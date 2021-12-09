import request from '@/utils/desform/request'



export default {
 
//添加
  addVideo(video) {
    return request({
      url: `/serviceedu/edu-video-copy/addVideo`,
      method: 'post',
      data:video
    })
  },

  //根据id查询章节
  getVideo(videoId) {
    return request({
      url: `/serviceedu/edu-video-copy/getVideoInfo/${videoId}`,
      method: 'get'
    })
  },

  //修改
  updateVideo(video) {
    return request({
      url: `/serviceedu/edu-video-copy/updateVideo`,
      method: 'post',
      data:video
    })
  },
  //删除小节
  deleteVideo(id) {
    return request({
      url: `/serviceedu/edu-video-copy/${id}`,
      method: 'delete'
    })
  },
  //删除视频
  deleteAliyunvod(id) {
    return request({
      url: `/eduvod/video/removeAlyVideo/${id}`,
      method: 'delete'
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