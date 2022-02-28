<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleId">
              <select-user-by-dep v-model="model.peopleId" @info="getPerson" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportSex">
              <j-dict-select-tag
                type="list"
                v-model="model.reportSex"
                dictCode="sex"
                placeholder="请选择性别"
                readOnly
                unselectable="on"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportAge">
              <a-input-number v-model="model.reportAge" placeholder="请输入年龄" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="politics">
              <j-dict-select-tag
                type="list"
                v-model="model.politics"
                dictCode="political_status"
                placeholder="请选择政治面貌"
                readOnly
                unselectable="on"
              />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="12">-->
<!--            <a-form-model-item label="工作单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departId">-->
<!--              <a-input v-model="model.departId" placeholder="请输入工作单位"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="12">
            <a-form-model-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zhiwu">
              <j-dict-select-tag
                type="list"
                v-model="model.zhiwu"
                dictCode="sys_position,name,code"
                placeholder="请选择职务"
                readOnly
                unselectable="on"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="职级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zhiji">
              <j-dict-select-tag
                type="list"
                v-model="model.zhiji"
                dictCode="position_rank"
                placeholder="请选择职级"
                readOnly
                unselectable="on"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入联系电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="逝世人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="theDeadName">
              <a-input v-model="model.theDeadName" placeholder="请输入逝世人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="与本人关系" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="relation">
              <a-input v-model="model.relation" placeholder="请输入与本人关系"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="葬礼时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="funeralTime">
              <j-date placeholder="请选择葬礼时间" v-model="model.funeralTime"   :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="葬礼地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="funeralAddress">
              <a-input v-model="model.funeralAddress" placeholder="请输入葬礼地点"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="宴请人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleAccount">
              <a-input-number v-model="model.peopleAccount" placeholder="请输入宴请人数"  style="width: 100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="宴请场所名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groundName">
              <a-input v-model="model.groundName" placeholder="请输入宴请场所名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="宴请场所地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入宴请场所地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="宴请人员范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="peopleType">
              <a-input v-model="model.peopleType" placeholder="请输入宴请人员范围"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="葬礼用车数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="carAccount">
              <a-input-number v-model="model.carAccount" placeholder="请输入葬礼用车数量" style="width: 100%" ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="其中公车数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicCarAccount">
              <a-input-number v-model="model.publicCarAccount" placeholder="请输入其中公车数量" style="width: 100%" ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="不符合规定礼金" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unusualMoney">
              <a-input-number v-model="model.unusualMoney" placeholder="请输入不符合规定收受礼金（元）" style="width: 100%" ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="不合规定礼品数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unusualCount">
              <a-input-number v-model="model.unusualCount" placeholder="请输入不符合规定收受礼品件数" style="width: 100%" ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="违规处置情况" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishContent">
              <a-input v-model="model.punishContent" placeholder="请输入违规收受礼金礼品处置情况"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="其他违规情况" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isElse">
              <a-input v-model="model.isElse" placeholder="请输入有否其他违规情况"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="其他需要说明事项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="elseState">
              <a-input v-model="model.elseState" placeholder="请输入其他需要说明事项"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="报备时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTime">
              <j-date placeholder="请选择报备时间"  v-model="model.reportTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="files">
              <a-button icon="camera" v-on:click="imgClick()">手机拍照</a-button>
              <a-button icon="camera" @click="eloamScan">高拍仪拍照</a-button>
              <input
                style="float: left; display: none"
                type="file"
                id="uploadFile"
                accept="image/*"
                capture="camera"
                v-on:change="readLocalFile()"
              />
              <j-upload v-model="model.files" :biz-path="bizPath"  ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <eloam-modal ref="modalForm" @ok='scanOk'></eloam-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'
  import EloamModal from '@views/eloam/modules/EloamModal'

  export default {
    name: 'SmartPostFuneralReportForm',
    components: {
      SelectUserByDep,
      EloamModal
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
           peopleId: [
              { required: true, message: '请输入报备人ID!'},
           ],
           theDeadName: [
              { required: true, message: '请输入逝世人姓名!'},
           ],
           relation: [
              { required: true, message: '请输入与本人关系!'},
           ],
           funeralTime: [
              { required: true, message: '请输入葬礼时间!'},
           ],
           funeralAddress: [
              { required: true, message: '请输入葬礼地点!'},
           ],
           peopleAccount: [
              { required: true, message: '请输入宴请人数!'},
           ],
           groundName: [
              { required: true, message: '请输入宴请场所名称!'},
           ],
           address: [
              { required: true, message: '请输入宴请场所地址!'},
           ],
           peopleType: [
              { required: true, message: '请输入宴请人员范围!'},
           ],
           carAccount: [
              { required: true, message: '请输入葬礼用车数量!'},
           ],
           publicCarAccount: [
              { required: true, message: '请输入其中公车数量!'},
           ],
           unusualMoney: [
              { required: true, message: '请输入不符合规定收受礼金（元）!'},
           ],
           unusualCount: [
              { required: true, message: '请输入不符合规定收受礼品件数!'},
           ],
           punishContent: [
              { required: true, message: '请输入违规收受礼金礼品处置情况!'},
           ],
           isElse: [
              { required: true, message: '请输入有否其他违规情况!'},
           ],
           reportTime: [
              { required: true, message: '请输入报备时间!'},
           ],
        },
        url: {
          add: "/smartPostFuneralReport/smartPostFuneralReport/add",
          edit: "/smartPostFuneralReport/smartPostFuneralReport/edit",
          queryById: "/smartPostFuneralReport/smartPostFuneralReport/queryById"
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
      eloamScan() {
        this.$refs.modalForm.open()
      },
      scanOk(url) {
        let image = url
        if (image) {
          let arr = []
          if (this.model.files) {
            arr.push(this.model.files)
          }
          arr.push(image)
          // 更新表单中文件url字段, files 为字段名称
          this.$set(this.model, 'files', arr.join())
        }
      },
      //图片click
      imgClick: function () {
        document.getElementById('uploadFile').click()
      },
      //点击选中图片
      readLocalFile: function () {
        var localFile = document.getElementById('uploadFile').files[0]
        console.log(localFile.name)
        this.getBase64(localFile).then((res) => {
          console.log('----------------' + res + '-----------')
          let formData = new FormData()
          formData.append('biz', this.bizPath)
          formData.append('file', this.dataURLtoFileFun(res, localFile.name))
          uploadFile(formData).then((res) => {
            console.log(res)
            if (res.success) {
              let arr = []
              if (this.model.files) {
                arr.push(this.model.files)
              }
              arr.push(res.message)
              // 更新上传文件列表
              this.$set(this.model, 'files', arr.join())
            }
          })
        })
      },
      dataURLtoFileFun(dataurl, filename) {
        // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      },
      getBase64(file) {
        return new Promise(function (resolve, reject) {
          let reader = new FileReader()
          let imgResult = ''
          reader.readAsDataURL(file)
          reader.onload = function () {
            imgResult = reader.result
          }
          reader.onerror = function (error) {
            reject(error)
          }
          reader.onloadend = function () {
            resolve(imgResult)
          }
        })
      },
      getPerson(back) {
        let that = this
        console.log(back)
        that.model.peopleId = back[0].id
        // that.model.name = back[0].realname
        that.model.reportSex = back[0].sex
        // that.model.reportAge = back[0].age
        that.model.zhiwu = back[0].post_dictText
        that.model.zhiji = back[0].positionRank_dictText
        that.model.politics = back[0].politicalStatus_dictText
        that.model.phone = back[0].phone

        let birth = back[0].birthday
        if(birth == "undefined" || birth == null || birth == ""){
          // that.model.reportAge = 0
        }else{
          that.model.reportAge = that.$options.methods.ages(birth.slice(0, 11))
        }

        //工作单位文本
        // alert( back[0].orgCodeTxt)
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