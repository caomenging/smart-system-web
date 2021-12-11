<template>
  <div class="page-header-index-wide">
  <a-card  :bordered="false" :body-style="{padding: '0'}" :loading="cardLoading">
    <div class="salesCard">
      <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
        <!--查询区域-->
        <div class="extra-wrapper" slot="tabBarExtraContent">
         <!-- <a-range-picker :style="{width: '256px'}" />-->
          <div class="extra-item">
          <j-input placeholder="请输入年份" v-model="queryParam.year" width="60%" />
          </div>
         <a-button type="primary" @click="search" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>
        <!--统计展示-->
        <a-tab-pane  :tab="title" key="1" >
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <line-chart-multid   :dataSource="lineData" :fields ="lineField" :aliases="aliases" :height="height"/>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list :title="rankCountTitle" :list="rankCountData" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane :tab="pieTitle" key="2">
          <a-row >
            <span :style="{marginLeft: '120px',marginTop: '-50px',paddingTop:'-50px'}">评价标准：完全满意-10、非常满意-8、基本满意-6、不满意-4、非常不满意-2</span>
          </a-row>
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <pie title="全区评价满意度比例图" :height="height" :dataSource="pieData" />
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list :title="rankGradeTitle" :list="rankGradeData" />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>

  <a-row :gutter="12">
    <a-card :class="{ 'anty-list-cust':true }" :bordered="false" :style="{marginTop:'30px',marginLeft:'3px'}">

      <a-tabs v-model="indexBottomTab" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
        <div class="extra-wrapper" slot="tabBarExtraContent">
          <!-- <a-range-picker :style="{width: '256px'}" />-->
          <div class="extra-item">
            <j-input placeholder="请输入窗口服务大厅名称" v-model="queryParam.windowsName" width="60%" />
          </div>
          <a-button type="primary" @click="searchWindows" icon="search">查询</a-button>
          <a-button type="primary" @click="searchWindowsReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>

        <a-tab-pane loading="true" tab="窗口服务大厅满意度" key="1">
          <a-table ref="table"
                   size="middle"
                   :scroll="{x:true}"
                   bordered
                   :columns="windowsColumns"
                   :dataSource="windowsDataSource"
                   :pagination="ipagination"
                   :loading="loading"
                   class="j-table-force-nowrap"
                   @change="handleWindowsTableChange">
          </a-table>
        </a-tab-pane>
        <a-tab-pane loading="true" tab="窗口工作人员服务满意度" key="2">
          <a-table ref="table"
                   size="middle"
                   :scroll="{x:true}"
                   bordered
                   :columns="peopleColumns"
                   :dataSource="peopelDataSource"
                   :pagination="ipagination"
                   :loading="loading"
                   class="j-table-force-nowrap"
                   @change="handleTableChange">
          </a-table>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-row>
  </div>
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

  import '@/assets/less/TableExpand.less'
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import { mixinDevice } from '@/utils/mixin'
  import { filterObj } from '@/utils/util'
  import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"

  export default {
    name: 'EvaluateIndex',
    mixins: [mixinDevice],
    components: {
      Bar, MiniBar, BarMultid, AreaChartTy, LineChartMultid,
      Pie, Radar, DashChartDemo, MiniProgress, RankList,
      TransferBar, Trend, Liquid, MiniArea, BarAndLine,
      ACol, ChartCard,
    },
    data() {
      return {
        cardLoading:true,
        queryParam: { year: '' ,windowsName:''},
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
        rankGradeData:[],
        //列表数据
        anntId: '',
        peopelDataSource: [],
        superFieldList: [],
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        /* 排序参数 */
        isorter: {
          column: 'avgGrade',
          order: 'desc',
        },
        /* 筛选参数 */
        filters: {},
        /* table加载状态 */
        loading: false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        /* 查询折叠 */
        toggleSearchStatus: false,
        /* 高级查询条件生效状态 */
        superQueryFlag: false,
        /* 高级查询条件 */
        superQueryParams: '',
        /** 高级查询拼接方式 */
        superQueryMatchType: 'and',
        // 表头
        peopleColumns: [
                   {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },

          {
            title: '人员名称',
            align: "center",
            dataIndex: 'personName',
            //sorter: true,
          },
          /*          {
            title:'主管单位',
            align:"center",
            dataIndex: 'exeDept',
            sorter: true
          },*/
          {
            title:'所属窗口服务大厅',
            align:"center",
            dataIndex: 'windowsName',
            //sorter: true
          },
          {
            title: '评分',
            align: "center",
            dataIndex: 'avgGrade',
            //sorter: true,

          },

          /*          {
            title:'评价人',
            align:"center",
            dataIndex: 'evaluateName',
            sorter: true
          },
          {
            title:'评价人手机号',
            align:"center",
            dataIndex: 'evaluatePhone',
            sorter: true
          },
          {
            title:'评价时间',
            align:"center",
            dataIndex: 'evaluateTime',
            sorter: true
          },
          {
            title:'评价结果',
            align:"center",
            dataIndex: 'evaluateResult_dictText',
            sorter: true
          },
          {
            title:'意见',
            align:"center",
            dataIndex: 'evaluateOpinion',
            sorter: true
          },*/
          /*          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: { customRender: 'action' }
          }*/
        ],
        windowsColumns:[
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },

          {
            title:'主管单位',
            align:"center",
            dataIndex: 'exeDept',
            //sorter: true
          },
          {
            title:'窗口服务大厅名称',
            align:"center",
            dataIndex: 'windowsName',
            //sorter: true
          },
          /*{
            title: '人员名称',
            align: "center",
            dataIndex: 'personName',
            sorter: true,
            width: 60
          },*/
          {
            title: '评分',
            align: "center",
            dataIndex: 'avgGrade',
            //sorter: true,

          },

        ],
        dictOptions: {},
        url: {
          peopleList: "/smartEvaluateList/chart/avgByPeople",
          windowsList: "/smartEvaluateList/chart/windowsByGrade",
        },

        indexBottomTab:"1",

      }
    },
    created() {
      this.cardLoading = true
      this.lineData = []
      this.pieData = []
      this.rankCountData = []
      this.rankGradeData = []
      this.getTitle()
      this.loadLineData()
      this.loadPieData()
      this.loadRankCountData();
      this.loadRankGradeData();
      this.loadPeopleData(1);
      this.loadWindowsData(1);
      setTimeout(() => {
        this.cardLoading = !this.cardLoading
      }, 1000)
    },
    methods: {
      //token header
      tokenHeader(){
        let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
        let tenantid = Vue.ls.get(TENANT_ID)
        if(tenantid){
          head['tenant-id'] = tenantid
        }
        return head;
      },
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
          })

      },
      //搜索
      search(){
        let curYear = Number(new Date().getFullYear());
        let l = this.queryParam.year.length
        let y = Number(this.queryParam.year.substring(1,l-1))
        console.log(curYear,y)
        if(y==''||y=="undifine"){
          this.$message.warning("请输入年份！")
        }
        else if(curYear < y ||  y< 2000){
          this.$message.warning("请输入正确的年份！")
        }else {
          this.cardLoading = true
          this.lineData = []
          this.pieData = []
          this.rankCountData = []
          this.rankGradeData = []
          this.getTitle()
          this.loadLineData();
          this.loadPieData();
          this.loadRankCountData();
          this.loadRankGradeData();
          setTimeout(() => {
            this.cardLoading = !this.cardLoading
          }, 1000)
        }
      },
      searchReset(){
        this.queryParam.year = ''
        this.cardLoading = true
        this.lineData = []
        this.pieData = []
        this.rankCountData = []
        this.rankGradeData = []
        this.getTitle()
        this.loadLineData();
        this.loadPieData();
        this.loadRankCountData();
        this.loadRankGradeData();
        setTimeout(() => {
          this.cardLoading = !this.cardLoading
        }, 1000)
      },
      searchWindows(){
        let e = this.queryParam.windowsName
        if(e==''||e=="undifine"){
          this.$message.warning("请输入窗口服务大厅名称！")
        }else{
          this.loadPeopleData()
          this.loadWindowsData()
        }
      },
      searchWindowsReset(){
        this.queryParam.windowsName=''
        this.loadPeopleData()
        this.loadWindowsData()
      },
      //饼图
      loadPieData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/countByGrade"+"?year="+year;
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

      //评价次数排行榜，展示前十名（可设置）
      loadRankCountData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/windowsRankByCount"+"?year="+year;
        getAction(url).then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            let len = data.length
            if(len >10){
              len = 10
            }
            if(len>0){
              for (let i = 0; i < len; i++) {
                this.rankCountData.push({
                  name: data[i].keyName,
                  total:data[i].value
                })
              }
            }else{
              this.rankCountData.push({
                name: "",
                total:"无数据"
              })
              this.$message.warning("无数据!")
            }

          } else{
            this.$message.warning("系统错误!")
          }
        })
      },
    //满意度排行榜，展示前十名（可设置）
      loadRankGradeData(){
        let year = this.queryParam.year
        let url =  "/smartEvaluateList/chart/windowsRankByGrade"+"?year="+year;
        getAction(url).then((res)=>{
          if(res.success){
            let data = res.result
            console.log(data)
            let len = data.length
            if(len >10){
              len = 10
            }
            if(len>0){
              for (let i = 0; i < len; i++) {
                this.rankGradeData.push({
                  name: data[i].keyName,
                  total:data[i].value
                })
              }
            }else{
              this.rankCountData.push({
                name: "",
                total:"无数据"
              })
              this.$message.warning("无数据!")
            }
          } else{
            this.$message.warning("系统错误!")
          }
        })
      },

      //列表-人员
      loadPeopleData(arg) {
        if (!this.url.peopleList) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams() //查询条件
        this.loading = true
        getAction(this.url.peopleList,params)
          .then((res) => {
            if (res.success) {
              this.peopelDataSource = res.result.records || res.result
              let i = 0
              for(i=0;i<this.peopelDataSource.length;i++){
                if(this.peopelDataSource[i].avgGrade === '' || this.peopelDataSource[i].avgGrade == null || this.peopelDataSource[i].avgGrade === 'undefined' ){
                  this.peopelDataSource[i].avgGrade = '暂无评分'
                }
              }
              if (res.result.total) {
                this.ipagination.total = res.result.total
              } else {
                this.ipagination.total = 0
              }
            } else {
              this.$message.warning(res.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      //列表-窗口
      loadWindowsData(arg) {
        if (!this.url.windowsList) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams() //查询条件
        this.loading = true
        getAction(this.url.windowsList,params)
          .then((res) => {
            if (res.success) {
              this.windowsDataSource = res.result.records || res.result
              let i = 0
              for(i=0;i<this.windowsDataSource.length;i++){
                if(this.windowsDataSource[i].avgGrade === '' || this.windowsDataSource[i].avgGrade == null || this.windowsDataSource[i].avgGrade === 'undefined' ){
                  this.windowsDataSource[i].avgGrade = '暂无评分'
                }
              }
              if (res.result.total) {
                this.ipagination.total = res.result.total
              } else {
                this.ipagination.total = 0
              }
            } else {
              this.$message.warning(res.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadPeopleData()
      },
      handleWindowsTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadWindowsData()
      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if (this.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
        console.log(param)
        param.anntId = this.anntId
        //   param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        return filterObj(param)
      },
    }
  }
</script>



<style  scoped>
  @import '~@assets/less/common.less';
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
      margin-right: 40px;

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

  .anty-list-cust {
    .ant-list-item-meta{flex: 0.3 !important;}
  }
  .anty-list-cust {
    .ant-list-item-content{flex:1 !important; justify-content:flex-start !important;margin-left: 20px;}
  }
</style>
