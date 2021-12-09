import request from '@/utils/desform/request'



export default {
  getAllChapterVideo(courseId) {
    return request({
      url: `/serviceedu/edu-chapter-copy/getChapterVideo/${courseId}`,
      method: 'get',
    })
  },
//添加
  addChapter(chapter) {
    return request({
      url: `/serviceedu/edu-chapter-copy/addChapter`,
      method: 'post',
      data:chapter
    })
  },

  //根据id查询章节
  getChapter(chapterId) {
    return request({
      url: `/serviceedu/edu-chapter-copy/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },

  //修改
  updateChapter(chapter) {
    return request({
      url: `/serviceedu/edu-chapter-copy/updateChapter`,
      method: 'post',
      data:chapter
    })
  },
  //删除
  deleteChapter(chapterId) {
    return request({
      url: `/serviceedu/edu-chapter-copy/${chapterId}`,
      method: 'delete'
    })
  }
}