<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="模板名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="templateName">
              <a-input v-model="model.templateName" placeholder="请输入模板名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入标题"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="优先级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="priority">
              <a-select
                v-model="model.priority"
                placeholder="请选择优先级"
                :disabled="disableSubmit"
                :getPopupContainer="(target) => target.parentNode"
              >
                <a-select-option value="L">低</a-select-option>
                <a-select-option value="M">中</a-select-option>
                <a-select-option value="H">高</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="msgAbstract">
              <a-input v-model="model.msgAbstract" placeholder="请输入摘要"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
              <j-editor v-model="model.content"></j-editor>
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
import JEditor from '../../../components/jeecg/JEditor.vue'

  export default {
    name: 'SmartMessageTemplateForm',
    components: {
        JEditor
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
          templateName: [
            { required: true, message: '请输入模板名!'},
          ],
           title: [
              { required: true, message: '请输入标题!'},
           ],
           priority: [
              { required: true, message: '请输入优先级!'},
           ],
           msgAbstract: [
              { required: true, message: '请输入摘要!'},
           ],
           content: [
              { required: true, message: '请输入内容!'},
           ],
        },
        url: {
          add: "/smartMessageTemplate/smartMessageTemplate/add",
          edit: "/smartMessageTemplate/smartMessageTemplate/edit",
          queryById: "/smartMessageTemplate/smartMessageTemplate/queryById"
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
    }
  }
</script>