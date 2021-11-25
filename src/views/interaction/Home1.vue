<template>
<div>
  <Header />
  <Tiles ref="tiles" />
</div>
</template>

<script>
import Header from './module/Header.vue'
import Tiles from './module/Tiles.vue'

export default {
  components: { Header, Tiles },
  data() {
      return {
          
      }
  },
  methods: {
      handleOk(){
          this.$refs.tiles.loadData()
      }
  }

}
</script>

<style>

</style>