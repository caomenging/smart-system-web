<template>
  <div class="app-container">
    实验列表
     <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- <el-table-column prop="id" label="ID" width="80" /> -->

      <el-table-column prop="title" label="实验名称" />
      <el-table-column prop="lessonNum" label="总章节" width="160"/>
      <el-table-column prop="gmtCreate" label="修改时间" width="160"/>


      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/courcopy/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑基本信息</el-button>
          </router-link>
          <router-link :to="'/courcopy/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑实验大纲</el-button>
          </router-link>
           <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除实验信息</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import course from './api/edu/courcopy'
export default {

  data() {// 定义数据
      return {
          list: null, // 数据列表
      }
  },

  created() { // 当页面加载时获取数据
    this.getList()
  },

  methods: {
    getList() { // 调用api层获取数据库中的数据
      course.getListCourse().then(response=>{
        console.log(response)
              this.list=response.data.list


          })
          .catch(error=>{
              //alert(error)

          })
    },

    //删除通知的方法
    removeDataById(id)
      {
        console.log(id)
        this.$confirm('此操作将永久删除该通知的记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        return course.deleteCourse(id)
    }).then(() => {
        this.getList()
        this.$message({
            type: 'success',
            message: '删除成功!'
        })
    }).catch((response) => { // 失败
        if (response === 'cancel') {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        } else {
            this.$message({
                type: 'error',
                message: '删除失败'
            })
        }
    })
        // notice.removeNoticeById(id)
        //   .then(response=>{//删除成功
        //       //提示信息


        //       //回到列表页面
        //       this.getList()

        //   })
        //   .catch(error=>{

        //   })

    }

  }
}
</script>