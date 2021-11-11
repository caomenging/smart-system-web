<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="会议时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetTime">
              <j-date placeholder="请选择会议时间" v-model="model.meetTime" style="width: 100%" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetLocation">
              <a-input v-model="model.meetLocation" placeholder="请输入会议地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetName">
              <a-input v-model="model.meetName" placeholder="请输入会议名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostNo">
              <j-select-user-by-dep v-model="model.hostNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受约谈函询人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="talkedNo">
              <j-select-user-by-dep v-model="model.talkedNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受诫勉谈话人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inquirerNo">
              <j-select-user-by-dep v-model="model.inquirerNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受党纪处分人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punisherNo">
              <j-select-user-by-dep v-model="model.punisherNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="会议摘要" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="abs">
              <j-editor v-model="model.abs" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="记录人工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="recorderNo">
              <j-select-user-by-dep v-model="model.recorderNo" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="党内谈话参与人表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartInnerPartyPacpaTable.loading"
          :columns="smartInnerPartyPacpaTable.columns"
          :dataSource="smartInnerPartyPacpaTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="党内谈话附件表" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="smartInnerPartyAnnexTable.loading"
          :columns="smartInnerPartyAnnexTable.columns"
          :dataSource="smartInnerPartyAnnexTable.dataSource"
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
    name: 'SmartInnerPartyTalkForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        rootUrl:'/SmartInnerPartyTalk/smartInnerPartyTalk',
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
        },
        refKeys: ['smartInnerPartyPacpa', 'smartInnerPartyAnnex', ],
        tableKeys:['smartInnerPartyPacpa', 'smartInnerPartyAnnex', ],
        activeKey: 'smartInnerPartyPacpa',
        // 党内谈话参与人表
        smartInnerPartyPacpaTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '参会人员工号',
              key: 'papcNo',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 党内谈话附件表
        smartInnerPartyAnnexTable: {
          loading: false,
          dataSource: [],
          columns: [
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
              title: '附件说明',
              key: 'supplement',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '附件文件路径',
              key: 'annex',
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
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/SmartInnerPartyTalk/smartInnerPartyTalk/add",
          edit: "/SmartInnerPartyTalk/smartInnerPartyTalk/edit",
          queryById: "/SmartInnerPartyTalk/smartInnerPartyTalk/queryById",
          smartInnerPartyPacpa: {
            list: '/SmartInnerPartyTalk/smartInnerPartyTalk/querySmartInnerPartyPacpaByMainId'
          },
          smartInnerPartyAnnex: {
            list: '/SmartInnerPartyTalk/smartInnerPartyTalk/querySmartInnerPartyAnnexByMainId'
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
        this.smartInnerPartyPacpaTable.dataSource=[]
        this.smartInnerPartyAnnexTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartInnerPartyPacpa.list, params, this.smartInnerPartyPacpaTable)
          this.requestSubTableData(this.url.smartInnerPartyAnnex.list, params, this.smartInnerPartyAnnexTable)
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
          smartInnerPartyPacpaList: allValues.tablesValue[0].values,
          smartInnerPartyAnnexList: allValues.tablesValue[1].values,
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