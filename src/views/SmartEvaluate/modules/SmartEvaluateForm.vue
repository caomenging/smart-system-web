<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form"  ref="evaluateForm">
      <a-form-item
        label="主管单位"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'exeDept',
            {rules: [{ required: true, message: '主管单位' }]}
          ]"
          name="exeDept"
          placeholder="主管单位" />
      </a-form-item>
      <!--<a-form-item
        label="起止日期"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: '请选择起止日期' }]}
          ]" />
      </a-form-item>-->
      <!--      <a-form-item
            label="政务服务大厅名称"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input
              placeholder="政务服务大厅名称"
              v-decorator="[
                  'windowsName',
                  {rules: [{ required: true, message: '政务服务大厅名称' }]}
                ]" />
          </a-form-item>-->
      <a-form-item
        label="主管单位ID"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" v-show="false">
        <a-input v-decorator="['exeDeptId']" />
      </a-form-item>
      <a-form-item
        label="窗口服务大厅ID"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" v-show="false">
        <a-input v-decorator="['windowsId']" />
      </a-form-item>
      <a-form-item
        label="窗口服务大厅名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          placeholder="窗口服务大厅名称"
          v-decorator="[
            'windowsName',
            {rules: [{ required: true, message: '窗口服务大厅名称' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="人员ID"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" v-show="false">
        <a-input v-decorator="['personId']" />
      </a-form-item>
      <a-form-item
        label="被评价人姓名"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input
          v-decorator="['personName']" placeholder="被评价人姓名" />
      </a-form-item>
      <a-form-item
        label="评价人姓名"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-input v-decorator="[
            'evaluateName',validatorRules.evaluateName]" placeholder="请输入评价人姓名" />
      </a-form-item>
      <a-form-item
        label="评价人手机号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"

      >
        <a-input v-decorator="[
            'evaluatePhone', validatorRules.evaluatePhone]" placeholder="请输入评价人手机号" />
      </a-form-item>
      <a-form-item
        label="评价时间"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" v-show="false"
      >
        <a-input placeholder="选择日期"  style="width: 100%"
                 v-decorator="['evaluateTime']"/>
      </a-form-item>
      <a-form-item label="满意度评价"
                   :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                   :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <span>
            <a-rate v-decorator="['evaluateResult']"
                    :tooltips="desc"
            />
            </span>
      </a-form-item>
      <a-form-model-item label="意见"  :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                         :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="evaluateOpinion">
        <a-textarea v-decorator="[
            'evaluateOpinion']" placeholder="请输入意见" />
      </a-form-model-item>


      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary" >提交</a-button>
<!--        <a-button style="margin-left: 8px" href	='../../QRCode/QRcode'>取消</a-button>-->
        <a-button type="primary" href="../../InsertReportingInformation/InsertReportingInformationDetail">去举报</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { httpAction, getAction } from '@/api/manage'
import pick from "lodash.pick";

export default {
  name: 'EvaluateForm',
  components: { AFormItem },
  data () {
    return {
      //value: 1,
      exeDept:'',//主管单位
      exeDeptId:'',
      windowsId:'',
      windowsName:'',//窗口服务大厅名称
      personId:'',
      personName:'',//被评价人姓名

      evaluateTime:'',
      evaluateResult: 0,
      desc: ['不满意', '基本满意', '满意', '非常满意', '完全满意'],
      // form
      form: this.$form.createForm(this),
      validatorRules: {
        evaluateName: {//name与v-decorator中属性对应
          rules: [
            { required:true,pattern: /^([\u4e00-\u9fa5]){2,13}$/, message: '请输入2-13位的中文姓名!'},//此处配置正则表达式
          ]
        },
        evaluatePhone: {//name与v-decorator中属性对应
          rules: [
            { required:true,pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},//此处配置正则表达式，手机号，可自己配置正则表达式
          ]
        },
      },
      url: {
        add: "/smartEvaluateList/smartEvaluateWindow/add",
      }
    }

  },


  created() {
    this.$nextTick(()=>{
      /*
      *内部直接获取刷新，可在次之外添加判断personName是否为空，目前尝试后发现或许暂时只能这样获取：personName:this.getUrlKey("personName,//被评价人姓名})
      */
      this.form.setFieldsValue({
        windowsId:this.getUrlKey("windowsId"),
        exeDeptId:this.getUrlKey("exeDeptId"),
        exeDept:this.getUrlKey("exeDept"),//主管单位
        windowsName:this.getUrlKey("windowsName"),//窗口服务大厅名称
        personId:this.getUrlKey("personId"),
        personName:this.getUrlKey("personName"),//被评价人姓名
      })
    })
  },
  mounted () {
    this.nowTimes()
  },
  beforeDestroy () {
    this.clear()
  },

  methods: {
    //获取url参数
    getUrlKey: function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },

    //动态时钟
    timeFormate (timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
      let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
      let mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
      let ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()
      //let week = new Date(timeStamp).getDay()
      //let weeks = ['日', '一', '二', '三', '四', '五', '六']
      //let getWeek = '星期' + weeks[week]
      this.evaluateTime = year + '-' + month + '-' + date  + ' ' + hh + ':' + mm + ':' + ss
    }, // 实时刷新当前时间，格式化
    nowTimes () {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 1000)
      this.clear()
      this.form.setFieldsValue({
        evaluateTime:this.evaluateTime
      })
    },
    clear () {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },
    //评价分数
    getGrade(evaluateResult){
      let that = this
      if(evaluateResult == 1){
        that.form.setFieldsValue({
          evaluateResult:2
        })
      }else if(evaluateResult == 2){
        that.form.setFieldsValue({
          evaluateResult:4})
      }else if(evaluateResult == 3){
        that.form.setFieldsValue({
          evaluateResult:6})
      }else if(evaluateResult == 4){
        that.form.setFieldsValue({
          evaluateResult:8})
      }else if(evaluateResult == 5){
        that.form.setFieldsValue({
          evaluateResult:10})
      }
    },


    // handler
    handleSubmit (e) {
      let that = this
      console.log(that.form.getFieldValue('evaluateResult'))
      that.$nextTick(()=>{
          that.getGrade(that.form.getFieldValue('evaluateResult'))
        })
      console.log(that.form.getFieldValue('evaluateResult'))
      e.preventDefault()
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let httpurl = '';
          let method = '';
          httpurl+=that.url.add;
          method = 'post';
          httpAction(httpurl,values,method).then((res)=>{
            console.log(res)
            if(res.success){
              that.$message.success(res.message);
              //that.$emit('ok');
              that.$router.push({path: '/webview/success'});
            }else{
              that.$message.warning(res.message);
            }
          })
        }
      })

      this.$nextTick(() => {
        that.form.setFieldsValue({
          evaluateResult:0
        })
      })
    }
  }
}
</script>