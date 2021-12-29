<template>
  <a-card title='新增宣传教育' :bordered='false'>
    <a-button slot='extra' type='primary' @click='handleOk'>
      保存
    </a-button>
    <smart-publicity-education-form ref='realForm' @ok='submitCallback'></smart-publicity-education-form>
    <template slot='actions' class='ant-card-actions'>
      <a-button type='primary' @click='handleOk'>
        保存
      </a-button>
    </template>
  </a-card>
</template>

<script>
import SmartPublicityEducationForm from '@views/SmartPublicityEducation/modules/SmartPublicityEducationForm'

export default {
  name: 'AddSmartPublicityEducation',
  components: {
    SmartPublicityEducationForm
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.realForm.handleOk()
    },
    submitCallback() {
      window.location.reload()
    }
  }
}
</script>

<style scoped>

</style>