import request from '@/utils/desform/request'

export default {
//!!
  getPageList(page, limit, courseId) {
    return request({
      url: `/serviceedu/edu-comment/${page}/${limit}`,
      method: 'get',
      params: {courseId}
    })
  },
  addComment(comment) {
    return request({
      url: `/serviceedu/edu-comment/auth/save`,
      method: 'post',
      data: comment
    })
  }
}