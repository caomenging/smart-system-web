<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="所属窗口单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentId">
              <j-search-select-tag v-model="model.departmentId" dict="smart_window_unit,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="principal">
              <j-select-user-by-dep v-model="model.principal" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="窗口人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personId">
              <j-select-user-by-dep v-model="model.personId" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入联系方式"  ></a-input>
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

  export default {
    name: 'SmartWindowPeopleForm',
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
           departmentId: [
              { required: true, message: '请输入所属窗口单位!'},
           ],
           principal: [
              { required: true, message: '请输入负责人!'},
           ],
           personId: [
              { required: true, message: '请输入窗口人员!'},
              { validator: (rule, value, callback) => validateDuplicateValue('smart_window_people', 'person_id', value, this.model.id, callback)},
           ],
           phone: [
              { required: true, message: '请输入联系方式!'},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
           ],
        },
        url: {
          add: "/smart_window_people/smartWindowPeople/add",
          edit: "/smart_window_people/smartWindowPeople/edit",
          queryById: "/smart_window_people/smartWindowPeople/queryById"
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