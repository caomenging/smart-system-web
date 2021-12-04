<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" >
        <chart-card :loading="loading" title="优秀人数" :total="model.excellent_number">

        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="良好人数" :total="model.good_number">

        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="及格人数" :total="model.pass_number">

        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="不及格人数" :total="model.fail_number">

        </chart-card>
      </a-col>
    </a-row>
    <grade-result/>
  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import ACol from "ant-design-vue/es/grid/Col"
import { httpAction, postAction, getAction } from '@/api/manage'
import GradeResult from './GradeResult'//调用成绩单表格
import SmartGradeNumberModal from '../SmartGradeNumber/modules/SmartGradeNumberModal'
export default {
  name: 'SurveyList',//调查问卷成绩单
  components:{
    ACol,
    ChartCard,
    GradeResult,//调用成绩单表格
    SmartGradeNumberModal
  },
  data(){
    return{
      loading:false,

      model:{
        excellent_number:'0',
        good_number:'0',
        pass_number:'0',
        fail_number:'0'

      },
      url:{
        add:'/smartGradeNumber/smartGradeNumber/addPersonNumber'
      }
    }
  },
  created:{

  },
  methods:{


  }

}
</script>

<style lang="less" scoped>
.circle-cust{
  position: relative;
  top: 28px;
  left: -100%;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}


.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>