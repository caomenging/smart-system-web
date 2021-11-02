<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="人员性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleSex">
              <a-input v-model="model.peopleSex" placeholder="请输入人员性别" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="politicCou">
              <a-input v-model="model.politicCou" placeholder="请输入政治面貌" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workUint">
              <a-input v-model="model.workUint" placeholder="请输入工作单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="post">
              <a-input v-model="model.post" placeholder="请输入职务" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="职级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="postRank">
              <a-input v-model="model.postRank" placeholder="请输入职级" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="配偶姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="spoName">
              <a-input v-model="model.spoName" placeholder="请输入配偶姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="配偶单位职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="spoUnitPos">
              <a-input v-model="model.spoUnitPos" placeholder="请输入配偶单位职务" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="配偶政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="spoPoliticCou">
              <a-input v-model="model.spoPoliticCou" placeholder="请输入配偶政治面貌" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marriedName">
              <a-input v-model="model.marriedName" placeholder="请输入结婚人姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="与本人关系" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="relationWithMyself">
              <a-input v-model="model.relationWithMyself" placeholder="请输入与本人关系" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚姻登记时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marryRegistTime">
              <a-input v-model="model.marryRegistTime" placeholder="请输入婚姻登记时间" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚礼时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weddingTime">
              <a-input v-model="model.weddingTime" placeholder="请输入婚礼时间" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="是否同城同地合办" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isSameOrganized">
              <a-input v-model="model.isSameOrganized" placeholder="请输入是否同城同地合办" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="拟宴请人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="guestsNumber">
              <a-input v-model="model.guestsNumber" placeholder="请输入拟宴请人数" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚宴场所名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="banqPlaceName">
              <a-input v-model="model.banqPlaceName" placeholder="请输入婚宴场所名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="婚宴场所地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="banqPlaceAddr">
              <a-input v-model="model.banqPlaceAddr" placeholder="请输入婚宴场所地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="宴请人员范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="banqPersonScope">
              <a-input v-model="model.banqPersonScope" placeholder="请输入宴请人员范围" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="拟用婚礼车辆来源" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="proCarsSource">
              <a-input v-model="model.proCarsSource" placeholder="请输入拟用婚礼车辆来源" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="拟用婚礼车辆数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="proCarsNum">
              <a-input v-model="model.proCarsNum" placeholder="请输入拟用婚礼车辆数量" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人配偶姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marrySpoName">
              <a-input v-model="model.marrySpoName" placeholder="请输入结婚人配偶姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人配偶单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marrySpoUnit">
              <a-input v-model="model.marrySpoUnit" placeholder="请输入结婚人配偶单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人配偶单位职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marrySpoUnitPos">
              <a-input v-model="model.marrySpoUnitPos" placeholder="请输入结婚人配偶单位职务" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人配偶父母姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marrySpoParName">
              <a-input v-model="model.marrySpoParName" placeholder="请输入结婚人配偶父母姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结婚人配偶父母单位职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marrySpoParUnitPos">
              <a-input v-model="model.marrySpoParUnitPos" placeholder="请输入结婚人配偶父母单位职务" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="其他需要说明的事情" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="otherMattersExp">
              <a-input v-model="model.otherMattersExp" placeholder="请输入其他需要说明的事情" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTime">
              <a-input v-model="model.reportTime" placeholder="请输入报告时间" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactNumber">
              <a-input v-model="model.contactNumber" placeholder="请输入联系电话" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="8项规定婚前报备表附表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="smartPremaritalFilingAppTable.loading"
          :columns="smartPremaritalFilingAppTable.columns"
          :dataSource="smartPremaritalFilingAppTable.dataSource"
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
    name: 'SmartPremaritalFilingForm',
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
        },
        refKeys: ['smartPremaritalFilingApp', ],
        tableKeys:['smartPremaritalFilingApp', ],
        activeKey: 'smartPremaritalFilingApp',
        // 8项规定婚前报备表附表
        smartPremaritalFilingAppTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '附件文件路径',
              key: 'appFilePath',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上传时间',
              key: 'uploadTime',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下载次数',
              key: 'downloadNum',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/smartPremaritalFiling/smartPremaritalFiling/add",
          edit: "/smartPremaritalFiling/smartPremaritalFiling/edit",
          queryById: "/smartPremaritalFiling/smartPremaritalFiling/queryById",
          smartPremaritalFilingApp: {
            list: '/smartPremaritalFiling/smartPremaritalFiling/querySmartPremaritalFilingAppByMainId'
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
        this.smartPremaritalFilingAppTable.dataSource=[]
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
          this.requestSubTableData(this.url.smartPremaritalFilingApp.list, params, this.smartPremaritalFilingAppTable)
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
          smartPremaritalFilingAppList: allValues.tablesValue[0].values,
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