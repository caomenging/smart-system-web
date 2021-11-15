<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="姓名">
              <j-input placeholder="请输入姓名" v-model="queryParam.punishName"  />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位">
              <j-select-depart placeholder="请输入单位" v-model="queryParam.departName" customReturnField='departName'></j-select-depart>
            </a-form-item>
          </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="职级">
                <j-search-select-tag placeholder="请输入或选择职级" v-model="queryParam.positionRank" dict="position_rank" />
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="手机号">
                <j-input placeholder="请输入手机号" v-model="queryParam.phone"></j-input>
              </a-form-item>
            </a-col>
          </template>
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
      <a-button type="primary" icon="download" @click="handleExportXls('处分人员表')">导出</a-button>
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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

    <smart-punish-people-modal ref="modalForm" @ok="modalFormOk"></smart-punish-people-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartPunishPeopleModal from './modules/SmartPunishPeopleModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import SelectUserByDep from '@/components/jeecgbiz/modal/SelectUserByDep'
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: 'SmartPunishPeopleList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SmartPunishPeopleModal,SelectUserByDep,JInput
    },
    data () {
      return {
        description: '处分人员表管理页面',
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
/*          {
            title:'处分人Id',
            align:"center",
            dataIndex: 'punishId'
          },*/
          {
            title:'处分人姓名',
            align:"center",
            dataIndex: 'punishName',
            sorter: true
          },
          /*{
            title:'单位ID',
            align:"center",
            dataIndex: 'departId'
          },*/
          {
            title:'单位',
            align:"center",
            dataIndex: 'departName',
            sorter: true
          },
          {
            title:'职务',
            align:"center",
            dataIndex: 'position',
            sorter: true
          },
          {
            title:'职级',
            align:"center",
            dataIndex: 'positionRank_dictText',
            sorter: true
          },
          {
            title:'手机号',
            align:"center",
            dataIndex: 'phone',
            sorter: true
          },
          {
            title:'处分类型',
            align:"center",
            dataIndex: 'punishType_dictText',
            sorter: true
          },
          {
            title:'处分开始时间',
            align:"center",
            dataIndex: 'beginTime',
            sorter: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'解除处分时间',
            align:"center",
            dataIndex: 'removeTime',
            sorter: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'处分状态',
            align:"center",
            dataIndex: 'statu_dictText',
            sorter: true
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
          list: "/SmartPunishPeople/smartPunishPeople/list",
          delete: "/SmartPunishPeople/smartPunishPeople/delete",
          deleteBatch: "/SmartPunishPeople/smartPunishPeople/deleteBatch",
          exportXlsUrl: "/SmartPunishPeople/smartPunishPeople/exportXls",
          importExcelUrl: "SmartPunishPeople/smartPunishPeople/importExcel",
          
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
        fieldList.push({type:'string',value:'punishId',text:'处分人'})
        fieldList.push({type:'string',value:'punishName',text:'处分人姓名',dictCode:''})
        fieldList.push({type:'string',value:'departId',text:'单位ID',dictCode:''})
        fieldList.push({type:'string',value:'departName',text:'单位',dictCode:''})
        fieldList.push({type:'string',value:'position',text:'职务',dictCode:''})
        fieldList.push({type:'string',value:'positionRank',text:'职级',dictCode:'position_rank'})
        fieldList.push({type:'string',value:'phone',text:'手机号',dictCode:''})
        fieldList.push({type:'string',value:'punishType',text:'处分类型',dictCode:'punish_type'})
        fieldList.push({type:'date',value:'beginTime',text:'处分开始时间'})
        fieldList.push({type:'date',value:'removeTime',text:'解除处分时间'})
        fieldList.push({type:'string',value:'statu',text:'处分状态',dictCode:'punish_statu'})
        this.superFieldList = fieldList
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>