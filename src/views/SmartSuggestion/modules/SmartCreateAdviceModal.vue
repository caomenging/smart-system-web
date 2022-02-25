<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <a-row type="flex" justify="center">
      <a-col :span="22">
        <a-card style="width: 100%; margin: 1rem 0">
          <a-card-meta title="填表说明" :description="typeDesc">
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <smart-create-advice-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" />
  </j-modal>
</template>

<script>
import { getAction } from '../../../api/manage'
import SmartCreateAdviceForm from './SmartCreateAdviceForm'

export default {
  name: 'SmartCreateAdviceModal',
  components: {
    SmartCreateAdviceForm,
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      typeDesc: '',
      typeName: '制发建议'
    }
  },
  methods: {
    add() {
      this.visible = true
      getAction('/taskType/smartVerifyType/queryByTypeName',{typeName: this.typeName}).then((res) => {
        if(res.success) {
          this.typeDesc = res.result
        }
      })
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.submitForm()
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