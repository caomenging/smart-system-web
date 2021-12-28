<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button type="primary" icon="download" @click="handleExportXls('选择结果')">导出</a-button>-->
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload>-->
    </div>
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
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record">
          <a @click="beginSurvey(record)" :class="isDisabled(record)">开始调查</a>
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
import { getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { ACCESS_TOKEN,TENANT_ID } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  name: 'SelectedPeopleAppList',
  //   mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      title:'',
      paperId:'',
      description: '选择结果',
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
      anntId: '',
      // 查询条件
      queryParam: {},
      // 表头
      columns: [
        /*{
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },*/
        // {
        //   title: '户主',
        //   align: 'center',
        //   dataIndex: 'hostId_dictText',
        // },
        {
          title: '被访人',
          align: 'center',
          dataIndex: 'realname',
        },
        // {
        //   title: '手机号',
        //   align: 'center',
        //   dataIndex: 'phone',
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          width:100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      //   detailModal: { visible: false, url: '' },
      url: {
        list: '/SmartPaper/smartPeople/SYPeopleList',
        delete: '/sys/annountCement/delete',
        deleteBatch: '/sys/annountCement/deleteBatch',
        releaseDataUrl: '/sys/annountCement/doReleaseData',
        reovkeDataUrl: 'sys/annountCement/doReovkeData',
        //exportXlsUrl: 'sys/annountCement/exportXls',
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
    //token header
    tokenHeader(){
      let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
      let tenantid = Vue.ls.get(TENANT_ID)
      if(tenantid){
        head['tenant-id'] = tenantid
      }
      return head;
    }
  },
  methods: {
    isDisabled(record){
      if ( record.isFinish === "0") {
        //激活开始调查
        //console.log('激活发布');
      } else if ( record.isFinish === "1"){
        //console.log('No发布');
        return "disabled";
      }
    },
    edit(paperId,departId) {
      console.log(paperId,departId)
      this.$nextTick(() => {
        this.paperId = paperId
        // this.anntId = record.id
        // console.log(this.anntId)
        this.loadData(1, paperId,departId)
      })
      //   this.$emit('ok')
    },
    beginSurvey(record){
        console.log(record);
        let paperId = this.paperId
        let userName = record.realname
        let userId = record.userId
        let hostText = record.hostId_dictText
      this.$router.push({
        name: "myTriPrePlusAppSurvey",
        query: {paperId,userName,userId,hostText}
      });
        // const { href } = this.$router.resolve({
        //   name: "myTriPrePlusSurvey",
        //   query: {paperId,userName,userId}
        // });
        // const win = window.open(href, "_blank");
        // const loop = setInterval(item => {
        //   if (win.closed) {
        //     clearInterval(loop);
        //     this.$ref.table.reload();
        //   }
        // }, 1000);
      },
    loadData(arg, paperId,departId) {
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
      getAction(this.url.list, {paperId:paperId,departId:departId})
        .then((res) => {
          if (res.success) {
            this.dataSource = res.result.records || res.result
            let i = 0
            for(i=0;i<this.dataSource.length;i++){
              if(this.dataSource[i].examGrade === "-1" ){
                this.dataSource[i].examGrade = '未参与调查'
              }else if(this.dataSource[i].examGrade === "0" && this.dataSource[i].isMark === 0){
                this.dataSource[i].examGrade = '已参与调查'
              }
            }
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
      fieldList.push({type:'string',value:'hostId',text:'户主',dictCode:'sys_user,realname,id'})
      fieldList.push({type:'string',value:'userId',text:'被访人ID',dictCode:''})
      fieldList.push({type:'string',value:'realname',text:'被访人',dictCode:''})
      fieldList.push({type:'string',value:'phone',text:'手机号',dictCode:''})
      fieldList.push({type:'string',value:'isFinish',text:'',dictCode:'is_finish'})
      this.superFieldList = fieldList
    },
    /* 导出 */
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }else{
        fileName = this.title
      }
      let param = this.getQueryParams();
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      }
      Object.assign(param,{title:this.title},{examId:this.examId})
      console.log("导出参数",param)
      downFile(this.url.exportXlsUrl,param).then((data)=>{
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text){
      if(!text){
        this.$message.warning("未知的文件")
        return;
      }
      if(text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
  },
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';
.disabled {
  pointer-events: none;
  filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
  -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
  opacity: 0.5; /*其他，透明度50%*/
}
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