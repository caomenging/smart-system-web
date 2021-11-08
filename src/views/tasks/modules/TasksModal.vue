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
    <smart-premarital-filing-form
      ref="realForm"
      @ok="submitCallback"
      :disabled="disableSubmit"
    />
    <h1>审核区域</h1>
    <tasks-form ref="realForm"/>
  </j-modal>
</template>

<script>
import SmartPremaritalFilingForm from '../../SmartPremaritalFiling/modules/SmartPremaritalFilingForm.vue'

import TasksForm from './TasksForm'

  export default {
    name: 'TaskModal',
    components: {
      TasksForm,
      SmartPremaritalFilingForm
    },
    data() {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods:{
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.handleOk();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>
</style>