<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="任务类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="typeName">
              <a-input v-model="model.typeName" placeholder="请输入任务类型名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <!-- TODO 审核层级还未实现 -->
            <!-- <a-form-model-item label="审核层级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="typeLevel">
              <a-input-number v-model="model.typeLevel" placeholder="请输入审核层级" style="width: 100%" />
            </a-form-model-item> -->
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-model="model.isVerify" :default-value="model.isVerify">
                <a-radio value="1"> 是 </a-radio>
                <a-radio value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="一级审核部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verifyFirst">
              <j-select-depart v-model="model.verifyFirst" multi  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="二级审核部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verifySecond">
              <j-select-depart v-model="model.verifySecond" multi  />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <!-- <a-form-model-item label="表单路径" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="typeModralPath">
              <a-input v-model="model.typeModralPath" placeholder="请输入表单路径"></a-input>
            </a-form-model-item> -->
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="填表说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="typeDesc">
              <a-textarea v-model="model.typeDesc" rows="4" placeholder="请输入填表说明" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'SmartVerifyTypeForm',
  components: {},
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
      validatorRules: {
        typeLevel: [{ required: false }, { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' }],
      },
      url: {
        add: '/taskType/smartVerifyType/add',
        edit: '/taskType/smartVerifyType/edit',
        queryById: '/taskType/smartVerifyType/queryById',
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