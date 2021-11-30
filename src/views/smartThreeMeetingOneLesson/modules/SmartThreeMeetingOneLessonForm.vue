<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="shyk" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="theme">
              <a-input v-model="model.theme" placeholder="请输入主题" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="time">
              <j-date placeholder="请选择时间" v-model="model.time" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostId">
              <select-user-by-dep v-model="model.hostId" @info="getHostUser"></select-user-by-dep>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostName">
              <a-input v-model="model.hostName" placeholder="请输入主持人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="记录人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderId">
              <select-user-by-dep v-model="model.recorderId" @info="getRecorderUser"></select-user-by-dep>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="记录人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderName">
              <a-input v-model="model.recorderName" placeholder="请输入记录人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="place">
              <a-input v-model="model.place" placeholder="请输入地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-model-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="time">
              <j-date placeholder="请选择时间" v-model="model.time" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="24" >
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="shyk" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="theme">
              <a-input v-model="model.theme" placeholder="请输入主题" ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="内容摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="content">
              <a-textarea v-model="model.content" rows="4" placeholder="请输入内容摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" >
            <a-form-model-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">
              <j-date placeholder="请选择创建日期" v-model="model.createTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          
          <!-- <a-col :span="24" >
            <a-form-model-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verifyStatus">
              <a-input v-model="model.verifyStatus" placeholder="请输入审核状态" ></a-input>
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="三会一课参会人员表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartThreeMeetingOneLessonParticipantsTable.loading"
          :columns="smartThreeMeetingOneLessonParticipantsTable.columns"
          :dataSource="smartThreeMeetingOneLessonParticipantsTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="三会一课附件表" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smartThreeMeetingOneLessonAnnexTable.loading"
          :columns="smartThreeMeetingOneLessonAnnexTable.columns"
          :dataSource="smartThreeMeetingOneLessonAnnexTable.dataSource"
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

  export default {
    name: 'SmartThreeMeetingOneLessonForm',
    mixins: [JEditableTableModelMixin],
    components: {
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
          hostId:'',
          hostName:'',
          recorderId:'',
          recorderName:'',
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
           time: [
              { required: true, message: '请输入时间!'},
           ],
           type: [
              { required: true, message: '请输入类型!'},
           ],
           theme: [
              { required: true, message: '请输入主题!'},
           ],
           createTime: [
              { required: true, message: '请输入创建日期!'},
           ],
        },
        refKeys: ['smartThreeMeetingOneLessonParticipants', 'smartThreeMeetingOneLessonAnnex', ],
        tableKeys:['smartThreeMeetingOneLessonParticipants', 'smartThreeMeetingOneLessonAnnex', ],
        activeKey: 'smartThreeMeetingOneLessonParticipants',
        // 三会一课参会人员表
        smartThreeMeetingOneLessonParticipantsTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参会人员工号',
              key: 'participantsNumber',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        // 三会一课附件表
        smartThreeMeetingOneLessonAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '附件说明',
              key: 'fileDescription',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件文件路径',
              key: 'fileLocation',
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
          add: "/smartThreeMeetingOneLesson/smartThreeMeetingOneLesson/add",
          edit: "/smartThreeMeetingOneLesson/smartThreeMeetingOneLesson/edit",
          queryById: "/smartThreeMeetingOneLesson/smartThreeMeetingOneLesson/queryById",
          smartThreeMeetingOneLessonParticipants: {
            list: '/smartThreeMeetingOneLesson/smartThreeMeetingOneLesson/querySmartThreeMeetingOneLessonParticipantsByMainId'
          },
          smartThreeMeetingOneLessonAnnex: {
            list: '/smartThreeMeetingOneLesson/smartThreeMeetingOneLesson/querySmartThreeMeetingOneLessonAnnexByMainId'
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
      getHostUser(back){
        let that = this
        console.log(back);
        that.model.hostId = back[0].id
        that.model.hostName = back[0].realname
      },

      getRecorderUser(back){
        let that = this
        console.log(back);
        that.model.recorderId = back[0].id
        that.model.recorderName = back[0].realname
      },

      addBefore(){
        this.smartThreeMeetingOneLessonParticipantsTable.dataSource=[]
        this.smartThreeMeetingOneLessonAnnexTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartThreeMeetingOneLessonParticipants.list, params, this.smartThreeMeetingOneLessonParticipantsTable)
          this.requestSubTableData(this.url.smartThreeMeetingOneLessonAnnex.list, params, this.smartThreeMeetingOneLessonAnnexTable)
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
          smartThreeMeetingOneLessonParticipantsList: allValues.tablesValue[0].values,
          smartThreeMeetingOneLessonAnnexList: allValues.tablesValue[1].values,
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