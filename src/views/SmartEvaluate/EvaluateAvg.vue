<template>
  <div class="page-header-index-wide">
<!--  <a-card  :bordered="false" :body-style="{padding: '0'}" :loading="cardLoading">
    <div class="salesCard">
      <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
        &lt;!&ndash;查询区域&ndash;&gt;
        <div class="extra-wrapper" slot="tabBarExtraContent">
         &lt;!&ndash; <a-range-picker :style="{width: '256px'}" />&ndash;&gt;
          <div class="extra-item">
          <j-input placeholder="请输入年份" v-model="queryParam.year" width="60%" />
          </div>
         <a-button type="primary" @click="search" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>
        &lt;!&ndash;统计展示&ndash;&gt;
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
  </a-card>-->
  <a-row :gutter="12">
    <a-card :class="{ 'anty-list-cust':true }" :bordered="false" :style="{marginTop:'3px',marginLeft:'3px'}">
      <h3 :style="{marginBottom:'20px'}">窗口人员评分排名（评分标准：10分制）</h3>
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="窗口服务大厅名称">
                <!--            <j-input placeholder="请输入窗口服务大厅名称" v-model="queryParam.windowsName"></j-input>-->
                <j-search-select-tag
                  placeholder="请选择"
                  v-model="queryParam.windowsName"
                  dict="smart_window_unit,name,name,del_flag = 0"
                  :async="true" :style="{width:'140px'}">
                </j-search-select-tag>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchWindows" icon="search">查询</a-button>
              <a-button type="primary" @click="searchWindowsReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

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
</a-card>
</a-row>
    <a-row :gutter="12">
      <a-card :class="{ 'anty-list-cust':true }" :bordered="false" :style="{marginTop:'20px',marginLeft:'3px'}">
        <h3 :style="{marginBottom:'20px'}">窗口单位评分排名（评分标准：10分制）</h3>
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
        queryParam: { windowsName:''},
        title: '',
        pieTitle:'',
        rankCountTitle:'',
        rankGradeTitle:'',
        height: 420,
        rankList: [],
        barData: [],
        areaData: [],
        //列表数据
        anntId: '',
        windowsDataSource:[],
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
            /*       {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/

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
         /* {
            title:'所属窗口服务大厅',
            align:"center",
            dataIndex: 'windowsName',
            //sorter: true
          },*/
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
/*          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/

         /* {
            title:'主管单位',
            align:"center",
            dataIndex: 'exeDept',
            //sorter: true
          },*/
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
      searchWindows(){
        let e = this.queryParam.windowsName
        if(e===''||e==="undefined"){
          this.$message.warning("请选择窗口服务大厅名称！")
        }else{
          this.loadPeopleData()
          //this.loadWindowsData()
        }
      },
      searchWindowsReset(){
        console.log(this.queryParam.windowsName)
        this.queryParam={}
        this.loadPeopleData()
        //this.loadWindowsData()
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
