<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <!-- <el-step title="最终发布"/> -->
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加课程章节</el-button>
    

    <ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}
             <span class="acts">
                <el-button type="text"  @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title + " : " +video.wordOneName}}
                    <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
                 </p>
            </li>
        </ul>
    </li>
</ul>


      <div>
        <el-button @click="previous">上一步</el-button>
        <!-- <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button> -->
      </div>
        <!-- 添加和修改实验章节表单 -->
        
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加课程章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="课程章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="课程章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>


        <!-- 添加小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">

        <template>
          <a-descriptions title="填表说明" bordered>
            <a-descriptions-item label="小节类型":span="3">
              <b>仅支持如下两种指定输入</b>
              <a-badge status="processing" text="在线听课" />
              <a-badge status="processing" text="学习资料" />
            </a-descriptions-item>

            <a-descriptions-item label="上传课程资料">
              <b>如小节类型为在线听课：</b>则仅可上传单个视频资料，不可上传文档等其他资料！<br />
              <b>如小节类型为学习资料：</b>则可上传任意类型资料，但如上传视频资料，则无法记录观看情况！<br />
              <b>每次仅可上传一个文件！</b>
            </a-descriptions-item>
          </a-descriptions>
        </template>


        <el-form-item label="小节类型">
          <el-input v-model="video.title"/>
<!--          <el-tooltip placement="right-end">-->
<!--            <div slot="content">仅支持指定类型：“在线听课” 或 ”学习资料“ ！</div>-->
<!--            <i class="el-icon-question"/>-->
<!--          </el-tooltip>-->
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="资料名称">
          <el-input v-model="video.wordOneName"/>
       </el-form-item>

        <el-form-item label="上传课程资料">
          <a-col :span="24">
            <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wordOneUrl">
              <j-upload v-model="video.wordOneUrl"   ></j-upload>
<!--              <el-tooltip placement="right-end">-->
<!--              <div slot="content">若类型为在线听课，则仅可上传视频文件，否则无法统计观看进度 </div>-->
<!--                <i class="el-icon-question"/>-->
<!--              </el-tooltip>-->
            </a-form-model-item>
          </a-col>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisibleupdate" title="添加小节">
      <el-form :model="video" label-width="120px">
        <template>
          <a-descriptions title="填表说明" bordered>
            <a-descriptions-item label="小节类型":span="3">
              <b>仅支持如下两种指定输入</b>
              <a-badge status="processing" text="在线听课" />
              <a-badge status="processing" text="学习资料" />
            </a-descriptions-item>

            <a-descriptions-item label="上传课程资料">
              <b>如小节类型为在线听课：</b>则仅可上传单个视频资料，不可上传文档等其他资料！<br />
              <b>如小节类型为学习资料：</b>则可上传任意类型资料，但如上传视频资料，则无法记录观看情况！<br />
              <b>每次仅可上传一个文件！</b>
            </a-descriptions-item>
          </a-descriptions>
        </template>


        <el-form-item label="小节类型">
          <el-input v-model="video.title"/>
          <!--          <el-tooltip placement="right-end">-->
          <!--            <div slot="content">仅支持指定类型：“在线听课” 或 ”学习资料“ ！</div>-->
          <!--            <i class="el-icon-question"/>-->
          <!--          </el-tooltip>-->
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="资料名称">
          <el-input v-model="video.wordOneName"/>
        </el-form-item>

        <el-form-item label="上传课程资料">
          <a-col :span="24">
            <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wordOneUrl">
              <j-upload v-model="video.wordOneUrl"   ></j-upload>
              <!--              <el-tooltip placement="right-end">-->
              <!--              <div slot="content">若类型为在线听课，则仅可上传视频文件，否则无法统计观看进度 </div>-->
              <!--                <i class="el-icon-question"/>-->
              <!--              </el-tooltip>-->
            </a-form-model-item>
          </a-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="Update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

//import Tinymce from '@/components/Tinymce'
import chapter from './api/edu/chaptercopy'
import video from './api/edu/videocopy'


