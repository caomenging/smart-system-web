<template>
<div>
  <Header />
  <Statistics />
  <Tiles ref="tiles" />
</div>
</template>

<script>
import Header from './module/Header.vue'
import Statistics from './module/Statistics.vue'
import Tiles from './module/Tiles.vue'

export default {
  components: { Header, Tiles, Statistics },
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