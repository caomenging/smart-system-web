<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="处分人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishId">
              <select-user-by-dep v-model="model.punishId" @info="getUser"  :multi="false" :flag ="false"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="处分人姓名"  :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishName" v-show="false">
              <a-input v-model="model.punishName" placeholder="处分人姓名"
                       readOnly
                       unselectable="on"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="单位" prop="departCode" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-model="model.departCode" placeholder="单位"
                dictCode="sys_depart,depart_name,org_code"  disabled="true" >
              </j-dict-select-tag>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="职务"  prop="position" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-model="model.position" placeholder="职务"  dictCode="sys_position,name,code"
                                 disabled="true"></j-dict-select-tag>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="职级" prop="positionRank" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-model="model.positionRank" placeholder="职级"  dict="position_rank"  disabled="true"
                       unselectable="on"></j-search-select-tag>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="手机号"  prop="phone" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="model.phone" placeholder="手机号" readOnly
                       unselectable="on"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="处分类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishType">
              <j-dict-select-tag
                placeholder="请选择处分类型"
                dictCode="punish_type"
                v-model="model.punishType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="处分开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="beginTime">
              <j-date placeholder="请选择处分开始时间" v-model="model.beginTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="解除处分时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="removeTime">
              <j-date placeholder="请选择解除处分时间" v-model="model.removeTime"  style="width: 100%" />
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
  import Template1 from '../../jeecg/JVxeDemo/layout-demo/Template1'
  import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'

  export default {
    name: 'SmartPunishPeopleForm',
    components: {
      Template1,SelectUserByDep
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
          punishNo: '',
          punishName: '',
          departCode: '',
          position: '',
          positionRank: '',
          phone: '',
          /*punishType: '',
          removeTime: '',*/
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
        },
        url: {
          add: "/SmartPunishPeople/smartPunishPeople/add",
          edit: "/SmartPunishPeople/smartPunishPeople/edit",
          queryById: "/SmartPunishPeople/smartPunishPeople/queryById"
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
      getUser(back){
        console.log(back)
        //this.model = back[0]
        //console.log(this.model)
        this.model.punishId = back[0].id
        this.model.punishName = back[0].realname
        this.model.departCode = back[0].orgCode
        this.model.phone = back[0].phone
        this.model.position = back[0].post
        this.model.positionRank = back[0].positionRank
      }
    }
  }
</script>