import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import cookie from 'js-cookie'
import Vue from "vue";
import {VueAxios} from "../axios";
import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"
import router from '@/router/index'
import store from '@/store'

// 创建axios实例
let apiBaseUrl = window._CONFIG['domianURL'] || "/jeecg-boot";
const service = axios.create({
  baseURL: apiBaseUrl, // api的base_url,nginx
  timeout: 20001 // 请求超时时间
})
const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log("------异常响应------",token)
    console.log("------异常响应------",error.response.status)
    switch (error.response.status) {
      case 403:
        Vue.prototype.$Jnotification.error({ message: '系统提示', description: '拒绝访问',duration: 4})
        break
      case 500:
        console.log("------error.response------",error.response)
        // update-begin- --- author:liusq ------ date:20200910 ---- for:处理Blob情况----
        let type=error.response.request.responseType;
        if(type === 'blob'){
          blobToJson(data);
          break;
        }
        // update-end- --- author:liusq ------ date:20200910 ---- for:处理Blob情况----
        if(token && data.message.includes("Token失效")){
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          if (/wxwork|dingtalk/i.test(navigator.userAgent)) {
            Vue.prototype.$Jmessage.loading('登录已过期，正在重新登陆', 0)
          } else {
            Vue.prototype.$Jmodal.error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  try {
                    let path = window.document.location.pathname
                    console.log('location pathname -> ' + path)
                    if (path != '/' && path.indexOf('/user/login') == -1) {
                      window.location.reload()
                    }
                  } catch (e) {
                    window.location.reload()
                  }
                })
              }
            })
          }
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break
      case 404:
        Vue.prototype.$Jnotification.error({ message: '系统提示', description:'很抱歉，资源未找到!',duration: 4})
        break
      case 504:
        Vue.prototype.$Jnotification.error({ message: '系统提示', description: '网络超时'})
        break
      case 401:
        Vue.prototype.$Jnotification.error({ message: '系统提示', description:'很抱歉，登录已过期，请重新登录',duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        Vue.prototype.$Jnotification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      Vue.prototype.$Jnotification.error({message: '系统提示', description: '网络超时'})
    } else {
      Vue.prototype.$Jnotification.error({message: '系统提示', description: error.message})
    }
  }
  return Promise.reject(error)
};

// http request 拦截器
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
      config.headers[ 'X-Access-Token' ] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }

    // update-begin--author:sunjianlei---date:20200723---for 如果当前在low-app环境，并且携带了appId，就向Header里传递appId
    const $route = router.currentRoute
    if ($route && $route.name && $route.name.startsWith('low-app') && $route.params.appId) {
      config.headers['X-Low-App-ID'] = $route.params.appId
    }
    // update-end--author:sunjianlei---date:20200723---for 如果当前在low-app环境，并且携带了appId，就向Header里传递appId

    //update-begin-author:taoyan date:2020707 for:多租户
    let tenantid = Vue.ls.get(TENANT_ID)
    if (!tenantid) {
      tenantid = 0;
    }
    config.headers[ 'tenant-id' ] = tenantid
    //update-end-author:taoyan date:2020707 for:多租户
    if(config.method=='get'){
      if(config.url.indexOf("sys/dict/getDictItems")<0){
        config.params = {
          _t: Date.parse(new Date())/1000,
          ...config.params
        }
      }
    }


  //debugger
  //判断cookie里面是否有名称是guli_token的数据
  if (cookie.get('guli_token') != null) {
    //console.log("adsasdasda");
    //把获取的cookie值放到header里面
    config.headers['token'] = cookie.get('guli_token');
    //console.log(config.headers['token']);
  }
  return config
  },
  err => {
  return Promise.reject(err);
})


service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}
/**
 * Blob解析
 * @param data
 */
function blobToJson(data) {
  let fileReader = new FileReader();
  let token = Vue.ls.get(ACCESS_TOKEN);
  fileReader.onload = function() {
    try {
      let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
      console.log("jsonData",jsonData)
      if (jsonData.status === 500) {
        console.log("token----------》",token)
        if(token && jsonData.message.includes("Token失效")){
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        }
      }
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      console.log("blob解析fileReader返回err",err)
    }
  };
  fileReader.readAsText(data)
}



export default service