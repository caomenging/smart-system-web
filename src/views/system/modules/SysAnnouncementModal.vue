<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="{ props: { disabled: disabled } }"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendType" label="发送类型">
          <a-radio-group v-model="sendType" placeholder="请选择发送类型" :disabled="disableSubmit">
            <a-radio value="1">系统消息</a-radio>
            <!-- <a-select-option value="2">系统消息</a-select-option> -->
            <a-radio value="2">短信</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="msgCategory"
          label="消息类型"
          v-if="sendType !== '2'"
        >
          <a-radio-group v-model="model.msgCategory" placeholder="请选择消息类型" :disabled="disableSubmit">
            <a-radio value="1">通知公告</a-radio>
            <a-radio value="2">廉政提醒</a-radio>
            <a-radio value="3">任务下发</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="model.msgCategory == '1'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="msgCategory"
          label="模板选择"
        >
          <a-select placeholder="请选择消息模板" :disabled="disableSubmit" @change="useTemplate">
            <a-select-option v-for="template in templates" :key="template.id">
              {{ template.templateName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="titile"
          label="标题"
          v-if="sendType !== '2'"
        >
          <a-input placeholder="请输入标题" v-model="model.titile" :readOnly="disableSubmit" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="msgAbstract"
          label="摘要"
          v-if="sendType !== '2'"
        >
          <a-textarea placeholder="请输入摘要" v-model="model.msgAbstract" />
        </a-form-model-item>
        <!-- <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="startTime"
          label="开始时间:"
          v-if="sendType !== '2'"
        >
          <j-date
            style="width: 100%"
            :getCalendarContainer="(node) => node.parentNode"
            v-model="model.startTime"
            placeholder="请选择开始时间"
            showTime
            dateFormat="YYYY-MM-DD HH:mm:ss"
          ></j-date>
        </a-form-model-item> -->
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="endTime"
          label="结束时间"
          class="endTime"
          v-if="sendType !== '2'"
        >
          <j-date
            style="width: 100%"
            :getCalendarContainer="(node) => node.parentNode"
            v-model="model.endTime"
            placeholder="请选择结束时间"
            showTime
            dateFormat="YYYY-MM-DD HH:mm:ss"
          ></j-date>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="msgType" label="接收用户">
          <a-radio-group
            v-model="model.msgType"
            placeholder="请选择接收用户"
            :disabled="disableSubmit"
            @change="chooseMsgType"
          >
            <a-radio value="TYPE">指定用户类别</a-radio>
            <a-radio value="DEPART">指定部门</a-radio>
            <a-radio value="USER">指定用户</a-radio>
            <a-radio value="ALL">全体用户</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选择用户"
          prop="userIds"
          v-if="userType == 'USER'"
        >
          <j-select-user-by-dep v-model="userIds" :multi="true"></j-select-user-by-dep>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选择用户类别"
          v-if="userType == 'TYPE'"
        >
          <a-textarea placeholder="请输入摘要" v-model="type" />
        </a-form-model-item>
        <a-form-model-item
          label="选择部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="departId"
          v-if="userType == 'DEPART'"
        >
          <j-select-depart v-model="departIds" :multi="true"></j-select-depart>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优先级" v-if="sendType !== '2'">
          <a-radio-group v-model="model.priority" placeholder="请选择优先级" :disabled="disableSubmit">
            <a-radio value="L">低</a-radio>
            <a-radio value="M">中</a-radio>
            <a-radio value="H">高</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelColX1"
          :wrapperCol="wrapperColX1"
          label="内容"
          class="j-field-content"
          v-if="sendType !== '2'"
        >
          <j-editor v-model="model.msgContent"></j-editor>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelColX1" :wrapperCol="wrapperColX1" label="内容" v-if="sendType !== '1'">
          <a-textarea v-model="smsMsg.content" placeholder="请输入短信内容" :rows="4" />
        </a-form-model-item>
      </a-form-model>

      <!-- 加入消息附件功能 -->
      <a-form-model-item label="文件上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="sendType !== '2'">
        <j-upload v-model="model.fileList"></j-upload>
      </a-form-model-item>
    </a-spin>
    <!-- <select-user-list-modal ref="UserListModal" @choseUser="choseUser"></select-user-list-modal> -->
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
import JEditor from '@/components/jeecg/JEditor'
import SelectUserListModal from './SelectUserListModal'
import moment from 'moment'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'

export default {
  components: { JEditor, JDate, SelectUserListModal, JSelectUserByDep },
  name: 'SysAnnouncementModal',
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      sendType: '1',
      type: '',
      template: '',
      templates: [],
      smsMsg: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      labelColX1: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperColX1: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      confirmLoading: false,
      validatorRules: {
        titile: [{ required: true, message: '请输入标题!' }],
        msgCategory: [{ required: true, message: '请选择消息类型!' }],
        msgType: [{ required: true, message: '请选择通告对象类型!' }],
        endTime: [{ required: true, message: '请选择结束时间!' }, { validator: this.endTimeValidate }],
        startTime: [{ required: true, message: '请选择开始时间!' }, { validator: this.startTimeValidate }],
        msgAbstract: [{ required: true, message: '请输入摘要!' }],
      },
      url: {
        queryByIds: '/sys/user/queryByIds',
        add: '/sys/annountCement/add',
        edit: '/sys/annountCement/edit',
      },
      userType: '',
      userIds: '',
      departIds: '',
      selectedUser: [],
      disabled: false,
      msgContent: '',
      userList: [],
      returnKeys: ['id', 'id'], //用户选择返回字段
    }
  },
  created() {
    this.getTemplate()
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = {}
      this.disable = false
      this.visible = true
      this.getUser(record)
    },
    getUser(record) {
      console.log(record)
      this.model = Object.assign({}, record)
      // 指定用户
      if (record && record.msgType === 'USER') {
        this.userType = 'USER'
        this.userIds = record.userIds
        getAction(this.url.queryByIds, { userIds: this.userIds }).then((res) => {
          if (res.success) {
            //update--begin--autor:wangshuai-----date:20200601------for：系统公告选人后，不能删除------
            var userList = []
            for (var i = 0; i < res.result.length; i++) {
              var user = {}
              user.label = res.result[i].realname
              user.key = res.result[i].id
              userList.push(user)
            }
            this.selectedUser = userList
            //update--begin--autor:wangshuai-----date:20200601------for：系统公告选人后，不能删除------
            this.$refs.UserListModal.edit(res.result, this.userIds)
          }
        })
      }
    },
    getTemplate() {
      getAction('/smartMessageTemplate/smartMessageTemplate/list').then((res) => {
        if (res.success) {
          this.templates = res.result.records
        }
      })
    },
    useTemplate(value) {
      let templateObj = this.templates.find((item) => item.id === value)
      let message = {}
      message.msgCategory = this.model.msgCategory
      message.titile = templateObj.title
      message.msgAbstract = templateObj.msgAbstract
      message.msgContent = templateObj.content
      message.priority = templateObj.priority
      this.model = Object.assign({}, message)
    },
    changeSendtype(value) {
      this.sendType = value
    },
    close() {
      this.$emit('close')
      this.selectedUser = []
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleOk() {
      const that = this
      // console.log(this.departIds)
      //当设置指定用户类型，但用户为空时，后台报错
      // if (this.userType == 'USER' && !(this.userIds != null && this.userIds.length > 0)) {
      //   this.$message.warning('指定用户不能为空！')
      //   return
      // }

      if (this.sendType === '2') {
        console.log(this.smsMsg)
        const tmp = {}
        tmp.msgType = this.model.msgType
        tmp.userIds = this.userIds
        tmp.departIds = this.departIds
        Object.assign(this.smsMsg, tmp)
        console.log(this.smsMsg)
        that.$message.success('短信发送成功')
        that.visible = false
        that.$emit('ok')
        that.resetUser()
        // this.confirmLoading = false
        // this.close()
        // getAction('/sys/annountCement/sendSmsMsg', this.smsMsg).then((res) => {
        //   if(res.success) {
        //     this.$message.success(res.message)
        //     this.$emit('ok')
        //     this.resetUser()
        //   }
        // })
      } else {
        // 触发表单验证
        this.$refs.form.validate((valid) => {
          if (valid) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            if (this.userType == 'USER') {
              this.model.userIds = this.userIds
            } else if (this.userType == 'DEPART') {
              this.model.departIds = this.departIds
            }
            httpAction(httpurl, this.model, method)
              .then((res) => {
                if (res.success) {
                  that.$message.success('消息创建成功，请选择发布或撤销')
                  that.$emit('ok')
                  that.resetUser()
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
                that.close()
              })
          } else {
            return false
          }
        })
      }
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
      this.$refs.form.resetFields()
      this.resetUser()
    },
    resetUser() {
      this.userType = 'ALL'
      this.userIds = []
      this.departIds = ''
      this.selectedUser = []
      this.disabled = false
      this.sendType = undefined
      this.smsMsg = {}
      // this.$refs.UserListModal.edit(null, null)
    },
    selectUserIds() {
      this.$refs.UserListModal.add(this.selectedUser, this.userIds)
    },
    chooseMsgType(e) {
      console.log(e)
      if ('USER' == e.target.value) {
        console.log('1')
        this.userType = 'USER'
      } else if ('DEPART' == e.target.value) {
        console.log('2')
        this.userType = 'DEPART'
      } else if ('TYPE' == e.target.value) {
        console.log('3')
        this.userType = 'TYPE'
      } else {
        console.log('4')
        this.userType = 'ALL'
      }
      this.departIds = ''
      this.userIds = ''
    },
    // 子modal回调z
    choseUser(userList) {
      console.log(userList.length)
      this.selectedUser = []
      this.userIds = ''
      for (var i = 0; i < userList.length; i++) {
        //update--begin--autor:wangshuai-----date:20200601------for：系统公告选人后，不能删除------
        var user = {}
        user.label = userList[i].realname
        user.key = userList[i].id
        this.selectedUser.push(user)
        //update--end--autor:wangshuai-----date:20200601------for：系统公告选人后，不能删除------
        this.userIds += userList[i].id + ','
      }
    },
    startTimeValidate(rule, value, callback) {
      let endTime = this.model.endTime
      if (!value || !endTime) {
        callback()
      } else if (moment(value).isBefore(endTime)) {
        callback()
      } else {
        callback('开始时间需小于结束时间')
      }
    },
    endTimeValidate(rule, value, callback) {
      let startTime = this.model.startTime
      if (!value || !startTime) {
        callback()
      } else if (moment(startTime).isBefore(value)) {
        callback()
      } else {
        callback('结束时间需大于开始时间')
      }
    },
    handleChange(userList) {
      if (userList) {
        this.userIds = []
        var users = []
        for (var i = 0; i < userList.length; i++) {
          var user = {}
          user.id = userList[i].key
          user.realname = userList[i].label
          this.userIds += userList[i].key + ','
          users.push(user)
        }
      }
      this.$refs.UserListModal.edit(users, this.userIds)
    },
  },
}
</script>

<style scoped>
</style>