<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入项目名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="项目分类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-category-select v-model="model.type" pcode="B03" placeholder="请选择项目分类"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="建设单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="location">
              <j-select-depart v-model="model.location" multi />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="施工单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="constructDep">
              <a-input v-model="model.constructDep" placeholder="请输入施工单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="简要说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectContent">
              <a-textarea v-model="model.projectContent" rows="4" placeholder="请输入简要说明" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="money">
              <a-input v-model="model.money" placeholder="请输入合同金额" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="服务年限" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="period">
              <a-input v-model="model.period" placeholder="请输入服务年限" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="完成时限" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date placeholder="请选择完成时限" v-model="model.endTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="合同签订日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="signTime">
              <j-date placeholder="请选择合同签订日期" v-model="model.signTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="四议两公开内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file1">
              <j-upload v-model="model.file1"  ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="村集体经济组织相关材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file2">
              <j-upload v-model="model.file2"  ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="合同" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file3">
              <j-upload v-model="model.file3"  ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="验收材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="file4">
              <j-upload v-model="model.file4"  ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="项目审核" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartPublicityProjectVerifyTable.loading"
          :columns="smartPublicityProjectVerifyTable.columns"
          :dataSource="smartPublicityProjectVerifyTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
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
    name: 'SmartPublicityProjectForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
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
           money: [
              { required: false},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
           period: [
              { required: false},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
           ],
        },
        refKeys: ['smartPublicityProjectVerify', ],
        tableKeys:['smartPublicityProjectVerify', ],
        activeKey: 'smartPublicityProjectVerify',
        // 项目审核
        smartPublicityProjectVerifyTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '审核部门',
              key: 'verifyDepart',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '审核意见',
              key: 'verifyDesc',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件',
              key: 'file',
              type: FormTypes.file,
              token:true,
              responseName:"message",
              width:"200px",
              placeholder: '请选择文件',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/smartPublicityProject/smartPublicityProject/add",
          edit: "/smartPublicityProject/smartPublicityProject/edit",
          queryById: "/smartPublicityProject/smartPublicityProject/queryById",
          smartPublicityProjectVerify: {
            list: '/smartPublicityProject/smartPublicityProject/querySmartPublicityProjectVerifyByMainId'
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
        this.smartPublicityProjectVerifyTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartPublicityProjectVerify.list, params, this.smartPublicityProjectVerifyTable)
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
          smartPublicityProjectVerifyList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     handleCategoryChange(value,backObj){
      this.model = Object.assign(this.model, backObj);
      }

    }
  }
</script>

<style scoped>
</style>