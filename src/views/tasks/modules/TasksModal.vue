<template>
  <j-modal
    :title="title"
    :width="900"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    okText="提交"
    :okButtonProps="{ class: { 'jee-hidden': verifyDisableSubmit } }"
    @cancel="handleCancel"
  >
    <!-- <test-verify-form v-if="type==='婚前报备'" ref="realForm" :disabled="disableSubmit" /> -->
    <!-- <test v-if="type==='婚前报备'" ref="realForm" :disabled="disableSubmit" /> -->
    <smart-premarital-filing-form v-if="type === '婚前报备'" ref="realForm" :disabled="disableSubmit" />
    <smart-supervision-form v-if="type === '监督检查'" ref="realForm" :disabled="disableSubmit" />
    <smart-post-marriage-report-form v-if="type === '婚后报备'" ref="realForm" :disabled="disableSubmit" />
    <smart-create-advice-form v-if="type === '制发建议'" ref="realForm" :disabled="disableSubmit" />
    <smart-org-meeting-form v-if="type === '组织生活会'" ref="realForm" :disabled="disableSubmit" />
    <smart-democratic-life-meeting-form v-if="type === '民主生活会'" ref="realForm" :disabled="disableSubmit" />
    <smart-finance-result-form v-if="type === '财务收支'" ref="realForm" :disabled="disableSubmit" />

    <smart-triple-importance-one-greatness-form v-if="type === '三重一大'" ref="realForm" :disabled="disableSubmit" />

    <!-- <h3 :style="{ padding: '24px', background: '#9cdcfe', textAlign: 'center' }" >审核区域</h3> -->

    <a-row :gutter="[16, 40]" type="flex" justify="center" align="top">
      <a-col :span="16" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-list item-layout="horizontal" :data-source="verifyResult">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title">审核信息</a>
              <div slot="description">
                <div><span>审核人：</span><span>{{item.auditPerson}}</span></div>
                <div><span>审核时间：</span><span>{{item.auditTime}}</span></div>
                <div><span>审核结论：</span><span>{{item.auditStatus}}</span></div>
                <div><span>审核意见：</span><span>{{item.remark}}</span></div>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 40]">
      <tasks-form
        v-show="!verifyDisableSubmit"
        ref="verifyForm"
        @ok="submitCallback"
        :disabled="verifyDisableSubmit"
        :flowNo="flowNo"
      />
    </a-row>
  </j-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import SmartPremaritalFilingForm from '../../SmartPremaritalFiling/modules/SmartPremaritalFilingForm.vue'
import TasksForm from './TasksForm'
import TestVerifyForm from '@/views/testVerify/modules/TestVerifyForm'
import SmartSupervisionForm from '../../smartSupervision/modules/SmartSupervisionForm.vue'
import SmartPostMarriageReportForm from '../../SmartPostMarriage/modules/SmartPostMarriageReportForm.vue'
import SmartTripleImportanceOneGreatnessForm from '../../SmartTripleImportanceOneGreatness/modules/SmartTripleImportanceOneGreatnessForm.vue'
import SmartCreateAdviceForm from '../../SmartSuggestion/modules/SmartCreateAdviceForm'
import SplitPanel from '../../jeecg/SplitPanel.vue'
import SmartOrgMeetingForm from "../../SmartOrgMeeting/modules/SmartOrgMeetingForm";
import SmartFinanceResultForm from "../../SmartFinanceResult/modules/SmartFinanceResultForm";
import SmartDemocraticLifeMeetingForm from "../../smartDemocraticLifeMeeting/modules/SmartDemocraticLifeMeetingForm";

export default {
  name: 'TaskModal',
  components: {
    SmartDemocraticLifeMeetingForm,
    SmartFinanceResultForm,
    SmartOrgMeetingForm,
    getAction,
    TasksForm,
    TestVerifyForm,
    SmartPremaritalFilingForm,
    SmartSupervisionForm,
    SmartPostMarriageReportForm,
    SmartTripleImportanceOneGreatnessForm,
    SmartCreateAdviceForm,
    SplitPanel,
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      verifyDisableSubmit: true,
      flowNo: '',
      type: '',
      verifyResult: [],
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
    }
  },
  created() {
    this.getVerigyResult()
  },
  beforeCreate() {
    console.log(record)
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.type = record.taskType
      this.$nextTick(() => {
        // this.getVerigyResult(record.flowNo)
        this.title = record.taskType + '条目' + this.title
        let realRecord = record
        realRecord.id = record.flowNo
        this.flowNo = realRecord.id
        console.log(realRecord)
        // this.$refs.verifyForm.edit(realRecord)
        this.$refs.realForm.edit(realRecord)
        // getVerigyResult(record)
      })
      // this.$nextTick(() => {
      //   this.getVerigyResult(record.flowNo)
      // })
    },
    getVerigyResult(flowNo) {
      const params = {
        flowNo: flowNo,
      }
      getAction('/smartVerifyDetail/smartVerifyDetail/queryByflowNo', params).then((res) => {
        if (res.success) {
          this.verifyResult = res.result
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.verifyForm.handleOk()
    },
    submitCallback(record) {
      this.$emit('ok')
      this.visible = false
      console.log(record)
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>