<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="任务类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jobType"  @blur.native.capture="splitText">
              <j-dict-select-tag type="list" v-model="model.jobType" dictCode="job_type" placeholder="请选择任务类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jobName">
              <a-input v-model="model.jobName" placeholder="请输入任务名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jobDescribe">
              <a-input v-model="model.jobDescribe" placeholder="请输入任务描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否每日提醒" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isLoop">
              <j-dict-select-tag type="list" v-model="model.isLoop" dictCode="is_loop" placeholder="请选择是否每日提醒" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item v-if="model.isLoop=='1'" label="执行时间(日）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="executeTimeDay">
              <j-date placeholder="请选择执行时间(日）" v-model="model.executeTimeDay"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="执行时间(时）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="executeTimeHour">
              <j-time placeholder="请选择执行时间(时）"  v-model="model.executeTimeHour" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="提醒全体人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isToAll">
              <j-dict-select-tag type="list" v-model="model.isToAll" dictCode="is_loop" placeholder="请选择提醒全体人员" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-show="model.isToAll == '1'">
            <a-form-model-item label="提醒人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="toUser">
              <j-select-user-by-dep v-model="model.toUser" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="提醒类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="msgType" placeholder="请选择提醒类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="模板名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="templateName">
              <j-popup
                v-model="model.templateName"
                field="templateName"
                org-fields="template_name,template_content"
                dest-fields="templateName,templateContent"
                code="tem_test"
                :multi="true"
                @input="popupCallback"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="模板内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="templateContent">
              <a-input v-model="model.templateContent" placeholder="请输入模板内容" disabled ></a-input>
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

  export default {
    name: 'SmartJobForm',
    components: {
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
           jobType: [
              { required: true, message: '请输入任务类型!'},
           ],
           isLoop: [
              { required: true, message: '请输入是否每日提醒!'},
           ],
           executeTimeHour: [
              { required: true, message: '请输入执行时间(时）!'},
           ],
           isToAll: [
              { required: true, message: '请输入提醒全体人员!'},
           ],
           type: [
              { required: true, message: '请输入提醒类型!'},
           ],
           templateName: [
              { required: true, message: '请输入模板名!'},
           ],
           templateContent: [
              { required: true, message: '请输入模板内容!'},
           ],
        },
        url: {
          add: "/smartJob/smartJob/add",
          edit: "/smartJob/smartJob/edit",
          queryById: "/smartJob/smartJob/queryById"
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

      // splitText(){
      //   if(model.jobType == "入党纪念日提醒"){
      //     model.isLoop = '0'
      //     model.isToAll = '0'
      //     model.jobName = "smart"
      //   }
      // },

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
      popupCallback(value,row){
         this.model = Object.assign(this.model, row);
      },
    }
  }
</script>