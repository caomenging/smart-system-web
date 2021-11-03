<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="会议时间">
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.meetingTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.meetingTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="会议名称">
              <a-input placeholder="请输入会议名称" v-model="queryParam.meetingName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('民主生活会表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type:'radio'}"
        :customRow="clickThenSelect"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="民主生活会参会人员表" key="1" >
        <SmartDemocraticLifePeopleList :mainId="selectedMainId" />
      </a-tab-pane>
      <a-tab-pane tab="民主生活会附件表" key="2" forceRender>
        <SmartDemocraticLifeEnclosureList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <smartDemocraticLifeMeeting-modal ref="modalForm" @ok="modalFormOk"></smartDemocraticLifeMeeting-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartDemocraticLifeMeetingModal from './modules/SmartDemocraticLifeMeetingModal'
  import { getAction } from '@/api/manage'
  import SmartDemocraticLifePeopleList from './SmartDemocraticLifePeopleList'
  import SmartDemocraticLifeEnclosureList from './SmartDemocraticLifeEnclosureList'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "SmartDemocraticLifeMeetingList",
    mixins:[JeecgListMixin],
    components: {
      SmartDemocraticLifePeopleList,
      SmartDemocraticLifeEnclosureList,
      SmartDemocraticLifeMeetingModal
    },
    data () {
      return {
        description: '民主生活会表管理页面',
        // 表头
        columns: [
          {
            title:'单位ID',
            align:"center",
            dataIndex: 'departId'
          },
          {
            title:'会议时间',
            align:"center",
            dataIndex: 'meetingTime'
          },
          {
            title:'会议名称',
            align:"center",
            dataIndex: 'meetingName'
          },
          {
            title:'会议地点',
            align:"center",
            dataIndex: 'address'
          },
          {
            title:'主持人工号',
            align:"center",
            dataIndex: 'hostId'
          },
          {
            title:'上报时间',
            align:"center",
            dataIndex: 'reportingTime'
          },
          {
            title:'会议记录人工号',
            align:"center",
            dataIndex: 'recorderId'
          },
          {
            title:'会议内容摘要',
            align:"center",
            dataIndex: 'summary',
            scopedSlots: {customRender: 'htmlSlot'}
          },
          {
            title:'会议记录',
            align:"center",
            dataIndex: 'record'
          },
          {
            title:'创建人工号',
            align:"center",
            dataIndex: 'creatorId'
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/list",
          delete: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/delete",
          deleteBatch: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/deleteBatch",
          exportXlsUrl: "/smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/exportXls",
          importExcelUrl: "smartDemocraticLifeMeeting/smartDemocraticLifeMeeting/importExcel",
        },
        dictOptions:{
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        selectedMainId:'',
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      clickThenSelect(record) {
        return {
          on: {
            click: () => {
              this.onSelectChange(record.id.split(","), [record]);
            }
          }
        }
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.selectedMainId=''
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedMainId=selectedRowKeys[0]
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.onClearSelected()
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'departId',text:'单位ID',dictCode:''})
        fieldList.push({type:'datetime',value:'meetingTime',text:'会议时间'})
        fieldList.push({type:'string',value:'meetingName',text:'会议名称',dictCode:''})
        fieldList.push({type:'string',value:'address',text:'会议地点',dictCode:''})
        fieldList.push({type:'string',value:'hostId',text:'主持人工号',dictCode:''})
        fieldList.push({type:'datetime',value:'reportingTime',text:'上报时间'})
        fieldList.push({type:'string',value:'recorderId',text:'会议记录人工号',dictCode:''})
        fieldList.push({type:'Text',value:'summary',text:'会议内容摘要',dictCode:''})
        fieldList.push({type:'Text',value:'record',text:'会议记录',dictCode:''})
        fieldList.push({type:'string',value:'creatorId',text:'创建人工号',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>