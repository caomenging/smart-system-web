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
            <a-form-model-item label="来访事由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reason">
              <a-input v-model="model.reason" placeholder="请输入来访事由" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="接待对象单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receptionDepartmentId">
              <a-input v-model="model.receptionDepartmentId" placeholder="请输入接待对象单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="接待单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentId">
              <j-select-depart v-model="model.departmentId" multi />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="到访时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startTime">
              <j-date placeholder="请选择到访时间" v-model="model.startTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date placeholder="请选择结束时间" v-model="model.endTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="来访人数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="visitorsNum">
              <a-input-number v-model="model.visitorsNum" placeholder="请输入来访人数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="总开销" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cost">
              <a-input-number v-model="model.cost" placeholder="请输入总开销" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否住宿" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="stay">
              <j-dict-select-tag type="radio" v-model="model.stay" dictCode="stay" placeholder="请选择是否住宿" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件上传" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filesPc">
              <j-upload v-model="model.filesPc"  ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="高拍仪附件上传" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="files">
              <eloam-modal ref="modalForm" @ok='scanOk' biz-path='eloam'></eloam-modal>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createBy">
              <j-select-user-by-dep v-model="model.createBy" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createTime">
              <j-date placeholder="请选择创建日期" v-model="model.createTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateBy">
              <a-input v-model="model.updateBy" placeholder="请输入更新人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateTime">
              <j-date placeholder="请选择更新日期" v-model="model.updateTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import EloamModal from '@views/eloam/modules/EloamModal'

  export default {
    name: "SmartReceptionModal",
    components: {
      EloamModal
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
           reason: [
              { required: true, message: '请输入来访事由!'},
           ],
           receptionDepartmentId: [
              { required: true, message: '请输入接待对象单位!'},
           ],
           startTime: [
              { required: true, message: '请输入到访时间!'},
           ],
           visitorsNum: [
              { required: true, message: '请输入来访人数量!'},
              { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
           ],
           cost: [
              { required: false},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
           filesPc: [
              { required: true, message: '请输入附件上传!'},
           ],
           createBy: [
              { required: true, message: '请输入创建人!'},
           ],
           createTime: [
              { required: true, message: '请输入创建日期!'},
           ],
        },
        url: {
          add: "/smart_reception/smartReception/add",
          edit: "/smart_reception/smartReception/edit",
        }
     
      }
    },
    created () {
    //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      eloamScan() {
        this.$refs.modalForm.open()
      },
      scanOk(url) {
        let image = url
        // 请根据自己表单中的字段名称修改 field 变量的值
        let field = 'files'
        if (image) {
          let arr = []
          // 考虑如果存在已经上传的文件，则拼接起来，没有则直接添加
          if (this.model[field]) {
            arr.push(this.model[field])
          }
          arr.push(image)
          this.$set(this.model, field, arr.join())
        }
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