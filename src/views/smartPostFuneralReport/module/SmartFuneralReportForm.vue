<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleId">
              <select-user-by-dep v-model="model.peopleId"  @info="getPerson" />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departId">-->
<!--                <j-select-depart placeholder="请选择单位"  v-model="model.departId" customReturnField='id' :multi="false" :treeOpera="true"></j-select-depart>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="操办时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="funeralTime">
              <j-date placeholder="请选择操办时间"  v-model="model.funeralTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入地点"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="宴请人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleAccount">
              <a-input-number v-model="model.peopleAccount" placeholder="请输入宴请人数" style="width: 100%" ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="宴请人员范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleType">
              <a-input v-model="model.peopleType" placeholder="请输入宴请人员范围"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTime">
              <j-date placeholder="请选择报告时间"  v-model="model.reportTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="files">
              <a-button icon="camera" v-on:click="imgClick()">手机拍照</a-button>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
              <input
                style="float: left; display: none"
                type="file"
                id="uploadFile"
                accept="image/*"
                capture="camera"
                v-on:change="readLocalFile()"
              />
              <j-upload v-model="model.files" :biz-path="bizPath"  ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <eloam-modal ref="modalForm" @ok='scanOk'></eloam-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'
  import EloamModal from '@views/eloam/modules/EloamModal'

  export default {
    name: 'SmartFuneralReportForm',
    components: {
      SelectUserByDep,
      EloamModal
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
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
        validatorRules: {
           peopleId: [
              { required: true, message: '请选择人员!'},
           ],
           funeralTime: [
              { required: true, message: '请输入操办时间!'},
           ],
           address: [
              { required: true, message: '请输入地点!'},
           ],
           peopleAccount: [
              { required: true, message: '请输入宴请人数!'},
           ],
           peopleType: [
              { required: true, message: '请输入宴请人员范围!'},
           ],
           reportTime: [
              { required: true, message: '请输入报告时间!'},
           ],
        },
        url: {
          add: "/smartFuneralReport/smartFuneralReport/add",
          edit: "/smartFuneralReport/smartFuneralReport/edit",
          queryById: "/smartFuneralReport/smartFuneralReport/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      eloamScan() {
        this.$refs.modalForm.open()
      },
      scanOk(url) {
        let image = url
        if (image) {
          let arr = []
          if (this.model.files) {
            arr.push(this.model.files)
          }
          arr.push(image)
          // 更新表单中文件url字段, files 为字段名称
          this.$set(this.model, 'files', arr.join())
        }
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
          let formData = new FormData()
          formData.append('biz', this.bizPath)
          formData.append('file', this.dataURLtoFileFun(res, localFile.name))
          uploadFile(formData).then((res) => {
            console.log(res)
            if (res.success) {
              let arr = []
              if (this.model.files) {
                arr.push(this.model.files)
              }
              arr.push(res.message)
              // 更新上传文件列表
              this.$set(this.model, 'files', arr.join())
            }
          })
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
      getPerson(back) {
        let that = this
        console.log(back)
        that.model.peopleId = back[0].id
        // that.model.name = back[0].realname
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (newRecord) {
        this.model = Object.assign({}, newRecord);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>