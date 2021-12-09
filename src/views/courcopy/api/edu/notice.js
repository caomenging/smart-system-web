import request from '@/utils/desform/request'


export default {
   //查询所有通知公告
  getNoticeList() {
    return request({
      url: '/serviceedu/edu-notice/findAll',
      method: 'get',
      
    })
  },

  //根据id进行通知的删除
  removeNoticeById(id) {
    return request({
        url: `/serviceedu/edu-notice/${id}`,
        method: 'delete'
    })
 },

  //添加通知
  addNotice(notice){
    return request({
      url: `/serviceedu/edu-notice/addNotiece`,
      method: 'post',
      data: notice
    })

  },
  //根据id查询
  getNoticeInfo(id){
    return request({
      url: `/serviceedu/edu-notice/getnotice/${id}`,
      method: 'get',
    })

  },
  //修改通知
  updateNoticeInFo(notice){
    return request({
      url: `/serviceedu/edu-notice/updateNotice`,
      method: 'post',
      data: notice
    })
  }
}