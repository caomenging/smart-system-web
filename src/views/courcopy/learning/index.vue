<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /实验列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <div class="clear"></div>
        </section>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <!-- <section class="no-data-wrap" >
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section> -->
          <!-- /无数据提示 结束-->
          <article class="comm-course-list">

            <ul class="of" id="bna">
              <li v-for="item in list" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="item.cover" class="head_pic" @click="startLearn(item.id)" width="40" height="40" :alt="item.title">
<!--                    <div class="cc-mask">-->
<!--                      <a @click="startLearn(item.id)">开始学习</a>-->
<!--&lt;!&ndash;                      <a :href="'/courcopy/learning/_id/:id'+item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>&ndash;&gt;-->
<!--                    </div>-->
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/courcopy/learning/_id/'+item.id" :title="item.title" class="course-title fsize18 c-333">{{item.title}}</a>
                  </h3>
                </div>
              </li>
              <div class="demo-image">
                <div class="block" v-for="fit in fits" :key="fit">
                  <span class="demonstration">{{ fit }}</span>
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="item.cover"
                    :fit="fit"></el-image>
                </div>
              </div>
<!--              <div class="demo-image">-->
<!--                <div class="block" v-for="item in list" :key="item.id">-->
<!--                  <span class="demonstration"></span>-->
<!--                  <el-image-->
<!--                    style="width: 100px; height: 100px"-->
<!--                    :src="item.cover"-->
<!--                    :item="item.title"></el-image>-->
<!--                </div>-->
<!--              </div>-->
            </ul>

            <div class="clear"></div>
          </article>
        </div>
      </section>
    </section>
    <!-- /实验列表 结束 -->
  </div>
</template>
<script>
 import learn from"../api/api/learning"
 import cookie from 'js-cookie';
export default {
   data() {// 定义数据
      return {
          list:{}, // 数据列表
      }
  },

  created() { // 当页面加载时获取数据
     // if(this.istoken()==true){
     this.initCourse()
     // }
     // else{
     //   this.$message.error('您未登入，不能使用该功能，请登入后使用！')
     //   }

  },
    
  methods: {
    startLearn(id){
      this.$router.push({
        path:'/courcopy/learning/_id/' + id,
      })
 },


     //查询实验列表
    initCourse(){
      learn.getListCourse().then(response => {
        this.list = response.data.list
      })
    },

    istoken(){
        if(cookie.get('guli_token')){
          return true
        }
        else{
          return false
        }
      },
    
  }
};
</script>