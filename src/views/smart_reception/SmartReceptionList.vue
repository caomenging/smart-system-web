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
      <a-button type="primary" icon="download" @click="handleExportXls('公务接待2.0')">导出</a-button>
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
      <a-tab-pane tab="来访人员信息表" key="1" >
        <Smart_8VisitorList :mainId="selectedMainId" />
      </a-tab-pane>
      <a-tab-pane tab="住宿信息" key="2" forceRender>
        <Smart_8StayList :mainId="selectedMainId" />
      </a-tab-pane>
      <a-tab-pane tab="用餐情况" key="3" forceRender>
        <Smart_8DiningList :mainId="selectedMainId" />
      </a-tab-pane>
      <a-tab-pane tab="接待清单" key="4" forceRender>
        <Smart_8ListList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <smartReception-modal ref="modalForm" @ok="modalFormOk"></smartReception-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartReceptionModal from './modules/SmartReceptionModal'
  import { getAction } from '@/api/manage'
  import Smart_8VisitorList from './Smart_8VisitorList'
  import Smart_8StayList from './Smart_8StayList'
  import Smart_8DiningList from './Smart_8DiningList'
  import Smart_8ListList from './Smart_8ListList'
  import {initDictOptions,filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "SmartReceptionList",
    mixins:[JeecgListMixin],
    components: {
      Smart_8VisitorList,
      Smart_8StayList,
      Smart_8DiningList,
      Smart_8ListList,
      SmartReceptionModal
    },
    data () {
      return {
        description: '公务接待2.0管理页面',
        // 表头
        columns: [
          {
            title:'来访事由',
            align:"center",
            dataIndex: 'reason'
          },
          {
            title:'接待对象单位',
            align:"center",
            dataIndex: 'receptionDepartmentId'
          },
          {
            title:'接待单位',
            align:"center",
            dataIndex: 'departmentId_dictText',
          },
          {
            title:'到访时间',
            align:"center",
            dataIndex: 'startTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'结束时间',
            align:"center",
            dataIndex: 'endTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'来访人数量',
            align:"center",
            dataIndex: 'visitorsNum'
          },
          {
            title:'总开销',
            align:"center",
            dataIndex: 'cost'
          },
          {
            title:'是否住宿',
            align:"center",
            dataIndex: 'stay_dictText',
          },
          {
            title:'附件上传',
            align:"center",
            dataIndex: 'filesPc',
            scopedSlots: {customRender: 'fileSlot'}
          },
          {
            title:'高拍仪附件上传',
            align:"center",
            dataIndex: 'files',
            scopedSlots: {customRender: 'fileSlot'}
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title:'创建日期',
            align:"center",
            dataIndex: 'createTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'更新人',
            align:"center",
            dataIndex: 'updateBy'
          },
          {
            title:'更新日期',
            align:"center",
            dataIndex: 'updateTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
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
          list: "/smart_reception/smartReception/list",
          delete: "/smart_reception/smartReception/delete",
          deleteBatch: "/smart_reception/smartReception/deleteBatch",
          exportXlsUrl: "/smart_reception/smartReception/exportXls",
          importExcelUrl: "smart_reception/smartReception/importExcel",
        },
        dictOptions:{
         departmentId:[],
         stay:[],
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
        initDictOptions('sys_depart,depart_name,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'departmentId', res.result)
          }
        })
        initDictOptions('stay').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'stay', res.result)
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
        fieldList.push({type:'string',value:'reason',text:'来访事由',dictCode:''})
        fieldList.push({type:'string',value:'receptionDepartmentId',text:'接待对象单位',dictCode:''})
        fieldList.push({type:'sel_depart',value:'departmentId',text:'接待单位'})
        fieldList.push({type:'date',value:'startTime',text:'到访时间'})
        fieldList.push({type:'date',value:'endTime',text:'结束时间'})
        fieldList.push({type:'int',value:'visitorsNum',text:'来访人数量',dictCode:''})
        fieldList.push({type:'int',value:'cost',text:'总开销',dictCode:''})
        fieldList.push({type:'int',value:'stay',text:'是否住宿',dictCode:'stay'})
        fieldList.push({type:'string',value:'filesPc',text:'附件上传',dictCode:''})
        fieldList.push({type:'string',value:'files',text:'高拍仪附件上传',dictCode:''})
        fieldList.push({type:'sel_user',value:'createBy',text:'创建人'})
        fieldList.push({type:'date',value:'createTime',text:'创建日期'})
        fieldList.push({type:'string',value:'updateBy',text:'更新人',dictCode:''})
        fieldList.push({type:'date',value:'updateTime',text:'更新日期'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>