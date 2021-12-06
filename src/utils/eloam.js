import axios from 'axios'

/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/eloam'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */

// 创建 axios 实例
const baseURL = 'http://127.0.0.1:38088'

const service = axios.create({
  baseURL: baseURL,
  timeout: 9000 // 请求超时时间
})

export function getCameraURL(params) {

}

export function postAction(url, parameter) {
  if (parameter && parameter.baseURL) {
    url = parameter.baseURL + url
  }
  return service({
    url: url,
    method: 'post' ,
    data: parameter,
  });
}

export function getAction(url, parameter) {
  if (parameter.index) {
    url = url + parameter.index;
  } else {
    url = url + '0'
  }
  return service({
    url: url,
    method: 'get' ,
    data: parameter,
  });
}


/**
 * 【良田高拍仪访问函数】
 */
// 获取设备状态
const getStatus = (params)=>postAction("/video=status", params)

// 判断设备是否连接
const isConnect = (params)=>postAction("/device=isconnect", params)

// 打开摄像头
const openCamera = (params)=>getAction("/video=stream&camidx=", params)

// 关闭摄像头
const closeCamera = (params)=>postAction("/video=close", params);

// 摄像头拍照
const takePhoto = (params)=>postAction("/video=grabimage", params)

// 条码识别
const scanBarcode = (params) => postAction("/barcode=get", params)

// 获取指纹
const getBioKey = (params) => postAction("/biokey=get", params)

// 读取身份证
const getIdCard = (params) => postAction("/card=idcard", params)

export {
  baseURL,
  service as axios,
  openCamera,
  getStatus,
  isConnect,
  closeCamera,
  takePhoto,
  scanBarcode,
  getIdCard,
  getBioKey
}