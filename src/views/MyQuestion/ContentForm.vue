<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>

          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examStarttime">
              <j-date placeholder="请选择开始时间"  v-model="model.examStarttime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="examEndtime">
              <j-date placeholder="请选择结束时间"  v-model="model.examEndtime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24" >
            <a-form-model-item label="指定人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personId" >
              <j-select-user-by-dep v-model="model.personId" :multi="true" />
            </a-form-model-item>
          </a-col>


          <a-col :span="24" >
            <a-form-model-item label="指定人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personName" v-show="false" >

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
// import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import SmartPeopleModal from '../SmartPeople/modules/SmartPeopleModal'
import { FormTypes } from '../../utils/JEditableTableUtil'

export default {
  name: 'ContentForm',
  components: {
    SmartExamInformationModal,JSelectUserByDep,SmartPeopleModal
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
        personId:'admin',
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
        edit: "/smartExamInformation/smartExamInformation/edit",
        list:"/smartExamInformation/smartExamInformation/list",
        queryById: "/smartExamInformation/smartExamInformation/queryById",
        addPeople:"/smartPeople/smartPeople/add"

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
    //通过组织机构筛选选择用户
    onSearchDepUser() {
      this.$refs.JSearchUserByDep.showModal()
      this.selectedDepUsers = ''
      this.$refs.JSearchUserByDep.title = '根据部门查询用户'
    },
    onSearchDepUserCallBack(selectedDepUsers) {
      this.selectedDepUsers = selectedDepUsers
    },
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
   /* getPersonUser(back) {
      let that=this
      console.log(back)
      that.model.personId=back[0].id
      that.model.personName=back[1].realname
    },*/
    handleIssue(){
      //发布
      const params = {
        id: this.model.id,


      }
     /* putAction(this.url.edit, params).then((res) => {
        if(res.success) {
          //this.$message.success(res.message)
          this.$router.push({path:'/SmartSurvey/SmartSurveyList'})
        }
      })*/
      getAction(this.url.list,params).then((res)=>{
        if(res.success){
          this.$message.success('发布成功')
          this.$router.push({path:'/SmartSurvey/SmartSurveyList'})

        }
      })
      postAction(this.url.add,this.model).then(res =>{
        console.log(res)
        if(res.success){
          //this.$message.success(res.message);
          that.$emit('ok');
          this.$router.push({path:'/SmartSurvey/SmartSurveyList'})

        }
        else{
          this.$message.warning(res.message);
        }
      })
      postAction(this.url.addPeople,this.model).then(res =>{
        console.log(res)
        if(res.success){
          //this.$message.success(res.message);
          that.$emit('ok');
          this.$router.push({path:'/SmartSurvey/SmartSurveyList'})

        }
        else{
          this.$message.warning(res.message);
        }
      })
    }


  }
}
</script>