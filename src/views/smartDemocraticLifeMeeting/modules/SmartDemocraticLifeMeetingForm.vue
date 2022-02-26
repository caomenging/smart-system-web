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
            <a-form-model-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingTime">
              <j-date placeholder="请选择上报时间" v-model="model.reportingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostId">
              <select-user-by-dep v-model="model.hostId" @info="getHostUser"></select-user-by-dep>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostName" v-show="false">
              <a-input v-model="model.hostName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议记录人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderId">
              <select-user-by-dep v-model="model.recorderId" @info="getRecorderUser"></select-user-by-dep>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议记录人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderName" v-show="false">
              <a-input v-model="model.recorderName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议内容摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="summary">
              <a-textarea v-model="model.summary" rows="4" placeholder="请输入会议内容摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议记录" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="record">
              <a-textarea v-model="model.record" rows="4" placeholder="请输入会议记录" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="explanation">
              <a-textarea v-model="model.explanation" rows="4" placeholder="请输入附件说明" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="files">
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
              <eloam-modal ref="modalForm" @ok='scanOk'></eloam-modal>
              <j-upload v-model="model.path" ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="民主生活参会人员表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartDemocraticLifePeopleTable.loading"
          :columns="smartDemocraticLifePeopleTable.columns"
          :dataSource="smartDemocraticLifePeopleTable.dataSource"
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
  import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'
  import EloamModal from "../../eloam/modules/EloamModal";

  export default {
    name: 'SmartDemocraticLifeMeetingForm',
    mixins: [JEditableTableModelMixin],
    components: {
      EloamModal,
      SelectUserByDep
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
           address: [
              { required: true, message: '请输入会议地点!'},
           ],
           meetingTime: [
              { required: true, message: '请输入会议时间!'},
           ],
           reportingTime: [
              { required: true, message: '请输入上报时间!'},
           ],
           hostName: [
              { required: true, message: '请输入主持人姓名!'},
           ],
           recorderName: [
              { required: true, message: '请输入会议记录人姓名!'},
           ],
           summary: [
              { required: true, message: '请输入会议内容摘要!'},
           ],
           record: [
              { required: true, message: '请输入会议记录!'},
           ],
        },
        refKeys: ['smartDemocraticLifePeople'],
        tableKeys:['smartDemocraticLifePeople'],
        activeKey: 'smartDemocraticLifePeople',
        // 民主生活参会人员表
        smartDemocraticLifePeopleTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参会人员',
              key: 'participantName',
              type: FormTypes.sel_user,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/add",
          edit: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/edit",
          queryById: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/queryById",
          smartDemocraticLifePeople: {
            list: '/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/querySmartDemocraticLifePeopleByMainId'
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
      eloamScan() {
        this.$refs.modalForm.open()
      },
      scanOk(url) {
        let image = url
        if (image) {
          let arr = []
          // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
          if (this.model.path) {
            arr.push(this.model.path)
          }
          arr.push(image)
          // 更新表单中文件url字段, files 为字段名称
          this.$set(this.model, 'path', arr.join())
        }
      },
      addBefore(){
        this.smartDemocraticLifePeopleTable.dataSource=[]
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
          getAction(this.url.queryById, params).then(res => {
            if (res.success) {
              this.model = res.result
            }
          })
          this.requestSubTableData(this.url.smartDemocraticLifePeople.list, params, this.smartDemocraticLifePeopleTable)
        }
      },
      getHostUser(back) {
        this.model.hostId = back[0].id
        this.model.hostName = back[0].realname
      },
      getRecorderUser(back) {
        this.model.recorderId = back[0].id
        this.model.recorderName = back[0].realname
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
          smartDemocraticLifePeopleList: allValues.tablesValue[0].values,
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