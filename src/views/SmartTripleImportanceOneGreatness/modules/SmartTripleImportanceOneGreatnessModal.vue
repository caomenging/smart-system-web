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
            <a-form-model-item label="单位ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="documentid">
              <a-input v-model="model.documentid" placeholder="请输入单位ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingName">
              <a-input v-model="model.meetingName" placeholder="请输入名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingPlace">
              <a-input v-model="model.meetingPlace" placeholder="请输入地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingStarttime">
              <j-date placeholder="请选择时间" v-model="model.meetingStarttime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingType">
              <j-dict-select-tag type="list" v-model="model.meetingType" dictCode="meeting_type" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参会人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingNumber">
              <a-input-number v-model="model.meetingNumber" placeholder="请输入参会人数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参会人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingPeople">
              <a-input v-model="model.meetingPeople" placeholder="请输入参会人员" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主持人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingHoster">
              <a-input v-model="model.meetingHoster" placeholder="请输入主持人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="记录人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingRecorer">
              <a-input v-model="model.meetingRecorer" placeholder="请输入记录人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议内容摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingAbstract">
              <a-textarea v-model="model.meetingAbstract" rows="4" placeholder="请输入会议内容摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingRemarks">
              <a-textarea v-model="model.meetingRemarks" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatBy">
              <a-input v-model="model.creatBy" placeholder="请输入创建人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatTime">
              <j-date placeholder="请选择创建时间" v-model="model.creatTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
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
    name: "SmartTripleImportanceOneGreatnessModal",
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
           documentid: [
              { required: true, message: '请输入单位ID!'},
           ],
           meetingStarttime: [
              { required: true, message: '请输入时间!'},
           ],
           meetingType: [
              { required: true, message: '请输入类型!'},
           ],
           meetingNumber: [
              { required: true, message: '请输入参会人数!'},
           ],
           creatTime: [
              { required: true, message: '请输入创建时间!'},
           ],
        },
        url: {
          add: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/add",
          edit: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/edit",
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