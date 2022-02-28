<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="财务信息" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="financeInfo">
              <a-input v-model="model.financeInfo" placeholder="请输入财务信息"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="重大事项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bigEvent">
              <a-input v-model="model.bigEvent" placeholder="请输入重大事项"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="财物材料附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialFile">
              <j-upload v-model="model.materialFile"></j-upload>
              <a-button icon="camera" @click="eloamScan(1)">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="理事长、监事长、会计确认表"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="confirmFile"
            >
              <j-upload v-model="model.confirmFile"></j-upload>
              <a-button icon="camera" @click="eloamScan(2)">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="重大事项表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bigEventFile">
              <j-upload v-model="model.bigEventFile"></j-upload>
              <a-button icon="camera" @click="eloamScan(3)">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <eloam-modal ref="modalForm1" @ok="scanOk1" biz-path="before"></eloam-modal>
      <eloam-modal ref="modalForm2" @ok="scanOk2" biz-path="before"></eloam-modal>
      <eloam-modal ref="modalForm3" @ok="scanOk3" biz-path="before"></eloam-modal>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import EloamModal from '@views/eloam/modules/EloamModal'

export default {
  name: 'SmartPublicityFinanceForm',
  components: {
    EloamModal,
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {},
      url: {
        add: '/smartPublicityFinance/smartPublicityFinance/add',
        edit: '/smartPublicityFinance/smartPublicityFinance/edit',
        queryById: '/smartPublicityFinance/smartPublicityFinance/queryById',
      },
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    eloamScan(index) {
      if(index == 1) {
       this.$refs.modalForm1.open() 
      } else if (index == 2) {
        this.$refs.modalForm2.open()
      } else {
        this.$refs.modalForm3.open()
      }
    },
    scanOk1(url) {
      let image = url
      if (image) {
        let arr = []
        // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
        if (this.model.materialFile) {
          arr.push(this.model.materialFile)
        }
        arr.push(image)
        // 更新表单中文件url字段, files 为字段名称
        this.$set(this.model, 'materialFile', arr.join())
      }
    },
    scanOk2(url) {
      let image = url
      if (image) {
        let arr = []
        // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
        if (this.model.confirmFile) {
          arr.push(this.model.confirmFile)
        }
        arr.push(image)
        // 更新表单中文件url字段, files 为字段名称
        this.$set(this.model, 'confirmFile', arr.join())
      }
    },
    scanOk3(url) {
      let image = url
      if (image) {
        let arr = []
        // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
        if (this.model.bigEventFile) {
          arr.push(this.model.bigEventFile)
        }
        arr.push(image)
        // 更新表单中文件url字段, files 为字段名称
        this.$set(this.model, 'bigEventFile', arr.join())
      }
    },
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
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
          httpAction(httpurl, this.model, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
  },
}
</script>