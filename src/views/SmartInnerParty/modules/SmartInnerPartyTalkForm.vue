<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="会议地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="location">
              <a-input v-model="model.location" placeholder="请输入会议地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入会议名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostNo">
              <a-input v-model="model.hostNo" placeholder="请输入主持人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受约谈函询人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inquirePersonNo">
              <a-input v-model="model.inquirePersonNo" placeholder="请输入受约谈函询人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受诫勉谈话人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="admonishPersonNo">
              <a-input v-model="model.admonishPersonNo" placeholder="请输入受诫勉谈话人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受党纪处分人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishPersonNo">
              <a-input v-model="model.punishPersonNo" placeholder="请输入受党纪处分人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="abs">
              <j-editor v-model="model.abs" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="记录人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderNo">
              <a-input v-model="model.recorderNo" placeholder="请输入记录人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createrNo">
              <a-input v-model="model.createrNo" placeholder="请输入创建人工号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deptName">
              <a-input v-model="model.deptName" placeholder="请输入单位名称" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="党内谈话附件表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartInnerPartyAnnexTable.loading"
          :columns="smartInnerPartyAnnexTable.columns"
          :dataSource="smartInnerPartyAnnexTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="党内谈话参与人表" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smartInnerPartyPacpaTable.loading"
          :columns="smartInnerPartyPacpaTable.columns"
          :dataSource="smartInnerPartyPacpaTable.dataSource"
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
    name: 'SmartInnerPartyTalkForm',
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
           location: [
              { required: true, message: '请输入会议地点!'},
           ],
           name: [
              { required: true, message: '请输入会议名称!'},
           ],
           hostNo: [
              { required: true, message: '请输入主持人工号!'},
           ],
           inquirePersonNo: [
              { required: true, message: '请输入受约谈函询人工号!'},
           ],
           admonishPersonNo: [
              { required: true, message: '请输入受诫勉谈话人工号!'},
           ],
           punishPersonNo: [
              { required: true, message: '请输入受党纪处分人工号!'},
           ],
           recorderNo: [
              { required: true, message: '请输入记录人工号!'},
           ],
           createrNo: [
              { required: true, message: '请输入创建人工号!'},
           ],
           deptName: [
              { required: true, message: '请输入单位名称!'},
           ],
        },
        refKeys: ['smartInnerPartyAnnex', 'smartInnerPartyPacpa', ],
        tableKeys:['smartInnerPartyAnnex', 'smartInnerPartyPacpa', ],
        activeKey: 'smartInnerPartyAnnex',
        // 党内谈话附件表
        smartInnerPartyAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '序号',
              key: 'index',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件说明',
              key: 'annexEpl',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件文件路径',
              key: 'annexPath',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上传时间',
              key: 'uploadTime',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下载次数',
              key: 'downloadCount',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 党内谈话参与人表
        smartInnerPartyPacpaTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参会人员工号',
              key: 'participantNo',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/smartInnerParty/smartInnerPartyTalk/add",
          edit: "/smartInnerParty/smartInnerPartyTalk/edit",
          queryById: "/smartInnerParty/smartInnerPartyTalk/queryById",
          smartInnerPartyAnnex: {
            list: '/smartInnerParty/smartInnerPartyTalk/querySmartInnerPartyAnnexByMainId'
          },
          smartInnerPartyPacpa: {
            list: '/smartInnerParty/smartInnerPartyTalk/querySmartInnerPartyPacpaByMainId'
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
        this.smartInnerPartyAnnexTable.dataSource=[]
        this.smartInnerPartyPacpaTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartInnerPartyAnnex.list, params, this.smartInnerPartyAnnexTable)
          this.requestSubTableData(this.url.smartInnerPartyPacpa.list, params, this.smartInnerPartyPacpaTable)
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
          smartInnerPartyAnnexList: allValues.tablesValue[0].values,
          smartInnerPartyPacpaList: allValues.tablesValue[1].values,
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