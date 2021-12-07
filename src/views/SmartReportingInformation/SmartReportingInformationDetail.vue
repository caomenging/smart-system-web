<!--首页的表格-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">

      <!-- 高级查询区域 -->
      <a-button type="primary" icon="download" @click="handleExportXls('举报信息表')">导出</a-button>
    </div>

    <!-- table区域-begin -->
   <div>

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

         <a @click="handleLook(record)">查看</a>

        </span>

      </a-table>
    </div>

    <smart-reporting-information-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SmartReportingInformationModal from './modules/SmartReportingInformationModal'
import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'

export default {
  name: "SmartReportingInformationList",
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    SmartReportingInformationModal
  },
  data () {
    return {
      description: '首页管理页面',
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title:'被反映人姓名',
          align:"center",
          dataIndex: 'reflectedInformation'
        },
        {
          title:'被反映人单位',
          align:"center",
          dataIndex: 'reflectedDocumentid'
        },
        {
          title:'举报时间',
          align:"center",
          dataIndex: 'reportingTime'
        },
        {
          title:'处理状态',
          align:"center",
          dataIndex: 'processingResult_dictText'
        },
       /* {
          title:'举报人姓名',
          align:"center",
          dataIndex: 'reportingName'
        },
        {
          title:'联系电话',
          align:"center",
          dataIndex: 'contactNumber'
        },*/
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
        list: "/smartReportingInformation/smartReportingInformation/list",
        delete: "/smartReportingInformation/smartReportingInformation/delete",
        deleteBatch: "/smartReportingInformation/smartReportingInformation/deleteBatch",
        exportXlsUrl: "/smartReportingInformation/smartReportingInformation/exportXls",
        importExcelUrl: "smartReportingInformation/smartReportingInformation/importExcel",

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
    }
  },
  methods: {
    initDictConfig(){
    },
    handleLook(){//查看
      this.$router.push({path: '/SmartReportingInformation/SmartReportingInformationList'});
    }
   /* getSuperFieldList(){
      let fieldList=[];
      fieldList.push({type:'string',value:'reflectedInformation',text:'被反映人信息',dictCode:''})
      fieldList.push({type:'string',value:'reflectedDocumentid',text:'被反映人单位',dictCode:''})
      fieldList.push({type:'datetime',value:'reportingTime',text:'举报时间'})
      fieldList.push({type:'string',value:'processingType',text:'处理类型',dictCode:'processing_type'})
      fieldList.push({type:'string',value:'reportingName',text:'举报人姓名',dictCode:''})
      fieldList.push({type:'string',value:'contactNumber',text:'联系电话',dictCode:''})
      this.superFieldList = fieldList
    }*/
  }
}
</script>
<!--
<style scoped>
@import '~@assets/less/common.less';
</style>-->
