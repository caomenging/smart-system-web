<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
      <router-link v-if="item.name != name" :to="{ path: item.path }">
        {{ item.meta.title }}
      </router-link>
      <span v-else>{{ item.meta.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>


<script>
import store from '@/store'
export default {
    data() {
      return {
        name: '',
        breadList: [],
      }
    },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {

      console.log('this.$route.matched', this.$route.matched)

      this.breadList = []
      // let flag = 0;
      // for(let roleId of store.getters.role)
      // {
      //   if(roleId == "1463074308371800066"||roleId == "1463112478345588738")
      //   {
      //     this.flag = 2;
      //   }
      // }
      // for(let roleId of store.getters.role)
      // {
      //   if(roleId == "f6817f48af4fb3af11b9e8bf182f618b")
      //   {
      //     this.flag = 1;
      //   }
      // }
      // if(this.flag === 1)
      // {
      //   this.breadList.push({ name: 'dashboard-analysis', path: '/b5323bdac50f5bc855be3cf9c24f888a', meta: { title: '首页' } })
      // }else if(this.flag === 2)
      // {
      //   this.breadList.push({ name: 'dashboard-analysis', path: '/interaction/home1', meta: { title: '首页' } })
      // }
      // else {
      //   this.breadList.push({ name: 'dashboard-analysis', path: '/ok', meta: { title: '首页' } })
      // }
      this.breadList.push({ name: 'dashboard-analysis', path: '/dashboard/analysis', meta: { title: '首页' } })

      this.name = this.$route.name
      this.$route.matched.forEach((item) => {
        // item.meta.name === 'dashboard' ? item.path = '/dashboard' : this.$route.path === item.path
          this.breadList.push(item)
      })
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style scoped>

</style>