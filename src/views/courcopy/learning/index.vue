<template>
  <div>
    <!-- /实验列表 开始 -->
    <h2>全部课程</h2>
    <a-empty v-if='list.length === 0' />
    <a-row v-else :gutter='20'>
      <a-col v-for='item in list' :key='item.id' :xs='24' :sm='24' :md='12' :lg='6' :xl='4'
             style='margin-top: 20px'>
        <a-card>
          <el-image slot='cover'
                    alt='example'
                    :src='"http://localhost:8080/smart-system/sys/common/static/"+item.cover'
                    @click='startLearn(item.id)'
                    style='cursor: pointer;'
                    :alt='item.title'
          >
            <div slot='error' class='image-slot'>
              <i class='el-icon-picture-outline'></i>
            </div>
          </el-image>
          <template slot='actions' class='ant-card-actions'>
            <a :href="'/courcopy/learning/_id/'+item.id" title='开始学习'>
              <a-icon type='play-circle' />
              开始学习</a>
          </template>
          <a-card-meta description='This is the description'>
            <template slot='title'>
              <a :href="'/courcopy/learning/_id/'+item.id" :title='item.title'>
                {{ item.title }}</a>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <!-- /实验列表 结束 -->
  </div>
</template>
<script>
import learn from '../api/api/learning'
import cookie from 'js-cookie'

export default {
  data() {// 定义数据
    return {
      list: [] // 数据列表
    }
  },

  created() { // 当页面加载时获取数据
    // if(this.istoken()==true){
    this.initCourse()
    // }
    // else{
    //   this.$message.error('您未登入，不能使用该功能，请登入后使用！')
    //   }

  },

  methods: {
    startLearn(id) {
      this.$router.push({
        path: '/courcopy/learning/_id/' + id
      })
    },


    //查询实验列表
    initCourse() {
      learn.getListCourse().then(response => {
        this.list = response.data.list
      })
    },

    istoken() {
      if (cookie.get('guli_token')) {
        return true
      } else {
        return false
      }
    }

  }
}
</script>
<style>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  background: #f5f7fa;
  color: #909399;
  font-size: 32px;
}

</style>