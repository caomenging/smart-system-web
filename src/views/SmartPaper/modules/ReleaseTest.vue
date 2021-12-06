<template>
  <div>
    <!-- 发布考试弹框 -->
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      cancelText="关闭">
    <a-spin :spinning="confirmLoading">
        <j-form-container :disabled="formDisabled">
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-row>

              <a-col :span="24">
                <a-form-model-item label="考试开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examStarttime">
                  <j-date placeholder="请选择考试开始时间"  v-model="model.examStarttime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="考试结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examEndtime">
                  <j-date placeholder="请选择考试结束时间"  v-model="model.examEndtime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-model-item>
              </a-col>

              <a-col :span="24" >
                <a-form-model-item label="指定人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personId" >
                  <j-select-user-by-dep v-model="model.users" :multi="true" />
                </a-form-model-item>
              </a-col>
              <!--         <a-col :span="12">选中的用户(v-model):{{ model.personId }}</a-col>&ndash;&gt;-->

            </a-row>
           <!-- <a-form-model-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button @click="submitForm()" type="primary">发布</a-button>

            </a-form-model-item>-->
          </a-form-model>

        </j-form-container>
    </a-spin>
    </j-modal>
  </div>
</template>

<script>
import { validateDuplicateValue } from '@/utils/util'
import { httpAction,putAction, postAction,getAction } from '@/api/manage'

export default {
  name: "ReleaseTest",
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  data() {
    return {
      title:'发布调查问卷',
      width:800,
      visible: false,
      disableSubmit: false,
      model: {
        users: []
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      paperId: '',
      confirmLoading: false,
      validatorRules: {
        examStarttime: [
          { required: true, message: '请输入开始时间!' },
        ],
        examEndtime: [
          { required: true, message: '请输入结束时间!' },
        ],
        users: [
          { required: true, message: '请选择考试人员!' },
        ],
      },

    };
  },
  methods: {
    releaseTest(paperId){
      this.visible = true;
      this.paperId= paperId
    },
    submitForm() {
      const that = this;
      // 触发表单验证
      console.log(that.paperId);
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let paperId = that.paperId;
          let url = "/SmartExam/smartRelease/releaseExam/" + paperId;
          postAction(url,this.model).then((res)=>{
            if(res.success){
              this.visible = false;
              this.$elmessage({
                type:"success",
                message: "发布成功！",
                duration:1000
              })
              that.$emit('ok');
            }else{
              this.$elmessage({
                type:"error",
                message: "发布失败！",
                duration:1000,
              })
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      this.submitForm();
    },
    submitCallback(){
      this.$emit('ok');
      this.visible = false;
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>
