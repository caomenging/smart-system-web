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
    <selected-people-list ref="realList" @ok="submitCallback" :disabled="disableSubmit" />
    <!-- <smart-supervision-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/> -->
  </j-modal>
</template>

<script>
import { getAction } from '../../../api/manage'
import TaskDetailList from './TaskDetailList.vue'
import SelectedPeopleList from './SelectedPeopleList.vue'
export default {
  name: 'SelectedPeopleModal',
  components: { SelectedPeopleList },
  data() {
    return {
      title: '被访人',
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
    edit(paperId,departId) {
      this.visible = true
      console.log(paperId,departId)
      this.$nextTick(() => {
        this.$refs.realList.edit(paperId,departId)
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