<template>
  <a-card :bordered="false" style="width: 100%;text-align: center;margin-left:0%">
    <a-steps class="steps" :current="currentTab">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="content">
      <step1 v-if="currentTitle === '更改手机'" @nextStep="nextStep" @cancel="reload"/>
      <step2 v-if="currentTitle === '手机验证'" @nextStep="nextStep" @change="reload"/>
      <step3 v-if="currentTitle === '更改密码'" @nextStep="nextStep" @prevStep="prevStep" :userList="userList"/>
      <step4 v-if="currentTitle === '完成'" @prevStep="prevStep" @finish="finish" @reload="reload" :userList="userList" :title="lastTitle"/>
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
  import Step2 from './Step2'
  import Step3 from './Step3'
  import Step4 from './Step4'
  import Vue from 'vue'
  import { USER_INFO, CHANGE_PHONE, VERIFY_PHONE, CHANGE_PASSWORD } from '@/store/mutation-types'

  export default {
    name: "Verification",
    components: {
      Step1,
      Step2,
      Step3,
      Step4
    },
    data() {
      return {
        description: '将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。',
        currentTab: 0,
        currentTitle: '',
        lastTitle: '',
        userList: {},
        // form
        form: null,
        steps: []
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.steps = []
        // 修改密码前必须验证手机号码
        if (Vue.ls.get(VERIFY_PHONE) || (Vue.ls.get(CHANGE_PASSWORD))) {
          this.steps.push({
            title: '手机验证'
          })
        }
        if (Vue.ls.get(CHANGE_PHONE)) {
          // 如果手机号码发生变化则无法进行验证
          //Vue.ls.remove(VERIFY_PHONE)
          this.steps = []
          this.steps.push({
            title: '更改手机'
          })
        }
        if (Vue.ls.get(CHANGE_PASSWORD)) {
          this.steps.push({
            title: '更改密码'
          })
        }

        this.steps.push({
          title: '完成'
        })

        this.currentTitle = this.steps[this.currentTab].title
      },

      reload() {
        this.init()
        this.finish()
      },

      // handler
      nextStep(data) {
        this.userList = data;
        this.lastTitle = this.currentTitle
        if (this.currentTab < 4) {
          this.currentTab += 1
          this.currentTitle = this.steps[this.currentTab].title
        }
      },
      prevStep(data) {
        this.userList = data;
        if (this.currentTab > 0) {
          this.currentTab -= 1
          this.currentTitle = this.steps[this.currentTab].title
        }
      },
      finish() {
        this.currentTab = 0
        this.lastTitle = ''
        this.currentTitle = this.steps[this.currentTab].title
      }
    }
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
  /deep/ .password-retrieval-form{
    max-width: 500px;
    margin: 40px auto 0;
    .ant-form-explain{
      text-align: left;
    }
  }
</style>

