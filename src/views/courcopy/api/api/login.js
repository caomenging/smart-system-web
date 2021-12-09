import api from './index'
import { axios } from '@/utils/request'
import request from '@/utils/desform/request'



/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: '/sys/login',
    method: 'post',
    data: parameter
  })
}

export function phoneLogin(parameter) {
  return axios({
    url: '/sys/phoneLogin',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

// export function getInfo() {
//   return axios({
//     url: '/api/user/info',
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }

export function logout(logoutToken) {
  return axios({
    url: '/sys/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Access-Token':  logoutToken
    }
  })
}

/**
 * 第三方登录
 * @param token
 * @param thirdType
 * @returns {*}
 */
export function thirdLogin(token,thirdType) {
  return axios({
    url: `/sys/thirdLogin/getLoginUser/${token}/${thirdType}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 强退其他账号
 * @returns {*}
 * @param parameter
 */
export function forceLogout(parameter) {
  return axios({
    url: '/sys/online/forceLogout',
    method: 'post',
    data: parameter
  })
}


export function submitLoginUser(userInfo) {
  return request({
    url: `/educenter/member/login`,
    method: 'post',
    data: userInfo
  })
}

//token获取用户信息
export function getLoginUserInfo() {
  return request({
    url: `/educenter/member/getMemberInfo`,
    method: 'get',
  })
}

//修改密码
export function updateMember(ucenterMember){
  return request({
    url: `/educenter/member/updateMember`,
    method: 'post',
    data: ucenterMember
  })
}