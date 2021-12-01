<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="试卷类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paperType">
              <j-dict-select-tag type="list" v-model="model.paperType" dictCode="paper_type" placeholder="请选择试卷类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="试卷名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paperName">
              <a-textarea v-model="model.paperName" rows="4" placeholder="请输入试卷名称" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="试卷状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paperStatus">
              <j-dict-select-tag type="list" v-model="model.paperStatus" dictCode="paper_status" placeholder="请选择试卷状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="命卷人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createBy">
              <a-input v-model="model.createBy" placeholder="请输入命卷人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="命卷日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">
              <j-date placeholder="请选择命卷日期"  v-model="model.createTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="题目数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="topicNum">
              <a-input v-model="model.topicNum" placeholder="请输入题目数量"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="总分" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalScore">
              <a-input v-model="model.totalScore" placeholder="请输入总分"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="及格线" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="passMark">
              <a-input v-model="model.passMark" placeholder="请输入及格线"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="答题时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="time">
              <a-input-number v-model="model.time" placeholder="请输入答题时间" style="width: 100%" />
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
    name: 'SmartSurveyForm',
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
           paperType: [
              { required: true, message: '请输入试卷类型!'},
           ],
           paperName: [
              { required: true, message: '请输入调查问卷名称!'},
           ],
           createBy: [
              { required: true, message: '请输入命卷人!'},
           ],
           createTime: [
              { required: true, message: '请输入命卷日期!'},
           ],
        },
        url: {
          add: "/SmartPaper/smartPaper/add",
          edit: "/SmartPaper/smartPaper/edit",
          queryById: "/SmartPaper/smartPaper/queryById"
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