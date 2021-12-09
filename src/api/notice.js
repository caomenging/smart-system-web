import request from '@/utils/request'
export default {
   //根据id查询
   getNoticeInfo(id){
    return request({
      url: `/serviceedu/edu-notice/getnotice/${id}`,
      method: 'get',
    })
  },
}