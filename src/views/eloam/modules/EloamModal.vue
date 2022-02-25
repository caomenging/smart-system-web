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
    <camera ref="realForm" @ok="submitCallback" @close="close" :disabled="disableSubmit" :biz-path="bizPath"></camera>
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
  props:{
    /*这个属性用于控制文件上传的业务路径*/
    bizPath:{
      type:String,
      required:false,
      default:"temp"
    },
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
    submitCallback(url) {
      this.$emit('ok', url);
      // this.visible = false;
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>