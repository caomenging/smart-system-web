import request from '@/utils/request'

export function login(userInfo) {
  return request({
    url: '/serviceedu/admin/login',
    method: 'post',
    data: userInfo
  })
}

export function getInfo(token) {
  return request({
    url: '/serviceedu/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/serviceedu/admin/logout',
    method: 'post'
  })
}
