<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="文件主题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入文件主题"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="type_data" placeholder="请选择文件类型" />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="发布人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publisher">-->
<!--              <j-select-user-by-dep v-model="model.publisher" @info="realname" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="文件描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="describe1">
              <j-editor v-model="model.describeA" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">
              <j-date placeholder="请选择创建日期"  v-model="model.createTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上传文件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file">
              <eloam-modal ref="modalForm" @ok='scanOk' biz-path='eloam'></eloam-modal>
              <j-upload v-model="model.file"   ></j-upload>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
            </a-form-model-item>


          </a-col>
          <a-col :span="24">
            <a-form-model-item label="下载次数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="times">
              <a-input-number v-model="model.times" placeholder="请输入下载次数" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import EloamModal from "../../eloam/modules/EloamModal";
  import store from "@/store"

  export default {
    name: 'SmartDataSheetNewForm',
    components: {
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
        rootUrl:" /smart_data_sheet_new/smartDataSheetNew",
        model:{
          publisher:''
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
           name: [
              { required: true, message: '请输入文件主题!'},
           ],
           type: [
              { required: true, message: '请输入文件类型!'},
           ],
           // publisher: [
           //    { required: true, message: '请输入发布人!'},
           // ],
           createTime: [
              { required: true, message: '请输入创建日期!'},
           ],
           file: [
              { required: true, message: '请输入上传文件!'},
           ],
        },
        url: {
          add: "/smart_data_sheet_new/smartDataSheetNew/add",
          edit: "/smart_data_sheet_new/smartDataSheetNew/edit",
          queryById: "/smart_data_sheet_new/smartDataSheetNew/queryById"
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
    eloamScan() {
      this.$refs.modalForm.open()
    },
    scanOk(url) {
      let image = url
      if (image) {
        let arr = []
        // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
        if (this.model.files) {
          arr.push(this.model.files)
        }
        arr.push(image)
        // 更新表单中文件url字段, files 为字段名称
        this.$set(this.model, 'files', arr.join())
      }
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
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