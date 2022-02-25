<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入标题"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="正文" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
              <j-editor v-model="model.content" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="监督检查时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="supervisionTime"
            >
              <j-date placeholder="请选择监督检查时间" v-model="model.supervisionTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-model-item label="创建人员工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatorNo">
              <a-input v-model="model.creatorNo" placeholder="请输入创建人员工号" ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file">
              <j-upload v-model="model.file"></j-upload>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <eloam-modal ref="modalForm" @ok="scanOk" biz-path="before"></eloam-modal>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import EloamModal from '@views/eloam/modules/EloamModal'

export default {
  name: 'SmartSupervisionForm',
  components: {
    EloamModal
  },
  data() {
    return {
      rootUrl: '/smartSupervision/smartSupervision',
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
        title: [{ required: true, message: '请输入标题!' }],
        supervisionTime: [{ required: true, message: '请输入监督检查时间!' }],
        creatorNo: [{ required: true, message: '请输入创建人员工号!' }],
      },
      refKeys: ['smartSupervisionAnnex'],
      tableKeys: ['smartSupervisionAnnex'],
      activeKey: 'smartSupervisionAnnex',
      // 8项规定监督检查附件表
      
      url: {
        add: '/smartSupervision/smartSupervision/add',
        edit: '/smartSupervision/smartSupervision/edit',
        queryById: '/smartSupervision/smartSupervision/queryById',
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
  created() {},
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
        if (this.model.files) {
          arr.push(this.model.files)
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