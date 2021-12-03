import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN,INDEX_MAIN_PAGE_PATH, OAUTH2_LOGIN_PAGE_PATH } from '@/store/mutation-types'
import { generateIndexRouter, isOAuth2AppEnv } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result','/user/alteration',
  '/InsertReportingInformation/InsertReportingInformationDetail',
  '/InsertReportingInformation/Success','/QRCodesame/QRcodesame'] // no redirect whitelist
const appWhiteList = [
  '/webview/info',
  '/webview/sun',
]
whiteList.push(OAUTH2_LOGIN_PAGE_PATH)

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  /**
   * 此处添加的代码是为了APP端webview访问方便
   * 在白名单中的url可以直接访问
   * 为了安全性加入get参数，参数名secret 内容是token
   * 验证如果参数为null，直接跳出进行原来的代码流程，不破坏页面认证
   * 可以取消侧边栏，只显示右侧部分内容
   */
   for (let i=0; i<appWhiteList.length; i++) {
    // 判断是这个路径，并且有get参数
    if (to.path.indexOf(appWhiteList[i]) != -1 && to.query.secret != null) {
      // 由于token存储在前端sessionStorage中，因此直接设置为app端的token继续下面的流程
      Vue.ls.set(ACCESS_TOKEN, to.query.secret);
      next();
    }
  }

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login' || to.path === OAUTH2_LOGIN_PAGE_PATH) {
      next({ path: INDEX_MAIN_PAGE_PATH })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
              const menuData = res.result.menu;
              //console.log(res.message)
              if (menuData === null || menuData === "" || menuData === undefined) {
                return;
              }
              let constRoutes = [];
              constRoutes = generateIndexRouter(menuData);
              // 添加主界面路由
              store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            })
          .catch(() => {
           /* notification.error({
              message: '系统提示',
              description: '请求用户信息失败，请重试！'
            })*/
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，如果进入的页面是login页面并且当前是OAuth2app环境，就进入OAuth2登录页面
      if (to.path === '/user/login' && isOAuth2AppEnv()) {
        next({path: OAUTH2_LOGIN_PAGE_PATH})
      } else {
        // 在免登录白名单，直接进入
        next()
      }
      NProgress.done()
    } else {
      // 如果当前是在OAuth2APP环境，就跳转到OAuth2登录页面
      let path = isOAuth2AppEnv() ? OAUTH2_LOGIN_PAGE_PATH : '/user/login'
      next({ path: path, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
