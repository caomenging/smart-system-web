import request from '@/utils/desform/request'
export default {
   //根据id查询
   getVideoInfo(videoId){
    return request({
      url: `/serviceedu/edu-video-copy/getVideoInfo/${videoId}`,
      method: 'get',
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