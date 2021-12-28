<template>
  <carousel :perPage=1 :autoplay="true">
      <slide>
      <img
        class="home-temp"
        src="https://pic.imgdb.cn/item/61cb42af2ab3f51d9129c48e.png"
      />
    </slide>
    <slide>
      <img
        class="home-temp"
        src="https://pic.imgdb.cn/item/61cb40132ab3f51d912831cd.png"
      />
    </slide>
    <slide>
      <img class="home-temp" src="https://pic.imgdb.cn/item/61cb43dd2ab3f51d912a916f.png" />
    </slide>
  </carousel>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'HomeTemp',
  components: {
      Carousel,
      Slide
  }
}
</script>

<style>
.home-temp {
  width: 100%;
}
</style>