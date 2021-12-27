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
            <a-form-model-item label="会议地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingPlace">
              <a-input v-model="model.meetingPlace" placeholder="请输入会议地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="检查时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkTime">
              <j-date placeholder="请选择检查时间" v-model="model.checkTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="对象类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleType">
              <a-input v-model="model.peopleType" placeholder="请输入对象类型" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingRemarks">
              <a-textarea v-model="model.meetingRemarks" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="述责述廉参与人表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartEvaluateMeetingPacpaTable.loading"
          :columns="smartEvaluateMeetingPacpaTable.columns"
          :dataSource="smartEvaluateMeetingPacpaTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="述责述廉附件表" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smartEvaluateMeetingAnnexTable.loading"
          :columns="smartEvaluateMeetingAnnexTable.columns"
          :dataSource="smartEvaluateMeetingAnnexTable.dataSource"
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
    name: 'SmartEvaluateMeetingForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        rootUrl: "/smartEvaluateMeeting/smartEvaluateMeeting",
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
           meetingPlace: [
              { required: true, message: '请输入会议地点!'},
           ],
           checkTime: [
              { required: true, message: '请输入检查时间!'},
           ],
           peopleType: [
              { required: true, message: '请输入对象类型!'},
           ],
        },
        refKeys: ['smartEvaluateMeetingPacpa', 'smartEvaluateMeetingAnnex', ],
        tableKeys:['smartEvaluateMeetingPacpa', 'smartEvaluateMeetingAnnex', ],
        activeKey: 'smartEvaluateMeetingPacpa',
        // 述责述廉参与人表
        smartEvaluateMeetingPacpaTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参与人员',
              key: 'pacpaId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 述责述廉附件表
        smartEvaluateMeetingAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
            // {
            //   title: '序号',
            //   key: 'annexIndex',
            //   type: FormTypes.inputNumber,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            //   validateRules: [{ required: true, message: '${title}不能为空' }],
            // },
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
              title: '附件',
              key: 'annexPath',
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
          add: "/smartEvaluateMeeting/smartEvaluateMeeting/add",
          edit: "/smartEvaluateMeeting/smartEvaluateMeeting/edit",
          queryById: "/smartEvaluateMeeting/smartEvaluateMeeting/queryById",
          smartEvaluateMeetingPacpa: {
            list: '/smartEvaluateMeeting/smartEvaluateMeeting/querySmartEvaluateMeetingPacpaByMainId'
          },
          smartEvaluateMeetingAnnex: {
            list: '/smartEvaluateMeeting/smartEvaluateMeeting/querySmartEvaluateMeetingAnnexByMainId'
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
        this.smartEvaluateMeetingPacpaTable.dataSource=[]
        this.smartEvaluateMeetingAnnexTable.dataSource=[]
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
            getAction(this.url.queryById,params).then(res =>{
                if(res.success){
                  this.model = res.result
                }
              }
            )
          this.requestSubTableData(this.url.smartEvaluateMeetingPacpa.list, params, this.smartEvaluateMeetingPacpaTable)
          this.requestSubTableData(this.url.smartEvaluateMeetingAnnex.list, params, this.smartEvaluateMeetingAnnexTable)
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
          smartEvaluateMeetingPacpaList: allValues.tablesValue[0].values,
          smartEvaluateMeetingAnnexList: allValues.tablesValue[1].values,
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