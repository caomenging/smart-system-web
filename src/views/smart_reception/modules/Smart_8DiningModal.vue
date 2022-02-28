<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="用餐地名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name"placeholder="请输入用餐地名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="用餐时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="etime">
              <j-date placeholder="请选择用餐时间" v-model="model.etime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="用餐总人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="num">
              <a-input-number v-model="model.num"placeholder="请输入用餐总人数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="陪同人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="numR">
              <a-input v-model="model.numR"placeholder="请输入陪同人数" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">

          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createBy">-->
<!--              <a-input v-model="model.createBy"placeholder="请输入创建人" ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
  <!--          <a-col :span="24">-->
  <!--            <a-form-model-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">-->
  <!--              <j-date placeholder="请选择创建日期" v-model="model.createTime" style="width: 100%" />-->
  <!--            </a-form-model-item>-->
<!--            </a-col>-->
            <a-col :span="24">
              <a-form-model-item label="更新人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateBy">
                <a-input v-model="model.updateBy"placeholder="请输入更新人" ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateTime">
                <j-date placeholder="请选择更新日期" v-model="model.updateTime" style="width: 100%" />
              </a-form-model-item>
            </a-col>
          <a-col :span="24">
            <a-form-model-item label="陪同用餐人员管理" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateTime">
              <a-button type="primary" @click="showModal">管理</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <meet-modal ref="mealModal" ></meet-modal>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import Smart_8EscortedMealModal from "./Smart_8EscortedMealModal";
  import MeetModal from "./MeetModal";


  export default {
    name: "Smart_8DiningModal",
    components: {
      MeetModal
    },
    props:{
      mainId:{
        type:String,
        required:false,
        default:''
      }
    },
    data () {
      return {
        title:"操作",
        width:800,
        visible: false,
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
           name: [
              { required: true, message: '请输入用餐地名称!'},
           ],
           etime: [
              { required: true, message: '请输入用餐时间!'},
           ],
           num: [
              { required: true, message: '请输入用餐总人数!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
           numR: [
              { required: true, message: '请输入陪同人数!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
           createBy: [
              { required: true, message: '请输入创建人!'},
           ],
           createTime: [
              { required: true, message: '请输入创建日期!'},
           ],
        },
        url: {
          add: "/smart_reception/smartReception/addSmart_8Dining",
          edit: "/smart_reception/smartReception/editSmart_8Dining",
        }

      }
    },
    created () {
    //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      showModal() {
        this.$refs.mealModal.edit();
        this.$refs.mealModal.title = "编辑";
        this.$refs.mealModal.disableSubmit = false;
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.clearValidate();
      },
      handleOk () {
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
            this.model['mainId'] = this.mainId
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }else{
             return false
          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>
