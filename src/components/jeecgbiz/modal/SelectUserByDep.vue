<template>
  <div>
    <a-input-search
      v-model="textVals"
      placeholder="请选择人员"
      readOnly
      unselectable="on"
      @search="onSearchDepUser"
      :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-button slot="enterButton" :disabled="disabled">选择人员</a-button>
    </a-input-search>
    <select-user-by-dep-modal
      ref="selectModal"
      :modal-width="modalWidth"
      :multi="multi"
      @ok="selectOK"
      :user-ids="value"
      :store="storeField"
      :text="textField"
      @initComp="initComp"
    />
  </div>
</template>

<script>
  import SelectUserByDepModal from '@/components/jeecgbiz/modal/SelectUserByDepModal'
  // 下划线转换驼峰
  import { underLinetoHump } from '@/components/_util/StringUtil'
  import DictDeleteList from '../../../views/system/DictDeleteList'
  import AFormModelItem from 'ant-design-vue/es/form-model/FormItem'

  export default {
    name: 'SelectUserByDep',
    components: { AFormModelItem, DictDeleteList, SelectUserByDepModal},
    props: {
      modalWidth: {
        type: Number,
        default: 1250,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      multi: {
        type: Boolean,
        default: true,
        required: false
      },
      backUser: {
        type: Boolean,
        default: false,
        required: false
      },
      // 存储字段 [key field]
      store: {
        type: String,
        default: 'id',
        required: false
      },
      // 显示字段 [label field]
      text: {
        type: String,
        default: 'realname',
        required: false
      },
      info: {
        type: Object,
        default: '',
        required: false
      }
    },
    data() {
      return {
        storeVals: '', //[key values]
        textVals: '', //[label values]
        info:'',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
      }
    },
    computed:{
      storeField(){
        let field = this.customReturnField
        if(!field){
          field = this.store;
        }
        return underLinetoHump(field)
      },
      textField(){
        return underLinetoHump(this.text)
      }
    },
    mounted() {
      this.storeVals = this.value
    },
    watch: {
      value(val) {
        this.storeVals = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(textVals) {
        this.textVals = textVals
      },
      //返回选中的用户信息
      backDeparInfo(){
        if(this.backUser===true){
          if(this.storeVals && this.storeVals.length>0){
            let arr1 = this.storeVals.split(',')
            let arr2 = this.textVals.split(',')
            let result = []
            for(let i=0;i<arr1.length;i++){
              result.push({
                value: arr1[i],
                text: arr2[i]
              })
            }
            this.$emit('back', result)
          }
        }
      },
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows) {
        // console.log("当前选中用户", rows)
        // if (!rows) {
        //   this.storeVals = ''
        //   this.textVals = ''
        // } else {
        //   let temp1 = []
        //   let temp2 = []
        //   let info=[]
        //   for (let item of rows) {
        //     temp1.push(item[this.storeField])
        //     temp2.push(item[this.textField])
        //     info.push(item)
        //   }
        //   this.storeVals = temp1.join(',')//存储值
        //   this.textVals = temp2.join(',')//显示值
        //   this.info = info
        // }
        //子组件使用this.$emit()向父组件传值
        this.$emit("info",rows)
        // this.$emit("change", this.storeVals)
      }
    }
  }
</script>

<style scoped>

</style>