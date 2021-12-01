<template>
  <a-modal width="900px" v-model="visible" title="发表问题" @ok="handleOk">
    <!-- <a-spin :spinning="confirmLoading"> -->
      <j-form-container>
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
          </a-row>
        </a-form-model>
      </j-form-container>
    <!-- </a-spin> -->
  </a-modal>
</template>

<script>
import { postAction } from '../../../api/manage'
export default {
  data() {
    return {
      model:{},
      url: '/interaction/add',
      visible: false,
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
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        title: [{ required: true, message: '请输入标题!' }],
      },
      refKeys: ['smartSupervisionAnnex'],
      tableKeys: ['smartSupervisionAnnex'],
      activeKey: 'smartSupervisionAnnex',
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
  },
  created() {},
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      postAction(this.url, this.model).then((res) => {
        if(res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
      this.$emit('handleOk')
      this.visible = false
    },
  },
}
</script>

<style>
</style>