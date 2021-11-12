<template>
  <j-modal
    :title="title"
    :width="900"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    okText="提交"
    :okButtonProps="{ class: { 'jee-hidden': verifyDisableSubmit } }"
    @cancel="handleCancel"
  >
    <test-verify-form v-if="type==='婚前报备'" ref="realForm" :disabled="disableSubmit" />
    <!-- <test v-if="type==='婚前报备'" ref="realForm" :disabled="disableSubmit" /> -->
    <smart-premarital-filing-form v-if="type==='婚报备'" ref="realForm" :disabled="disableSubmit" />
    <smart-supervision-form v-if="type==='监督检查'" ref="realForm" :disabled="disableSubmit" />
    <smart-post-marriage-report-form v-if="type==='婚后报备'" ref="realForm" :disabled="disableSubmit" />

    <h2 :style="{ padding: '24px', background: '#9cdcfe', textAlign: 'center' }" >审核区域</h2>
    <tasks-form ref="verifyForm" @ok="submitCallback" :disabled="verifyDisableSubmit" :flowNo="flowNo" />
    <smart-triple-importance-one-greatness-form v-if="type==='三重一大'" ref="realForm" :disabled="disableSubmit" />
  </j-modal>
</template>

<script>
import SmartPremaritalFilingForm from '../../SmartPremaritalFiling/modules/SmartPremaritalFilingForm.vue'
import Test from '../model/test.vue'
import TasksForm from './TasksForm'
import TestVerifyForm from '@/views/testVerify/modules/TestVerifyForm'
import SmartSupervisionForm from '../../smartSupervision/modules/SmartSupervisionForm.vue'
import SmartPostMarriageReportForm from '../../SmartPostMarriage/modules/SmartPostMarriageReportForm.vue'
import SmartTripleImportanceOneGreatnessForm from '../../SmartTripleImportanceOneGreatness/modules/SmartTripleImportanceOneGreatnessForm.vue'

export default {
  name: 'TaskModal',
  components: {
    TasksForm,
    TestVerifyForm,
    Test,
    SmartPremaritalFilingForm,
    SmartSupervisionForm,
    SmartPostMarriageReportForm,
    SmartTripleImportanceOneGreatnessForm,
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      verifyDisableSubmit: true,
      flowNo:'',
      type:''
    }
  },
  beforeCreate() {
    console.log(record)
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.type = record.taskType
      this.$nextTick(() => {
        let realRecord = record
        realRecord.id = record.flowNo
        this.flowNo = realRecord.id
        console.log(realRecord)
        // this.$refs.verifyForm.edit(realRecord)
        this.$refs.realForm.edit(realRecord)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.verifyForm.handleOk()
    },
    submitCallback(record) {
      this.$emit('ok')
      this.visible = false
      console.log(record)
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>