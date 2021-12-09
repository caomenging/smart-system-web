import request from '@/utils/desform/request'



export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `/serviceedu/edu-course-copy/addCourseCopyInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  //查询
  getCourseInfoId(id) {
    return request({
      url: `/serviceedu/edu-course-copy/getCourseInfo/${id}`,
      method: 'get',
    })
  },
  //修改
  updateCourseInfo(courseInfo) {
    return request({
      url: `/serviceedu/edu-course-copy/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  //查询所有课程
  getListCourse() {
    return request({
      url: `/serviceedu/edu-course-copy/`,
      method: 'get',
      
    })
  },
   //删除
  deleteCourse(id) {
    return request({
      url: `/serviceedu/edu-course-copy/${id}`,
      method: 'delete',
      
    })
  }
}