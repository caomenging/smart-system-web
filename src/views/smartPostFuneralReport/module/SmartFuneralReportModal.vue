<template>
  <j-modal
    :title="title"
    :width="width"
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
    <smart-funeral-report-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></smart-funeral-report-form>
  </j-modal>
</template>

<script>

  import SmartFuneralReportForm from './SmartFuneralReportForm'
  import { getAction } from '../../../api/manage'
  export default {
    name: 'SmartFuneralReportModal',
    components: {
      SmartFuneralReportForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        typeDesc: '',
        typeName: '丧事报备'
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
      edit (newRecord) {
        // console.log(newRecord.reportTime)
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(newRecord);
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
      preView(record) {
        // this.visible = true
        // console.log(record.reportTime)
        // let newRecord = Object.assign({},record)
        // console.log(newRecord.reportTime)
        getAction('/smartFuneralReport/smartFuneralReport/getById',
          {id:record.preId}).then((res)=>{
          if(res.success){
            // newRecord.peopleId = res.result.peopleId;
            // newRecord.departId = res.result.departId;
            // newRecord.funeralTime = res.result.funeralTime;
            // newRecord.address = res.result.address;
            // newRecord.peopleAccount = res.result.peopleAccount;
            // newRecord.peopleType = res.result.peopleType;
            // newRecord.reportTime = res.result.reportTime;
            let newRecord = Object.assign({},res.result)
            // console.log(newRecord.reportTime)
            this.edit(newRecord);
            this.title="口头报备详情";
            this.disableSubmit = true;
          }
          else{
            this.$message.error("口头报备数据调取失败！")
          }
        })
      }
    }
  }
</script>