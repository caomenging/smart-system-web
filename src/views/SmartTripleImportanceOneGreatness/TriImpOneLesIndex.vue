<template>
  <div>
  <a-card :bordered="false">
<!--    <a-row :gutter="24">
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
    </a-row>-->
    <a-tabs defaultActiveKey="1" @change="callback">
      <!-- 多列柱状图 -->
      <a-tab-pane  tab="审核状况统计" key="1">
        <h3>{{barTitle}}</h3>
<!--        <a-col :span="10">
          <a-radio-group :value="pieType" @change="statisticst">
            <a-radio-button value="year">按年统计</a-radio-button>
            <a-radio-button value="month">按月统计</a-radio-button>
            <a-radio-button value="category">按类别统计</a-radio-button>
          </a-radio-group>
        </a-col>-->
        <a-row :gutter="24">
        <a-col :span="20">
          <a-form layout="inline" :style="{marginTop: '-40px',marginLeft:'150px'}" >
            <a-row :gutter="24">
              <a-form-item label="月份">
                <a-date-picker
                  format="YYYY-MM"
                  v-model="queryParam.barDate"
                  mode="month"
                  :open="barOpen"
                  @openChange="openBarChange"
                  @panelChange="panelBarChange"
                  @change="handleBarChange"
                />
              </a-form-item>
              <a-button style="margin-top: 2px" type="primary" icon="search" @click="queryDatebar">查询</a-button>
              <a-button style="margin-top: 2px;margin-left: 8px" type="primary" icon="reload" @click="searchBarReset">重置</a-button>
            </a-row>
          </a-form>
        </a-col>
        <bar-multid  class="statistic" :height="400" :dataSource="barDataSource" :fields="barFields"/>
        </a-row>
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
      <a-tab-pane tab="开展状况" key="2">
        <h3>{{pieTitle}}</h3>
        <a-row :gutter="24">
<!--          <a-col :span="10">
            <a-radio-group :value="pieType" @change="statisticst">
              <a-radio-button value="year">按年统计</a-radio-button>
              <a-radio-button value="month">按月统计</a-radio-button>
              <a-radio-button value="category">按类别统计</a-radio-button>
              <a-radio-button value="cabinet">按柜号统计</a-radio-button>
            </a-radio-group>
          </a-col>-->
          <a-col :span="20">
            <a-form layout="inline" :style="{marginTop: '-40px',marginLeft:'150px'}" >
              <a-row :gutter="24">
                <a-form-item label="月份">
                  <a-date-picker
                    format="YYYY-MM"
                    v-model="queryParam.barDate"
                    mode="month"
                    :open="pieOpen"
                    @openChange="openPieChange"
                    @panelChange="panelPieChange"
                    @change="handlePieChange"
                  />
                </a-form-item>
                <a-button style="margin-top: 2px" type="primary" icon="search" @click="queryDatepie">查询</a-button>
                <a-button style="margin-top: 2px;margin-left: 8px" type="primary" icon="reload" @click="searchReset">重置</a-button>
              </a-row>
            </a-form>
          </a-col>
          <pie class="statistic" :title="pieTitle" :dataSource="pieData" :height="450"/>
        </a-row>
      </a-tab-pane>
    </a-tabs>

  </a-card>
  <div>
  <h2>三重一大已通过任务列表</h2>
  <szyd-tasks-list />
  <h2>三重一大审核未通过列表</h2>
  <szyd-not-pass-list />
  </div>
  </div>
</template>

