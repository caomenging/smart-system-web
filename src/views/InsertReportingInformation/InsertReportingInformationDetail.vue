<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin :spinning="confirmLoading">
        <j-form-container :disabled="formDisabled">
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-row>
              <a-col :span="24" >
                <a-form-model-item label="被反映人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reflectedInformation">
                  <a-input v-model="model.reflectedInformation" placeholder="请输入被反映人信息" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" >
                <a-form-model-item label="被反映人单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reflectedDepartid">
                  <a-input v-model="model.reflectedDepartid" placeholder="请输入被反映人单位" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" >
                <a-form-model-item label="主要问题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="majorProblem">
                  <a-input v-model="model.majorProblem" placeholder="请输入主要问题" ></a-input>
                </a-form-model-item>
              </a-col>

<!--              <a-col :span="24" >-->
<!--                <a-form-model-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="photoString">-->
<!--                  <j-image-upload isMultiple  v-model="model.photo" ></j-image-upload>-->
<!--                </a-form-model-item>-->
<!--              </a-col>-->
             <a-col :span="24" >
                <a-form-model-item  label="上传图片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="photoString">
                  <div>

                    <div>
<!--                      <j-image-upload isMultiple  v-model="model.photo" >点击上传</j-image-upload>-->
                      <a-button style="margin-left: 8px"  v-on:click="imgClick()">点我拍照！</a-button>
                    </div>
                    <div
                      v-for="(urls, index) in imgs"
                      style="margin: 2px; border: 1px solid #ccc"
                    >
                      <div
                        style="text-align: right; position: relative"
                        v-on:click="deleteImg(index)"
                      >
                        X
                      </div>
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
              <a-col :span="24" >
                <a-form-model-item label="上传视频" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
                  <!-- 录像-- -->
                  <div>
                  <j-upload v-model="model.description">点击上传</j-upload>
                    <input type="file" @change="openCamera($event)"  accept="video/*" capture="user"/>
                  </div>
                  <!-- accept="video/*" ：accept 属性只能与 <input type="file"> 配合使用。-->
                  <!--	它规定能够通过文件上传进行提交的文件类型。 -->
                  <!-- 指定capture属性调用默认相机，摄像，录音功能-->
                </a-form-model-item>
              </a-col>

              <a-col :span="24" >
                <a-form-model-item label="举报人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingName">
                  <a-input v-model="model.reportingName" placeholder="请输入举报人姓名" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" >
                <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactNumber">
                  <a-input v-model="model.contactNumber" placeholder="请输入联系电话" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24" >
                <a-form-model-item label="举报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingTime">
                  <j-date placeholder="请选择举报时间" v-model="model.reportingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button @click="handleSubmit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px">取消</a-button>
            </a-form-model-item>
          </a-form-model>
        </j-form-container>
      </a-spin>

  </a-card>

</template>

