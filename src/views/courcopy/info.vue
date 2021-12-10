<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新专题</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写专题基本信息"/>
      <el-step title="编辑专题内容"/>
      <!-- <el-step title="最终发布"/> -->
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="专题标题">
        <el-input v-model="courseInfo.title" placeholder="政策文件"/>
      </el-form-item>

      <!-- 所属分类 TODO -->

      <!-- 课程讲师 TODO -->

      <el-form-item label="总章节">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="专题封面">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API+'/eduoss/fileoss/upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import cour from './api/edu/courcopy'
import Networking from "./api/networking"

//import Tinymce from '@/components/Tinymce'   //引入组件

export default {
  mixins: [JeecgListMixin],


  //声明组件
  // components:{Tinymce},
  data() {
    return {
      courseInfo: {
        cover: '',

      },
      saveBtnDisabled: false,// 保存按钮是否禁用
      couseId: '',
      BASE_API: process.env.BASE_API // 接口API地址

    }
  },

  created() {
    this.init()

  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },


  methods: {


    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
      this.$message.success('上传封面成功')
      //this.getInfo()
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        console.log(this.$route.params.id)
        this.getInfo()
      } else {
        this.courseInfo = {}
      }
    },
    //添加方法


    //根据id查询信息
    getInfo() {
      cour.getCourseInfoId(this.courseId)
        .then(response => {

          console.log(response)
          this.courseInfo = response.result
        })
    },
    //添加
    addCourse() {
      // this.addCourse({},{})
      cour.addCourseInfo(this.courseInfo).then(response => {
        //提示
        this.$message.success("添加课程成功")
        //跳转到第二步
        this.$router.push({
          path: `/courcopy/chapter/?id=${response.data.courseId}`,
        })
        // Networking.doPost("/courcopy/chapter/")
        // this.$router.push({ name: 'chapter', query:{id: response.data.courseId} })
      })
    },
    //修改
    updateCourse() {
      cour.updateCourseInfo(this.courseInfo)
        .then(response => {
          this.$message.success({
            type: 'success',
            message: '修改课程成功!'
          });
          //跳转到第二步
          this.$router.push({
            path: `/courcopy/chapter/?id=${response.data.courseId}`,
          })

        })
    },

    saveOrUpdate() {
      //判断添加还是修改
      if (!this.courseInfo.id) {
        this.addCourse()
      } else {
        this.updateCourse()
      }

    }
  }
}
</script>
<style>
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>