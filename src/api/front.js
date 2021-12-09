import request from '@/utils/request'
export default {

     //根据id查询
  getInfo(id){
    return request({
      url: `/serviceedu/edu-course-description/course/${id}`,
      method: 'get',
      })
    },
  getNoticeList() {
    return request({
      url: `/serviceedu/edu-notice/findAll`,
      method: 'get'
    })
  },
  getCourseDescription() {
    return request({
      url: `/serviceedu/edu-course-description/findCourseIntroduce`,
      method: 'get'
    })
  },
  getFeatures() {
    return request({
      url: `/serviceedu/edu-course-description/findCourseFeatures`,
      method: 'get'
    })
  },
  getSyllabus() {
    return request({
      url: `/serviceedu/edu-course-description/findSyllabus`,
      method: 'get'
    })
  },
  getTeaCalendar() {
    return request({
      url: `/serviceedu/edu-course-description/findTeaCalendar`,
      method: 'get'
    })
  },
  getReference() {
    return request({
      url: `/serviceedu/edu-course-description/findReference`,
      method: 'get'
    })
  },
  getTeacherDescription() {
    return request({
      url: `/serviceedu/edu-teacher-description/findAll`,
      method: 'get'
    })
  },
    //查询所有实验
    getListCourse() {
      return request({
        url: `/serviceedu/edu-course/`,
        method: 'get',
        
      })
    },
    //查询所有教学资源
    getResourcesList() {
      return request({
        url: '/serviceedu/edu-resources/findAll',
        method: 'get',
        
      })
    },
}