<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>

          <a-col :span="24">
            <a-form-model-item label="考试开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examStarttime">
              <j-date placeholder="请选择考试开始时间"  v-model="model.examStarttime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="考试结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examEndtime">
              <j-date placeholder="请选择考试结束时间"  v-model="model.examEndtime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="指定人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personId">
              <select-user-by-dep v-model="model.personId" @info="getPersonUser"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="指定人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personName" v-show="false">
              <a-input v-model="model.personName"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button @click="handleIssue" type="primary"
                    :disabled="disableSubmit">发布</a-button>

        </a-form-model-item>
      </a-form-model>

    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction,putAction, postAction,getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import SmartExamInformationModal from '../SmartExamInformation/modules/SmartExamInformationModal'
import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'

import SmartPeopleModal from '../SmartPeople/modules/SmartPeopleModal'

export default {
  name: 'ContentForm',
  components: {
    SmartExamInformationModal,SelectUserByDep,SmartPeopleModal
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
        personId:'',
        personName:''
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      disableSubmit: false,
      confirmLoading: false,
      /*validatorRules: {
        examStarttime: [
          { required: true, message: '请输入考试开始时间!'},
        ],
        examEndtime: [
          { required: true, message: '请输入考试结束时间!'},
        ],
      },*/
      url: {
         add: "/smartExamInformation/smartExamInformation/add",
       // add:"/smartPaper/smartPaper/add",
        edit: "/smartExamInformation/smartExamInformation/edit",

        list:"/smartExamInformation/smartExamInformation/list",
        queryById: "/smartExamInformation/smartExamInformation/queryById"

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
    getPersonUser(back) {
      let that=this
      console.log(back)
      that.model.personId=back[0].id
      that.model.personName=back[1].realname
    },
    handleIssue(){
      //发布
      const params = {
        id: this.model.id,


      }
     /* putAction(this.url.edit, params).then((res) => {
        if(res.success) {
          this.$message.success(res.message)
        }
      })*/
      getAction(this.url.list,params).then((res)=>{
        if(res.success){
          this.$message.success('发布成功')
         // this.$router.push({path:'/MyQuestion/MyQuestionList'})

        }
      })
     postAction(this.url.add,this.model).then(res =>{
        console.log(res)
        if(res.success){
          this.$message.success(res.message);
          that.$emit('ok');
          this.$router.push({path:'/MyQuestion/MyQuestionList'})

        }
        else{
          this.$message.warning(res.message);
        }
      })

    }


  }
}
</script>