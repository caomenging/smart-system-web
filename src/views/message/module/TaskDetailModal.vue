<template>
  <j-modal
    :title="title+'统计详情'"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <a-row style="padding:0 24px">
      <a-button type="primary" @click="remindAll(anntId,title)" > 一键提醒 </a-button>
      <a-button type="primary" @click="handleBatchDownload(title)" style="margin-left: 8px"> 一键下载附件 </a-button>
    </a-row>
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
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      console.log(record)
      this.title = "【" + record.titile + "】"
      this.anntId = record.id
      this.ty
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