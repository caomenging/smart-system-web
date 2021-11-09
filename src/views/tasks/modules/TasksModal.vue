<template>
  <j-modal
    :title="title"
    :width="900"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <test ref="realForm" @ok="submitCallback" :disabled="disableSubmit" />
    <h1>审核区域</h1>
    <tasks-form ref="verifyForm" :disabled="verifyDisableSubmit" />
  </j-modal>
</template>

<script>
import SmartPremaritalFilingForm from '../../SmartPremaritalFiling/modules/SmartPremaritalFilingForm.vue'
import Test from '../model/test.vue'

import TasksForm from './TasksForm'

export default {
  name: 'TaskModal',
  components: {
    TasksForm,
    Test,
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      verifyDisableSubmit: true
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
      this.$nextTick(() => {
        let realRecord = record
        realRecord.id = '1456130292371910657'
        console.log(realRecord)
        this.$refs.realForm.edit(realRecord)
        
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.handleOk()
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