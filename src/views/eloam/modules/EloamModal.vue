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
    <camera ref="realCamera" @ok="submitCallback" :disabled="disableSubmit"></camera>
  </j-modal>
</template>

<script>
import camera from "./camera";

export default {
  name: "EloamModal",
  components: {
    camera
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      this.$refs.realForm.submitForm();
    },
    submitCallback(info) {
      this.$emit('ok', info);
      this.visible = false;
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>