<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="本月帖子数" content="8" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本月互动数" content="32" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本月浏览数" content="24"/>
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false">

      <div >
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
        <a-form-item >
          <j-select-depart placeholder="请选择村镇"></j-select-depart>
        </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item >
            <j-input placeholder="请输入标题" ></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </div>


      <a-list size="large" :pagination="{showSizeChanger: false, showQuickJumper: true, pageSize: 10}">
        <a-list-item :key="index" v-for="(item, index) in topicList">
          <a-list-item-meta :description="item.title">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.user.avatar"/>
            <a slot="title">{{ item.user.username }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleDetail(item)">详情</a>
            <a-divider type="vertical" />
            <a>删除</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>发帖时间</span>
              <p>{{ item.inTime }}</p>
            </div>
            <div class="list-content-item">
              <span>浏览数</span>
              <p>{{ item.view }}</p>
            </div>
            <div class="list-content-item">
              <span>评论数</span>
              <p>{{ item.commentCount}}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
      <home-modal ref="HomeModal" @ok="loadData"/>
    </a-card>
  </div>
</template>

<script>
  import HeadInfo from '@/components/tools/HeadInfo'
  import HomeModal from './modules/HomeModal'
  import {queryTopicList} from '@/api/api'

  export default {
    name: "Home",
    components: {
      HeadInfo,
      HomeModal
    },
    data () {
      return {
        topicList:[]

      }
    },
    created() {
      this.loadData();
    },
    methods:{
      loadData() {
        var that = this
        that.topicList = []
        queryTopicList().then((res) => {
          if (res.success) {
            that.topicList = res.result;
          }
        })
        // $.ajax({
        //   type: "get",
        //   url: "/village2/smartVillageTopic/queryTopicList",
        //   data: {
        //   },
        //   dataType: "json",
        //   success: function (data) {
        //     if (data.code === 1) {
        //       that.$message({
        //         showClose: true,
        //         message: data.message,
        //         type: "error"
        //       })
        //       that.data = []
        //       return;
        //     }
        //     that.data = data.data
        //     console.log("可以得到信息")
        //   },
        //   error: function (data) {
        //     that.$message({
        //       message: "村镇问答信息查询失败",
        //       type: "error"
        //     })
        //     that.data = []
        //
        //   },
        //   complete: function (data, statusText) {
        //   }
        // });
      },
      handleDetail(record) {
        this.$refs.HomeModal.view(record)
        this.$refs.HomeModal.title = '村情互动'
      },
      close () {
        this.$emit('close');
        this.visible = false;
        // this.$refs.form.resetFields();
      },
      handleExit () {
        this.close()
      },
    }
  }
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>