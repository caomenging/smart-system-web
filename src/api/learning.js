import request from '@/utils/request'



export default {


    //根据课程id查询所有章节和小节
  getAllChapterVideo(courseId) {
    return request({
        url: `/serviceedu/edu-chapter-copy/getChapterVideo/${courseId}`,
        method: 'get',
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
  },

  //修改学习次数
  updatecount(loginInfo){
    return request({
      url: `/educenter/member/updatemember`,
      method: 'post',
      data: loginInfo
    })
  }
}