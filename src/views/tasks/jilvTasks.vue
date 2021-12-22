<template>
<div>
  <h2>监督检查任务列表</h2>
  <jilv-tasks-list />
  <h2>监督检查审核未通过列表</h2>
  <jilv-not-pass-list />
</div>
</template>

<script>
import JilvNotPassList from './modules/jilvNotPassList.vue'
import jilvTasksList from './modules/jilvTasksList.vue'
export default {
  components: { jilvTasksList, JilvNotPassList },

}
</script>

<style>

</style>