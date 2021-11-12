<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin :spinning="confirmLoading">
        <j-form-container :disabled="formDisabled">
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="被反映人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reflectedName">
                  <a-input v-model="model.reflectedName" placeholder="请输入被反映人姓名"  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="被反映人单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reflectedDocumentid">
                  <a-input v-model="model.reflectedDocumentid" placeholder="请输入被反映人单位"  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="主要问题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="majorProblem">
                  <a-input v-model="model.majorProblem" placeholder="请输入主要问题"  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
                  <j-upload v-model="model.description"   ></j-upload>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="举报人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reporterName">
                  <a-input v-model="model.reporterName" placeholder="请输入举报人姓名"  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactNumber">
                  <a-input v-model="model.contactNumber" placeholder="请输入联系电话"  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="举报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportingTime">
                  <j-date placeholder="请选择举报时间"  v-model="model.reportingTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button @click="handleSubmit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px">取消</a-button>
            </a-form-model-item>
          </a-form-model>
        </j-form-container>
      </a-spin>

  </a-card>

</template>

<script>

  import { httpAction, postAction, getAction } from '@/api/manage'
  import AFormItem from 'ant-design-vue/lib/form/FormItem'

  export default {
    name: 'ReportingInformationDetail',
    components: {AFormItem},
    data () {
      return {
        reportingTime:'',
        reportingResult:'',
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
        //form: this.$form.createForm(this),
        validatorRules: {
          majorProblem: [
            { required: true, message: '请输入主要问题!'},
          ],
          contactNumber: [
            { required: true, message: '请输入联系电话!'},
          ],
          reportingTime: [
            { required: true, message: '请输入举报时间!'},
          ],
        },

        url: {
          add: "/smartReportingInformationDetail/smartReportingInformationDetail/add",
        }
      }
    },
    mounted () {
      /*this.nowTimes()*/
    },
   /* beforeDestroy () {
      this.clear()
    },*/

    methods: {
      /*//动态时钟
      timeFormate (timeStamp) {
        let year = new Date(timeStamp).getFullYear()
        let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
        let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
        let ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()

        this.reportingTime = year + '-' + month + '-' + date  + ' ' + hh + ':' + mm + ':' + ss
      }, // 实时刷新当前时间，格式化
      nowTimes () {
        this.timeFormate(new Date())
        setInterval(this.nowTimes, 1000)
        this.clear()
        this.form.setFieldsValue({
          reportingTime:this.reportingTime
        })
      },
      clear () {
        clearInterval(this.nowTimes)
        this.nowTimes = null
      },*/

      // handler
      handleSubmit () {
        console.log(this.model)
        postAction(this.url.add,this.model).then(res =>{
          console.log(res)
          if(res.success){
            this.$message.success(res.message);
            //that.$emit('ok');
            this.$router.push({path: '/result/success'});

          }


          else{
            this.$message.warning(res.message);
          }
        })

      }
    }
  }
 // this.$refs.form.resetFields();
</script>
