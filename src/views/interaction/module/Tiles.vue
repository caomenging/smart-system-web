<template>
  <div>
    <div style="padding: 10px">
      <a-list
        :bordered="false"
        style="width: 100%; background-color: white;padding: 1rem 0"
        :pagination="ipagination"
        :data-source="listData"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-row style="width:100%; flex-flow: row nowrap;padding:0 0.75rem" type="flex" justify="space-between" align="middle">
            <a-col style="margin-right: 1rem" :flex="4">
              <a-avatar shape="square" :size="60" :style="{ backgroundColor: 'blue', verticalAlign: 'middle' }"
                >{{item.createBy.slice(0,3)}}</a-avatar
              >
            </a-col>
            <a-col :pull='4'>
              <h3>{{item.title}}</h3>
              <!-- <p>这是内容简介，这是内容简介，这是内容简介，这是内容简介</p> -->
              <a-row type="flex" style="font-size: 0.5rem; color: gray">
                <div>{{ item.createBy }} </div>
                <span style="padding:0 10px">•</span>
                <div> {{ item.createTime }} </div>
              </a-row>
            </a-col>
            <a-col :flex="8">
              <a-button @click="handleDetail(item)">详情</a-button>
            </a-col>
          </a-row>
        </a-list-item>
      </a-list>
    </div>
    <Answer ref="answerModal" />
  </div>
</template>

<script>
import { filterObj } from '@/utils/util';
import { getAction } from '../../../api/manage'
import Answer from './Answer.vue';
export default {
  components: { Answer },
  created() {
    this.loadData()
  },
  data() {
    return {
      listData: [],
      url: '/interaction/list',
      superQueryParams: '',
      queryParam: {},
      isorter:{
        column: 'createTime',
        order: 'desc',
      },
      ipagination:{
        page: 1,
        pageSize: 10,
        onChange: page => {
          this.ipagination.page = page
          console.log(page);
          this.loadData()
        },
        // pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /** 高级查询拼接方式 */
      superQueryMatchType: 'and',
    }
  },
  methods: {
    loadData(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.page = 1;
      }
      var params = this.getQueryParams()
      getAction(this.url, params).then((res) => {
        console.log(res)
        if (res.success) {
          this.listData = res.result.records
          if(res.result.total)
          {
            this.ipagination.total = res.result.total;
          }else{
            this.ipagination.total = 0;
          }
        }
      })
    },
    getQueryParams() {
      console.log(this.ipagination.page)
      //获取查询条件
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter);
      param.pageNo = this.ipagination.page;
      param.pageSize = this.ipagination.pageSize;
      console.log(param)
      return filterObj(param);
    },
    handleDetail(record){
      console.log(record)
      this.$refs.answerModal.edit(record)
    },
    handleChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
  },
}
</script>

<style>
</style>