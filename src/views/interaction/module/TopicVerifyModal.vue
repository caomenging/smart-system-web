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
      <a-button type="primary" key="submit" @click="handleSubmit">提交</a-button>
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
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="是否通过">
        <a-radio-group v-model="status">
          <a-radio value='1'> 是 </a-radio>
          <a-radio value='2'> 否 </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
import { putAction } from '../../../api/manage'
export default {
  name: 'TopicVerifyModal',
  components: {},
  data() {
    return {
      title: '通知消息',
      record: {},
      status: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      visible: false,
      switchFullscreen: true,
      loading: false,
      bodyStyle: {
        padding: '0',
        height: window.innerHeight * 0.8 + 'px',
        'overflow-y': 'auto',
      },
      modelStyle: {
        width: '60%',
        style: { top: '20px' },
        fullScreen: false,
      },
    }
  },
  beforeCreate() {
  },
  created() {
  },
  mounted() {},
  methods: {
    edit(record) {
      this.visible = true
      this.record = record
      console.log(record)
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
        id: this.record.id,
        status: parseInt(this.status),
      }
      console.log(params)
      putAction('/interaction/verify',params).then((res) => {
        if(res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
        } else {
          this.$message.error(res.message)
        }
      })
      this.status = ''
      this.visible = false
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
