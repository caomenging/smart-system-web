import request from '@/utils/desform/request'

export default{

    //学习次数列表  条件分页查询
    pageListComment(current,limit){
        return request({
            //url: '/table/list/'+current+"/"+limit,
            url: `/educenter/member/PageMenber/${current}/${limit}` ,
            method: 'get',
    
            
          })
    },

      //根据id进行通知的删除
  removeMemberById(id) {
    return request({
        url: `/educenter/member/${id}`,
        method: 'delete'
    })
 },

   //根据id查询
   getMemberInfo(id){
    return request({
      url: `/educenter/member/getMemberInfo/${id}`,
      method: 'get',
    })

  },
  //修改
  updateMember(ucenterMember){
    return request({
      url: `/educenter/member/updateMember`,
      method: 'post',
      data: ucenterMember
    })
  }


}