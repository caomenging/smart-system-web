<template>
  <div>
    <a-form style='margin: 40px auto 0;'>
      <result :title='titleShow' :is-success='true'>
        <div class='toLogin'>
          <h3>将在<span>{{ time }}</span>秒后返回
            <router-link :to="{ path: '/dashboard/analysis'}">
              首页
            </router-link>
            .
          </h3>
        </div>
      </result>

    </a-form>
  </div>
</template>

<script>
import Result from '@/views/result/Result'
import Vue from 'vue'
import { CHANGE_PASSWORD, CHANGE_PHONE, VERIFY_PHONE } from '@/store/mutation-types'

export default {
  name: 'Step4',
  props: ['userList', 'title'],
  components: {
    Result
  },
  data() {
    return {
      loading: false,
      time: 0
    }
  },
  methods: {
    countDown() {
      let that = this
      that.time--
    }
  },
  mounted() {
    let that = this
    if (Vue.ls.get(VERIFY_PHONE) || Vue.ls.get(CHANGE_PHONE)) {
      this.$notification['warning']({
        message: "警告",
        description: '还有操作未完成',
        duration: 4,
      });
      that.$emit('reload')
    }
    that.time = 5
    setInterval(that.countDown, 1000)
  },
  computed: {
    titleShow() {
      return this.title + '成功'
    }
  },
  watch: {
    time: function(newVal, oldVal) {
      if (newVal == 0) {
        this.$router.push({ path: '/dashboard/analysis' })
      }
    }
  }
}
</script>
<style scoped>
.toLogin {
  text-align: center;
}
</style>