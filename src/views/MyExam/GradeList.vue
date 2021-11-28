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
  name: 'GradeList',//成绩单
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
    /*addPersonNumber(){
      console.log(this.model)
      postAction(this.url.add,this.model).then(res=>{
        console.log(res)
        if(res.success){
          this.$message.success(res.message);
        }

      })
    }*/


    /*gradeRankSort(exam_grade,total_score,pass_mark,excellent_number,good_number,pass_number,fail_number){
      //成绩等级
      //exam_grade是考试成绩,total_grade是试卷的总分,pass_mark是及格线。

      excellent_number=0;//优秀人数
      good_number=0;//良好人数
      pass_number=0;//及格人数
      fail_number=0;//不及格人数


      if(exam_grade<=total_score && exam_grade>=0.9*total_score){//优秀

        excellent_number += 1;

      } else if(exam_grade<0.9*total_score && exam_grade>=0.8*total_score){//良好

        good_number += 1;

      } else if(exam_grade<0.8*total_score && exam_grade>=pass_mark){//及格

        pass_number += 1;


      }else if(exam_grade<pass_mark && exam_grade>=0){//不及格

        fail_number += 1;

      }
    }*/

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