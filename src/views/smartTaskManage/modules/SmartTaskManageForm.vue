<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="任务名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskName">
              <a-input v-model="model.taskName" placeholder="请输入任务名" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskDesc">
              <a-input v-model="model.taskDesc" placeholder="请输入任务描述" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="使用中的模板名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="templateName">
              <j-popup
                v-model="model.templateName"
                field="templateName"
                org-fields="template_name,template_code,template_content"
                dest-fields="templateName,templateCode,templateContent"
                code="tem_test"
                :multi="true"
                @input="popupCallback"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="使用中的模板编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="templateCode">
              <a-input v-model="model.templateCode" placeholder="请输入使用中的模板编码" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="提醒方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendType">
              <j-dict-select-tag type="list" v-model="model.sendType" dictCode="msgType" placeholder="请选择发送方式" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <a-input v-model="model.status" placeholder="请输入任务状态" disabled ></a-input>
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
    name: 'SmartTaskManageForm',
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
        },
        url: {
          add: "/smartTaskManage/smartTaskManage/add",
          edit: "/smartTaskManage/smartTaskManage/edit",
          queryById: "/smartTaskManage/smartTaskManage/queryById"
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