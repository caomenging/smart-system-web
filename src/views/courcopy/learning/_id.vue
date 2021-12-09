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
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">

                <!-- 课程详情介绍 开始 -->

                <!-- /课程详情介绍 结束 -->

                <!-- 课程大纲 开始-->
                <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
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
                                           <div v-if="video.title==='学习指南'">
                                            <a :href="'/learning/guide/'+video.id">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                            </div>

                                            <div v-if="video.title==='在线听课(一)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                              <div v-if="video.title==='在线听课(二)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                             <div v-if="video.title==='在线听课(三)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                             <div v-if="video.title==='拓展听课(一)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                        
                                            <div v-if="video.title==='拓展听课(二)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                            <div v-if="video.title==='拓展听课(三)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                            <div v-if="video.title==='拓展听课(四)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                            <div v-if="video.title==='拓展听课(五)'">
                                            <a :href="'/learning/player/'+video.videoSourceId"  @click="submit"  target="_blank">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                           </div>
                                           

                                
                                              <div v-if="video.title==='电子课件'">
                                            <a :href="video.wordOneUrl">
                                                <span class="fr">
                                                    <i class="free-icon vam mr10">点击下载</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
                                            </a>
                                            </div>
                                            
                                              <div v-if="video.title==='课后习题'">
                                            <a :href="'/learning/exercises/'+video.id">
                                                <span  class="fr">
                                                    <i class="free-icon vam mr10">点击学习</i>
                                                </span>
                                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title}}
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
        <!-- <aside class="fl col-3">
          <div class="i-box">
        
          </div>
        </aside> -->
        <div class="clear"/>
      </div>
    </section>
    <!-- /课程详情 结束 -->

    <div class="mt50 commentHtml"><div>
      <h6 class="c-c-content c-infor-title" id="i-art-comment">
        <span class="commentTitle">在线答疑</span>
      </h6>
      <section class="lh-bj-list pr mt20 replyhtml">
        <ul>
          <li class="unBr">
            <aside class="noter-pic">
<!--              <img width="50" height="50" class="picImg" src="~/assets/img/avatar-boy.gif">-->
              </aside>
            <div class="of">
              <section class="n-reply-wrap">
                <fieldset>
                  <textarea name="" v-model="comment.content" placeholder="输入您要评论的文字" id="commentContent"></textarea>
                </fieldset>
                <p class="of mt5 tar pl10 pr10">
                  <span class="fl "><tt class="c-red commentContentmeg" style="display: none;"></tt></span>
                  <input type="button" @click="addComment()" value="回复" class="lh-reply-btn">
                </p>
              </section>
            </div>
          </li>
        </ul>
      </section>
      <section class="">
          <section class="question-list lh-bj-list pr">
            <ul class="pr10">
              <li v-for="(comment,index) in data.items" v-bind:key="index">
                <!-- <li v-for="comment in data.items" :key="comment.id"> -->
                  <aside class="noter-pic">
                    <img width="50" height="50" class="picImg" :src="comment.avatar">
                    </aside>
                  <div class="of">
                    <span class="fl"> 
                    <font class="fsize12 c-blue"> 
                      {{comment.nickname}}</font>
                    <font class="fsize12 c-999 ml5">评论：</font></span>
                  </div>
                  <div class="noter-txt mt5">
                    <p>{{comment.content}}</p>
                  </div>
                  <div class="of mt5">
                    <span class="fr"><font class="fsize12 c-999 ml5">{{comment.gmtCreate}}</font></span>
                  </div>
                </li>
              
              </ul>
          </section>
        </section>
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
    </div>
  </div>
</template>

<script>
import learn from"../api/api/learning"
import {login} from "../api/api/login";
import comment from '../api/api/comment'

import cookie from 'js-cookie'
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
     

    if(this.istoken()==true){
        this.init()
        this.initComment()
        this.gotoPage(1)
         
     }
    else{
       this.$message.error('您未登入，不能使用该功能，请登入后使用！') 
       }
  
  },

  watch:{
    $route(to,from){
      this.init()
    }
  },


    methods: {
       istoken(){
        if(cookie.get('guli_token')){
          return true
        }
        else{
          return false
        }
      },

  //   asyncData({ params, error }) {
  //   return learn.getAllChapterVideo(params.id).then(response => {
  //     //console.log(response);
  //     return { 
  //       //course: response.data.data.course,
  //       courseId: params.id,
  //       chapterVideoList: response.data.data.allChapterVideo
  //     }
  //   })
  // },  


      initCourseInfo(Id){
        learn.getAllChapterVideo(Id)
        .then(response=>{
            this.chapterVideoList= response.data.data.getAllChapterVideo();
              // allChapterVideo
            //console.log(222222);
            //console.log(Id);
        })
        },


      init(){
           if (this.$route.params && this.$route.params.id) {
                const Id = this.$route.params.id  //从路径中获取id值
                this.courseId=Id
                //console.log(11111111111);
                //console.log(Id);
                //console.log(this.courseId);
                this.initCourseInfo(Id)
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
           this.data = response.data.data
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
                this.data = response.data.data
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