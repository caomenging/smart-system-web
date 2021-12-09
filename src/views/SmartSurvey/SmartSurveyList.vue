<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-model-item label="调查问卷名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paperName">
              <j-input placeholder="请输入调查问卷名称" v-model="queryParam.paperName"></j-input>
            </a-form-model-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button @click="createTestPaper"  type="primary" icon="plus">创建调查问卷</a-button>

    </div>

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

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
          <!--<a @click="handleEdit(record)">编辑</a>-->
          <a @click="handleIssueSurvey(record)" v-show="record.paperStatus == '0'">发布</a>
          <a-divider type="vertical" />
          <a @click="editTestPaper(record.id)">修改</a>
          <a-divider type="vertical" />
          <a @click="showScore(record)">查看</a>

        </span>

      </a-table>
    </div>

    <smart-paper-modal ref="modalForm" @ok="modalFormOk"></smart-paper-modal>
    <task-detail-modal ref="scoreModal" @ok="modalFormOk"></task-detail-modal>
    <!-- 发布调查问卷弹框 -->
    <ReleaseTest ref="releaseTestDialog" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SmartPaperModal from './modules/SmartPaperModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { httpAction,putAction, postAction,getAction } from '@/api/manage'
  import ReleaseTest from './modules/ReleaseTest'
  import TaskDetailModal from './modules/TaskDetailModal.vue'

  export default {
    name: 'SmartSurveyList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SmartPaperModal,
      ReleaseTest,
      TaskDetailModal
    },
    data () {
      return {
        queryParam:{
          paperType:'2'
        },
        description: '试卷表管理页面',
        // 表头
        columns: [
         /* {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
         /*{
            title:'试卷类型',
            align:"center",
            dataIndex: 'paperType_dictText'
          },*/
          {
            title:'试卷名称',
            align:"center",
            dataIndex: 'paperName',
            width: 100,
            sorter: true
          },
          // {
          //   title:'试卷状态',
          //   align:"center",
          //   dataIndex: 'paperStatus_dictText',
          //   sorter: true
          // },
          // {
          //   title:'命卷人',
          //   align:"center",
          //   dataIndex: 'creatorName',
          //   sorter: true
          // },
          // {
          //   title:'命卷日期',
          //   align:"center",
          //   dataIndex: 'createTime',
          //   sorter: true
          // },
          // {
          //   title:'题目数量',
          //   align:"center",
          //   dataIndex: 'topicNum',
          //   sorter: true
          // },
          // {
          //   title:'总分',
          //   align:"center",
          //   dataIndex: 'totalScore',
          //   sorter: true
          // },
          // /*{
          //   title:'及格线',
          //   align:"center",
          //   dataIndex: 'passMark'
          // },*/
          // {
          //   title:'答题时间',
          //   align:"center",
          //   dataIndex: 'time',
          //   sorter: true
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
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
      flag(){
        console.log(this.$route.query.flag);
        if(this.$route.query.flag){
          this.getSuperFieldList()
        }
      },
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      showScore(record) {
        console.log(record)
        this.$refs.scoreModal.edit(record.id)
      },
      isDisabled(record){
        if ( record.paperStatus === "0") {
          //激活开始考试
          //console.log('激活发布');
        } else if ( record.paperStatus === "2"){
          //console.log('No发布');
          return "disabled";
        }
      },
      //去创建新试卷
      createTestPaper() {
        const { href } = this.$router.resolve({
          name: "createSurvey",
          params: { opt: 'addSurvey'}
        });
        const win  = window.open(href, "_blank");
        const loop = setInterval(item => {
          if (win.closed) {
            clearInterval(loop);
            this.refresh();
          }
        }, 1000);
      },
      // 编辑试卷
      editTestPaper(id) {
        console.log(id);
        const { href } = this.$router.resolve({
          name: "editSurvey",
          params: { opt: 'edit', id}
        });
        const win = window.open(href, "_blank");
        const loop = setInterval(item => {
          if (win.closed) {
            clearInterval(loop);
            this.$ref.table.reload();
          }
        }, 1000);
      },
      detailPage(id){
        console.log(id);
        const { href } = this.$router.resolve({
          name: "editSurvey",
          params: { opt: 'detail', id}
        });
        const win = window.open(href, "_blank");
        const loop = setInterval(item => {
          if (win.closed) {
            clearInterval(loop);
            this.$ref.table.reload();
          }
        }, 1000);
  },
      //试卷发布
      handleIssueSurvey(record){
        console.log(record)
        let paperId = record.id
        this.$refs.releaseTestDialog.releaseTest(paperId)
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'paperType',text:'试卷类型',dictCode:'paper_type'})
        fieldList.push({type:'string',value:'paperName',text:'试卷名称',dictCode:''})
        fieldList.push({type:'string',value:'paperStatus',text:'试卷状态',dictCode:'paper_status'})
        fieldList.push({type:'string',value:'creatorName',text:'命卷人',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'命卷日期'})
        fieldList.push({type:'string',value:'topicNum',text:'题目数量',dictCode:''})
        fieldList.push({type:'string',value:'totalScore',text:'总分',dictCode:''})
        fieldList.push({type:'string',value:'passMark',text:'及格线',dictCode:''})
        fieldList.push({type:'int',value:'time',text:'答题时间',dictCode:''})
        this.superFieldList = fieldList
      }
    },
  }
</script>
