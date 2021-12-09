import request from '@/utils/desform/request'


export default {

  getTeacherList() {
    return request({
      url: '/serviceedu/edu-teacher-description/findAll',
      method: 'get',
      
    })
  },

  //添加教学队伍描述，一般不用
  addTeacher(teacher){
    return request({
      url: '/serviceedu/edu-teacher-description/addTeacher',
      method: 'post',
      data: teacher
    })

  },
  //根据id查询
  getTeacherInfo(id){
    return request({
      url: `/serviceedu/edu-teacher-description/teacher/${id}`,
      method: 'get',
    })

  },
  //修改
  updateTeacherInFo(teacher){
    return request({
      url: `/serviceedu/edu-teacher-description/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}