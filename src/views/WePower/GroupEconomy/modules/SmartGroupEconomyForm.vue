<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="农村集体经济组织类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="group_economy_type" placeholder="请选择农村集体经济组织类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="农村集体经济组织名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入农村集体经济组织名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="理事长（法定代表人）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="councilBoard">
              <a-input v-model="model.councilBoard" placeholder="请输入理事长（法定代表人）"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="理事会成员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="counilMenber">
              <a-input v-model="model.counilMenber" placeholder="请输入理事会成员"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任期开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="termStartTime">
              <j-date placeholder="请选择任期开始时间" v-model="model.termStartTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任期结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="termEndTime">
              <j-date placeholder="请选择任期结束时间" v-model="model.termEndTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="经理人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="manager">
              <a-input v-model="model.manager" placeholder="请输入经理人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="授权额度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="credit">
              <a-input v-model="model.credit" placeholder="请输入授权额度"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="监事长" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supervisor">
              <a-input v-model="model.supervisor" placeholder="请输入监事长"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="监事会成员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supervisorMember">
              <a-input v-model="model.supervisorMember" placeholder="请输入监事会成员"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任期开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supervisorStartTime">
              <j-date placeholder="请选择任期开始时间" v-model="model.supervisorStartTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任期结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supervisorEndTime">
              <j-date placeholder="请选择任期结束时间" v-model="model.supervisorEndTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="财务成员代表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="financialOfficer">
              <a-input v-model="model.financialOfficer" placeholder="请输入财务成员代表"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="财务成员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="financialMember">
              <a-input v-model="model.financialMember" placeholder="请输入财务成员"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="账户信息" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="accountInfo">
              <a-input v-model="model.accountInfo" placeholder="请输入账户信息"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SmartGroupEconomyForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           type: [
              { required: true, message: '请输入农村集体经济组织类型!'},
           ],
           name: [
              { required: true, message: '请输入农村集体经济组织名称!'},
           ],
           councilBoard: [
              { required: true, message: '请输入理事长（法定代表人）!'},
           ],
           termStartTime: [
              { required: true, message: '请输入任期开始时间!'},
           ],
           termEndTime: [
              { required: true, message: '请输入任期结束时间!'},
           ],
           manager: [
              { required: true, message: '请输入经理人!'},
           ],
           credit: [
              { required: true, message: '请输入授权额度!'},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
           supervisor: [
              { required: true, message: '请输入监事长!'},
           ],
           supervisorStartTime: [
              { required: true, message: '请输入任期开始时间!'},
           ],
           supervisorEndTime: [
              { required: true, message: '请输入任期结束时间!'},
           ],
           financialOfficer: [
              { required: true, message: '请输入财务成员代表!'},
           ],
        },
        url: {
          add: "/smartGroupEconomy/smartGroupEconomy/add",
          edit: "/smartGroupEconomy/smartGroupEconomy/edit",
          queryById: "/smartGroupEconomy/smartGroupEconomy/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>