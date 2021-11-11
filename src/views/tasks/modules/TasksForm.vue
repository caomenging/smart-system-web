<template>
  <!-- <a-spin :spinning="confirmLoading"> -->
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="审核结论" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditStatus">
              <a-radio-group v-model="model.auditStatus">
                <a-radio value="3"> 通过</a-radio>
                <a-radio value="4"> 不通过 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入审核意见" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditTime">
              <j-date v-model="model.auditTime" :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  <!-- </a-spin> -->
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { validateDuplicateValue } from '@/utils/util'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'TasksForm',
  components: {
    JDate,
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
      model: {
      },
      url: {
        // add: '/smartSupervision/smartSupervision/add',
        edit: '/tasks/smartVerifyTask/updateStatus',
        queryById: '/tasks/smartVerifyTask/queryById',
      },
      rules: {
        auditStatus:[{ required: true, message: '请选择审核结论', trigger: 'blur' }],
        auditTime:[{ required: true, message: '请选择审核时间', trigger: 'blur' }],
        remark:[{ required: false, message: '请填写审核备注', trigger: 'blur' }]
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
    flowNo: {
      type: String,
      default: '',
      require: true
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  methods: {
    handleOk() {
      this.model.flowNo = this.flowNo
      putAction(this.url.edit,this.model).then(res => {
        console.log(res)
        if(res.success){
          this.$message.success('提交成功')
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(this.model)
      this.$emit('ok')
    }, 
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },

    /** 整理成formData */
    // classifyIntoFormData(allValues) {
    //   let main = Object.assign(this.model, allValues.formValue)
    //   return {
    //     ...main, // 展开
    //     smartSupervisionAnnexList: allValues.tablesValue[0].values,
    //   }
    // },
  },
}
</script>

<style scoped>
</style>