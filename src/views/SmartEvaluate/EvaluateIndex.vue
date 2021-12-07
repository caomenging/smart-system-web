<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="search">
        <a-row :gutter="24">
          <!--下拉搜索（可配置字典）：j-search-select-tag -->
          <a-col :md="6" :sm="8">
            <a-form-item label="年份" prop="year">
              <j-input placeholder="请输入年份" v-model="queryParam.year"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="search" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

      <line-chart-multid  :title="title" :dataSource="lineData" :fields ="lineField" :aliases="aliases" :height="height"/>

    <!-- 饼图 -->

      <!--<pie title="全区评价满意度比例图" :height="height" :dataSource="pieData"/>-->

<!--    <a-tabs defaultActiveKey="1">
      &lt;!&ndash; 柱状图 &ndash;&gt;
      <a-tab-pane tab="柱状图" key="1">
        <bar title="销售额排行" :dataSource="barData" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 多列柱状图 &ndash;&gt;
      <a-tab-pane tab="多列柱状图" key="2">
        <bar-multid title="多列柱状图" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 迷你柱状图 &ndash;&gt;
      <a-tab-pane tab="迷你柱状图" key="3">
        <mini-bar :dataSource="barData" :width="400" :height="200"/>
      </a-tab-pane>
      &lt;!&ndash; 面积图 &ndash;&gt;
      <a-tab-pane tab="面积图" key="4">
        <area-chart-ty title="销售额排行" :dataSource="areaData" x="月份" y="销售额" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 迷你面积图 &ndash;&gt;
      <a-tab-pane tab="迷你面积图" key="5">
        <div style="padding-top: 100px;width:600px;height:200px">
          <mini-area :dataSource="areaData" x="月份" y="销售额" :height="height"/>
        </div>
      </a-tab-pane>
      &lt;!&ndash; 多行折线图 &ndash;&gt;
      <a-tab-pane tab="多行折线图" key="6">
        <line-chart-multid title="多行折线图" :dataSource="lineData" :fields ="lineField" :aliases="aliases" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 饼图 &ndash;&gt;
      <a-tab-pane tab="饼图" key="7">
        <pie title="饼图" :height="height" :dataSource="pieData"/>
      </a-tab-pane>
      &lt;!&ndash; 雷达图 &ndash;&gt;
      <a-tab-pane tab="雷达图" key="8">
        <radar title="雷达图" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 仪表盘 &ndash;&gt;
      <a-tab-pane tab="仪表盘" key="9">
        <dash-chart-demo title="仪表盘" :value="9" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; 进度条 &ndash;&gt;
      <a-tab-pane tab="进度条" key="10">
        <mini-progress :percentage="30" :target="40" :height="30"/>
        <mini-progress :percentage="51" :target="60" :height="30" color="#FFA500"/>
        <mini-progress :percentage="66" :target="80" :height="30" color="#1E90FF"/>
        <mini-progress :percentage="74" :target="70" :height="30" color="#FF4500"/>
        <mini-progress :percentage="92" :target="100" :height="30" color="#49CC49"/>
      </a-tab-pane>
      &lt;!&ndash; 排名列表 &ndash;&gt;
      <a-tab-pane tab="排名列表" key="11">
        <rank-list title="门店销售排行榜" :list="rankList" style="width: 600px;margin: 0 auto;"/>
      </a-tab-pane>
      &lt;!&ndash; TransferBar &ndash;&gt;
      <a-tab-pane tab="TransferBar" key="12">
        <transfer-bar title="年度消耗流量一览表" :data="barData" x="月份" y="流量(Mb)" :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; Trend &ndash;&gt;
      <a-tab-pane tab="Trend" key="13">
        <trend title="Trend" term="Trend：" :percentage="30"/>
      </a-tab-pane>
      &lt;!&ndash; Liquid &ndash;&gt;
      <a-tab-pane tab="Liquid" key="14">
        <liquid :height="height"/>
      </a-tab-pane>
      &lt;!&ndash; BarAndLine &ndash;&gt;
      <a-tab-pane tab="BarAndLine" key="15">
        <bar-and-line :height="height"/>
      </a-tab-pane>
    </a-tabs>-->
  </a-card>
</template>

