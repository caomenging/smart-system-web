<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="是否每日提醒">
              <j-dict-select-tag placeholder="请选择是否每日提醒" v-model="queryParam.isLoop" dictCode="is_loop"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="提醒全体人员">
              <j-dict-select-tag placeholder="请选择提醒全体人员" v-model="queryParam.isToAll" dictCode="is_loop"/>
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
      <a-button type="primary" icon="download" @click="handleExportXls('定时任务信息表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <!-- <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button> -->
      </a-dropdown>
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
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
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
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

    <smart-job-modal ref="modalForm" @ok="modalFormOk"></smart-job-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartJobModal from './modules/SmartJobModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'SmartJobList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SmartJobModal
    },
    data () {
      return {
        description: '定时任务信息表管理页面',
        // 表头
        columns: [
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
            title:'任务类型',
            align:"center",
            dataIndex: 'jobType_dictText'
          },
          {
            title:'任务名称',
            align:"center",
            dataIndex: 'jobName'
          },
          {
            title:'任务描述',
            align:"center",
            dataIndex: 'jobDescribe'
          },
          {
            title:'任务状态',
            align:"center",
            dataIndex: 'jobStatus'
          },
          {
            title:'是否每日提醒',
            align:"center",
            dataIndex: 'isLoop_dictText'
          },
          {
            title:'执行时间(日）',
            align:"center",
            dataIndex: 'executeTimeDay',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'执行时间(时）',
            align:"center",
            dataIndex: 'executeTimeHour'
          },
          // {
          //   title:'提醒全体人员',
          //   align:"center",
          //   dataIndex: 'isToAll_dictText'
          // },
          // {
          //   title:'提醒人员',
          //   align:"center",
          //   dataIndex: 'toUser_dictText'
          // },
          {
            title:'提醒类型',
            align:"center",
            dataIndex: 'type_dictText'
          },
          {
            title:'模板名',
            align:"center",
            dataIndex: 'templateName'
          },
          {
            title:'模板内容',
            align:"center",
            dataIndex: 'templateContent'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/smartJob/smartJob/list",
          delete: "/smartJob/smartJob/delete",
          deleteBatch: "/smartJob/smartJob/deleteBatch",
          exportXlsUrl: "/smartJob/smartJob/exportXls",
          importExcelUrl: "smartJob/smartJob/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'jobType',text:'任务类型',dictCode:'job_type'})
        fieldList.push({type:'string',value:'jobName',text:'任务名称',dictCode:''})
        fieldList.push({type:'string',value:'jobDescribe',text:'任务描述',dictCode:''})
        fieldList.push({type:'string',value:'jobStatus',text:'任务状态',dictCode:''})
        fieldList.push({type:'string',value:'isLoop',text:'是否每日提醒',dictCode:'is_loop'})
        fieldList.push({type:'date',value:'executeTimeDay',text:'执行时间(日）'})
        fieldList.push({type:'string',value:'executeTimeHour',text:'执行时间(时）',dictCode:''})
        fieldList.push({type:'string',value:'isToAll',text:'提醒全体人员',dictCode:'is_loop'})
        fieldList.push({type:'sel_user',value:'toUser',text:'提醒人员'})
        fieldList.push({type:'string',value:'type',text:'提醒类型',dictCode:'msgType'})
        fieldList.push({type:'popup',value:'templateName',text:'模板名', popup:{code:'tem_test',field:'template_name',orgFields:'template_name',destFields:'template_name'}})
        fieldList.push({type:'string',value:'templateContent',text:'模板内容',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>