<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="文件主题">
              <a-input placeholder="请输入文件主题" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

<!--    &lt;!&ndash; 操作按钮区域 &ndash;&gt;-->
<!--    <div class="table-operator">-->
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button type="primary" icon="download" @click="handleExportXls('资料库')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
<!--                @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
<!--      &lt;!&ndash; 高级查询区域 &ndash;&gt;-->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal"-->
<!--                     @handleSuperQuery="handleSuperQuery"></j-super-query>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-menu slot="overlay">-->
<!--          <a-menu-item key="1" @click="batchDel">-->
<!--            <a-icon type="delete"/>-->
<!--            删除-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--        <a-button style="margin-left: 8px"> 批量操作-->
<!--          <a-icon type="down"/>-->
<!--        </a-button>-->
<!--      </a-dropdown>-->
<!--    </div>-->

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a-->
<!--        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

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
          <img v-else :src="getImgView(text)" height="25px" alt=""
               style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
          <a @click="handlePreview(record)">预览</a>
        </span>

      </a-table>
    </div>

    <smart-data-sheet-new-modal ref="modalForm" @ok="modalFormOk"></smart-data-sheet-new-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import {mixinDevice} from '@/utils/mixin'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import SmartDataSheetNewModal from './modules/SmartDataSheetNewModal'
import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import {Base64} from "js-base64";

export default {
  name: 'SmartDataSheetNewList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SmartDataSheetNewModal
  },
  data() {
    return {
      description: '资料库管理页面',
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 60,
        //   align: "center",
        //   customRender: function (t, r, index) {
        //     return parseInt(index) + 1;
        // //   }
        // },
        {
         // title: '文件主题',
          align: "left",
          dataIndex: 'name',
          scopedSlots: {customRender: 'name'}
        },
        // {
        //   title: '文件类型',
        //   align: "center",
        //   dataIndex: 'type_dictText'
        // },
        // {
        //   title: '发布单位',
        //   align: "center",
        //   dataIndex: 'departmentid'
        // },
        // {
        //   title: '发布人',
        //   align: "center",
        //   dataIndex: 'publisher'
        // },
        // {
        //   title: '文件描述',
        //   align: "center",
        //   dataIndex: 'describeA',
        //   scopedSlots: {customRender: 'htmlSlot'}
        // },
        // {
        //   title: '创建日期',
        //   align: "center",
        //   dataIndex: 'createTime'
        // },
        // {
        //   title: '文件下载',
        //   align: "center",
        //   dataIndex: 'file',
        //   scopedSlots: {customRender: 'fileSlot'}
        // },
        // {
        //   title: '下载次数',
        //   align: "center",
        //   dataIndex: 'times'
        // },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: "center",
        //   fixed: "right",
        //   width: 60,
        //   scopedSlots: {customRender: 'action'}
        // }
      ],
      url: {
        list: "/smart_data_sheet_new/smartDataSheetNewP/list",
        delete: "/smart_data_sheet_new/smartDataSheetNewP/delete",
        deleteBatch: "/smart_data_sheet_new/smartDataSheetNewP/deleteBatch",
        exportXlsUrl: "/smart_data_sheet_new/smartDataSheetNewP/exportXls",
        importExcelUrl: "smart_data_sheet_new/smartDataSheetNewP/importExcel",

      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    handlePreview(record) {
      let url = window._CONFIG['staticDomainURL'] + "/" + record.file
      let previewURL = window._CONFIG['filePreViewURL']
      window.location.href = previewURL + encodeURIComponent(Base64.encode(url))
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = [];
      fieldList.push({type: 'string', value: 'name', text: '文件主题', dictCode: ''})
      fieldList.push({type: 'int', value: 'type', text: '文件类型', dictCode: 'type_data'})
      fieldList.push({type: 'string', value: 'departmentid', text: '发布单位', dictCode: ''})
      fieldList.push({type: 'sel_user', value: 'publisher', text: '发布人'})
      fieldList.push({type: 'Text', value: 'describe1', text: '文件描述', dictCode: ''})
      fieldList.push({type: 'datetime', value: 'createTime', text: '创建日期'})
      fieldList.push({type: 'string', value: 'file', text: '上传文件', dictCode: ''})
      fieldList.push({type: 'int', value: 'times', text: '下载次数', dictCode: ''})
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>