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

      <!-- 高级查询区域 -->

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>

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
          <a @click="handleIssueExam(record)">发布考试</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">查看</a>

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

    <smart-paper-modal ref="modalForm" @ok="modalFormOk"></smart-paper-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SmartPaperModal from '../SmartPaper/modules/SmartPaperModal'
//import SmartExamInformationModal from '../SmartExamInformation/modules/SmartExamInformationModal'
//import SmartPeopleModal from '../SmartPeople/modules/SmartPeopleModal'
import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import { putAction, getAction } from '@/api/manage'

export default {
  name: 'MyQuestionList',
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    SmartPaperModal/*,SmartExamInformationModal,SmartPeopleModal*/
  },
  data () {
    return {
      description: '试卷发布页面',
      paper_status:'未发布', //数据库表里没有设默认值
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
          title:'试卷类型',
          align:"center",
          dataIndex: 'paperType_dictText'
        },
        {
          title:'试卷名称',
          align:"center",
          dataIndex: 'paperName'
        },
        {
          title:'试卷状态',
          align:"center",
          dataIndex: 'paperStatus_dictText'
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
        add:"/SmartPaper/smartPaper/add",
        edit: "/SmartPaper/smartPaper/edit/{id}",
        list: "/SmartPaper/smartPaper/list",
        delete: "/SmartPaper/smartPaper/delete",
        deleteBatch: "/SmartPaper/smartPaper/deleteBatch",
        exportXlsUrl: "/SmartPaper/smartPaper/exportXls",
        importExcelUrl: "SmartPaper/smartPaper/importExcel",

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

    handleIssueExam(record){//试卷发布

      console.log(record)


      const params = {
        id: record.id,
        paperStatus: '2'
      }
      putAction(this.url.edit, params).then((res) => {
        if(res.success){
          this.$router.push({path:'/MyQuestion/ContentForm'})
        }
      })


    },

    getSuperFieldList(){
      let fieldList=[];
      fieldList.push({type:'string',value:'paperType',text:'试卷类型',dictCode:'paper_type'})
      fieldList.push({type:'string',value:'paperName',text:'试卷名称',dictCode:''})
      fieldList.push({type:'string',value:'paperStatus',text:'试卷状态',dictCode:'paper_status'})
      fieldList.push({type:'string',value:'createBy',text:'命卷人',dictCode:''})
      fieldList.push({type:'datetime',value:'createTime',text:'命卷日期'})
      fieldList.push({type:'string',value:'topicNum',text:'题目数量',dictCode:''})
      fieldList.push({type:'string',value:'totalScore',text:'总分',dictCode:''})
      fieldList.push({type:'string',value:'passMark',text:'及格线',dictCode:''})
      fieldList.push({type:'int',value:'time',text:'答题时间',dictCode:''})
      this.superFieldList = fieldList
    }
  }
}
</script>
