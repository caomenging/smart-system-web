<template>
  <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="本月帖子数" content="8" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本月互动数" content="32" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本月浏览数" content="24"/>
        </a-col>
      </a-row>
    </a-card>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
export default {
    name: 'Statistics',
    components: {HeadInfo},
}
</script>

<style>

</style>