export default {
//  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false,
      courseId:'',
      chapterVideoList:[],
      chapter:{//封装章节
        title:'',
        sort:0
      },
      video:{
         title: '',
          sort: 0,
          videoTxt:'',
          videoSourceId:'',
          videoOriginalName:'',
          wordOneUrl:'',
          wordOneName:'',


      },
      dialogChapterFormVisible:false,//章节弹框
      dialogVideoFormVisible:false,  //小节弹框 
      dialogVideoFormVisibleupdate:false,  //修改小节弹框 
      fileList: [],//上传视频列表
      fileListcopy: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {

       //获取路由中id
       if (this.$route.params && this.$route.params.id) {
       this.courseId = this.$route.params.id
       //根据课程id查询章节和小节
       this.getChapterVideo()
     }

  },


  methods: {
    //===================================文件操作===============================//
    beforeVodRemovecopy(file, fileList){
       return this.$confirm(`确定删除 ${file.name}？`)
    },
    handleVodRemovecopy(){
      //调用接口删除文件
      var encoderURLone = encodeURIComponent(this.video.wordOneUrl)//第一次编码
      var encoderURLtwo = encodeURIComponent(encoderURLone)        //第二次编码
      video.deleteAliyunWj(encoderURLtwo)                //9.14前端请求报跨域错误，后端swagger测试删除文件正常！
      .then(() => {
      this.$message.success("ok");

       //把文件列表
       this.fileListcopy=[]
       //把文件url和名称清空
        this.video.wordOneUrl = ''
        //清空名称名称
        this.video.wordOneName=''
      })
    },

          //上传文件成功
      handleVodUploadSuccesscopy(response, file, fileListcopy) {
        //复制数据库文件id
        this.video.wordOneUrl = response.data.url
        //上传视频名称
        this.video.wordOneName=file.name
        //console.log(fileList)
        this.$message.success('上传文件成功!')
        //alert(fileList)
      },
      //视图上传多于一个视频
      handleUploadExceedcopy(files, fileListcopy) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },


    //===================================视频操作===============================//
    beforeVodRemove(file, fileList){
       return this.$confirm(`确定删除 ${file.name}？`)
    },
    handleVodRemove(){
      //调用接口删除视频
      video.deleteAliyunvod(this.video.videoSourceId)
      .then(() => {
      this.$message.success("ok");
       //把文件列表
       this.fileList=[]
       //把video视频id和视频名称清空
        this.video.videoSourceId = ''
        //上传视频名称
        this.video.videoOriginalName=''
      })
    },

          //上传视频成功
      handleVodUploadSuccess(response, file, fileList) {
        //复制数据库视频id
        this.video.videoSourceId = response.data.videoId
        //上传视频名称
        this.video.videoOriginalName=file.name
        //console.log(fileList)
        //alert(fileList)
      },
      //视图上传多于一个视频
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },


    //===================================小节操作===============================//
    openVideo(chapterId){
      //弹框
      this.dialogVideoFormVisible = true
      //弹框完后清空数据
      this.video.title=''
      this.video.sort=0
      this.video.videoTxt=''
      this.video.videoSourceId=''
      this.video.videoOriginalName=''
      this.video.wordOneUrl=''
      this.video.wordOneName=''
      this.fileList=[]
      this.fileListcopy=[]
      //tinymce.remove()
      
      //this.$refs.content.setContent("")

      
      //设置章节id
      this.video.chapterId=chapterId


    },

    //删除小节
    removeVideo(id){
      
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {//点击确定
      video.deleteVideo(id)
      .then(() => {

      this.$message.success("ok");
      this.getChapterVideo()// 刷新列表

      })
 
    })
    },
    
    //添加小节
    addVideo(){
      //设置课程id
      this.video.courseId=this.courseId
      this.video.id=''
      video.addVideo(this.video)
      .then(response=>{
          //关弹框
          this.dialogVideoFormVisible = false
          //提示信息
          this.$message.success("ok");
          //刷新页面
          this.getChapterVideo()

      })
    },
      //修改小节弹框数据回显
    openEditVideo(videoId){
      //弹框
      this.dialogVideoFormVisibleupdate=true
      //调用接口
      video.getVideo(videoId)
      .then(response=>{
        this.video=response.data.video
        this.fileList=[]
        this.fileListcopy=[]
        this.getChapterVideo()
        //this.$refs.content.setContent("")
        //tinymce.remove()

        
      })
      
    },
    //修改小节
    updateVideo(){
      video.updateVideo(this.video)
      .then(response=>{
        //关弹框
        this.dialogVideoFormVisibleupdate = false
        
        //tinymce.remove()
        //提示信息
         this.$message.success("ok");
        //刷新页面
        this.getChapterVideo()
        this.video.id=''
        
        
      })
    },

    save(){
      
        this.addVideo()
    },
    Update(){
      
        this.updateVideo()
      
    },

    quxiao(){
      this.video.id=''
      this.dialogVideoFormVisibleupdate = false
      
    },

    //===================================章节操作===============================//

    //删除章节
  removeChapter(chapterId) {
    this.$confirm('此操作将永久删除该课程章节, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {//点击确定
      chapter.deleteChapter(chapterId)
      .then(() => {
     
      this.$message.success("ok");
       this.getChapterVideo()// 刷新列表

      })
 
    })
},

    //修改章节弹框数据回显
    openEditChapter(chapterId){
      //弹框
      this.dialogChapterFormVisible=true
      //调用接口
      chapter.getChapter(chapterId)
      .then(response=>{
        this.chapter=response.data.chapter
      })
      
    },
    
    //弹出章节页面
    openChapterDialog(){
      //弹框
      this.dialogChapterFormVisible=true
      //弹完后情况表单
      this.chapter.title=''
      this.chapter.sort=0

    },
    //修改章节
    updateChapter(){
      chapter.updateChapter(this.chapter)
      .then(response=>{
        //关弹框
        this.dialogChapterFormVisible = false
        //提示信息
         this.$message.success("ok");
        //刷新页面
        this.getChapterVideo()
        
      })
    },


    //添加章节
    addChapter(){
       //s设置课程id
      this.chapter.courseId=this.courseId
      chapter.addChapter(this.chapter)
      .then(response=>{
        //关弹框
        this.dialogChapterFormVisible = false
        //提示信息
         this.$message.success("ok");
        //刷新页面
        this.getChapterVideo()
        
      })
    },
    saveOrUpdate(){
      if(!this.chapter.id){
        this.addChapter()
      }else{
        this.updateChapter()
      }
      
     
    },
   
   //查询所有章节小节
    getChapterVideo(){
      chapter.getAllChapterVideo(this.courseId)
      .then(response=>{
        console.log(response)
        this.chapterVideoList = response.data.allChapterVideo
      })

    },
    
    previous() {
      console.log('previous')
      this.$router.push({ path: '/courcopy/info/'+this.courseId})
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/courcopy/publish/'+this.courseId })
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>