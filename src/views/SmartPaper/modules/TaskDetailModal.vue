<template>
  <j-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    :fullscreen = "true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <task-detail-list ref="realList" @ok="submitCallback" :disabled="disableSubmit" />
    <!-- <smart-supervision-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/> -->
  </j-modal>
</template>

<script>
import { getAction } from '../../../api/manage'
import TaskDetailList from './TaskDetailList.vue'
export default {
  name: 'TaskDetailModal',
  components: { TaskDetailList },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      anntId: ''
    }
  },
  created() {

  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(examId,examName) {
      this.visible = true
      console.log(examId)
      this.title = examName+'成绩单'
      // this.title = "【" + record.titile + "】"
      // this.anntId = record.id
      this.$nextTick(() => {
        this.$refs.realList.edit(examId,examName)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    /*    handleOk() {
          this.$refs.realForm.handleOk()
        },*/
    handleOk() {
        this.close()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    handleBatchDownload(record) {
      this.$refs.realList.handleBatchDownload(record)
    },
    remindAll(anntId, type) {
      getAction('/sys/sysAnnouncementSend/remindAll',{anntId: anntId, type:type}).then((res) => {
        if(res.success) {
          this.$message.success(res.message)
        }
      })
    }
  },
}
</script>

<style scoped>
</style>