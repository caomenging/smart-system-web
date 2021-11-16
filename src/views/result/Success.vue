<template>
  <a-card :bordered="false">
    <my-result :is-success="true" :description="description" :title="title">

    </my-result>
    <div class="prompt_text" style="text-align: center"><span id="num">{{count}}</span>秒后自动跳转</div>
  </a-card>
</template>

<script>
  import MyResult from './MyResult'
  import { mixinDevice } from '@/utils/mixin.js'

  const directionType = {
    horizontal: 'horizontal',
    vertical: 'vertical'
  }

  export default {
    name: "Success",
    components: {
      MyResult
    },
    mixins: [mixinDevice],
    data () {
      return {
        count:"",//倒计时
        title: '提交成功',
        description: '感谢您的填写！' ,
        directionType
      }
    },
    created (){
      this.goGrdoupRecor()
    },
    methods: {
//  3秒后跳转页面
      goGrdoupRecor(){
        const TIME_COUNT = 3;
        if(!this.timer){
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(()=>{
            if(this.count > 0 && this.count <= TIME_COUNT){
              this.count--;
            }else{
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              //跳转的页面写在此处
              this.$router.push({path: '/QRCodesame/QRcodesame'});
            }
          },1000)
        }
      },
    }

  }
</script>

<style scoped>

</style>
