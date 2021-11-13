<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="单位ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentId">
              <a-input v-model="model.departmentId" placeholder="请输入单位ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="接待时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receptionTime">
              <j-date placeholder="请选择接待时间" v-model="model.receptionTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="接待对象单位ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receptionDepartmentId">
              <a-input v-model="model.receptionDepartmentId" placeholder="请输入接待对象单位ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="人员数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="number">
              <a-input-number v-model="model.number" placeholder="请输入人员数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="陪同人员数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receptionNumber">
              <a-input-number v-model="model.receptionNumber" placeholder="请输入陪同人员数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="总开销金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cost">
              <a-input-number v-model="model.cost" placeholder="请输入总开销金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建人id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createId">
              <a-input v-model="model.createId" placeholder="请输入创建人id" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">
              <j-date placeholder="请选择创建日期" v-model="model.createTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="更新人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateBy">
              <a-input v-model="model.updateBy" placeholder="请输入更新人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateTime">
              <j-date placeholder="请选择更新日期" v-model="model.updateTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="八项规定公务接待人员信息" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smart_8regulationsForReceptionStaffTable.loading"
          :columns="smart_8regulationsForReceptionStaffTable.columns"
          :dataSource="smart_8regulationsForReceptionStaffTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
          :rootUrl="rootUrl"/>
      </a-tab-pane>
      <a-tab-pane tab="八项规定公务接待陪同人员信息" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smart_8regulationsForReceptiondStaffTable.loading"
          :columns="smart_8regulationsForReceptiondStaffTable.columns"
          :dataSource="smart_8regulationsForReceptiondStaffTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="八项规定公务接待公务活动项目" :key="refKeys[2]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[2]"
          :loading="smart_8regulationsForReceptionActivityTable.loading"
          :columns="smart_8regulationsForReceptionActivityTable.columns"
          :dataSource="smart_8regulationsForReceptionActivityTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="八项规定公务接待信息附件表" :key="refKeys[3]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[3]"
          :loading="smart_8regulationsForReceptionAppendixTable.loading"
          :columns="smart_8regulationsForReceptionAppendixTable.columns"
          :dataSource="smart_8regulationsForReceptionAppendixTable.dataSource"
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
    name: 'Smart_8regulationsForReceptionForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        rootUrl:"/smart_8regulations_for_reception/smart_8regulationsForReception",
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
           departmentId: [
              { required: true, message: '请输入单位ID!'},
           ],
           receptionTime: [
              { required: true, message: '请输入接待时间!'},
           ],
           receptionDepartmentId: [
              { required: true, message: '请输入接待对象单位ID!'},
           ],
           number: [
              { required: true, message: '请输入人员数量!'},
           ],
           receptionNumber: [
              { required: true, message: '请输入陪同人员数量!'},
           ],
           cost: [
              { required: true, message: '请输入总开销金额!'},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
           createId: [
              { required: true, message: '请输入创建人id!'},
           ],
           createTime: [
              { required: true, message: '请输入创建日期!'},
           ],
        },
        refKeys: ['smart_8regulationsForReceptionStaff', 'smart_8regulationsForReceptiondStaff', 'smart_8regulationsForReceptionActivity', 'smart_8regulationsForReceptionAppendix', ],
        tableKeys:['smart_8regulationsForReceptionStaff', 'smart_8regulationsForReceptiondStaff', 'smart_8regulationsForReceptionActivity', 'smart_8regulationsForReceptionAppendix', ],
        activeKey: 'smart_8regulationsForReceptionStaff',
        // 八项规定公务接待人员信息
        smart_8regulationsForReceptionStaffTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '人员姓名',
              key: 'name',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '所在单位',
              key: 'department',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '职务',
              key: 'jobTitle',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        // 八项规定公务接待陪同人员信息
        smart_8regulationsForReceptiondStaffTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '姓名',
              key: 'name',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '职务',
              key: 'jobTitle',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        // 八项规定公务接待公务活动项目
        smart_8regulationsForReceptionActivityTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '公务活动项目',
              key: 'officialActivitiesProject',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '时间',
              key: 'time',
              type: FormTypes.datetime,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '场所',
              key: 'place',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '是否安排住宿',
              key: 'stay',
              type: FormTypes.select,
              dictCode:"stay",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '花销标准',
              key: 'costStandard',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '总开销金额',
              key: 'cost',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '创建人工号',
              key: 'createId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '创建时间',
              key: 'createTime',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        // 八项规定公务接待信息附件表
        smart_8regulationsForReceptionAppendixTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '附件说明',
              key: 'attachmentDescription',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '附件文件路径',
              key: 'path',
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
              key: 'updateTime',
              type: FormTypes.datetime,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '下载次数',
              key: 'downloadTimes',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/smart_8regulations_for_reception/smart_8regulationsForReception/add",
          edit: "/smart_8regulations_for_reception/smart_8regulationsForReception/edit",
          queryById: "/smart_8regulations_for_reception/smart_8regulationsForReception/queryById",
          smart_8regulationsForReceptionStaff: {
            list: '/smart_8regulations_for_reception/smart_8regulationsForReception/querySmart_8regulationsForReceptionStaffByMainId'
          },
          smart_8regulationsForReceptiondStaff: {
            list: '/smart_8regulations_for_reception/smart_8regulationsForReception/querySmart_8regulationsForReceptiondStaffByMainId'
          },
          smart_8regulationsForReceptionActivity: {
            list: '/smart_8regulations_for_reception/smart_8regulationsForReception/querySmart_8regulationsForReceptionActivityByMainId'
          },
          smart_8regulationsForReceptionAppendix: {
            list: '/smart_8regulations_for_reception/smart_8regulationsForReception/querySmart_8regulationsForReceptionAppendixByMainId'
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
        this.smart_8regulationsForReceptionStaffTable.dataSource=[]
        this.smart_8regulationsForReceptiondStaffTable.dataSource=[]
        this.smart_8regulationsForReceptionActivityTable.dataSource=[]
        this.smart_8regulationsForReceptionAppendixTable.dataSource=[]
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
          this.requestSubTableData(this.url.smart_8regulationsForReceptionStaff.list, params, this.smart_8regulationsForReceptionStaffTable)
          this.requestSubTableData(this.url.smart_8regulationsForReceptiondStaff.list, params, this.smart_8regulationsForReceptiondStaffTable)
          this.requestSubTableData(this.url.smart_8regulationsForReceptionActivity.list, params, this.smart_8regulationsForReceptionActivityTable)
          this.requestSubTableData(this.url.smart_8regulationsForReceptionAppendix.list, params, this.smart_8regulationsForReceptionAppendixTable)
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
          smart_8regulationsForReceptionStaffList: allValues.tablesValue[0].values,
          smart_8regulationsForReceptiondStaffList: allValues.tablesValue[1].values,
          smart_8regulationsForReceptionActivityList: allValues.tablesValue[2].values,
          smart_8regulationsForReceptionAppendixList: allValues.tablesValue[3].values,
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