<script>
import SzydNotPassList from './modules/szydNotPassList.vue'
import SzydTasksList from './modules/szydTasksList.vue'
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
    Pie,BarMultid,
    SzydNotPassList, SzydTasksList
  },
  data() {
    return {
      description: '三重一大统计页面',
      // 查询条件
      queryParam: {pieDate: '',barDate:''},
      pieTitle:'',
      barTitle:'',
      // 数据集
      countSource: [],
      barDataSource: [],
      //barFields:['重大事项决策','重要干部任免','重要项目安排','大额资金使用'],
      barFields:[],
      // 柱状图
      barType: 'year',
      barValue: [],
      // 饼状图
      pieType: 'year',
      pieOpen: false,
      barOpen:false,
      pieData:[],
      pieValue: [],
      // 统计图类型
      tabStatus:"bar",
    }
  },
  created() {
    this.getPieTitle();
    this.getBarTitle()
    //let url = this.url.getCntrNoCountInfo;
    //this.loadDate(url,'category',{});
    this.loadBarData();
    this.loadPieData();
  },
  methods: {
    getPieTitle(){
      var year = '';
      var month = '';
      if(this.queryParam.pieDate !== ''){
        let selectTime = this.queryParam.pieDate.format("YYYY-MM")
        year = selectTime.substr(0,4)
        month = selectTime.substr(5,7)
      }else{
        var date = new Date ();
        year = date.getFullYear ();
        month = date .getMonth()+1; //获取当前月份(0-11,0代表1月)
      }
      console.log(year,month)
      this.pieTitle = year+"年"+month+"月"
    },
    getBarTitle(){
      var baryear = '';
      var barmonth = '';
      if(this.queryParam.barDate !== ''){
        let selectTime = this.queryParam.barDate.format("YYYY-MM")
        baryear = selectTime.substr(0,4)
        barmonth = selectTime.substr(5,7)
      }else{
        var date = new Date ();
        baryear = date.getFullYear ();
        barmonth = date .getMonth()+1; //获取当前月份(0-11,0代表1月)
      }
      console.log(baryear,barmonth)
      this.barTitle = baryear+"年"+barmonth+"月"
    },
    loadBarData(){
      //获取当前时间
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var nowDate = year + "-" + month ;
      console.log(nowDate)
      let url =  "/smartTriImpOneGre/chart/countByVerifyStatus"+"?time="+nowDate;
      getAction(url).then((res)=>{
        if(res.success){
          console.log(res.result)
          let list = res.result
          let l = list.length
          this.barDataSource = [{type:'未通过'},{type:'已通过'}]
          let key =''
          let n =''
          console.log(l)
          for(var i =0;i<l;i++){
            this.barFields.push(key=list[i].keyName)
          }
          let field = this.barFields
          //'重大事项决策','重要干部任免','重要项目安排','大额资金使用'
          for(var i =0;i<l;i++){

            if(list[i].statu === '0'){
              key=list[i].keyName
              n=list[i].value
              for(var j=0;j<field.length;j++){
                if(key === field[j]){
                  this.$set(this.barDataSource[0],key,n)
                }
              }
            }else if(list[i].statu === '1'){
              key=list[i].keyName
              n=list[i].value
              for(var j=0;j<field.length;j++){
                if(key === field[j]){
                  this.$set(this.barDataSource[1],key,n)
                }
              }

            }
          }
          console.log(this.barDataSource)
        }else{
          this.$message.warning("error")
        }
      })
    },
    //饼图
    loadPieData(){
      //获取当前时间
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var nowDate = year + "-" + month ;
      console.log(nowDate)
      let url =  "/smartTriImpOneGre/chart/countByType"+"?time="+nowDate;
      getAction(url).then((res)=>{
        if(res.success){
          let data = res.result
          console.log(data)
          if(data.length != 0){
            for (let i = 0; i < data.length; i++) {
              this.pieData.push({
                item: data[i].keyName,
                count:data[i].value
              })
            }
          }else{
            this.pieData.push({
              item: '',
              count:"无数据！"
            })
            this.$message.warning("无数据!")
          }

        } else{
          this.$message.warning("系统错误!")
        }
      })
    },
    // 按月份查询
    queryDatebar(){
      this.getBarTitle()
      let time = this.queryParam.barDate.format("YYYY-MM")
      console.log(time)
      let url =  "/smartTriImpOneGre/chart/countByVerifyStatus"+"?time="+time;
      getAction(url).then((res)=>{
        if(res.success){
          console.log(res.result)
          let list = res.result
          let l = list.length
          this.barDataSource = [{type:'未通过'},{type:'已通过'}]
          let key =''
          let n =''
          console.log(l)
          for(var i =0;i<l;i++){
            this.barFields.push(key=list[i].keyName)
          }
          let field = this.barFields
          //'重大事项决策','重要干部任免','重要项目安排','大额资金使用'
          for(var i =0;i<l;i++){

            if(list[i].statu === '0'){
              key=list[i].keyName
              n=list[i].value
              for(var j=0;j<field.length;j++){
                if(key === field[j]){
                  this.$set(this.barDataSource[0],key,n)
                }
              }
            }else if(list[i].statu === '1'){
              key=list[i].keyName
              n=list[i].value
              for(var j=0;j<field.length;j++){
                if(key === field[j]){
                  this.$set(this.barDataSource[1],key,n)
                }
              }

            }
          }
          console.log(this.barDataSource)
        }else{
          this.$message.warning("error")
        }
      })
    },
    searchBarReset(){
      this.queryParam.barDate =''
      this.getBarTitle()
      this.loadBarData();
    },
    queryDatepie(){
      this.getPieTitle();
      let time = this.queryParam.pieDate.format("YYYY-MM")
      //console.log(time)
      let url =  "/smartTriImpOneGre/chart/countByType"+"?time="+time;
      getAction(url).then((res)=>{
        if(res.success){
          let data = res.result
          console.log(data)
          if(data.length != 0){
            for (let i = 0; i < data.length; i++) {
              this.pieData.push({
                item: data[i].keyName,
                count:data[i].value
              })
            }
          }else{
            this.pieData.push({
              item: '',
              count:"无数据！"
            })
            this.$message.warning("无数据!")
          }

        } else{
          this.$message.warning("系统错误!")
        }
      })
    },
    searchReset(){
      this.queryParam.pieDate =''
      this.getPieTitle()
      this.loadPieData();
    },

    openPieChange(status) {
      if (status) {
        this.pieOpen = true;
      } else {
        this.pieOpen = false;
      }
    },
    panelPieChange(value) {
      // 获取到的时间赋值给widgetVal
      this.queryParam.pieDate =value
      this.pieOpen = false;
    },
    handlePieChange(value) {
      this.queryParam.pieDate =value
    },
    openBarChange(status) {
      if (status) {
        this.barOpen = true;
      } else {
        this.barOpen = false;
      }
    },
    panelBarChange(value) {
      // 获取到的时间赋值给widgetVal
      this.queryParam.barDate =value
      this.barOpen = false;
    },
    handleBarChange(value) {
      this.queryParam.barDate =value
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