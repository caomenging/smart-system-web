<script src='../../../../../../../Documents/WeChat Files/wxid_phazgprm4eso22/FileStorage/File/2021-11/main.js'></script>
<template>
  <a-modal
    :title="title"
    :width="1500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
        <el-card id="blog">


          <div id="title">
            <h2 style="text-align: center">
<!--              {{title}}-->
              文章标题
            </h2>
          </div>
          <div style="text-align: center">
            <p>
              <span class="el-icon-time hidden-xs-only">&nbsp;
<!--                {{getTime(time)}}-->
              发布时间
              </span>

              <span class="el-icon-view hidden-xs-only" style="margin-left: 100px">&nbsp;
<!--                {{blogViews}}-->
                浏览次数
              </span>

              <span class="el-icon-chat-line-square hidden-xs-only" style="margin-left: 100px">&nbsp;
<!--                {{discussCount}}-->
                讨论数
              </span>
              <span class="el-icon-user-solid hidden-xs-only" style="margin-left: 150px">&nbsp;
<!--                {{userName}}-->
              作者
              </span>
            </p>
<!--            <p>-->
<!--          <span>-->
<!--            <span v-for="tag in catchTagName(tags)">-->
<!--              <el-tag type="success" style="margin-left: 5px">{{tag}}</el-tag>-->
<!--            </span>-->
<!--          </span>-->
<!--            </p>-->
          </div>
          <mavon-editor v-model="body" id="editor" :toolbarsFlag="false" :subfield="false" defaultOpen="preview"/>
<!--          &lt;!&ndash; 以下是预览模式配置 &ndash;&gt;-->
<!--          &lt;!&ndash;:toolbarsFlag="false"  :subfield="false" defaultOpen="preview"&ndash;&gt;-->

<!--          <div style="margin: 0 auto;width: 30%" class="hidden-xs-only" v-if="userReward!=undefined&&userReward!==null">-->
<!--            <br/>-->
<!--            <el-popover placement="bottom" width="250px" height="250px" trigger="hover">-->
<!--              <img alt="打赏码" :src="userReward" width="250px" height="250px"/>-->
<!--              <el-button type="text" slot="reference" icon="el-icon-trophy" round>写的不错，打赏一个</el-button>-->
<!--            </el-popover>-->
<!--            <el-button type="text" :class="[like?'el-tyson-good-fill':'el-tyson-good']" @click="likeThis">-->
<!--              &nbsp;{{this.like == 0 ? '点赞' : '已赞'}}&nbsp;{{likeCount}}-->
<!--            </el-button>-->
<!--          </div>-->
          <el-divider/>
          <div v-for="discuss in discussList" id="discussList">
            <p style="margin: -5px " @mouseenter="pEnter()" @mouseleave="pLeave()">
              <el-button type="text">{{discuss.inTime}}&nbsp;&nbsp;:</el-button>
              <span style="margin-left: 10px">{{discuss.content}}</span>
              <span style="color: #909399;margin-left: 50px" class="el-icon-time">{{discuss.inTime}}</span>
              <el-button type="text" style="margin-left: 5%"
                         v-if=""
                         @click="">删除
              </el-button>
<!--              (discuss.user.name==getStoreName()||(getStoreRoles().indexOf('ADMIN') > -1))&&replyFlag-->
<!--              deleteDiscuss(discuss.id)-->
<!--              getTime(discuss.time)-->
            </p>
          </div>
        </el-card>
    </a-spin>
  </a-modal>
</template>

<script>
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import {queryCommentList} from '@/api/api'
  import Vue from 'vue'
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(ElementUI)

  export default {
    name: "HomeModal",
    components: { ATextarea },
    data () {
      return {
        topicId:"",
        body:"",//博文内容
        discussList:[],
        visible:false,
        confirmLoading:false
      }
    },
    created () {
      // this.loadData();
    },
    methods: {
      loadData(){
        queryCommentList({topicId:this.topicId.toString()}).then((res) => {
          if (res.success) {
            that.discussList = res.result;
          }
        })
      },
      bodyTran(body) { //将数据库中带标签的博文转换为纯文本
        var dd = body.replace(new RegExp('#', 'g'), "");
        dd = dd.replace(new RegExp('!\\[.*\\]\\(.*\\)', 'g'), "[图片]");
        dd = dd.replace(new RegExp('\\[.*\\]\\(.*\\)', 'g'), "[链接]");
        dd = dd.replace(new RegExp('-', 'g'), "");
        dd = dd.replace(new RegExp('>', 'g'), "");
        dd = dd.replace(new RegExp('`', 'g'), "");
        return dd;
      },
      view (record) {
        let that = this;
        this.topicId = record.id;
        this.visible = true;
        this.body = record.content;
        queryCommentList({topicId:record.id.toString()}).then((res) => {
          if (res.success) {
            that.discussList = res.result;
          }
        })
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>