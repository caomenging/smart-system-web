<template>
  <a-card :bordered="false">
    <my-result :is-success="true" :description="description" :title="title">

    </my-result>
    <div class="prompt_text" style="text-align: center"><span id="num">{{count}}</span>秒后自动跳转</div>
  </a-card>
</template>

<script>
  import MyResult from '../result/MyResult'
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
        fromRoute:'',
        count:"",//倒计时
        title: '提交成功',
        description: '感谢您的填写！' ,
        directionType
      }
    },
    created (){
      this.fromRoute = this.$route.query.fromRoute
      console.log(this.fromRoute)
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
              let r = this.fromRoute
              console.log(r)
              if(r === '/myTriPrePlusSurvey'){
               window.location.href="about:blank";
               window.close();
               window.opener.location.reload();
              }
              else if( r === '/myTriPrePlusAppSurvey'){
                this.$router.push({
                  path: '/SmartTriSurveyAppList'
                });
              }
              else {
                this.$router.push({
                  path: '../InsertReportingInformation/InsertReportingInformationDetail'
                });
              }

            }
          },1000)
        }
      },
    }

  }
</script>

<style scoped>

</style>
