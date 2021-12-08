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
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button v-if="record.openType === 'url'" type="primary" @click="toHandle">去处理</a-button>
    </template>
    <a-card class="daily-article" :loading="loading">
      <a-card-meta :title="record.titile" :description="'发布人：' + record.sender + ' 发布时间： ' + record.sendTime">
      </a-card-meta>
      <a-divider />
      <span v-html="record.msgContent" class="article-content"></span>
      <div v-if="fieldList !== {}">
        <a-divider />
        <div>附件</div>
        <a-upload :fileList="fileList"></a-upload>
      </div>
    </a-card>
  </j-modal>
</template>

<script>
export default {
  name: 'SysAnnouncementModal',
  components: {},
  data() {
    return {
      title: '通知消息',
      upurl: window._CONFIG['domianURL'] + '/sys/common/static/',
      fileList: {},
      record: {},
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
        width: document.body.clientWidth < 600 ? '100%' : '70%',
        style: { top: '20px' },
        fullScreen: false,
      },
    }
  },
  beforeCreate() {
    console.log(this.record)
  },
  created() {
    console.log(this.record)
    this.displayFile();
  },
  mounted() {
    
  },
  methods: {
    detail(record) {
      this.visible = true
      this.record = record
      console.log(record)
      const fileList = record.fileList.split(',').map((item,index) => {
        return item = {
          uid: index,
          name:item.split('/').slice(-1)[0],
          url: this.upurl + item
        }
      })
      this.fileList = fileList
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
    displayFile() {
      fileList = this.record.fileList.split(',')
      console.log(fileList)
    }
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
