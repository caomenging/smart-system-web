<template>
  <j-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
  <task-detail-list ref="realList" @ok="submitCallback" :disabled="disableSubmit"/>
    <!-- <smart-supervision-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/> -->
  </j-modal>
</template>

<script>
import TaskDetailList from './TaskDetailList.vue'
export default {
  name: 'TaskDetailModal',
  components: {TaskDetailList},
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
    }
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
        this.$refs.realList.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.handleOk()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>