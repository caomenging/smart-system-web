<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-row type="flex" justify="center">
      <a-col :span="22">
        <a-card style="width: 100%; margin: 1rem 0">
          <a-card-meta title="填表说明" :description="typeDesc">
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <smart-post-funeral-report-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></smart-post-funeral-report-form>
  </j-modal>
</template>

<script>

  import SmartPostFuneralReportForm from './SmartPostFuneralReportForm'
  import { getAction } from '../../../api/manage'
  export default {
    name: 'SmartPostFuneralReportModal',
    components: {
      SmartPostFuneralReportForm
    },
    data () {
      return {
        title:'',
        width:896,
        visible: false,
        disableSubmit: false,
        typeDesc: '',
        typeName: '丧事事后报备'
      }
    },
    methods: {
      add () {
        this.visible=true
        getAction('/taskType/smartVerifyType/queryByTypeName',{typeName: this.typeName}).then((res) => {
          if(res.success) {
            this.typeDesc = res.result
          }
        })
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      postAdd(record) {
        this.visible = true
        getAction('/taskType/smartVerifyType/queryByTypeName',
          {typeName:this.typeName}).then((res)=>{
          if(res.success){
            this.typeDesc=res.result
          }
        })
        this.$nextTick(() => {
          this.$refs.realForm.model.preId = record.id
          this.$refs.realForm.add()
        })
      }
    }
  }
</script>