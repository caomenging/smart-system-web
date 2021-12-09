import request from '@/utils/desform/request'

export default{

    //评论分页的查询
    pageListComment(current,limit){
        return request({
            //url: '/table/list/'+current+"/"+limit,
            url: `/serviceedu/edu-comment/Comment/${current}/${limit}` ,
            method: 'get',
    
            
          })
    },

  //根据id进行评论的删除
  removeCommentById(id) {
    return request({
        url: `/serviceedu/edu-comment/${id}`,
        method: 'delete'
    })
 },

      //根据id进行评论的审核
      setCommentById(id) {
        return request({
            url: `/serviceedu/edu-comment/set/${id}`,
            method: 'post'
        })
     },
}