<script>
  import AreaChartTy from '@/components/chart/AreaChartTy'
  import Bar from '@/components/chart/Bar'
  import BarMultid from '@/components/chart/BarMultid'
  import DashChartDemo from '@/components/chart/DashChartDemo'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import Liquid from '@/components/chart/Liquid'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniArea from '@/components/chart/MiniArea'
  import MiniProgress from '@/components/chart/MiniProgress'
  import Pie from '@/components/chart/Pie'
  import Radar from '@/components/chart/Radar'
  import RankList from '@/components/chart/RankList'
  import TransferBar from '@/components/chart/TransferBar'
  import Trend from '@/components/chart/Trend'
  import BarAndLine from '@/components/chart/BarAndLine'
  import { httpAction,putAction, postAction,getAction } from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: 'ViserChartDemo',
    mixins: [JeecgListMixin],
    components: {
      Bar, MiniBar, BarMultid, AreaChartTy, LineChartMultid,
      Pie, Radar, DashChartDemo, MiniProgress, RankList,
      TransferBar, Trend, Liquid, MiniArea, BarAndLine
    },
    data() {
      return {
        queryParam:{year:''},
        title:'',
        height: 420,
        rankList: [],
        barData: [],
        areaData: [],
        //折线图
        lineData:[],
        lineField:['count'],
        aliases:[{field:'count',alias:'评价次数'}],
        //饼图
        pieData:[]
      }
    },
    created() {
      setTimeout(() => {
        this.loadBarData()
        this.loadAreaData()
        this.loadRankListData()
        this.getLineTitle()
        this.loadLineData()
        this.loadPieData()
      }, 100)
    },
    methods: {
      getLineTitle(){
        if(this.queryParam.year ===''){
          let currentYear = new Date().getFullYear();
          this.title = currentYear+"年全区评价次数统计图"
        }else {
          let len =(this.queryParam.year).length
          this.title = this.queryParam.year.substr(1,len-2)+"年全区评价次数统计图"
        }
      },
      loadData(x, y, max, min, before = '', after = '月') {
        let data = []
        for (let i = 0; i < 12; i += 1) {
          data.push({
            [x]: `${before}${i + 1}${after}`,
            [y]: Math.floor(Math.random() * max) + min
          })
        }
        return data
      },
      //加载折线图数据
      loadLineData(){
        let year = this.queryParam.year
        this.getLineTitle()
        let url =  "/smartEvaluateList/chart/countByMonth"+"?year="+year;
        //console.log(url)
        getAction(url).then((res)=>{
            if(res.success){
              console.log(this.lineData)
              let result = res.result
              let l = result.length
                let i=1;
                let monthArray= ['1','2','3','4','5','6','7','8','9','10','11','12'];
                console.log(result.length,result)
              if(result.length != 0){
                for(i=0;i<12;i++){
                  if(result[i].month != monthArray[i] ){
                    console.log(i,monthArray[i],result[i].month)
                    let item ={month:monthArray[i],count:0}
                    result.splice(i,0,item)
                  }else {
                    console.log(result.length,i+l)
                    let item ={month:monthArray[i+1],count:0}
                    if(result.length< 12 ){
                      result.splice(i+1,0,item)
                    }else if(result.length !=12){
                      result.push(item)
                    }
                  }
                }
              }else{
                for(i=0;i<12;i++){
                    console.log(monthArray[i])
                    this.lineData = []
                    let item ={month:monthArray[i],count:0}
                    result.splice(i,0,item)
                }
              }
              console.log(result)
              result.forEach((c)=>{
                let monthData = c.month+'月'
                console.log(this.lineData)
                this.lineData.push({type:monthData,count:c.count})
              })
              console.log(this.lineData)

            }
            else{
              this.$message.warning("系统错误!")
            }
          }
        )
      },
      search(){
        this.lineData=[]
        this.loadLineData();
      },
      loadPieData(){
        getAction("/smartEvaluateList/chart/countByGrade").then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            for (let i = 0; i < data.length; i++) {
              this.pieData.push({
                item: data[i].grade,
                count:data[i].value
              })
            }
          } else{
            this.$message.warning("系统错误!")
          }
        })
      },
      // 加载柱状图数据
      loadBarData() {
        this.barData = this.loadData('x', 'y', 1000, 200)
      },
      // 加载AreaChartTy的数据
      loadAreaData() {
        this.areaData = this.loadData('x', 'y', 500, 100)
      },
      loadRankListData() {
        this.rankList = this.loadData('name', 'total', 2000, 100, '北京朝阳 ', ' 号店')
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less'
</style>
