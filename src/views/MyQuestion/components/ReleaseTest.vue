<template>
  <div>
    <!-- 发布考试弹框 -->
    <el-dialog class="releaseTest" :title="examName" :visible.sync="dialog" width="70%" @close="closeReleaseTestDialog">
      <el-steps :active="releaseTestSteps" finish-status="success" align-center>

        <el-step title="选择指定人"></el-step>
        <el-step title="选择考试时间"></el-step>
        <el-step title="发布考试"></el-step>
      </el-steps>


      <!-- 选择指定人   -->
      <div v-if="releaseTestSteps==0">
        <el-table ref="multipleTable" :data="peopleList" height="350" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="指定人编号" width="120">
            <template slot-scope="scope">{{scope.row.personId}} </template>
          </el-table-column>
          <el-table-column prop="peopleName" label="指定人姓名" />
          <el-table-column prop="date" label="考试时间" width="350" />
<!--          <el-table-column prop="status" label="状态" width="150" />-->
        </el-table>
        <el-pagination class="pagination" layout="total, prev, pager, next,jumper" :total="total" :page-size="pageSize" @current-change="currentChange">
        </el-pagination>
      </div>


      <!-- 选择考试时间 -->
      <div v-if="releaseTestSteps==1">
        <el-date-picker v-model="releaseTestDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-switch v-model="publishAnswer" active-text="公布答案" :active-value="1" inactive-text="不公布答案" :inactive-value="0" />
        <el-switch v-model="publishScore" active-text="公布分数" :active-value="1" inactive-text="不公布分数" :inactive-value="0" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="lastStep()">
          {{releaseTestSteps==1?'上一步':'取消'}}
        </el-button>
        <el-button type="info" v-if="releaseTestSteps==0" size="medium">
          取消发布
        </el-button>
        <el-button type="primary" @click="nestStep()" size="medium">
          {{releaseTestSteps==0?'下一步':'发布考试'}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFormatDate } from "@/utils/common.js";

export default {
  name: "ReleaseTest",
  props: {

  },
  data() {
    return {
      /*// 用户所创建的班级
      classesList: [],*/
      //选定的指定人
      peopleList:[],

      //发布试卷记录
      testPaper_classes: [],

      //是否显示发布考试_弹框
      dialog: false,

      examName: "",
      examId: "",
      //考试日期
      releaseTestDate: "",
      publishAnswer: 0,
      publishScore: 0,

      //发布考试步骤状态
      releaseTestSteps: 0,

      currentPage: 1,
      pageSize: 7,
      total: null,
    };
  },
  methods: {
    //弹出发布考试对话框,用户选择时间
    async releaseTest(tp_id, examName) {
      this.dialog = true;
      this.currentPage = 1
      this.examName = "发布试卷名称: " + examName;
      this.examId = tp_id;

      //await this.getClassesLiat();
      await this.getTestPaper_classes(tp_id);
    },

   /* //获取用户的班级列表
    async getClassesLiat() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      };
      await this.$http.get("/queryClassesList", { params }).then((res) => {
        //添加发布状态与考试日期
        res.data.content.map((v) => {
          v.status = "未发布";
          v.date = "--";
        });

        this.classesList = res.data.content;
        this.total = res.data.total;
      });
    },*/

    //获取发布试卷记录
    async getTestPaper_classes(tp_id) {
      let params = {
        examId: tp_id,
        pageSize: 9999,
        currentPage: 1,
      };
     /* await this.$http.get("/queryClassesList", { params }).then((res) => {
        this.testPaper_classes = res.data;
        console.log(this.testPaper_classes);
        console.log(this.peopleList);
        /!*!//修改班级考试信息
        for (let tc of this.testPaper_classes) {
          for (let c of this.peopleList) {
            if (tc.classesId === c.classesId) {
              c.status = "已发布";
              c.date = tc.startDate + " 至 " + tc.deadline;
            }
          }
        }*!/
      });*/
    },

    //发布考试对话框中的上一步
    lastStep() {
      this.releaseTestSteps == 1
        ? (this.releaseTestSteps = 0)
        : (this.dialog = false);
      console.log(this.$refs.multipleTable);
      setTimeout(() => {
        this.selectionPeople.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }, 100);
    },

    //发布考试对话框中的下一步
    nestStep() {
      //判断是否有选择指定人
      if (this.selectionPeople.length == 0) {
        this.$message("请选择指定人");
        return;
      }

      //下一步 ---选择时间
      if (this.releaseTestSteps == 0) {
        console.log(this.selectionPeople);
        this.releaseTestSteps++;
        return;
      }

      //判断是否有选择考试时间
      if (this.releaseTestDate == null) {
        this.$message("请选择考试时间");
        return;
      } else if (this.releaseTestDate.length != 2) {
        this.$message("请选择考试时间");
        return;
      }

     /* if (this.releaseTestSteps == 1) {
        //判断已选择的班级是否包含该试卷已发布的班级
        var isHas = false;
        for (let i = 0; i < this.selectionPeople.length; i++) {
          for (let j = 0; j < this.testPaper_classes.length; j++) {
            if (
              this.selectionPeople[i].classesId ==
              this.testPaper_classes[j].classesId
            ) {
              isHas = true;
              break;
            }
          }
          if (isHas) {
            break;
          }
        }
        if (isHas) {
          //提示
          this.$confirm(
            "已选中的班级中包括已发布的班级,该操作将会覆盖之前的考试时间! 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info",
            }
          ).then(() => {
            this.doReleaseTest();
          });
        } else {
          this.doReleaseTest();
        }
      }*/
    },

    //确定发布考试 -----向后端发送请求
    doReleaseTest() {
      //考试开始时间
      var examStarttime = getFormatDate(new Date(this.releaseTestDate[0]));
      //考试结束时间
      var examEndtime = getFormatDate(new Date(this.releaseTestDate[1]));
      /*//班级id
      var classesId = [];
      for (let i = 0; i < this.selectionPeople.length; i++) {
        classesId.push(this.selectionPeople[i].classesId);
      }*/

      // 处理post请求参数
      var request = {
        examId: this.examId,
        classesId: classesId,
        examStarttime,
        examEndtime,


        publishScore: this.publishScore,
        publishAnswer: this.publishAnswer
      };
      this.$http.post("/releaseTest", request).then((res) => {
        if (res.code == 200) {
          this.$message.success("发布成功");
        }
        this.closeReleaseTestDialog();
      });
    },

    //发布考试中已选择的指定人
    handleSelectionChange(val) {
      this.selectionPeople = val;
    },

    //关闭对话框
    closeReleaseTestDialog() {
      //初始化数据
      this.dialog = false;
      this.selectionPeople = [];
      this.releaseTestDate = "";
      this.releaseTestSteps = 0;
    },

    //切换分页时触发
    async currentChange(val) {
      this.currentPage = val;

      await this.getClassesLiat();
      await this.getTestPaper_classes(this.examId);
    },
  },
};
</script>

<style lang="less" >
.releaseTest{
  .el-dialog .pagination{
    text-align: center;
    margin-top: 6px;
  }
  .el-dialog .el-date-editor{
    margin: 0;
    margin-top: 24px;
  }
  .el-dialog__body{
      text-align: center;
  }
  .el-dialog__body .el-switch{
      display: block;
      margin: 24px 0;
  }

  .el-divider--horizontal{
      background-color: #444;
      margin: 14px 0;
  }
}

</style>
