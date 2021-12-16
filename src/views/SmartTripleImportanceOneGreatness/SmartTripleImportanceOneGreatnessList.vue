<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div v-if="roleId.indexOf('1465163864583323650') == -1"
         class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位">
              <j-select-depart placeholder="请选择单位"  v-model="queryParam.documentid" customReturnField='id' :multi="false" :treeOpera="true"></j-select-depart>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>
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
          <a v-show="record.verifyStatus == '3'" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a v-show="record.verifyStatus == '3'">删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <smart-triple-importance-one-greatness-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartTripleImportanceOneGreatnessModal from './modules/SmartTripleImportanceOneGreatnessModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import { mapActions,mapGetters,mapState } from 'vuex'

  export default {
    name: "SmartTripleImportanceOneGreatnessList",
    mixins:[JeecgListMixin],
    components: {
      SmartTripleImportanceOneGreatnessModal
    },
    data () {
      return {
        description: '三重一大表管理页面',
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
            title:'单位',
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
            dataIndex: 'meetingType_dictText'
          },
          {
            title:'参会人数',
            align:"center",
            dataIndex: 'meetingNumber'
          },
          {
            title:'主持人姓名',
            align:"center",
            dataIndex: 'meetingHosterName'
          },
          {
            title:'记录人姓名',
            align:"center",
            dataIndex: 'meetingRecorerName'
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
            dataIndex: 'createBy'
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title:'审核状态',
            align:'center',
            dataIndex: 'verifyStatus',
            customRender: function(text) {
              if(text == '0') {
                return '不通过'
              } else if (text == '1') {
                return '通过'
              } else if (text == '2') {
                return '待审核'
              } else {
                return '免审' }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          },

        ],
        url: {
          list: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/list",
          delete: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/delete",
          deleteBatch: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/deleteBatch",
          exportXlsUrl: "/smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/exportXls",
          importExcelUrl: "smartTripleImportanceOneGreatness/smartTripleImportanceOneGreatness/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.roleId=this.userInfo().roleId
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {

      ...mapGetters(["userInfo"]),

      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'list_multi',value:'documentid',text:'单位',dictTable:'', dictText:'', dictCode:''})
         fieldList.push({type:'string',value:'meetingName',text:'名称',dictCode:''})
         fieldList.push({type:'string',value:'meetingPlace',text:'地点',dictCode:''})
         fieldList.push({type:'datetime',value:'meetingStarttime',text:'时间'})
         fieldList.push({type:'string',value:'meetingType',text:'类型',dictCode:'meeting_type'})
         fieldList.push({type:'int',value:'meetingNumber',text:'参会人数',dictCode:''})
         fieldList.push({type:'string',value:'meetingPeople',text:'参会人员',dictCode:''})
         fieldList.push({type:'string',value:'meetingPeopleName',text:'参会人员姓名',dictCode:''})
         fieldList.push({type:'string',value:'meetingHoster',text:'主持人',dictCode:''})
         fieldList.push({type:'string',value:'meetingHosterName',text:'主持人姓名',dictCode:''})
         fieldList.push({type:'string',value:'meetingRecorer',text:'记录人',dictCode:''})
         fieldList.push({type:'string',value:'meetingRecorerName',text:'记录人姓名',dictCode:''})

         fieldList.push({type:'string',value:'meetingAbstract',text:'会议内容摘要',dictCode:''})
         fieldList.push({type:'string',value:'meetingRemarks',text:'备注',dictCode:''})
         fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
         fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
