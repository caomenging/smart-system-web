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
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
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
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SmartCreateAdviceForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        rootUrl: "/smartCreateAdvice/smartCreateAdvice/",
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
        model:{
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
           basicDesc: [
              { required: true, message: '请输入基本情况!'},
           ],
           problem: [
              { required: true, message: '请输入存在问题!'},
           ],
           mainSolution: [
              { required: true, message: '请输入主要措施!'},
           ],
        },
        refKeys: ['smartCreateAdviceAnnex', ],
        tableKeys:['smartCreateAdviceAnnex', ],
        activeKey: 'smartCreateAdviceAnnex',
        // 制发建议附件表
        smartCreateAdviceAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '上传时间',
              key: 'createTime',
              type: FormTypes.datetime,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件说明',
              key: 'annexDesc',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件路径',
              key: 'annexPath',
              type: FormTypes.file,
              token:true,
              responseName:"message",
              width:"200px",
              placeholder: '请选择文件',
              defaultValue:'',
            },
            {
              title: '下载次数',
              key: 'downCount',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/smartCreateAdvice/smartCreateAdvice/add",
          edit: "/smartCreateAdvice/smartCreateAdvice/edit",
          queryById: "/smartCreateAdvice/smartCreateAdvice/queryById",
          smartCreateAdviceAnnex: {
            list: '/smartCreateAdvice/smartCreateAdvice/querySmartCreateAdviceAnnexByMainId'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.smartCreateAdviceAnnexTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.smartCreateAdviceAnnex.list, params, this.smartCreateAdviceAnnexTable)
          getAction(this.url.queryById,params).then(res => {
              if(res.success){
                this.model = res.result
                // console.log(model)
              }
            })
        }
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
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
      validateError(msg){
        this.$message.error(msg)
      },

    }
  }
</script>

<style scoped>
</style>