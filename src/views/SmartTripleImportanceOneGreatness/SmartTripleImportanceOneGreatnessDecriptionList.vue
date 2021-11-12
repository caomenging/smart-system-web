<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('三重一大附件表')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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
        bordered
        rowKey="id"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <smartTripleImportanceOneGreatnessDecription-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></smartTripleImportanceOneGreatnessDecription-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartTripleImportanceOneGreatnessDecriptionModal from './modules/SmartTripleImportanceOneGreatnessDecriptionModal'

  export default {
    name: "SmartTripleImportanceOneGreatnessDecriptionList",
    mixins:[JeecgListMixin],
    components: { SmartTripleImportanceOneGreatnessDecriptionModal },
    props:{
      mainId:{
        type:String,
        default:'',
        required:false
      }
    },
    watch:{
      mainId:{
        immediate: true,
        handler(val) {
          if(!this.mainId){
            this.clearList()
          }else{
            this.queryParam['meetingId'] = val
            this.loadData(1);
          }
        }
      }
    },
    data () {
      return {
        description: '三重一大表管理页面',
        disableMixinCreated:true,
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
            title:'附件说明',
            align:"center",
            dataIndex: 'attachmentDescription'
          },
          {
            title:'附件说明路径',
            align:"center",
            dataIndex: 'descriptionPath',
            scopedSlots: {customRender: 'fileSlot'}
          },
          {
            title:'上传时间',
            align:"center",
            dataIndex: 'uploadTime'
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
          list: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/listSmartTripleImportanceOneGreatnessDecriptionByMainId",
          delete: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/deleteSmartTripleImportanceOneGreatnessDecription",
          deleteBatch: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/deleteBatchSmartTripleImportanceOneGreatnessDecription",
          exportXlsUrl: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/exportSmartTripleImportanceOneGreatnessDecription",
          importUrl: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/importSmartTripleImportanceOneGreatnessDecription",
        },
        dictOptions:{
         meetingType:[],
        },
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importUrl}/${this.mainId}`;
      }
    },
    methods: {
      clearList(){
        this.dataSource=[]
        this.selectedRowKeys=[]
        this.ipagination.current = 1
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
