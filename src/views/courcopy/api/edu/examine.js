import request from '@/utils/desform/request'

export default{

    //未审核列表  条件分页查询
    pageListEaxmine(current,limit){
        return request({
            //url: '/table/list/'+current+"/"+limit,
            url: `/educenter/member/ExaMenber/${current}/${limit}` ,
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

  //根据id进行评论的审核
  setMemberById(id) {
    return request({
      url: `/educenter/member/set/${id}`,
        method: 'post'
    })
 },
}