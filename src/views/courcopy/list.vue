<template>
  <div class="app-container">
    实验列表
    <el-table
      v-bind="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    ><router-view />

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- <el-table-column prop="id" label="ID" width="80" /> -->

      <el-table-column prop="title" label="实验名称"/>
      <el-table-column prop="lessonNum" label="总章节" width="160"/>
      <el-table-column prop="gmtCreate" label="修改时间" width="160"/>


      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!--          <router-link :to="'/courcopy/info/?id='+scope.row.id">-->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateInfo(scope.row.id)">编辑基本信息
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateChapter(scope.row.id)">编辑实验大纲</el-button>
          <!--          </router-link>-->
          <!--          <el-form-item>-->
          <!--            <el-button :disabled="saveBtnDisabled" type="primary" @click="updateCourse">保存并下一步</el-button>-->
          <!--          </el-form-item>-->
<!--          <router-link :to="'/courcopy/chapter/'+scope.row.id">-->
<!--            <el-button type="primary" size="mini" icon="el-icon-edit">编辑实验大纲</el-button>-->
<!--          </router-link>-->
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除实验信息
          </el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import course from './api/edu/courcopy'
import cour from "./api/edu/courcopy";
import {MessageBox} from "element-ui";

export default {

  data() {// 定义数据
    return {
      list: null, // 数据列表
      listLoading: {
        spinning: false
      }
    }
    saveBtnDisabled: false  // 保存按钮是否禁用
  },

  created() { // 当页面加载时获取数据
    this.getList()
  },

  methods: {
    // loadData(arg) {
    //   if(!this.url.list){
    //     this.$message.error("请设置url.list属性!")
    //     return
    //   }
    //   //加载数据 若传入参数1则加载第一页的内容
    //   if (arg === 1) {
    //     this.ipagination.current = 1;
    //   }
    //   var params = this.getQueryParams();//查询条件
    //   this.loading = true;
    //   getAction(this.url.list, params).then((res) => {
    //     if (res.success) {
    //       //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
    //       this.dataSource = res.result.records||res.result;
    //       if(res.result.total)
    //       {
    //         this.ipagination.total = res.result.total;
    //       }else{
    //         this.ipagination.total = 0;
    //       }
    //       //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
    //     }else{
    //       this.$message.warning(res.message)
    //     }
    //   }).finally(() => {
    //     this.loading = false
    //   })
    // },

    getList() { // 调用api层获取数据库中的数据
      course.getListCourse().then(response => {
        console.log(response)
        this.list = response.data.list
      })
        .catch(error => {
          //alert(error)
        })
    },

    //删除通知的方法
    removeDataById(id) {
      //     console.log(id)
      this.$confirm({
        title: "删除主题",
        content: "此操作将永久删除该记录, 是否继续?",
        onOk() {
          course.deleteCourse(id).then(() => {
            this.$message.success("ok")
          }).catch((response) => { // 失败
            if (response === 'cancel') {
              this.$message.success({
                type: 'info',
                message: '已取消删除'
              })
            } else {
              this.$message.success({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        },
        oncancel() {
        }
      })
      this.getList()
    },

    updateInfo(id) {
      this.$router.push({
        path: `/courcopy/info/`+id,
      })
      // cour.updateCourseInfo(this.courseInfo)
      //   .then(response =>{
      //     this.$message.success({
      //       type: 'success',
      //       message: '修改课程成功!'
      //     });
      //     //跳转到第二步
      //
      //
      //   })
    },
    updateChapter(id) {
      this.$router.push({
        path: `/courcopy/chapter/`+id,
        // path: `/courcopy/chapter/?id=${id}`,
      })
    },
  }
}
</script>

<style scoped>
.el-button+.el-button {
  margin-left: 0 !important;
}
</style>