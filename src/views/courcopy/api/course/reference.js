import request from '@/utils/request'

export default {

  getReferencelist() {
    return request({
      url: '/serviceedu/edu-course-description/findReference',
      method: 'get',
      
    })
  },
  add(eduCourseDescription){
    return request({
      url: '/serviceedu/edu-course-description/addCourse',
      method: 'post',
      data: eduCourseDescription
    })

  },
  //根据id查询
  getInfo(id){
    return request({
      url: `/serviceedu/edu-course-description/course/${id}`,
      method: 'get',
    })

  },

  updateCourse(eduCourseDescription){
    return request({
      url: `/serviceedu/edu-course-description/updateCourse`,
      method: 'post',
      data: eduCourseDescription
    })
  }
}
