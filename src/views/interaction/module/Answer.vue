<template>
  <j-modal
    :title="title"
    :width="modelStyle.width"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :switchFullscreen="switchFullscreen"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button type="primary" key="submit" @click="handleSubmit">发布回答</a-button>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
    <a-card class="daily-article" :loading="loading">
      <a-card-meta
        :title="record.title"
        :description="'提问人：' + record.createBy + ' 提问时间： ' + record.createTime"
      >
      </a-card-meta>
      <a-divider />
      <span v-html="record.content" class="article-content"></span>
      <div v-if="fieldList !== {}"></div>
    </a-card>
    <a-card>
      <a-card-meta title="回复"></a-card-meta>
      <a-list
        :bordered="false"
        style="width: 100%; background-color: white; padding: 1rem 0"
        :pagination="ipagination"
        :data-source="commentList"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-row style="width: 100%; flex-flow: row nowrap" type="flex" justify="start" align="middle">
            <a-col style="margin-right: 1rem">
              <a-avatar shape="square" :size="64" :style="{ backgroundColor: 'blue', verticalAlign: 'middle' }"
                >{{item.createBy.slice(0,3)}}</a-avatar>
            </a-col>
            <a-col :flex="10">
              <p>{{item.content}}</p>
              <a-row type="flex" style="font-size: 0.5rem; color: gray">
                <div>{{ item.createBy }}</div>
                <span style="padding: 0 10px">•</span>
                <div>{{ item.createTime }}</div>
              </a-row>
            </a-col>
          </a-row>
        </a-list-item>
      </a-list>
      <j-form-container>
        <!-- 主表单区域 -->
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="回答" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
                <a-input
                  v-model="content"
                  type="textarea"
                  placeholder="请输入回答"
                  :auto-size="{ minRows: 3, maxRows: 10 }"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
    </a-card>
  </j-modal>
</template>

<script>
import { getAction, postAction, putAction } from '../../../api/manage'
export default {
  name: 'AnswerModal',
  components: {},
  data() {
    return {
      title: '问题详情',
      record: {},
      status: '',
      content: '',
      commentList: [],
      ipagination: {
        page: 1,
        pageSize: 10,
        onChange: (page) => {
          this.ipagination.page = page
          this.getComment()
        },
        
        // pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      modelStyle: {
        width: document.body.clientWidth < 600 ? '100%' : '70%',
        style: { top: '20px' },
        fullScreen: false,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      visible: false,
      switchFullscreen: true,
      loading: false,
      bodyStyle: {
        padding: '0',
        height: window.innerHeight * 0.8 + 'px',
        'overflow-y': 'auto',
      },
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  methods: {
    edit(record) {
      this.visible = true
      this.record = record
      this.getComment(record)
      console.log(record)
    },
    getComment(record) {
      const params = {
        topicId: record.id,
        pageNo: this.ipagination.page,
        pageSize: this.ipagination.pageSize,
      }
      getAction('/interaction/comment/list', params).then((res) => {
        if (res.success) {
          this.commentList = res.result.records
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    /** 切换全屏显示 */
    handleClickToggleFullScreen() {
      let mode = !this.modelStyle.fullScreen
      if (mode) {
        this.modelStyle.width = '100%'
        this.modelStyle.style.top = '20px'
      } else {
        this.modelStyle.width = '60%'
        this.modelStyle.style.top = '50px'
      }
      this.modelStyle.fullScreen = mode
    },
    toHandle() {
      if (this.record.openType === 'url') {
        this.visible = false
        //链接跳转
        this.$router.push({ path: this.record.openPage })
      }
    },
    handleSubmit() {
      const params = {
        topicId: this.record.id,
        content: this.content,
      }
      console.log(params)

      postAction('/interaction/comment/add', params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.getComment(this.record)
          this.$emit('ok')
        } else {
          this.$message.error(res.message)
        }
      })
      this.content = ''
    },
  },
}
</script>

<style lang="less">
.announcementCustomModal {
  .ant-modal-header {
    border: none;
    display: inline-block;
    position: absolute;
    z-index: 1;
    right: 56px;
    padding: 0;
    .ant-modal-title {
      .custom-btn {
        width: 56px;
        height: 56px;
        border: none;
        box-shadow: none;
      }
    }
  }
  .daily-article {
    border-bottom: 0;
  }
}
</style>
<style scoped lang="less">
.daily-article {
  .article-button {
    font-size: 1.2rem !important;
  }
  .ant-card-body {
    padding: 18px !important;
  }
  .ant-card-head {
    padding: 0 1rem;
  }
  .ant-card-meta {
    margin-bottom: 1rem;
  }
  .article-content {
    p {
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: initial;
      white-space: normal;
      font-size: 0.9rem !important;
      margin-bottom: 0.8rem;
    }
  }
}
</style>
