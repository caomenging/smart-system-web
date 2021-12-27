<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
    <a-col :xl="6" :lg="7" :md="8" :sm="24" >
      <a-card>
      <a-statistic title="今日待审核" :value="value1" :style="{fontSize:'14px'}" :width="80" height="30"/>
      </a-card>
    </a-col>
      <a-col :xl="6" :lg="7" :md="8" :sm="24">
        <a-card>
          <a-statistic title="今日未通过" :value="value2" :style="{fontSize:'14px'}" :width="80" height="30" />
        </a-card>
      </a-col>
      <a-col :xl="6" :lg="7" :md="8" :sm="24">
        <a-card>
          <a-statistic title="今日已审核" :value="value3" :style="{fontSize:'14px'}" :width="80" height="30" />
        </a-card>
      </a-col>
      <a-col :xl="6" :lg="7" :md="8" :sm="24">
        <a-card>
          <a-statistic title="今日已通过" :value="value4" :style="{fontSize:'14px'}" :width="80" height="30"/>
        </a-card>
      </a-col>
    </a-row>
    <a-tabs defaultActiveKey="1" @change="callback">
      <!-- 多列柱状图 -->
      <a-tab-pane tab="审核状况统计" key="1">
<!--        <a-col :span="10">
          <a-radio-group :value="pieType" @change="statisticst">
            <a-radio-button value="year">按年统计</a-radio-button>
            <a-radio-button value="month">按月统计</a-radio-button>
            <a-radio-button value="category">按类别统计</a-radio-button>
          </a-radio-group>
        </a-col>-->
        <bar-multid title="审核状况统计" class="statistic" :height="400" :dataSource="barDataSource" :fields="barFields"/>
      </a-tab-pane>
<!--      <a-tab-pane tab="审核状况统计" key="2">
        <a-row>
          <a-col :span="10">
            <a-radio-group :value="barType" @change="statisticst">
              <a-radio-button value="year">按年统计</a-radio-button>
              <a-radio-button value="month">按月统计</a-radio-button>
              <a-radio-button value="category">按类别统计</a-radio-button>
              <a-radio-button value="cabinet">按柜号统计</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="14">
            <a-form v-if="barType === 'month' && false" layout="inline" style="margin-top: -4px">
              <a-form-item label="月份区间">
                <a-range-picker
                  :placeholder="['开始月份', '结束月份']"
                  format="YYYY-MM"
                  :value="barValue"
                  :mode="barDate"
                  @panelChange="handleBarDate"/>
              </a-form-item>
              <a-button style="margin-top: 2px" type="primary" icon="search" @click="queryDatebar">查询</a-button>
              <a-button style="margin-top: 2px;margin-left: 8px" type="primary" icon="reload" @click="searchReset">重置</a-button>
            </a-form>
          </a-col>
          <bar class="statistic" title="档案统计" :dataSource="countSource" :height="400"/>
        </a-row>
      </a-tab-pane>-->
      <a-tab-pane tab="开展状况" key="3">
        <a-row :gutter="24">
<!--          <a-col :span="10">
            <a-radio-group :value="pieType" @change="statisticst">
              <a-radio-button value="year">按年统计</a-radio-button>
              <a-radio-button value="month">按月统计</a-radio-button>
              <a-radio-button value="category">按类别统计</a-radio-button>
              <a-radio-button value="cabinet">按柜号统计</a-radio-button>
            </a-radio-group>
          </a-col>-->
          <a-col :span="14">
            <a-form v-if="pieType === 'month' && false" layout="inline" style="margin-top: -4px">
              <a-row :gutter="24">
                <a-form-item label="月份区间">
                  <a-range-picker
                    :placeholder="['开始月份', '结束月份']"
                    format="YYYY-MM"
                    :value="pieValue"
                    :mode="pieDate"
                    @panelChange="handlePieDate"/>
                </a-form-item>
                <a-button style="margin-top: 2px" type="primary" icon="search" @click="queryDatepie">查询</a-button>
                <a-button style="margin-top: 2px;margin-left: 8px" type="primary" icon="reload" @click="searchReset">重置</a-button>
              </a-row>
            </a-form>
          </a-col>
          <pie class="statistic" title="开展状况" :dataSource="countSource" :height="450"/>
        </a-row>
      </a-tab-pane>
    </a-tabs>

  </a-card>
</template>

<script>
import Bar from '@/components/chart/Bar'
import Pie from '@/components/chart/Pie'
import ACol from 'ant-design-vue/es/grid/Col'
import { getAction } from '@/api/manage'
import BarMultid from '@/components/chart/BarMultid'

