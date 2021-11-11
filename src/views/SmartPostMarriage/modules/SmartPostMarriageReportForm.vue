<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="人员工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workNo">
              <a-input v-model="model.workNo" placeholder="请输入人员工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <a-input v-model="model.sex" placeholder="请输入性别" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="age">
              <a-input-number v-model="model.age" placeholder="请输入年龄" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="politicsStatus">
              <a-input v-model="model.politicsStatus" placeholder="请输入政治面貌" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="job">
              <a-input v-model="model.job" placeholder="请输入职务" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="职级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jobLevel">
              <a-input v-model="model.jobLevel" placeholder="请输入职级" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚宴场所名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weddingVenue">
              <a-input v-model="model.weddingVenue" placeholder="请输入婚宴场所名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚宴场所地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weddingVenueAddr">
              <a-input v-model="model.weddingVenueAddr" placeholder="请输入婚宴场所地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="宴请人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="guestsNumber">
              <a-input-number v-model="model.guestsNumber" placeholder="请输入宴请人数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="宴请人员范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="guestsScope">
              <a-input v-model="model.guestsScope" placeholder="请输入宴请人员范围" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="宴请费用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weddingCost">
              <a-input-number v-model="model.weddingCost" placeholder="请输入宴请费用" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚礼用车数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weddingCarNumber">
              <a-input-number v-model="model.weddingCarNumber" placeholder="请输入婚礼用车数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="公车数量（婚礼用车中有多少辆公车）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="govCarNumber">
              <a-input-number v-model="model.govCarNumber" placeholder="请输入公车数量（婚礼用车中有多少辆公车）" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="不符合规定收受礼金" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="illegalMoney">
              <a-input-number v-model="model.illegalMoney" placeholder="请输入不符合规定收受礼金" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="不符合规定收受礼品件数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="illegalGiftNumber">
              <a-input-number v-model="model.illegalGiftNumber" placeholder="请输入不符合规定收受礼品件数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="违规收礼品处置情况" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="disposalDescribe">
              <a-input v-model="model.disposalDescribe" placeholder="请输入违规收礼品处置情况" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="有无其他违诺行为" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="otherViolations">
              <a-input v-model="model.otherViolations" placeholder="请输入有无其他违诺行为" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTime">
              <j-date placeholder="请选择报告时间" v-model="model.reportTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phoneNumber">
              <a-input v-model="model.phoneNumber" placeholder="请输入联系电话" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="8项规定婚后报备宴请发票与附件表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartPostMarriageReportFileTable.loading"
          :columns="smartPostMarriageReportFileTable.columns"
          :dataSource="smartPostMarriageReportFileTable.dataSource"
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
    name: 'SmartPostMarriageReportForm',
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
           workNo: [
              { required: true, message: '请输入人员工号!'},
           ],
           name: [
              { required: true, message: '请输入姓名!'},
           ],
           sex: [
              { required: true, message: '请输入性别!'},
           ],
           age: [
              { required: true, message: '请输入年龄!'},
           ],
           politicsStatus: [
              { required: true, message: '请输入政治面貌!'},
           ],
           job: [
              { required: true, message: '请输入职务!'},
           ],
           jobLevel: [
              { required: true, message: '请输入职级!'},
           ],
           weddingVenue: [
              { required: true, message: '请输入婚宴场所名!'},
           ],
           weddingVenueAddr: [
              { required: true, message: '请输入婚宴场所地址!'},
           ],
           guestsNumber: [
              { required: true, message: '请输入宴请人数!'},
           ],
           guestsScope: [
              { required: true, message: '请输入宴请人员范围!'},
           ],
           weddingCost: [
              { required: true, message: '请输入宴请费用!'},
           ],
           weddingCarNumber: [
              { required: true, message: '请输入婚礼用车数量!'},
           ],
           govCarNumber: [
              { required: true, message: '请输入公车数量（婚礼用车中有多少辆公车）!'},
           ],
           illegalMoney: [
              { required: true, message: '请输入不符合规定收受礼金!'},
           ],
           illegalGiftNumber: [
              { required: true, message: '请输入不符合规定收受礼品件数!'},
           ],
           disposalDescribe: [
              { required: true, message: '请输入违规收礼品处置情况!'},
           ],
           otherViolations: [
              { required: true, message: '请输入有无其他违诺行为!'},
           ],
           reportTime: [
              { required: true, message: '请输入报告时间!'},
           ],
           phoneNumber: [
              { required: true, message: '请输入联系电话!'},
           ],
        },
        refKeys: ['smartPostMarriageReportFile', ],
        tableKeys:['smartPostMarriageReportFile', ],
        activeKey: 'smartPostMarriageReportFile',
        // 8项规定婚后报备宴请发票与附件表
        smartPostMarriageReportFileTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '序号',
              key: 'serialNumber',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '附件说明',
              key: 'fileDescription',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '附件文件路径',
              key: 'filePath',
              type: FormTypes.file,
              token:true,
              responseName:"message",
              width:"200px",
              placeholder: '请选择文件',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '上传时间',
              key: 'uploadTime',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '下载次数',
              key: 'downloadCount',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/smartPostMarriage/smartPostMarriageReport/add",
          edit: "/smartPostMarriage/smartPostMarriageReport/edit",
          queryById: "/smartPostMarriage/smartPostMarriageReport/queryById",
          smartPostMarriageReportFile: {
            list: '/smartPostMarriage/smartPostMarriageReport/querySmartPostMarriageReportFileByMainId'
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
        this.smartPostMarriageReportFileTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartPostMarriageReportFile.list, params, this.smartPostMarriageReportFileTable)
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
          smartPostMarriageReportFileList: allValues.tablesValue[0].values,
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