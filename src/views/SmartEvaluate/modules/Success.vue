<template>
  <a-card :bordered="false">
    <my-result :is-success="true" :description="description" :title="title">
      <!--<template slot="action">
        <a-button type="primary">返回列表</a-button>
        <a-button style="margin-left: 8px">查看项目</a-button>
        <a-button style="margin-left: 8px">打印</a-button>
      </template>-->
     <!-- <div>
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;">项目名称</div>
        <a-row style="margin-bottom: 16px">
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">项目 ID：</span>
            20180724089
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">负责人：</span>
            曲丽丽是谁？
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <span style="color: rgba(0, 0, 0, 0.85)">生效时间：</span>
            2016-12-12 ~ 2017-12-12
          </a-col>
        </a-row>
        <a-steps :current="1" :direction="isMobile() && directionType.vertical || directionType.horizontal" progressDot>
          <a-step >
            <span style="font-size: 14px" slot="title">创建项目</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >
                <div style="margin: 8px 0 4px">
                  曲丽丽
                  <a-icon style="margin-left: 8px" type="dingding-o" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </a-step>
          <a-step title="部门初审">
            <span style="font-size: 14px" slot="title">部门初审</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >
                <div style="margin: 8px 0 4px">
                  周毛毛
                  <a-icon style="margin-left: 8px; color: #00A0E9" type="dingding-o" />
                </div>
                <div><a href="">催一下</a></div>
              </div>
            </template>
          </a-step>
          <a-step title="财务复核">
            <span style="font-size: 14px" slot="title">财务复核</span>
          </a-step>
          <a-step title="完成" >
            <span style="font-size: 14px" slot="title">完成</span>
          </a-step>
        </a-steps>
      </div>-->
    </my-result>
    <div class="prompt_text" style="text-align: center"><span id="num">{{count}}</span>秒后自动跳转</div>
  </a-card>
</template>

<script>
  import MyResult from '../../result/MyResult'
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
        description: '感谢您的评价！' ,
        directionType
      }
    },
    created (){
      this.goGrdoupRecor()
    },
    methods: {
//  3秒后跳转评廉首页
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
              this.$router.push({path: '/webview/sun/statistics'});
            }
          },1000)
        }
      },
    }

  }
</script>

<style scoped>

</style>