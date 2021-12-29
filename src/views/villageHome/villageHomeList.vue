<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
<!--            <a-form-item label="所属乡镇">-->
<!--              <a-input placeholder="请输入所属乡镇" v-model="queryParam.departId"></a-input>-->
<!--            </a-form-item>-->
            <a-form-model-item label="所在乡镇、村" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departId">
              <!-- <j-select-depart v-model="model.selecteddeparts" :multi="false" @back="backDepartInfo" :backDepart="true" :treeOpera="true"/>-->
              <a-tree-select
                style="width:100%"
                :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                :treeData="departTree"
                v-model="queryParam.departId"
                placeholder="请选择乡镇、村"
                allow-clear
                tree-default-expand-all>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="户主姓">
              <a-input placeholder="请输入户主姓" v-model="queryParam.homeSurname"></a-input>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="download" @click="handleExportXls('乡镇户口表')">导出</a-button>
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

    <village-home-modal ref="modalForm" @ok="modalFormOk"></village-home-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import villageHomeModal from './modules/villageHomeModal'
  import { queryVillageIdTree} from '@/api/api'

  export default {
    name: 'villageHomeList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      villageHomeModal
    },
    data () {
      return {
        description: '乡镇户口表管理页面',
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
            title:'户籍编号',
            align:"center",
            dataIndex: 'homeCode'
          },
          {
            title:'户主姓',
            align:"center",
            dataIndex: 'homeSurname'
          },
          {
            title:'家庭地址',
            align:"center",
            dataIndex: 'address'
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
          list: "/villageHome/villageHome/list",
          delete: "/villageHome/villageHome/delete",
          deleteBatch: "/villageHome/villageHome/deleteBatch",
          exportXlsUrl: "/villageHome/villageHome/exportXls",
          importExcelUrl: "villageHome/villageHome/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        departTree:[],
      }
    },
    created() {
    this.getSuperFieldList();
      this.loadVillageTreeData();
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
        fieldList.push({type:'string',value:'departId',text:'村庄',dictCode:''})
        fieldList.push({type:'string',value:'homeCode',text:'户籍编号',dictCode:''})
        fieldList.push({type:'string',value:'homeSurname',text:'户主姓',dictCode:''})
        fieldList.push({type:'string',value:'hostId',text:'户主',dictCode:''})
        fieldList.push({type:'string',value:'address',text:'家庭地址',dictCode:''})
        this.superFieldList = fieldList
      },
      loadVillageTreeData(){
        var that = this;
        this.departTee = []
        queryVillageIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let j = 0; j < res.result.length; j++) {
              let temp = res.result[j];
              that.departTree.push(temp);
            }
          }

        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>