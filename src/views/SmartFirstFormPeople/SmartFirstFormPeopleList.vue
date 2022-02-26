<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="被谈话人单位">
              <j-select-depart placeholder="请输入被谈话人单位" v-model="queryParam.intervieweeDept" customReturnField='orgCode'></j-select-depart>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="被谈话人姓名">
              <j-input placeholder="请输入被谈话人姓名" v-model="queryParam.intervieweeName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="谈话人单位">
                <j-select-depart placeholder="请输入谈话人单位" v-model="queryParam.talkerDept" customReturnField='orgCode'></j-select-depart>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="谈话人姓名">
                <j-input placeholder="请输入谈话人姓名" v-model="queryParam.talkerName"></j-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('执行第一种形态人员表')">导出</a-button>
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <!-- 高级查询区域 -->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
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

    <smart-first-form-people-modal ref="modalForm" @ok="modalFormOk"></smart-first-form-people-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartFirstFormPeopleModal from './modules/SmartFirstFormPeopleModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'SmartFirstFormPeopleList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SmartFirstFormPeopleModal
    },
    data () {
      return {
        description: '执行第一种形态人员表管理页面',
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
            },
          },
          {
            title:'案件标题',
            align:"center",
            dataIndex: 'caseName',
            sorter: true
          },
          {
            title:'被谈话人单位',
            align:"center",
            dataIndex:'intervieweeDept_dictText',
            sorter: true
          },
          {
            title:'被谈话人姓名',
            align:"center",
            dataIndex: 'intervieweeName',
            sorter: true
          },
          {
            title:'谈话人单位',
            align:"center",
            dataIndex: 'talkerDept_dictText',
            sorter: true
          },
          {
            title:'谈话人姓名',
            align:"center",
            dataIndex: 'talkerName',
            sorter: true
          },
          {
            title:'办理部门',
            align:"center",
            dataIndex: 'handlerDepart_dictText',
            sorter: true
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
                return '免审'
              }
            }
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
          list: "/SmartFirstFormPeople/smartFirstFormPeople/list",
          delete: "/SmartFirstFormPeople/smartFirstFormPeople/delete",
          deleteBatch: "/SmartFirstFormPeople/smartFirstFormPeople/deleteBatch",
          exportXlsUrl: "/SmartFirstFormPeople/smartFirstFormPeople/exportXls",
          importExcelUrl: "SmartFirstFormPeople/smartFirstFormPeople/importExcel",
          
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
        fieldList.push({type:'string',value:'caseName',text:'案件标题',dictCode:''})
        fieldList.push({type:'string',value:'caseSource',text:'案件（线索来源）',dictCode:''})
        fieldList.push({type:'string',value:'intervieweeId',text:'被谈话人',dictCode:''})
        fieldList.push({type:'string',value:'intervieweeDept',text:'被谈话人单位',dictCode:'sys_depart,depart_name,org_code'})
        fieldList.push({type:'string',value:'intervieweeName',text:'被谈话人姓名',dictCode:''})
        fieldList.push({type:'string',value:'intervieweeSex',text:'被谈话人性别',dictCode:''})
        fieldList.push({type:'string',value:'intervieweeEthnicity',text:'被谈话人民族',dictCode:'ethnicity'})
        fieldList.push({type:'string',value:'intervieweePolsta',text:'被谈话人政治面貌',dictCode:'political_status'})
        fieldList.push({type:'string',value:'intervieweeJpt',text:'被谈话人入党时间',dictCode:''})
        fieldList.push({type:'string',value:'intervieweePost',text:'被谈话人职务',dictCode:'sys_position,name,code'})
        fieldList.push({type:'string',value:'intervieweePostrank',text:'被谈话人职级',dictCode:'position_rank'})
        fieldList.push({type:'string',value:'principal',text:'是否党政正职',dictCode:'yn'})
        fieldList.push({type:'string',value:'country',text:'是否国家检查队形',dictCode:'yn'})
        fieldList.push({type:'string',value:'authority',text:'干部管理权限',dictCode:''})
        fieldList.push({type:'string',value:'supervision',text:'是否是纪检监察干部',dictCode:'yn'})
        fieldList.push({type:'string',value:'talkerId',text:'谈话人',dictCode:''})
        fieldList.push({type:'string',value:'talkerDept',text:'谈话人单位',dictCode:'sys_depart,depart_name,org_code'})
        fieldList.push({type:'string',value:'talkerName',text:'谈话人姓名',dictCode:''})
        fieldList.push({type:'string',value:'talkerPost',text:'谈话人职务',dictCode:'sys_position,name,code'})
        fieldList.push({type:'string',value:'talkerPostrank',text:'谈话人职级',dictCode:'position_rank'})
        fieldList.push({type:'string',value:'caseAbs',text:'简要案情',dictCode:''})
        fieldList.push({type:'sel_depart',value:'handlerDepart',text:'办理部门'})
        fieldList.push({type:'string',value:'verifyStatus',text:'审理状态'})
        fieldList.push({type:'string',value:'type',text:'类型',dictCode:'first_form_type'})
        fieldList.push({type:'string',value:'situation',text:'情形',dictCode:''})
        fieldList.push({type:'date',value:'talkTime',text:'谈话时间'})
        fieldList.push({type:'string',value:'measures',text:'组织措施',dictCode:''})
        fieldList.push({type:'string',value:'decisionOrgan',text:'采取组织措施决定机关',dictCode:''})
        fieldList.push({type:'string',value:'annex',text:'附件',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>