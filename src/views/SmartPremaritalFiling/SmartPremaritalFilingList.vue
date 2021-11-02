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
      <a-button type="primary" icon="download" @click="handleExportXls('8项规定婚前报备表')">导出</a-button>
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

    <smart-premarital-filing-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartPremaritalFilingModal from './modules/SmartPremaritalFilingModal'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "SmartPremaritalFilingList",
    mixins:[JeecgListMixin],
    components: {
      SmartPremaritalFilingModal
    },
    data () {
      return {
        description: '8项规定婚前报备表管理页面',
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
            title:'人员性别',
            align:"center",
            dataIndex: 'peopleSex'
          },
          {
            title:'政治面貌',
            align:"center",
            dataIndex: 'politicCou'
          },
          {
            title:'工作单位',
            align:"center",
            dataIndex: 'workUint'
          },
          {
            title:'职务',
            align:"center",
            dataIndex: 'post'
          },
          {
            title:'职级',
            align:"center",
            dataIndex: 'postRank'
          },
          {
            title:'配偶姓名',
            align:"center",
            dataIndex: 'spoName'
          },
          {
            title:'配偶单位职务',
            align:"center",
            dataIndex: 'spoUnitPos'
          },
          {
            title:'配偶政治面貌',
            align:"center",
            dataIndex: 'spoPoliticCou'
          },
          {
            title:'结婚人姓名',
            align:"center",
            dataIndex: 'marriedName'
          },
          {
            title:'与本人关系',
            align:"center",
            dataIndex: 'relationWithMyself'
          },
          {
            title:'婚姻登记时间',
            align:"center",
            dataIndex: 'marryRegistTime'
          },
          {
            title:'婚礼时间',
            align:"center",
            dataIndex: 'weddingTime'
          },
          {
            title:'是否同城同地合办',
            align:"center",
            dataIndex: 'isSameOrganized'
          },
          {
            title:'拟宴请人数',
            align:"center",
            dataIndex: 'guestsNumber'
          },
          {
            title:'婚宴场所名称',
            align:"center",
            dataIndex: 'banqPlaceName'
          },
          {
            title:'婚宴场所地址',
            align:"center",
            dataIndex: 'banqPlaceAddr'
          },
          {
            title:'宴请人员范围',
            align:"center",
            dataIndex: 'banqPersonScope'
          },
          {
            title:'拟用婚礼车辆来源',
            align:"center",
            dataIndex: 'proCarsSource'
          },
          {
            title:'拟用婚礼车辆数量',
            align:"center",
            dataIndex: 'proCarsNum'
          },
          {
            title:'结婚人配偶姓名',
            align:"center",
            dataIndex: 'marrySpoName'
          },
          {
            title:'结婚人配偶单位',
            align:"center",
            dataIndex: 'marrySpoUnit'
          },
          {
            title:'结婚人配偶单位职务',
            align:"center",
            dataIndex: 'marrySpoUnitPos'
          },
          {
            title:'结婚人配偶父母姓名',
            align:"center",
            dataIndex: 'marrySpoParName'
          },
          {
            title:'结婚人配偶父母单位职务',
            align:"center",
            dataIndex: 'marrySpoParUnitPos'
          },
          {
            title:'其他需要说明的事情',
            align:"center",
            dataIndex: 'otherMattersExp'
          },
          {
            title:'报告时间',
            align:"center",
            dataIndex: 'reportTime'
          },
          {
            title:'联系电话',
            align:"center",
            dataIndex: 'contactNumber'
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
          list: "/smartPremaritalFiling/smartPremaritalFiling/list",
          delete: "/smartPremaritalFiling/smartPremaritalFiling/delete",
          deleteBatch: "/smartPremaritalFiling/smartPremaritalFiling/deleteBatch",
          exportXlsUrl: "/smartPremaritalFiling/smartPremaritalFiling/exportXls",
          importExcelUrl: "smartPremaritalFiling/smartPremaritalFiling/importExcel",
          
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
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'peopleSex',text:'人员性别',dictCode:''})
         fieldList.push({type:'string',value:'politicCou',text:'政治面貌',dictCode:''})
         fieldList.push({type:'string',value:'workUint',text:'工作单位',dictCode:''})
         fieldList.push({type:'string',value:'post',text:'职务',dictCode:''})
         fieldList.push({type:'string',value:'postRank',text:'职级',dictCode:''})
         fieldList.push({type:'string',value:'spoName',text:'配偶姓名',dictCode:''})
         fieldList.push({type:'string',value:'spoUnitPos',text:'配偶单位职务',dictCode:''})
         fieldList.push({type:'string',value:'spoPoliticCou',text:'配偶政治面貌',dictCode:''})
         fieldList.push({type:'string',value:'marriedName',text:'结婚人姓名',dictCode:''})
         fieldList.push({type:'string',value:'relationWithMyself',text:'与本人关系',dictCode:''})
         fieldList.push({type:'string',value:'marryRegistTime',text:'婚姻登记时间',dictCode:''})
         fieldList.push({type:'string',value:'weddingTime',text:'婚礼时间',dictCode:''})
         fieldList.push({type:'string',value:'isSameOrganized',text:'是否同城同地合办',dictCode:''})
         fieldList.push({type:'string',value:'guestsNumber',text:'拟宴请人数',dictCode:''})
         fieldList.push({type:'string',value:'banqPlaceName',text:'婚宴场所名称',dictCode:''})
         fieldList.push({type:'string',value:'banqPlaceAddr',text:'婚宴场所地址',dictCode:''})
         fieldList.push({type:'string',value:'banqPersonScope',text:'宴请人员范围',dictCode:''})
         fieldList.push({type:'string',value:'proCarsSource',text:'拟用婚礼车辆来源',dictCode:''})
         fieldList.push({type:'string',value:'proCarsNum',text:'拟用婚礼车辆数量',dictCode:''})
         fieldList.push({type:'string',value:'marrySpoName',text:'结婚人配偶姓名',dictCode:''})
         fieldList.push({type:'string',value:'marrySpoUnit',text:'结婚人配偶单位',dictCode:''})
         fieldList.push({type:'string',value:'marrySpoUnitPos',text:'结婚人配偶单位职务',dictCode:''})
         fieldList.push({type:'string',value:'marrySpoParName',text:'结婚人配偶父母姓名',dictCode:''})
         fieldList.push({type:'string',value:'marrySpoParUnitPos',text:'结婚人配偶父母单位职务',dictCode:''})
         fieldList.push({type:'string',value:'otherMattersExp',text:'其他需要说明的事情',dictCode:''})
         fieldList.push({type:'string',value:'reportTime',text:'报告时间',dictCode:''})
         fieldList.push({type:'string',value:'contactNumber',text:'联系电话',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>