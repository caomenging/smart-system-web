<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

        <a-col :md="6" :sm="8">
          <a-form-item label="任务类型">
            <a-input placeholder="" v-model="queryParam.taskType"></a-input>
          </a-form-item>
        </a-col>

        <a-col :md="6" :sm="8">
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('审核列表')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <!-- <a-button type="primary" icon="import">导入</a-button> -->
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width: 80px; font-size: 12px; font-style: italic"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="aa(record)">详情</a>

          <!-- <a @click="handleVerify(record)">审核</a> -->

          <!-- <a-divider type="vertical" /> -->
          <!-- <a-dropdown>
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
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <tasks-modal ref="modalForm" @ok="modalFormOk"> </tasks-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TasksModal from './modules/TasksModal'
//   import SmartPremaritalFilingModal from './modules/SmartPremaritalFilingModal'
import '@/assets/less/TableExpand.less'

export default {
  name: 'TaskList',
  mixins: [JeecgListMixin],
  components: {
    TasksModal,
  },
  data() {
    return {
      description: '待审核任务列表',
      queryParam:{},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '任务类型',
          align: 'center',
          dataIndex: 'taskType',
        },
        // {
        //   title:'填报单位',
        //   align:"center",
        //   dataIndex: 'sysOrgCode'
        // },
        //   {
        //     title:'单位类型',
        //     align:"center",
        //     dataIndex: 'departType'
        //   },
        //   {
        //     title:'填报人',
        //     align:"center",
        //     dataIndex: 'fillPerson'
        //   },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'flowStatus',
          customRender: function (text) {
            if (text == 1) {
              return '通过'
            } else if (text == 2) {
              return '待审核'
            } else if (text == 0) {
              return '驳回'
            }
          },
        },
        {
          title: '填报日期',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/tasks/smartVerifyTask/myTaskList',
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  methods: {
    aa(record) {
      console.log(record.flowNo)

      this.handleDetail(record)
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>