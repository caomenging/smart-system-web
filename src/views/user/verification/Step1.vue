<template>
  <div>
    <a-form-model ref='form' :model='model' :rules='validatorRules' class='password-retrieval-form'
                  @keyup.enter.native='nextStep'>
      <a-form-model-item label='密钥' required prop='key' :labelCol='{span: 5}' :wrapperCol='{span: 19}'>
        <a-row :gutter='16'>
          <a-col class='gutter-row' :span='24'>
            <a-input v-model='model.key' type='text' autocomplete='false' placeholder='请输入加密密钥'>
              <a-icon slot='prefix' type='key' :style="{ color: 'rgba(0,0,0,.25)'}" />
            </a-input>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label='新手机' required prop='phone' :labelCol='{span: 5}' :wrapperCol='{span: 19}'>
        <a-row :gutter='16'>
          <a-col class='gutter-row' :span='24'>
            <a-input v-model='model.phone' type='text' autocomplete='false' placeholder='请输入手机号'>
              <a-icon slot='prefix' type='phone' :style="{ color: 'rgba(0,0,0,.25)'}" />
            </a-input>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item v-if='show' required prop='captcha' label='验证码' :labelCol='{span: 5}' :wrapperCol='{span: 19}'>
        <a-row :gutter='16'>
          <a-col class='gutter-row' :span='14'>
            <a-input v-model='model.captcha' type='text' placeholder='手机短信验证码'>
              <a-icon slot='prefix' type='code' :style="{ color: 'rgba(0,0,0,.25)'}" />
            </a-input>
          </a-col>
          <a-col class='gutter-row' :span='8'>
            <a-button
              tabindex='-1'
              size='default'
              :disabled='state.smsSendBtn'
              @click.stop.prevent='getCaptcha'
              v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item :wrapperCol='{span: 19, offset: 5}'>
        <!--        <a href="javascript:;" @click="handleLogout" style="float: left;line-height: 40px;">-->
        <!--          <a-icon type="logout"/>-->
        <!--          <span>&nbsp;退出登录</span>-->
        <!--        </a>-->
        <a-button @click='cancel' style='margin-left: 0px'>取消</a-button>
        <a-button type='primary' @click='nextStep' style='margin-left: 20px'>下一步</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { postAction } from '@/api/manage'
import { mapActions } from 'vuex'
import Vue from 'vue'
import { CHANGE_PHONE, USER_INFO, VERIFY_PHONE } from '@/store/mutation-types'

export default {
  name: 'Step1',
  props: ['userList'],
  data() {
    return {
      model: {},
      loading: false,
      // accountName: this.userList.username,
      dropList: '0',
      captcha: '',
      smsmode: '1',
      show: true,
      changePhone: false,
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        captcha: '',
        mobile: ''
      },
      validatorRules: {
        key: [
          { required: true, message: '请输入加密密钥!' }
        ],
        phone: [
          { required: true, message: '请输入手机号码!' },
          { validator: this.validatePhone }
        ],
        captcha: [
          { required: true, message: '请输入短信验证码!' }
        ]
      }
    }
  },
  mounted() {
  },
  computed: {},
  methods: {
    nextStep() {
      let that = this
      that.loading = true
      this.$refs['form'].validate((success) => {
        if (success == true) {
          let params = {
            key: this.model.key,
            mobile: this.model.phone,
            captcha: this.model.captcha,
            smsmode: this.smsmode
          }
          postAction('/sys/phoneVerify', params).then((res) => {
            if (res.success) {
              Vue.ls.remove(CHANGE_PHONE)
              Vue.ls.remove(VERIFY_PHONE)
              let userList = {
                username: res.result.username,
                phone: params.mobile,
                smscode: res.result.smscode
              }
              setTimeout(function() {
                that.$emit('nextStep', userList)
              }, 0)
            } else {
              this.cmsFailed(res.message)
            }
          })
        }

      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const that = this
      that.$refs['form'].validateField('phone', err => {
        if (!err) {
          that.state.smsSendBtn = true
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          const hide = that.$message.loading('验证码发送中..', 0)
          let smsParams = {
            mobile: that.model.phone,
            smsmode: that.smsmode
          }
          postAction('/sys/getVerifyCode', smsParams).then(res => {
            if (!res.success) {
              setTimeout(hide, 1)
              that.cmsFailed(res.message)
            }
            setTimeout(hide, 500)
          })
        } else {
          that.cmsFailed(err)
        }
      })
    },
    cmsFailed(err) {
      this.$notification['error']({
        message: '验证错误',
        description: err,
        duration: 4
      })
    },
    handleChangeSelect(value) {
      var that = this
      console.log(value)
      if (value == 0) {
        that.dropList = '0'
        that.show = true
      } else {
        that.dropList = '1'
        that.show = false
      }
    },
    validatePhone(rule, value, callback) {
      if (value) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          callback('请输入正确的手机号')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    ...mapActions(['Logout']),
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that.Logout({}).then(() => {
            // update-begin author:wangshuai date:20200601 for: 退出登录跳转登录页面
            that.$router.push({ path: '/user/login' })
            window.location.reload()
            // update-end author:wangshuai date:20200601 for: 退出登录跳转登录页面
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel() {
        }
      })
    },
    cancel() {
      Vue.ls.remove(CHANGE_PHONE)
      this.$emit('cancel')
      // this.$router.push({path: '/dashboard/analysis'})
    }
  }

}
</script>

<style lang='less' scoped>
.stepFormText {
  margin-bottom: 24px;
}

.ant-form-item-label,
.ant-form-item-control {
  line-height: 22px;
}

.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
}
</style>
