<template>
  <a-card :bordered="false">
    
    <!-- table区域-begin -->
    <!-- <div>
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :scroll="{ x: true }"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
        <!-- <a-divider type="vertical" />
          <a @click="checkDetail(record)">详情</a> -->
      </span>
    </a-table>
    <!-- </div> -->
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { filterObj } from '@/utils/util'
import SysAnnouncementModal from '@/views/system/modules/SysAnnouncementModal'
import { doReleaseData, doReovkeData } from '@/api/api'
import { getAction } from '@/api/manage'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'TaskDetailList',
  //   mixins: [JeecgListMixin],
  components: {},
  created() {
    //   this.editAfter()
  },
  data() {
    return {
      description: '系统通告表管理页面',
      upurl: window._CONFIG['domianURL'] + '/sys/common/static/',
      fileList: [],
      dataSource: [],
      superFieldList: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      /** 高级查询拼接方式 */
      superQueryMatchType: 'and',
      loading: false,
      anntId: '',
      // 查询条件
      queryParam: {},
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
          title: '标题',
          align: 'center',
          dataIndex: 'titile',
        },
        {
          title: '接收人',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '接收部门',
          align: 'center',
          dataIndex: 'orgCode_dictText',
        },
        {
          title: '是否查收',
          align: 'center',
          dataIndex: 'readFlag',
          customRender: function (text) {
            if (text == '0') {
              return '未读'
            } else {
              return '已读'
            }
          },
        },
        {
          title: '是否超时',
          align: 'center',
          dataIndex: 'isDelay',
          customRender: function (text) {
            if (text == 0) {
              return '否'
            } else {
              return '是'
            }
          },
        },
        {
          title: '查看时间',
          align: 'center',
          dataIndex: 'readTime',
        },
        {
          title: '提交备注',
          align: 'center',
          dataIndex: 'submitRemark',
        },
        {
          title: '提交文件',
          align: 'center',
          dataIndex: 'submitFile',
          customRender: (text) => {
            if (text) {
              const url = 'http://127.0.0.1:8080/smart-system/sys/common/static/' + text
              const type = text.split('.').pop()
              const name = text.split('/').pop().split('_')[0]
              const fileName = name + '.' + type
              console.log(url)
              return <a href={url}>{fileName}</a>
            }
          },
        },
        {
          title: '下载时间',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //   detailModal: { visible: false, url: '' },
      url: {
        list: '/sys/sysAnnouncementSend/getTaskDetail',
        delete: '/sys/annountCement/delete',
        deleteBatch: '/sys/annountCement/deleteBatch',
        releaseDataUrl: '/sys/annountCement/doReleaseData',
        reovkeDataUrl: 'sys/annountCement/doReovkeData',
        exportXlsUrl: 'sys/annountCement/exportXls',
        importExcelUrl: 'sys/annountCement/importExcel',
      },
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    edit(record) {
      console.log(record)
      this.$nextTick(() => {
        this.anntId = record.id
        console.log(this.anntId)
        this.loadData(1)
      })
      //   this.$emit('ok')
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, params)
        .then((res) => {
          if (res.success) {
            this.dataSource = res.result.records || res.result
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.anntId = this.anntId
      //   param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    handleBatchDownload(title) {
      const params = {
        anntId: this.anntId,
      }
      getAction('/sys/sysAnnouncementSend/getSubmitFileList', params).then((res) => {
        if (res.success) {
          res.result.map((item) => {
            if (item) {
              this.fileList.push(this.upurl + item)
            }
          })
          console.log(this.fileList)
          this.downFileZip(title)
        }
      })
    },
    downFileZip(title) {
      const data = this.fileList // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
      const zip = new JSZip()
      const cache = {}
      const promises = []
      data.forEach((item) => {
        console.log(item)
        const promise = this.getFile(item).then((data) => {
          // 下载文件, 并存成ArrayBuffer对象
          const arr_name = item.split('/')
          const file_name = arr_name[arr_name.length - 1] // 获取文件名
          zip.file(file_name, data, { binary: true }) // 逐个添加文件
          cache[file_name] = data
        })
        promises.push(promise)
      })

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, title + '提交附件' + '.zip') // 利用file-saver保存文件
        })
      })
    },
    getFile(url) {
      console.log(url)
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: 'arraybuffer',
        })
          .then((data) => {
            console.log(data)
            resolve(data.data)
          })
          .catch((error) => {
            reject(error.toString())
          })
      })
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({
        type: 'string',
        value: 'orgCode',
        text: '所属部门',
        dictCode: 'sys_depart,depart_name,org_code',
      })
      this.superFieldList = fieldList
    },
  },
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

/** 查看详情弹窗的样式 */
.detail-modal {
  .detail-iframe {
    border: 0;
    width: 100%;
    height: 88vh;
    min-height: 600px;
  }

  &.fullscreen .detail-iframe {
    height: 100%;
  }
}

.detail-modal /deep/ .ant-modal {
  top: 30px;

  .ant-modal-body {
    font-size: 0;
    padding: 0;
  }
}

.detail-modal.fullscreen /deep/ .ant-modal {
  top: 0;
}
</style>