import request from '@/utils/desform/request'
export default {
    //查询所有实验
    getListCourse() {
      return request({
        url: `/serviceedu/edu-course/`,
        method: 'get',
      })
    },

    //查寻实验详情方法
    getAllChapterVideo(courseId) {
        return request({
          url: `/serviceedu/edu-chapter/getChapterVideo/${courseId}`,
          method: 'get',
        })
      },
}