<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">

    <a-row type="flex" justify="center">
      <a-col :span="22">
        <a-card style="width: 100%; margin: 1rem 0">
          <a-card-meta title="填表说明" :description="typeDesc">
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <smart-three-meeting-one-lesson-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
  </j-modal>
</template>

<script>

  import SmartThreeMeetingOneLessonForm from './SmartThreeMeetingOneLessonForm'
  import {getAction} from "../../../api/manage";

  export default {
    name: 'SmartThreeMeetingOneLessonModal',
    components: {
      SmartThreeMeetingOneLessonForm
    },
    data() {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,

        typeDesc: '',
        typeName: '三会一课'
      }
    },
    methods:{
      add () {
        this.visible=true

        getAction('/taskType/smartVerifyType/queryByTypeName' , {typeName: this.typeName}).then((res) => {
          if(res.success){
            this.typeDesc = res.result
          }
        })

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