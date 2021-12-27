<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入标题" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="正文" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
              <j-editor v-model="model.content" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="监督检查时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supervisionTime">
              <j-date placeholder="请选择监督检查时间" v-model="model.supervisionTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-model-item label="创建人员工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatorNo">
              <a-input v-model="model.creatorNo" placeholder="请输入创建人员工号" ></a-input>
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="8项规定监督检查附件表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartSupervisionAnnexTable.loading"
          :columns="smartSupervisionAnnexTable.columns"
          :dataSource="smartSupervisionAnnexTable.dataSource"
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
    name: 'SmartSupervisionForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        rootUrl: "/smartSupervision/smartSupervision",
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
           title: [
              { required: true, message: '请输入标题!'},
           ],
           supervisionTime: [
              { required: true, message: '请输入监督检查时间!'},
           ],
           creatorNo: [
              { required: true, message: '请输入创建人员工号!'},
           ],
        },
        refKeys: ['smartSupervisionAnnex', ],
        tableKeys:['smartSupervisionAnnex', ],
        activeKey: 'smartSupervisionAnnex',
        // 8项规定监督检查附件表
        smartSupervisionAnnexTable: {
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
              title: '文件路径',
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
              key: 'downloadCount',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/smartSupervision/smartSupervision/add",
          edit: "/smartSupervision/smartSupervision/edit",
          queryById: "/smartSupervision/smartSupervision/queryById",
          smartSupervisionAnnex: {
            list: '/smartSupervision/smartSupervision/querySmartSupervisionAnnexByMainId'
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
        this.smartSupervisionAnnexTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartSupervisionAnnex.list, params, this.smartSupervisionAnnexTable)
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
          smartSupervisionAnnexList: allValues.tablesValue[0].values,
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