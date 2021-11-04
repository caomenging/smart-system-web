<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('三重一大表')">导出</a-button>
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
      <a-tab-pane tab="三重一大附件表" key="1" >
        <SmartTripleImportanceOneGreatnessDecriptionList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <smartTripleImportanceOneGreatness-modal ref="modalForm" @ok="modalFormOk"></smartTripleImportanceOneGreatness-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartTripleImportanceOneGreatnessModal from './modules/SmartTripleImportanceOneGreatnessModal'
  import { getAction } from '@/api/manage'
  import SmartTripleImportanceOneGreatnessDecriptionList from './SmartTripleImportanceOneGreatnessDecriptionList'
  import {initDictOptions,filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "SmartTripleImportanceOneGreatnessList",
    mixins:[JeecgListMixin],
    components: {
      SmartTripleImportanceOneGreatnessDecriptionList,
      SmartTripleImportanceOneGreatnessModal
    },
    data () {
      return {
        description: '三重一大表管理页面',
        // 表头
        columns: [
          {
            title:'单位ID',
            align:"center",
            dataIndex: 'documentid'
          },
          {
            title:'名称',
            align:"center",
            dataIndex: 'meetingName'
          },
          {
            title:'地点',
            align:"center",
            dataIndex: 'meetingPlace'
          },
          {
            title:'时间',
            align:"center",
            dataIndex: 'meetingStarttime'
          },
          {
            title:'类型',
            align:"center",
            dataIndex: 'meetingType_dictText',
          },
          {
            title:'参会人数',
            align:"center",
            dataIndex: 'meetingNumber'
          },
          {
            title:'参会人员',
            align:"center",
            dataIndex: 'meetingPeople'
          },
          {
            title:'主持人',
            align:"center",
            dataIndex: 'meetingHoster'
          },
          {
            title:'记录人',
            align:"center",
            dataIndex: 'meetingRecorer'
          },
          {
            title:'会议内容摘要',
            align:"center",
            dataIndex: 'meetingAbstract'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'meetingRemarks'
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'creatBy'
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'creatTime'
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
          list: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/list",
          delete: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/delete",
          deleteBatch: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/deleteBatch",
          exportXlsUrl: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/exportXls",
          importExcelUrl: "smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/importExcel",
        },
        dictOptions:{
         meetingType:[],
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
        initDictOptions('meeting_type').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'meetingType', res.result)
          }
        })
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
        fieldList.push({type:'string',value:'documentid',text:'单位ID',dictCode:''})
        fieldList.push({type:'string',value:'meetingName',text:'名称',dictCode:''})
        fieldList.push({type:'string',value:'meetingPlace',text:'地点',dictCode:''})
        fieldList.push({type:'datetime',value:'meetingStarttime',text:'时间'})
        fieldList.push({type:'string',value:'meetingType',text:'类型',dictCode:'meeting_type'})
        fieldList.push({type:'int',value:'meetingNumber',text:'参会人数',dictCode:''})
        fieldList.push({type:'string',value:'meetingPeople',text:'参会人员',dictCode:''})
        fieldList.push({type:'string',value:'meetingHoster',text:'主持人',dictCode:''})
        fieldList.push({type:'string',value:'meetingRecorer',text:'记录人',dictCode:''})
        fieldList.push({type:'string',value:'meetingAbstract',text:'会议内容摘要',dictCode:''})
        fieldList.push({type:'string',value:'meetingRemarks',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'creatBy',text:'创建人',dictCode:''})
        fieldList.push({type:'datetime',value:'creatTime',text:'创建时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>