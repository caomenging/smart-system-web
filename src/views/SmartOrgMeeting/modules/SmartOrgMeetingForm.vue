<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingName">
              <a-input v-model="model.meetingName" placeholder="请输入会议名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入会议地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingTime">
              <j-date placeholder="请选择会议时间" v-model="model.meetingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTime">
              <j-date placeholder="请选择上报时间" v-model="model.reportTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostId">
              <a-input v-model="model.hostId" placeholder="请输入主持人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议记录人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderId">
              <a-input v-model="model.recorderId" placeholder="请输入会议记录人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议内容摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="summary">
              <a-textarea v-model="model.summary" rows="4" placeholder="请输入会议内容摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议记录" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="record">
              <a-textarea v-model="model.record" rows="4" placeholder="请输入会议记录" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="组织生活会参会人员表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartOrgMeetingPacpaTable.loading"
          :columns="smartOrgMeetingPacpaTable.columns"
          :dataSource="smartOrgMeetingPacpaTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="组织生活会附件表" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smartOrgMeetingAnnexTable.loading"
          :columns="smartOrgMeetingAnnexTable.columns"
          :dataSource="smartOrgMeetingAnnexTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
          :rootUrl="rootUrl"/>
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
    name: 'SmartOrgMeetingForm',
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
           meetingName: [
              { required: true, message: '请输入会议名称!'},
           ],
           reportTime: [
              { required: true, message: '请输入上报时间!'},
           ],
        },
        refKeys: ['smartOrgMeetingPacpa', 'smartOrgMeetingAnnex', ],
        tableKeys:['smartOrgMeetingPacpa', 'smartOrgMeetingAnnex', ],
        activeKey: 'smartOrgMeetingPacpa',
        // 组织生活会参会人员表
        smartOrgMeetingPacpaTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参会人员工号',
              key: 'pacpaId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 组织生活会附件表
        smartOrgMeetingAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '序号',
              key: 'annexOrder',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '附件说明',
              key: 'description',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '附件文件',
              key: 'annexFilepath',
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
              key: 'createTime',
              type: FormTypes.datetime,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下载次数',
              key: 'downloadCount',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        rootUrl: "/smartOrgMeeting/smartOrgMeeting",
        url: {
          add: "/smartOrgMeeting/smartOrgMeeting/add",
          edit: "/smartOrgMeeting/smartOrgMeeting/edit",
          queryById: "/smartOrgMeeting/smartOrgMeeting/queryById",
          smartOrgMeetingPacpa: {
            list: '/smartOrgMeeting/smartOrgMeeting/querySmartOrgMeetingPacpaByMainId'
          },
          smartOrgMeetingAnnex: {
            list: '/smartOrgMeeting/smartOrgMeeting/querySmartOrgMeetingAnnexByMainId'
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
        this.smartOrgMeetingPacpaTable.dataSource=[]
        this.smartOrgMeetingAnnexTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartOrgMeetingPacpa.list, params, this.smartOrgMeetingPacpaTable)
          this.requestSubTableData(this.url.smartOrgMeetingAnnex.list, params, this.smartOrgMeetingAnnexTable)
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
          smartOrgMeetingPacpaList: allValues.tablesValue[0].values,
          smartOrgMeetingAnnexList: allValues.tablesValue[1].values,
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