<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div v-if="roleId.indexOf('1465163864583323650') == -1" class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位">
              <j-select-depart
                placeholder="请输入单位"
                v-model="queryParam.workDepartment"
                customReturnField="id"
                :multi="false"
                :treeOpera="true"
              ></j-select-depart>
            </a-form-item>
          </a-col>
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="人员工号">
              <a-input placeholder="请输入人员工号" v-model="queryParam.workNo"></a-input>
            </a-form-item>
          </a-col> -->
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input placeholder="请输入姓名" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
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
      <a-button type="primary" icon="download" @click="handleExportXls('8项规定婚后报备表')">导出Excel</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
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

      <!-- 导出word -->
      <a-button @click="saveFiles" type="primary" icon="download">导出word</a-button>
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

    <smart-post-marriage-report-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SmartPostMarriageReportModal from './modules/SmartPostMarriageReportModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'
import { mapActions, mapGetters, mapState } from 'vuex'

import { myDownload } from '@/api/manage'

// import { downloadFile } from '../../api/manage'

export default {
  name: 'SmartPostMarriageReportList',
  mixins: [JeecgListMixin],
  components: {
    SmartPostMarriageReportModal,
  },
  data() {
    return {
      description: '8项规定婚后报备表管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        // {
        //   title: '人员工号',
        //   align: 'center',
        //   dataIndex: 'workNo',
        // },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex_dictText',
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age',
        },
        {
          title: '政治面貌',
          align: 'center',
          dataIndex: 'politicsStatus_dictText',
        },
        {
          title: '职务',
          align: 'center',
          dataIndex: 'job_dictText',
        },
        {
          title: '职级',
          align: 'center',
          dataIndex: 'jobLevel_dictText',
        },
        {
          title: '婚宴场所名',
          align: 'center',
          dataIndex: 'weddingVenue',
        },
        {
          title: '婚宴场所地址',
          align: 'center',
          dataIndex: 'weddingVenueAddr',
        },
        {
          title: '宴请人数',
          align: 'center',
          dataIndex: 'guestsNumber',
        },
        {
          title: '宴请人员范围',
          align: 'center',
          dataIndex: 'guestsScope',
        },
        {
          title: '宴请费用(元)',
          align: 'center',
          dataIndex: 'weddingCost',
        },
        {
          title: '婚礼用车数量(辆)',
          align: 'center',
          dataIndex: 'weddingCarNumber',
        },
        {
          title: '公车数量(辆)',
          align: 'center',
          dataIndex: 'govCarNumber',
        },
        {
          title: '不符合规定收受礼金(元)',
          align: 'center',
          dataIndex: 'illegalMoney',
        },
        {
          title: '不符合规定收受礼品件数(件)',
          align: 'center',
          dataIndex: 'illegalGiftNumber',
        },
        {
          title: '违规收礼品处置情况',
          align: 'center',
          dataIndex: 'disposalDescribe',
        },
        {
          title: '有无其他违诺行为',
          align: 'center',
          dataIndex: 'otherViolations',
        },
        {
          title: '报告时间',
          align: 'center',
          dataIndex: 'reportTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'phoneNumber',
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'verifyStatus',
          customRender: function (text) {
            if (text == '0') {
              return '不通过'
            } else if (text == '1') {
              return '通过'
            } else if (text == '2') {
              return '待审核'
            } else {
              return '免审'
            }
          },
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
        list: '/smartPostMarriage/smartPostMarriageReport/list',
        delete: '/smartPostMarriage/smartPostMarriageReport/delete',
        deleteBatch: '/smartPostMarriage/smartPostMarriageReport/deleteBatch',
        exportXlsUrl: '/smartPostMarriage/smartPostMarriageReport/exportXls',
        importExcelUrl: 'smartPostMarriage/smartPostMarriageReport/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.roleId = this.userInfo().roleId
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    ...mapGetters(['userInfo']),
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'workDepartment', text: '单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'personId', text: '人员工号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'name', text: '姓名', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sex', text: '性别', dictCode: 'sex' })
      fieldList.push({ type: 'int', value: 'age', text: '年龄', dictCode: '' })
      fieldList.push({ type: 'string', value: 'politicsStatus', text: '政治面貌', dictCode: 'political_status' })
      fieldList.push({ type: 'string', value: 'job', text: '职务', dictCode: 'sys_position,name,code' })
      fieldList.push({ type: 'string', value: 'jobLevel', text: '职级', dictCode: 'position_rank' })
      fieldList.push({ type: 'string', value: 'weddingVenue', text: '婚宴场所名', dictCode: '' })
      fieldList.push({ type: 'string', value: 'weddingVenueAddr', text: '婚宴场所地址', dictCode: '' })
      fieldList.push({ type: 'int', value: 'guestsNumber', text: '宴请人数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'guestsScope', text: '宴请人员范围', dictCode: '' })
      fieldList.push({ type: 'int', value: 'weddingCost', text: '宴请费用', dictCode: '' })
      fieldList.push({ type: 'int', value: 'weddingCarNumber', text: '婚礼用车数量', dictCode: '' })
      fieldList.push({ type: 'int', value: 'govCarNumber', text: '公车数量（婚礼用车中有多少辆公车）', dictCode: '' })
      fieldList.push({ type: 'int', value: 'illegalMoney', text: '不符合规定收受礼金', dictCode: '' })
      fieldList.push({ type: 'int', value: 'illegalGiftNumber', text: '不符合规定收受礼品件数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'disposalDescribe', text: '违规收礼品处置情况', dictCode: '' })
      fieldList.push({ type: 'string', value: 'otherViolations', text: '有无其他违诺行为', dictCode: '' })
      fieldList.push({ type: 'date', value: 'reportTime', text: '报告时间' })
      fieldList.push({ type: 'string', value: 'phoneNumber', text: '联系电话', dictCode: '' })
      this.superFieldList = fieldList
    },
    saveFiles() {
      //记录id
      console.log(this.selectedRowKeys)
      let ids = this.selectedRowKeys.join(",")

      if(ids.length == 0){
        this.$message.error('请选择要导出的数据！')
        return
      }

      //下载zip文件
      myDownload('/smartPostMarriage/smartPostMarriageReport/exportWord', ids).then((res) => {
        if (!res) {
          return
        }
        // 创建文件临时存储地址
        const url = window.URL.createObjectURL(new Blob([res], { type: 'application/zip' }))
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          try {
            window.navigator.msSaveOrOpenBlob(res, '附件.zip')
          } catch (e) {
            this.$message.error('下载附件失败')
          }
        } else {
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.download = '附件.zip'
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }
      })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>