<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="基本情况" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="basicDesc">
              <a-textarea v-model="model.basicDesc" rows="4" placeholder="请输入基本情况" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="存在问题" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="problem">
              <a-textarea v-model="model.problem" rows="4" placeholder="请输入存在问题" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主要措施" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="mainSolution">
              <a-textarea v-model="model.mainSolution" rows="4" placeholder="请输入主要措施" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <j-upload v-model="model.file"></j-upload>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <eloam-modal ref="modalForm" @ok="scanOk" biz-path="advise"></eloam-modal>
    </j-form-container>
    <!-- 子表单区域 -->
    <!-- <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="制发建议附件表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartCreateAdviceAnnexTable.loading"
          :columns="smartCreateAdviceAnnexTable.columns"
          :dataSource="smartCreateAdviceAnnexTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
          :rootUrl=rootUrl
        />
      </a-tab-pane>
    </a-tabs> -->
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import EloamModal from '@views/eloam/modules/EloamModal'

export default {
  name: 'SmartCreateAdviceForm',
  // mixins: [JEditableTableModelMixin],
  components: {
    EloamModal,
  },
  data() {
    return {
      rootUrl: '/smartCreateAdvice/smartCreateAdvice/',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      model: {},
      confirmLoading: false,
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        basicDesc: [{ required: true, message: '请输入基本情况!' }],
        problem: [{ required: true, message: '请输入存在问题!' }],
        mainSolution: [{ required: true, message: '请输入主要措施!' }],
      },
      refKeys: ['smartCreateAdviceAnnex'],
      tableKeys: ['smartCreateAdviceAnnex'],
      activeKey: 'smartCreateAdviceAnnex',
      url: {
        add: '/smartCreateAdvice/smartCreateAdvice/add',
        edit: '/smartCreateAdvice/smartCreateAdvice/edit',
        queryById: '/smartCreateAdvice/smartCreateAdvice/queryById',
      },
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
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
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        smartCreateAdviceAnnexList: allValues.tablesValue[0].values,
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    eloamScan() {
      this.$refs.modalForm.open()
    },
    scanOk(url) {
      let image = url
      if (image) {
        let arr = []
        // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
        if (this.model.file) {
          arr.push(this.model.file)
        }
        arr.push(image)
        // 更新表单中文件url字段, file 为字段名称
        this.$set(this.model, 'file', arr.join())
      }
    },
  },
}
</script>

<style scoped>
</style>