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
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download" @click="handleExportXls('资料库')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
<!--        <a-button type="primary" icon="import">导入</a-button>-->
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

<!--    &lt;!&ndash; table区域-begin &ndash;&gt;-->
<!--    <div>-->
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

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
<!--          <a @click="handleEdit(record)">编辑</a>-->
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->

<!--              </a-menu-item>-->
<!--              <a-menu-item>-->
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
        </span>

      </a-table>
<!--    </div>-->
    <smart-data-sheet-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartDataSheetModal from './modules/SmartDataSheetModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'


  export default {
    name: "SmartDataSheetList",
    mixins:[JeecgListMixin],
    components: {
      SmartDataSheetModal
    },
    data () {
      return {
        description: '资料库管理页面',
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
            title:'文件名',
            align:"center",
            dataIndex: 'name'
          },
          // {
          //   title:'文件类型',
          //   align:"center",
          //   dataIndex: 'type_dictText'
          // },
          {
            title:'发布时间',
            align:"center",
            dataIndex: 'time'
          },
          {
            title:'发布人',
            align:"center",
            dataIndex: 'publisher_dictText'
          },
          {
            title:'文件描述',
            align:"center",
            dataIndex: 'describe',
            scopedSlots: {customRender: 'htmlSlot'}
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
          list: "/smart_data_sheet/smartDataSheetP/list",
          delete: "/smart_data_sheet/smartDataSheetP/delete",
          deleteBatch: "/smart_data_sheet/smartDataSheetP/deleteBatch",
          exportXlsUrl: "/smart_data_sheet/smartDataSheetP/exportXls",
          importExcelUrl: "smart_data_sheet/smartDataSheetP/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    // changeData(){
    //   this.List.sort((a,b) => {
    //     let aTimeString = a.time
    //     let bTimeString = b.time
    //     aTimeString = aTimeString.replace(/-/g,'/')
    //     bTimeString = bTimeString.replace(/-/g,'/')
    //     let aTime = new Date(aTimeString).getTime()
    //     let bTime = new Date(bTimeString).getTime()
    //     return  aTime - bTime
    //   });
    // },
    handleTableChange(pagination, filters, sorter) {
      if(sorter.order=='ascend'){
        this.data.sort((a, b) => { return new Date(b.createdDate) - new Date(a.createdDate) })
      }else{
        this.data.sort((a, b) => { return new Date(a.createdDate) - new Date(b.createdDate) })
      }
    },

    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'name',text:'文件名',dictCode:''})
         fieldList.push({type:'int',value:'type',text:'文件类型',dictCode:'type_data'})
         fieldList.push({type:'datetime',value:'time',text:'发布时间'})
         fieldList.push({type:'sel_user',value:'publisher',text:'发布人'})
         fieldList.push({type:'Text',value:'describe',text:'文件描述',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>