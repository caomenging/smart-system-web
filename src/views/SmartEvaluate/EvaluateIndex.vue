<template>
  <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
    <div class="salesCard">
      <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
        <div class="extra-wrapper" slot="tabBarExtraContent">
         <!-- <a-range-picker :style="{width: '256px'}" />-->
          <div class="extra-item">
          <j-input placeholder="请输入年份" v-model="queryParam.year" width="60%"/>
          </div>
         <a-button type="primary" @click="search" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>
        <a-tab-pane  :tab="title" key="1">
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <line-chart-multid   :dataSource="lineData" :fields ="lineField" :aliases="aliases" :height="height"/>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list :title="rankCountTitle" :list="rankCountData"/>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane :tab="pieTitle" key="2">
          <a-row >
            <span :style="{marginLeft: '120px',marginTop: '-50px',paddingTop:'-50px'}">评价标准：完全满意-10、非常满意-8、基本满意-6、不满意-4、非常不满意-2</span>
          </a-row>
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <pie title="全区评价满意度比例图" :height="height" :dataSource="pieData"/>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list :title="rankGradeTitle" :list="rankGradeData"/>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
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

  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"



  export default {
    name: 'EvaluateIndex',
    mixins: [JeecgListMixin],
    components: {
      Bar, MiniBar, BarMultid, AreaChartTy, LineChartMultid,
      Pie, Radar, DashChartDemo, MiniProgress, RankList,
      TransferBar, Trend, Liquid, MiniArea, BarAndLine,
      ACol, ChartCard,
    },
    data() {
      return {
        queryParam: { year: '' },
        title: '',
        pieTitle:'',
        rankCountTitle:'',
        rankGradeTitle:'',
        height: 420,
        rankList: [],
        barData: [],
        areaData: [],
        //折线图
        lineData: [],
        lineField: ['count'],
        aliases: [{ field: 'count', alias: '评价次数' }],
        //饼图
        pieData: [],
        //排行榜
        rankCountData:[],
        rankGradeData:[]
      }
    },
    created() {
      setTimeout(() => {
        this.loadBarData()
        this.loadAreaData()
        this.loadRankListData()
        this.getTitle()
        this.loadLineData()
        this.loadPieData()
        this.loadRankCountData();
        this.loadRankGradeData();
      }, 100)

    },
    methods: {
      getTitle(){
        if(this.queryParam.year ===''){
          let currentYear = new Date().getFullYear();
          this.title = currentYear+"年道里区窗口评价参与度"
          this.pieTitle = currentYear +"年道里区窗口服务满意度"
          this.rankCountTitle = currentYear + "年道里区窗口服务大厅评价参与度排行榜"
          this.rankGradeTitle = currentYear + "年道里区窗口服务大厅评分排行榜"
        }else {
          let len =(this.queryParam.year).length
          this.title = this.queryParam.year.substr(1,len-2)+"年道里区窗口评价参与度"
          this.pieTitle = this.queryParam.year.substr(1,len-2) +"道里区窗口服务满意度"
          this.rankCountTitle = this.queryParam.year.substr(1,len-2) + "年道里区窗口服务大厅评价参与度排行榜"
          this.rankGradeTitle = this.queryParam.year.substr(1,len-2) + "年道里区窗口服务大厅评分排行榜"
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
        let url =  "/smartEvaluateList/chart/countByMonth"+"?year="+year;
        //console.log(url)
        getAction(url).then((res)=>{
            if(res.success){
              let result = res.result
              let l = result.length
                let i=1;
                let monthArray= ['1','2','3','4','5','6','7','8','9','10','11','12'];
                //console.log(result.length,result)
              if(result.length != 0){
                for(i=0;i<12;i++){
                  if(result[i].month != monthArray[i] ){
                    //console.log(i,monthArray[i],result[i].month)
                    let item ={month:monthArray[i],count:0}
                    result.splice(i,0,item)
                  }else {
                    //console.log(result.length,i+l)
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
              //console.log(result)
              result.forEach((c)=>{
                let monthData = c.month+'月'
                //console.log(this.lineData)
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
      //搜索
      search(){
        this.lineData=[]
        this.pieData = []
        this.rankCountData =[]
        this.rankGradeData =[]
        this.getTitle()
        this.loadLineData();
        this.loadPieData();
        this.loadRankCountData();
        this.loadRankGradeData();
      },
      searchReset(){
        this.queryParam.year = ''
        this.search()
      },
      //饼图
      loadPieData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/countByGrade"+"?year="+year;
        getAction(url).then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            for (let i = 0; i < data.length; i++) {
              this.pieData.push({
                item: data[i].keyName,
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
      },
      //评价次数排行榜
      loadRankCountData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/windowsRankByCount"+"?year="+year;
        getAction(url).then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            for (let i = 0; i < data.length; i++) {
              this.rankCountData.push({
                name: data[i].keyName,
                total:data[i].value
              })
            }
          } else{
            this.$message.warning("系统错误!")
          }
        })
      },
    //满意度排行榜
      loadRankGradeData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/windowsRankByGrade"+"?year="+year;
        getAction(url).then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            for (let i = 0; i < data.length; i++) {
              this.rankGradeData.push({
                name: data[i].keyName,
                total:data[i].value
              })
            }
          } else{
            this.$message.warning("系统错误!")
          }
        })
      },
    }
  }
</script>



<style  scoped>
  @import '~@assets/less/common.less'
</style>
<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>
