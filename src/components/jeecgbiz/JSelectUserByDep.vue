<template>
  <div>
    <a-input-search
      v-model="textVals"
      placeholder="请选择人员"
      readOnly
      unselectable="on"
      @search="onSearchDepUser">
      <a-button slot="enterButton" :disabled="disabled">选择人员</a-button>
    </a-input-search>
    <j-select-user-by-dep-modal
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
  import JSelectUserByDepModal from './modal/JSelectUserByDepModal'
  // 下划线转换驼峰
  import { underLinetoHump } from '@/components/_util/StringUtil'

  export default {
    name: 'JSelectUserByDep',
    components: {JSelectUserByDepModal},
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
    },
    data() {
      return {
        storeVals: '', //[key values]
        textVals: '', //[label values]
      }
    },
    computed:{
      storeField(){
        /*let field = this.customReturnField
        if(!field){
          field = this.store;
        }*/
        return underLinetoHump(this.store)
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
            let info = []
            for(let i=0;i<arr1.length;i++){
              info.push({
                value: arr1[i],
                text: arr2[i]
              })
            }
            console.log(info)
            this.$emit('back', info)
          }
        }
      },
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows) {
        let that = this
        console.log("当前选中用户", rows)
        if (!rows) {
          that.storeVals = ''
          that.textVals = ''
        } else {
          let temp1 = []
          let temp2 = []
          for (let item of rows) {
            temp1.push(item[that.storeField])
            temp2.push(item[that.textField])
          }
          that.storeVals = temp1.join(',')//存储值
          that.textVals = temp2.join(',')//显示值
        }
        console.log(that.store)
        console.log(that.storeVals)
        //子组件使用this.$emit()向父组件传值
        that.$emit("change", this.storeVals)
      }
    }
  }
</script>

<style scoped>

</style>