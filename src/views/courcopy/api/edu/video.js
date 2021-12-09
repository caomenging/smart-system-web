import request from '@/utils/desform/request'



export default {
 
//添加
  addVideo(video) {
    return request({
      url: `/serviceedu/edu-video/addVideo`,
      method: 'post',
      data:video
    })
  },

  //根据id查询章节
  getVideo(videoId) {
    return request({
      url: `/serviceedu/edu-video/getVideoInfo/${videoId}`,
      method: 'get'
    })
  },

  //修改
  updateVideo(video) {
    return request({
      url: `/serviceedu/edu-video/updateVideo`,
      method: 'post',
      data:video
    })
  },
  //删除小节
  deleteVideo(id) {
    return request({
      url: `/serviceedu/edu-video/${id}`,
      method: 'delete'
    })
  },
  //删除视频
  deleteAliyunvod(id) {
    return request({
      url: `/eduvod/video/removeAlyVideo/${id}`,
      method: 'delete'
    })
  }
}