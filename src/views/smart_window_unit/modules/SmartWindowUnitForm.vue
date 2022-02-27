<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入单位名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主管单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pid">
              <j-select-depart v-model="model.pid" multi  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="principal">
              <select-user-by-dep :multi="false" v-model="model.principal" @info = "getHostUser"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="负责人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="principalName" v-show="false">
              <a-input v-model="model.principalName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入联系电话" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="二维码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qrcode">
              <j-image-upload isMultiple  v-model="model.qrcode" disabled></j-image-upload>
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
  import SelectUserByDep from "../../../components/jeecgbiz/modal/SelectUserByDep";

  export default {
    name: 'SmartWindowUnitForm',
    components: {
      SelectUserByDep
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
          principalName:'',
          phone:'',
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
           name: [
              { required: true, message: '请输入单位名称!'},
           ],
           pid: [
              { required: true, message: '请输入主管单位!'},
           ],
           principal: [
              { required: true, message: '请输入负责人!'},
           ],
           phone: [
              { required: true, message: '请输入联系电话!'},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
           ],
        },
        url: {
          add: "/smart_window_unit/smartWindowUnit/add",
          edit: "/smart_window_unit/smartWindowUnit/edit",
          queryById: "/smart_window_unit/smartWindowUnit/queryById"
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
      getHostUser(back){
        let that = this
        console.log(back)
        that.model.principal = back[0].id
        that.model.principalName = back[0].realname
        that.model.phone = back[0].phone
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
    }
  }
</script>