<script>

  import { httpAction, postAction, getAction } from '@/api/manage'
  import AFormItem from 'ant-design-vue/lib/form/FormItem'
  import JUpload from '../../components/jeecg/JUpload'
  import JImageUpload from '../../components/jeecg/JImageUpload'


  export default {
    name: 'ReportingInformation',
    components: {AFormItem,JUpload,JImageUpload},
    data () {
      return {
        blob: new Blob(),
        uploadAction:window._CONFIG['domianURL']+"/sys/common/upload",
        imgs: [],
        reportingTime:'',
        reportingResult:'',
        //description:'',

        model:{

         },
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
          majorProblem: [
            { required: true, message: '请输入主要问题!'},
          ],
          contactNumber: [
            { required: true, message: '请输入联系电话!'},
          ],
          reportingTime: [
            { required: true, message: '请输入举报时间!'},
          ],
        },

        url: {
          upload:"/sys/common/upload",
          add: "/smartReportingInformation/smartReportingInformation/add",
        }
      }
    },
    mounted () {
      /*this.nowTimes()*/
    },
   /* beforeDestroy () {
      this.clear()
    },*/

    methods: {
      /*//动态时钟
      timeFormate (timeStamp) {
        let year = new Date(timeStamp).getFullYear()
        let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
        let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
        let ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()

        this.reportingTime = year + '-' + month + '-' + date  + ' ' + hh + ':' + mm + ':' + ss
      }, // 实时刷新当前时间，格式化
      nowTimes () {
        this.timeFormate(new Date())
        setInterval(this.nowTimes, 1000)
        this.clear()
        this.form.setFieldsValue({
          reportingTime:this.reportingTime
        })
      },
      clear () {
        clearInterval(this.nowTimes)
        this.nowTimes = null
      },*/

      deleteImg: function (index) {
        this.imgs.splice(index, 1);
      },
      //图片click
      imgClick: function () {
        document.getElementById("uploadFile").click();
      },
      //点击选中图片
      readLocalFile: function () {
        var localFile = document.getElementById("uploadFile").files[0];
        this.getBase64(localFile).then((res) => {
          console.log('----------------'+res+'-----------')
          this.imgs.push(res)
          console.log(this.dataURItoBlob(res))
          const params = {
            biz: '/temp',
            file:this.base64ToFile(res)
           // file: this.dataURItoBlob(res)
          }
          //console.log(this.imgs)
          //图片
          postAction(this.url.upload,params).then(res=>{
            console.log(res)
            if(res.success){
              this.$message.success("上传成功");
            }
          })
        })
        // console.log(localFile)
        // var reader = new FileReader();
        // var content;
        // var current = this;
        // reader.onload = function (event) {
        //   content = event.target.result;
        //   console.log(content)
        //   current.imgs.push(content); //获取图片base64代码
        //   // console.log(this.dataURItoBlob(content));
        // };
        // reader.onerror = function (event) {
        //   alert("error");
        // };
        // content = reader.readAsDataURL(localFile, "UTF-8");
        // console.log(content)
        // var sss = document.getElementById("uploadFile").value;
        // console.log(sss);
        // // this.blob = this.dataURItoBlob(sss)
        // let resdata=JSON.parse(JSON.stringify(this.imgs));
        // // const aaa = this.imgs
        // console.log(resdata)
      },
      getBase64(file) {
        return new Promise(function (resolve, reject) {
          let reader = new FileReader();
          let imgResult = "";
          reader.readAsDataURL(file);
          reader.onload = function () {
            imgResult = reader.result;
          };
          reader.onerror = function (error) {
            reject(error);
          };
          reader.onloadend = function () {
            resolve(imgResult);
          };
        });
      },
      // 录像
      // 调用摄像头 上传视频
      openCamera(t) {
        let that = this;
        let duration;
        let selectedFile = e.target.files[0];
        let reader = new FileReader(); //这是核心,读取操作就是由它完成.
        reader.onload = function (e) {
          let strContent = this.result;
          //获取视频或者音频时长
          let fileurl = URL.createObjectURL(selectedFile);
          let audioElement = new Audio(fileurl);
          //经测试，发现audio也可获取视频的时长
          audioElement.addEventListener("loadedmetadata", function (_event) {
            duration = audioElement.duration;
            if (duration > 8) {
              that.$message.error("视频时间过长，请重新录制");
            } else {
              that.base64ToFile(strContent);
            }
          });
        };
        reader.readAsDataURL(selectedFile); //读取文件的内容,也可以读取文件的URL
      },
      dataURItoBlob (dataURI) {
        // base64 解码
        //console.log("111")
        let byteString = window.atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        let T = mimeString.split('/')[1]
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
      },
      //将bes64转成文件
      base64ToFile(base64Data) {
        // base64转blob
        let arr = base64Data.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr], {
          type: mime,
        });
        // 将blob转为文件
        blob.lastModifiedDate = new Date();
        blob.name = "file";
        let config = {
          //其他配置
        };
        this.Request(blob, config); //发起请求
      },
      Request(data, config) {
        axios
          .post("/url", data, config)
          .then((res) => {
            console.log("成功");
          })
          .catch((err) => {
            console.log("失败");
          });
      },



      // 提交
      handleSubmit () {
        console.log(this.model)
        /*const params = {
          biz: '/temp/test',
          file: this.blob
        }

        //console.log(this.imgs)
       //图片、视频
        postAction(this.url.upload,params).then(res=>{
          console.log(res)
          if(res.success){
            this.$message.success("上传成功");
          }

        }),*/

        postAction(this.url.add,this.model).then(res =>{
          console.log(res)
          if(res.success){
            this.$message.success(res.message);
            //that.$emit('ok');
            this.$router.push({path: '/InsertReportingInformation/Success'});

          }


          else{
            this.$message.warning("请输入信息");
          }
        })

      }
    }
  }
 // this.$refs.form.resetFields();
</script>
