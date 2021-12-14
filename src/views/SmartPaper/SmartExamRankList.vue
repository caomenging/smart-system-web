<template>
    <!-- 查询区域 -->
    <div class="page-header-index-wide">
<!--      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
&lt;!&ndash;            <a-form-item label="考试名称">
              <j-input placeholder="请输入考试名称" v-model="queryParam.examName"></j-input>
            </a-form-item>&ndash;&gt;
            <a-form-item label="考试名称">
              <j-search-select-tag
                placeholder="请选择考试"
                v-model="queryParam.examId"
                dict="smart_exam_information,exam_name,id,paper_type = '1'"
                :async="true">
              </j-search-select-tag>
            </a-form-item>

          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
             &lt;!&ndash; <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>&ndash;&gt;
            </span>
          </a-col>
        </a-row>
      </a-form>-->
      <a-row :gutter="12">
        <a-card :class="{ 'anty-list-cust':true }" :bordered="false" :style="{marginTop:'10px',marginLeft:'3px'}">
          <a-tabs v-model="indexBottomTab" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <!-- <a-range-picker :style="{width: '256px'}" />-->
              <div class="extra-item">
                <a-form-item>
                <j-search-select-tag
                    placeholder="请选择考试"
                    v-model="queryParam.examId"
                    dict="smart_exam_information,exam_name,id,paper_type = '1'"
                    :async="true"
                    :style="{width: '150px'}">
                  </j-search-select-tag>
                </a-form-item>
              </div>
              <a-button type="primary" @click="searchDept" icon="search">查询</a-button>
              <a-button type="primary" @click="searchDeptReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </div>

            <a-tab-pane loading="true" :tab="deptTitle" key="1">
              <a-table ref="table"
                       size="middle"
                       :scroll="{x:true}"
                       bordered
                       :columns="deptColumns"
                       :dataSource="deptDataSource"
                       :pagination="ipagination"
                       :loading="loading"
                       class="j-table-force-nowrap"
                       @change="handleDeptTableChange">
              </a-table>
            </a-tab-pane>
            <a-tab-pane loading="true" :tab="peopleTitle" key="2">
              <a-table ref="table"
                       size="middle"
                       :scroll="{x:true}"
                       bordered
                       :columns="peopleColumns"
                       :dataSource="peopelDataSource"
                       :pagination="ipagination"
                       :loading="loading"
                       class="j-table-force-nowrap"
                       @change="handlePeopleTableChange">
              </a-table>
            </a-tab-pane>
          </a-tabs>
          <span :style="{paddingLeft:'15px',paddingBottom: '40px',fontSize:'14px'}">默认排名最新结束的考试排名</span>
        </a-card>
      </a-row>

    <!-- 操作按钮区域 -->
<!--    <div class="table-operator">
      &lt;!&ndash;<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>&ndash;&gt;
      <a-button type="primary" icon="download" @click="handleExportXls('考试信息表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      &lt;!&ndash; 高级查询区域 &ndash;&gt;
      &lt;!&ndash;<j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>&ndash;&gt;
&lt;!&ndash;      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>&ndash;&gt;
    </div>-->

<!--    <task-detail-modal ref="scoreModal" @ok="modalFormOk"></task-detail-modal>-->
    </div>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,putAction, postAction,getAction } from '@/api/manage'
  import { filterObj } from '@/utils/util'
  import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"
  import TaskDetailModal from './modules/TaskDetailModal.vue'

  export default {
    name: 'SmartExamRankList',
    mixins: [mixinDevice],
    components: {},
    data() {
      return {
        queryParam: {
          examId: ''
        },
        deptTitle:'',
        peopleTitle:'',
        anntId: '',
        indexBottomTab:"1",
        description: '考试排名',
        deptDataSource:[],
        peopelDataSource:[],
        // 表头
        deptColumns: [
          {
            title: '名次',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function(t, r, index) {
              return parseInt(index) + 1;
            }
          },
         /* {
            title: '考试名称',
            align: "center",
            dataIndex: 'examName'
          },*/
          {
            title: '单位',
            align: "center",
            dataIndex:'deptName'
          },
          {
            title: '参加考试人数',
            align: "center",
            dataIndex:'count'
          },
          {
            title: '平均分',
            align: "center",
            dataIndex: 'deptAvgGrade'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: { customRender: 'action' }
          }*/
        ],
        peopleColumns:[{
          title: '名次',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          }
        },
          /* {
             title: '考试名称',
             align: "center",
             dataIndex: 'examName'
           },*/
          {
            title: '单位',
            align: "center",
            dataIndex:'deptName'
          },
          {
            title: '姓名',
            align: "center",
            dataIndex:'personName'
          },
          {
            title: '成绩',
            align: "center",
            dataIndex: 'examGrade'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
        align: "center",
        fixed: "right",
        width: 147,
        scopedSlots: { customRender: 'action' }
    }*/
    ],
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
          column: '',
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
        url: {
          deptList: "/SmartPaper/smartMyExam/deptExamRank",
          peopleList:"/SmartPaper/smartMyExam/peopleExamRank",
          exportXlsUrl: "/SmartPaper/smartMyExam/exportXls",
          importExcelUrl: "SmartPaper/smartMyExam/importExcel",

        },
        dictOptions: {},
      }
    },
    created() {
      this.loadDeptRankData()
      this.loadPeopleRankData()
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      tokenHeader(){
        let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
        let tenantid = Vue.ls.get(TENANT_ID)
        if(tenantid){
          head['tenant-id'] = tenantid
        }
        return head;
      },
      searchDept(){
        let e = this.queryParam.examId
        if(e==''||e== undefined){
          this.$message.warning("请选择考试！")
        }else{
          this.loadPeopleRankData()
          this.loadDeptRankData()
        }
      },
      searchDeptReset(){
        //设置undefined实现下拉框数据清空
        this.queryParam.examId= undefined
        this.loadPeopleRankData()
        this.loadDeptRankData()
      },
      //列表-单位
      loadDeptRankData(arg) {
        if (!this.url.deptList) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams() //查询条件
        this.loading = true
        getAction(this.url.deptList,params)
          .then((res) => {
            if (res.success) {
              this.deptDataSource = res.result.records || res.result
              this.deptTitle = this.deptDataSource[0].examName +"单位排名"
              let i = 0
              for(i=0;i<this.deptDataSource.length;i++){
                if(this.deptDataSource[i].deptAvgGrade === '' || this.deptDataSource[i].deptAvgGrade == null || this.deptDataSource[i].deptAvgGrade === 'undefined' ){
                  this.deptDataSource[i].deptAvgGrade = '无成绩'
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
      //列表-个人
      loadPeopleRankData(arg) {
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
              this.peopleTitle = this.peopelDataSource[0].examName +"个人排名"
              let i = 0
              for(i=0;i<this.peopelDataSource.length;i++){
                if(this.peopelDataSource[i].examGrade === '' || this.peopelDataSource[i].examGrade == null || this.peopelDataSource[i].examGrade === 'undefined' ){
                  this.peopelDataSource[i].examGrade = '无成绩'
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
      handlePeopleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadPeopleRankData()
      },
      handleDeptTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadDeptRankData()
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
<style scoped>
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
  padding-right: 26px;

  .extra-item {
    display: inline-block;
    margin-right: 30px;

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