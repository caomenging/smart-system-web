<template>
  <div style="padding: 1rem 0">
    <a-row type="flex" justify="space-between">
      <h1 class="title">村情互动</h1>
      <a-button type="primary" icon="plus" :size="size" @click="createQuestion"> 发布信息 </a-button>
    </a-row>
    <create-modal ref="createModal" />
  </div>
</template>

<script>
import CreateModal from './CreateModal.vue'

export default {
  components: { CreateModal },
    name: 'Header',
    data() {
        return {
            
        }
    },
    methods: {
        createQuestion() {
            this.$nextTick(() => {
                this.$refs.createModal.showModal()
            })
        }
    }
}
</script>

<style scoped>
.title {
  text-align: left;
}
.subtitle {
  text-align: right;
}
</style>