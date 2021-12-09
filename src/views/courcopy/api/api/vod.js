import request from '@/utils/desform/request'

export default {

  getPlayAuth(vid) {
    return request({
      url: `/eduvod/video/getPlayAuth/${vid}`,
      method: 'get'
    })
  }

}