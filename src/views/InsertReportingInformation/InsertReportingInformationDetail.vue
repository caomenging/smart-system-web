<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="formDisabled">
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="被反映人姓名"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                prop="reflectedInformation"
              >
                <a-input v-model="model.reflectedInformation" placeholder="请输入被反映人信息"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="被反映人单位"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                prop="reflectedDepartid"
              >
                <a-input v-model="model.reflectedDepartid" placeholder="请输入被反映人单位"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="主要问题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="majorProblem">
                <a-textarea v-model="model.majorProblem" rows="4" placeholder="请输入主要问题" />
              </a-form-model-item>
            </a-col>

            <!--              <a-col :span="24" >-->
            <!--                <a-form-model-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="photoString">-->
            <!--                  <j-image-upload isMultiple  v-model="model.photo" ></j-image-upload>-->
            <!--                </a-form-model-item>-->
            <!--              </a-col>-->
            <a-col :span="24">
              <a-form-model-item label="上传图片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="photoString">
                <div>
                  <div>
                    <a-button icon="camera" v-on:click="imgClick()">拍照举报</a-button>
                  </div>
                  <div v-for="(urls, index) in imgs" style="margin: 2px; border: 1px solid #ccc">
                    <div style="text-align: right; position: relative" v-on:click="deleteImg(index)">X</div>
                    <img :src="urls" width="200px" height="200px" />
                  </div>

                  <input
                    style="float: left; display: none"
                    type="file"
                    id="uploadFile"
                    accept="image/*"
                    v-on:change="readLocalFile()"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="上传视频" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
                <!-- 录像-- -->
                <div>
                  <j-upload v-model="model.description">点击上传</j-upload>
                </div>
                <!-- accept="video/*" ：accept 属性只能与 <input type="file"> 配合使用。-->
                <!--	它规定能够通过文件上传进行提交的文件类型。 -->
                <!-- 指定capture属性调用默认相机，摄像，录音功能-->
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="举报人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingName">
                <a-input v-model="model.reportingName" placeholder="请输入举报人姓名"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactNumber">
                <a-input v-model="model.contactNumber" placeholder="请输入联系电话"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="举报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingTime">
                <j-date
                  placeholder="请选择举报时间"
                  v-model="model.reportingTime"
                  :show-time="true"
                  date-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item :wrapperCol="{ span: 24 }" style="text-align: center">
            <a-button @click="handleSubmit"   type="primary">提交</a-button>
            <a-button style="margin-left: 8px">取消</a-button>
          </a-form-model-item>
        </a-form-model>
      </j-form-container>
    </a-spin>
  </a-card>
</template>

<script>
import { httpAction, uploadFile, postAction, getAction } from '@/api/manage'
import AFormItem from 'ant-design-vue/lib/form/FormItem'
import JUpload from '../../components/jeecg/JUpload'
import JImageUpload from '../../components/jeecg/JImageUpload'

export default {
  name: 'ReportingInformation',
  components: { AFormItem, JUpload, JImageUpload },
  data() {
    return {
      
      savePath: 'report',
      filePath: '',
      filePathList: [],
      allImg: [],
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      imgs: [],
      reportingTime: '',
      reportingResult: '',
      //description:'',
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      //form: this.$form.createForm(this),
      validatorRules: {
        majorProblem: [{ required: true, message: '请输入主要问题!' }],
        contactNumber: [
          { required: true, message: '请输入联系电话!' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!' },
        ],
        reportingName: [{ required: true, message: '请输入举报人姓名!' }],
        reportingTime: [{ required: true, message: '请输入举报时间!' }],
      },

      url: {
        upload: '/sys/common/upload',
        add: '/smartReportingInformation/smartReportingInformation/add',
      },
    }
  },
  mounted() {
    /*this.nowTimes()*/
  },
  /* beforeDestroy () {
      this.clear()
    },*/

  methods: {
    deleteImg: function (index) {
      this.imgs.splice(index, 1)
      this.allImg.splice(index,1)
    },

    //图片click
    imgClick: function () {
      document.getElementById('uploadFile').click()
    },
    //点击选中图片
    readLocalFile: function () {
      var localFile = document.getElementById('uploadFile').files[0]
      console.log(localFile.name)
      this.getBase64(localFile).then((res) => {
        console.log('----------------' + res + '-----------')
        this.imgs.push(res)

        let photo = {
          imgName: localFile.name,
          base64: res,
        }

        this.allImg.push(photo)

        // console.log(this.dataURLtoFileFun(res, localFile.name))
      })
    },
    dataURLtoFileFun(dataurl, filename) {
      // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },

    // 提交
    handleSubmit() {
      //this.model.photo = this.filePath
      console.log(this.model)
      
      this.allImg.forEach((item) => {
        let formData = new FormData()
        formData.append('biz', this.savePath)
        formData.append('file', this.dataURLtoFileFun(item.base64, item.imgName))
        uploadFile(formData).then((res) => {
          console.log(res)
          if (res.success) {
            this.filePathList.push(res.message)
            // console.log(this.filePathList)
            
          }
        })
      })
      setTimeout(() =>{
        
        this.filePath = this.filePathList.join()
        console.log(this.filePath)
        this.model.photo = this.filePath
        postAction(this.url.add, this.model).then((res) => {
            
        console.log(res)
        if (res.success) {
          this.$message.success(res.message)
          //that.$emit('ok');
          this.$router.push({ path: '/InsertReportingInformation/Success' })
        } else {
          this.$message.warning('请输入信息')
        }
      })
    },100)

    

      postAction("/smartReportingInformation/smartReportingInformation/sendMessage"
        , this.model).then((res) => {
        console.log(res)
        if (res.success) {
          //this.$message.success('发送成功')

        } else {
          //this.$message.warning('发送失败')
        }
      })
    },
  },
}
// this.$refs.form.resetFields();
</script>
