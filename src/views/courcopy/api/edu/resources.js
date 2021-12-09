import request from '@/utils/desform/request'


export default {
   //查询所有教学资源
  getResourcesList() {
    return request({
      url: '/serviceedu/edu-resources/findAll',
      method: 'get',
      
    })
  },

  //根据id进行删除
  removeNoticeById(id) {
    return request({
        url: `/serviceedu/edu-resources/${id}`,
        method: 'delete'
    })
 },
  //根据id查询
  getNoticeInfo(id){
    return request({
      url: `/serviceedu/edu-resources/${id}`,
      method: 'get',
    })
  },
    //添加通知
  addResources(resources){
    return request({
      url: `/serviceedu/edu-resources/addResources`,
      method: 'post',
      data: resources
    })

  },

  //删除文件
  deleteAliyunWj(url) {
    return request({
      url: `/eduoss/fileoss/removeAlyWj/${url}`,
      method: 'delete'
    })
  },
}