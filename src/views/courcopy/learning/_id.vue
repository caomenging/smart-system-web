<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程详情 开始 -->
    <section class="container">

      <!-- 课程所属分类 开始 -->

      <!-- /课程所属分类 结束 -->

      <!-- 课程基本信息 开始 -->

      <!-- /课程基本信息 结束 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="专题详情">专题详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">

                <!-- 课程详情介绍 开始 -->

                <!-- /课程详情介绍 结束 -->

                <!-- 课程大纲 开始-->
                <h6 class="c-g-content c-infor-title">
                    <span>专题学习</span>
                </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                        <menu id="lh-menu" class="lh-menu mt10 mr10">
                            <ul>
                                <!-- 课程章节目录 -->
                                <li v-for="chapter in chapterVideoList" :key="chapter.id" class="lh-menu-stair">
                                    <a :title="chapter.title" href="javascript: void(0)" class="current-1">
                                        <em class="lh-menu-i-1 icon18 mr10"/>{{ chapter.title }}
                                    </a>
                                    <ol class="lh-menu-ol" style="display: block;">
                                         <li v-for="video in chapter.children"  :key="video.id" class="lh-menu-second ml30">
                                            <div v-if="video.title==='在线听课'">
<!--                                            <a :href="'/learning/player/'+video.wordOneUrl"  @click="submit"  target="_blank">-->
                                              <a @click="handlePreview(video)"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.wordOneName}}
                                            </a>
                                           </div>
                                              <div v-if="video.title==='学习资料'">
<!--                                            <a :href="video.wordOneUrl">-->
                                                <a @click="handlePreview(video)">
                                                <span class="fr">
                                                    <i class="free-icon vam mr10">浏览学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.wordOneName}}
                                            </a>
                                            </div>
                                        </li>
                                    </ol>
                                </li>
                            </ul>
                        </menu>
                    </div>
                </section>

                <!-- /课程大纲 结束 -->
              </article>
            </div>
          </section>
        </article>
        <div class="clear"/>
      </div>
    </section>
    <!-- /课程详情 结束 -->
            <!-- 公共分页 开始 -->
        <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
            :class="{undisable: !data.hasPrevious}"
            href="#"
            title="首页"
            @click.prevent="gotoPage(1)">首</a>
            <a
            :class="{undisable: !data.hasPrevious}"
            href="#"
            title="前一页"
            @click.prevent="gotoPage(data.current-1)">&lt;</a>
            <a
            v-for="page in data.pages"
            :key="page"
            :class="{current: data.current == page, undisable: data.current == page}"
            :title="'第'+page+'页'"
            href="#"
            @click.prevent="gotoPage(page)">{{ page }}</a>
            <a
            :class="{undisable: !data.hasNext}"
            href="#"
            title="后一页"
            @click.prevent="gotoPage(data.current+1)">&gt;</a>
            <a
            :class="{undisable: !data.hasNext}"
            href="#"
            title="末页"
            @click.prevent="gotoPage(data.pages)">末</a>
            <div class="clear"/>
        </div>
        <!-- 公共分页 结束 -->
      </div>

</template>

<script>
import learn from"../api/api/learning"
import {login} from "../api/api/login";
import comment from '../api/api/comment'

import cookie from 'js-cookie'
import {Base64} from "js-base64";
export default {




  // asyncData({ params, error }) {
  //   return learn.getAllChapterVideo(params.id).then(response => {
  //     //console.log(response);
  //     return { 
  //       //course: response.data.data.course,
  //       courseId: params.id,
  //       chapterVideoList: response.data.data.allChapterVideo
  //     }
  //   })
  // },


  created() {
    //this.initCourseInfo()

    this.init()
//        this.initComment()
//        this.gotoPage(1)
         

  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  watch:{
    $route(to,from){
      this.init()
    }
  },


    methods: {

      handlePreview(video) {
        let url = window._CONFIG['staticDomainURL'] + "/" + video.wordOneUrl
        let previewURL = 'http://127.0.0.1:8012/onlinePreview?url='
        window.location.href = previewURL + encodeURIComponent(Base64.encode(url))
      },
      videoPlay(video){
        this.$router.push({
          path: '/courcopy/learning/player/_vid?url='+video.wordOneUrl,
        })
      },

      initCourseInfo(){
        learn.getAllChapterVideo(this.courseId)
        .then(response=>{
          console.log(response);
//          this.chapterVideoList = response.data
          this.chapterVideoList= response.data.allChapterVideo;
              // allChapterVideo
            //console.log(222222);
            //console.log(Id);
        })
        },


      init(){
           if (this.$route.params && this.$route.params.id) {
             this.courseId = this.$route.params.id
             console.log(this.$route.params.id)
             this.initCourseInfo()
             // const Id = this.$route.params.id  //从路径中获取id值
                // this.courseId=Id
                //console.log(11111111111);
                //console.log(Id);
                //console.log(this.courseId);
                //this.initCourseInfo(Id)
                //this.getInfo(id)//根据id查询
          }
          },

    //根据token获取用户信息,记录学习次数加一
    async getuserInfo(){
        await login.getLoginUserInfo().then(response => {
            //console.log("1111111111")
            if(response.data.data.userInfo==null){
              this.$message.error('您未登入，学习记录将不会被记录，请登入后继续学习！')   
            }
            else{
            this.loginInfo = response.data.data.userInfo
            this.loginInfo.count = this.loginInfo.count + 1}
            return Promise.resolve()
                })       
      }, 
    //更新学习次数到数据库中
    async update(){
      learn.updatecount(this.loginInfo)
      return Promise.resolve()
    },

    async submit(){
        await this.getuserInfo()
        //console.log("111111")
       //console.log(this.loginInfo.nickname)
        if(this.loginInfo.nickname!=null){
           await this.update()
           //console.log("222222")
        }
        
          
       },

    handleNodeClick(data) {
            console.log(data);
          },
 
    initComment(){
       comment.getPageList(this.page, this.limit, this.courseId).then(response => {
           this.data = response.result
       })
    },
    //添加评论
      addComment(){
          this.comment.courseId = this.courseId
          //this.comment.teacherId = this.courseInfo.teacherId
          comment.addComment(this.comment).then(response => {
              if(response.data.success){
                  this.comment.content = ''
                  this.initComment()
              }
          })
      },

      gotoPage(page){
            comment.getPageList(page, this.limit,this.courseId).then(response => {
                this.data = response.result
            })
        }

        
    },
        
        
    
    


    data() {// 定义数据
      return {
          list:{}, // 数据列表
          loginInfo:{},
          data:{},
          page:1,
          limit:4,
          total:10,
          courseId:'',
          comment:{
            content:'',
            courseId:''
      },
       courseInfo:{},
       chapterVideoList:[],
       //isbuyCourse:false
          
      }
  },
}
</script>

<style>
@import "../assets/css/global.css";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.bg-fa{background-color:#fafafa}
.of{overflow:hidden}.ov{overflow:visible}
.container{margin-left:auto;margin-right:auto;width:1160px}
.mt20{margin-top:20px}.mr20{margin-right:20px}.mb20{margin-bottom:20px}.ml20{margin-left:20px}
.c-infor-box .col-3,.c-infor-box .col-7{width:100%}
.c-infor-box .col-7{margin:0 0 20px 0}
.c-infor-box .col-7 .mr30{margin:0}
.fl{float:left}.fr{float:right}
.col-7{width:70%}.col-3{width:30%}
</style>