export default {
  name: 'ArchivesStatisticst',
  components: {
    ACol,
    Bar,
    Pie,BarMultid
  },
  data() {
    return {
      description: '三重一大统计页面',
      // 查询条件
      queryParam: {},
      // 数据集
      countSource: [],
      barDataSource: [
          /*{ type: '未审核', '重大事项决策': 18.9, '重要干部任免': 28.8, '重要项目安排': 39.3, '大额资金使用': 81.4, '5月': 47, '6月': 20.3, '7月': 24, '8月': 35.6 },*/
          { type: '未通过', '重大事项决策': 12.4, '重要干部任免': 23.2, '重要项目安排': 34.5, '大额资金使用': 99.7 },
          /*{ type: '已审核', '重大事项决策': 18.9, '重要干部任免': 28.8, '重要项目安排': 39.3, '大额资金使用': 81.4, '5月': 47, '6月': 20.3, '7月': 24, '8月': 35.6 },*/
          { type: '已通过', '重大事项决策': 12.4, '重要干部任免': 23.2, '重要项目安排': 34.5, '大额资金使用': 99.7 }
        ],
      //barFields: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'],
      barFields:['重大事项决策','重要干部任免','重要项目安排','大额资金使用'],
      // 柱状图
      barType: 'year',
      barDate: ['month', 'month'],
      barValue: [],
      // 饼状图
      pieType: 'year',
      pieDate: ['month', 'month'],
      pieValue: [],
      // 统计图类型
      tabStatus:"bar",
      url: {
        getCurrentVerifyCount:"/smartTriImpOneGre/chart/countByVerifyStatus",
        getYearCountInfo: "/mock/api/report/getYearCountInfo",
        getMonthCountInfo:"/mock/api/report/getMonthCountInfo",
        getCntrNoCountInfo:"/mock/api/report/getCntrNoCountInfo",
        getCabinetCountInfo:"/mock/api/report/getCabinetCountInfo",
      },
    }
  },
  created() {
    let url = this.url.getCntrNoCountInfo;
    this.loadDate(url,'category',{});
  },
  methods: {
    loadVerifyCount(){
      let url  = this.url.getCurrentVerifyCount
      getAction(url).then((res)=>{
        if(res.success){

        }else{
        this.$message.warning("error")
        }
      })
    },
    loadDate(url,type,param) {
      getAction(url,param,'get').then((res) => {
        if (res.success) {
          this.countSource = [];
          if(type === 'year'){
            this.getYearCountSource(res.result);
          }
          if(type === 'month'){
            this.getMonthCountSource(res.result);
          }
          if(type === 'category'){
            this.getCategoryCountSource(res.result);
          }
          if(type === 'cabinet'){
            this.getCabinetCountSource(res.result);
          }
        }else{
          var that=this;
          that.$message.warning(res.message);
        }
      })
    },
    getYearCountSource(data){
      for (let i = 0; i < data.length; i++) {
        if(this.tabStatus === "bar"){
          this.countSource.push({
            x: `${data[i].year}年`,
            y: data[i].yearcount
          })
        }else{
          this.countSource.push({
            item: `${data[i].year}年`,
            count:data[i].yearcount
          })
        }
      }
    },
    getMonthCountSource(data){
      for (let i = 0; i < data.length; i++) {
        if(this.tabStatus === "bar"){
          this.countSource.push({
            x: data[i].month,
            y: data[i].monthcount
          })
        }else{
          this.countSource.push({
            item: data[i].month,
            count:data[i].monthcount
          })
        }
      }
    },
    getCategoryCountSource(data){
      for (let i = 0; i < data.length; i++) {
        if(this.tabStatus ==="bar"){
          this.countSource.push({
            x: data[i].classifyname,
            y: data[i].cntrnocount
          })
        }else{
          this.countSource.push({
            item: data[i].classifyname,
            count:data[i].cntrnocount
          })
        }
      }
    },
    getCabinetCountSource(data){
      for (let i = 0; i < data.length; i++) {
        if(this.tabStatus === "bar"){
          this.countSource.push({
            x: data[i].cabinetname,
            y: data[i].cabinetcocunt
          })
        }else{
          this.countSource.push({
            item: data[i].cabinetname,
            count:data[i].cabinetcocunt
          })
        }
      }
    },
    // 选择统计图类别
    callback(key) {
      if(key === "1"){
        this.tabStatus = "bar";
        this.queryDatebar();
      }else{
        this.tabStatus = "pie";
        this.queryDatepie();
      }
    },
    // 选择统计类别
    statisticst(e) {
      if(this.tabStatus === "pie"){
        this.pieType = e.target.value;
        this.queryDatepie();
      }else{
        this.barType = e.target.value;
        this.queryDatebar();
      }
    },
    // 按月份查询
    queryDatebar(){
      if(this.barValue.length>0){
        this.getUrl(this.barType,{startTime:this.barValue[0]._d,endTime:this.barValue[1]._d});
      }else{
        this.getUrl(this.barType,{});
      }
    },
    queryDatepie(){
      if(this.pieValue.length>0){
        this.getUrl(this.pieType,{startTime:this.pieValue[0]._d,endTime:this.pieValue[1]._d});
      }else{
        this.getUrl(this.pieType,{});
      }
    },
    searchReset(){
      console.log(this.tabStatus);
      if(this.tabStatus === "pie"){
        this.pieValue = [];
      }else{
        this.barValue = [];
      }
      this.getUrl(this.barType,{});
    },
    // 选择请求url
    getUrl(type,param){
      let url = "";
      if(type === 'year'){
        url = this.url.getYearCountInfo;
      }
      if(type === 'month'){
        url = this.url.getMonthCountInfo;
      }
      if(type === 'category'){
        url = this.url.getCntrNoCountInfo;
      }
      if(type === 'cabinet'){
        url = this.url.getCabinetCountInfo;
      }
      this.loadDate(url,type,param);
    },
    // 选择月份日期
    handleBarDate(value, mode) {
      this.barValue = value
      this.barDate = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
    },
    handlePieDate(value, mode) {
      this.pieValue = value
      this.pieDate = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
    },
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px
}

.ant-btn-danger {
  background-color: #ffffff
}

.ant-modal-cust-warp {
  height: 100%
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden
}

.statistic {
  padding: 0px !important;
  margin-top: 50px;
}

.statistic h4 {
  margin-bottom: 20px;
  text-align: center !important;
  font-size: 24px !important;;
}

.statistic #canvas_1 {
  width: 100% !important;
}
</style>