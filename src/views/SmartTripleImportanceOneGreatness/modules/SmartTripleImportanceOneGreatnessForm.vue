<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="单位ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="docementid">
              <a-input v-model="model.docementid" placeholder="请输入单位ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingName">
              <a-input v-model="model.meetingName" placeholder="请输入名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingPlace">
              <a-input v-model="model.meetingPlace" placeholder="请输入地点" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingStarttime">
              <j-date placeholder="请选择时间" v-model="model.meetingStarttime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingType">
              <j-dict-select-tag type="list" v-model="model.meetingType" dictCode="meeting_type" placeholder="请选择类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="参会人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingNumber">
              <a-input-number v-model="model.meetingNumber" placeholder="请输入参会人数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="参会人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingPeople">
              <a-input v-model="model.meetingPeople" placeholder="请输入参会人员" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="主持人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingHoster">
              <a-input v-model="model.meetingHoster" placeholder="请输入主持人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="记录人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetingRecorer">
              <a-input v-model="model.meetingRecorer" placeholder="请输入记录人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="会议内容摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="meetingAbstract">
              <a-textarea v-model="model.meetingAbstract" rows="4" placeholder="请输入会议内容摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="meetingRemarks">
              <a-textarea v-model="model.meetingRemarks" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatBy">
              <a-input v-model="model.creatBy" placeholder="请输入创建人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creatTime">
              <j-date placeholder="请选择创建时间" v-model="model.creatTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="三重一大附件表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartTripleImportanceOneGreatnessDecriptionTable.loading"
          :columns="smartTripleImportanceOneGreatnessDecriptionTable.columns"
          :dataSource="smartTripleImportanceOneGreatnessDecriptionTable.dataSource"
          :maxHeight="400"
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
    name: 'SmartTripleImportanceOneGreatnessForm',
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
           docementid: [
              { required: true, message: '请输入单位ID!'},
           ],
           meetingStarttime: [
              { required: true, message: '请输入时间!'},
           ],
           meetingType: [
              { required: true, message: '请输入类型!'},
           ],
           meetingNumber: [
              { required: true, message: '请输入参会人数!'},
           ],
           creatTime: [
              { required: true, message: '请输入创建时间!'},
           ],
        },
        refKeys: ['smartTripleImportanceOneGreatnessDecription', ],
        tableKeys:['smartTripleImportanceOneGreatnessDecription', ],
        activeKey: 'smartTripleImportanceOneGreatnessDecription',
        // 三重一大附件表
        smartTripleImportanceOneGreatnessDecriptionTable: {
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
            },
            {
              title: '附件说明路径',
              key: 'descriptionPath',
              type: FormTypes.input,
              width:"250px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上传时间',
              key: 'uploadTime',
              type: FormTypes.datetime,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/add",
          edit: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/edit",
          queryById: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/queryById",
          smartTripleImportanceOneGreatnessDecription: {
            list: '/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/querySmartTripleImportanceOneGreatnessDecriptionByMainId'
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
        this.smartTripleImportanceOneGreatnessDecriptionTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartTripleImportanceOneGreatnessDecription.list, params, this.smartTripleImportanceOneGreatnessDecriptionTable)
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
          smartTripleImportanceOneGreatnessDecriptionList: allValues.tablesValue[0].values,
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