import request from '@/utils/request'

export default {


  //用户登入
  submitLoginUser(userInfo) {
    return request({
      url: `/educenter/member/login`,
      method: 'post',
      data: userInfo
    })
  },

  //token获取用户信息
  getLoginUserInfo() {
    return request({
      url: `/educenter/member/getMemberInfo`,
      method: 'get',
    })
  },

   //修改密码
   updateMember(ucenterMember){
    return request({
      url: `/educenter/member/updateMember`,
      method: 'post',
      data: ucenterMember
    })
  }
}