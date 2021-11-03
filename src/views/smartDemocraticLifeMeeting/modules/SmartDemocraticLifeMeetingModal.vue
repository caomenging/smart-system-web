<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="单位ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departId">
              <a-input v-model="model.departId" placeholder="请输入单位ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingTime">
              <j-date placeholder="请选择会议时间" v-model="model.meetingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingName">
              <a-input v-model="model.meetingName" placeholder="请输入会议名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入会议地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主持人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostId">
              <a-input v-model="model.hostId" placeholder="请输入主持人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingTime">
              <j-date placeholder="请选择上报时间" v-model="model.reportingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议记录人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderId">
              <a-input v-model="model.recorderId" placeholder="请输入会议记录人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议内容摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="summary">
              <j-editor v-model="model.summary" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议记录" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="record">
              <a-textarea v-model="model.record" rows="4" placeholder="请输入会议记录" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatorId">
              <a-input v-model="model.creatorId" placeholder="请输入创建人工号" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: "SmartDemocraticLifeMeetingModal",
    components: { 
    },
    data () {
      return {
        title:"操作",
        width:800,
        visible: false,
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
           departId: [
              { required: true, message: '请输入单位ID!'},
           ],
           meetingTime: [
              { required: true, message: '请输入会议时间!'},
           ],
           meetingName: [
              { required: true, message: '请输入会议名称!'},
           ],
           address: [
              { required: true, message: '请输入会议地点!'},
           ],
           hostId: [
              { required: true, message: '请输入主持人工号!'},
           ],
           reportingTime: [
              { required: true, message: '请输入上报时间!'},
           ],
           recorderId: [
              { required: true, message: '请输入会议记录人工号!'},
           ],
           summary: [
              { required: true, message: '请输入会议内容摘要!'},
           ],
           record: [
              { required: true, message: '请输入会议记录!'},
           ],
           creatorId: [
              { required: true, message: '请输入创建人工号!'},
           ],
        },
        url: {
          add: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/add",
          edit: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/edit",
        }
     
      }
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
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.clearValidate();
      },
      handleOk () {
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
              that.close();
            })
          }else{
             return false
          }
        })
      },
      handleCancel () {
        this.close()
      },

      
    }
  }
</script>