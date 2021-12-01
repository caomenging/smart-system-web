<template>
  <div class="createTest testPaper">
    <div class="w">
      <!-- 考试信息 -->
      <div class="title " >
        <!-- {{testData}} -->
        <h3 class="testName">{{ testData.testName }}</h3>
        <ul>
          <!--<li class="test-info">试卷Id: E{{ testData.id }}</li>-->
          <li class="test-info">试卷名称: {{ testData.paperName }}</li>
          <!--<li class="test-info">出卷者: {{testData.creatorName}}</li>-->
          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>
          <li class="test-info">题目数量: 共 {{ testData.topicNum }} 道</li>
          <li class="test-info">总分: {{ testData.totalScore }} 分</li>
          <li class="test-info" >答题人: {{ nickname() }}</li>
          <li class="test-info" v-if="finishTest">得分: {{ testData.userGrade.grade + '分' }}</li>
          <li class="test-info" v-else>剩余时间: {{ remainTime }}</li>
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" :disabled="isRead">提交试卷</el-button>
          </li>
        </ul>
      </div>

      <div class="title fixed" v-if="isFixed">
        <ul>

          <!--<li class="test-info">试卷Id: E{{ testData.id }}</li>-->
          <li class="test-info">试卷名称: {{ testData.paperName }}</li>
          <!--<li class="test-info">出卷者: {{testData.creatorName}}</li>-->
          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>
          <li class="test-info">题目数量: 共 {{ testData.topicNum }} 道</li>
          <li class="test-info">总分: {{ testData.totalScore }} 分</li>
          <li class="test-info">答题人: {{ nickname() }}</li>
          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>
          <li class="test-info" v-if="finishTest">得分: {{ testData.userGrade.grade + '分' }}</li>
          <li class="test-info" v-else>剩余时间: {{ remainTime }}</li>
          <!-- {{expendTime}} -->
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" :disabled="isRead">提交试卷</el-button>
          </li>
        </ul>
      </div>
      <div class="test-content" >
        <!-- 题目内容 -->
        <div class="topics">
          <div class="topic" v-for="(topics, index) in sortedTopics" :key="index">

            <div class="topicsType" v-if="topics.topic_content.length != 0 ">
              <h4>{{bigQuestionName_mixin(topics.topicType,index)}}</h4><!-- 题目类型名称 -->

              <div class="topic-content" v-for="(t, index) in topics.topic_content" :key="index">
                <div class="_location"></div>
                <!-- 题目 -->
                <div class="question">
                  <span class="required-symbol" v-if="t.required == 1">*</span>
                  <span class="question_nunber">{{ t.index }}、</span>
                  {{ t.question }}
                  <span class="score">({{ t.score }}分)</span>
                </div>

                <!-- 单选题 -->
                <div class="radio" v-if="t.topicType==0">
                  <el-radio v-for="(item, index) in t.choice" :key="index" v-model="t.submitAnswer"
                            :class="item == t.correctAnswer? 'correct':'error'"
                            :label="getOption(index)"
                            :disabled="isRead">
                    {{String.fromCharCode(65+index)}}、{{ item }}
                  </el-radio>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 多选题 -->
                <div class="checkbox" v-if="t.topicType == 1">
                  <el-checkbox-group v-model="t.submitAnswer">
                    <el-checkbox :label="getOption(index)" v-for="(item, index) in t.choice" :key="index"
                                 :disabled="isRead"
                                 :class="isCheckboxCorrect(t,item)">
                      {{String.fromCharCode(65+index)}}、{{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 判断题 -->
                <div class="TrueOrFalse" v-if="t.topicType == 2">
                  <el-radio v-model="t.submitAnswer" label="true" :disabled="isRead" :class="'true' == t.correctAnswer? 'correct':'error'" >正确</el-radio>
                  <el-radio v-model="t.submitAnswer" label="false" :disabled="isRead" :class="'false' == t.correctAnswer? 'correct':'error'" >错误</el-radio>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 填空题 -->
                <!--<div class="fillInBlank" v-if="t.topicType == 3">
                  &lt;!&ndash; <div v-for="(q, index) in t.correct_answer" :key="index">
                    <el-input type="textarea" autosize placeholder="请回答" :disabled="isRead" v-model="t.submitAnswer[index]">
                    </el-input>
                  </div> &ndash;&gt;
                  <div v-for="(q, index) in fillSymbolStr(t.question)" :key="index">
                    <el-input type="textarea" autosize
                              :disabled="isRead"
                              v-if="index!=fillSymbolStr(t.question).length-1"
                              v-model="t.submitAnswer[index]">
                    </el-input>
                  </div>
                  &lt;!&ndash; {{ t.submitAnswer }} &ndash;&gt;
                </div>-->

                <!-- 简答题 -->
                <!--<div class="text" v-if="t.topicType == 4">
                  <el-input type="textarea" v-model="t.submitAnswer" :autosize="{ minRows: 3, maxRows: 10 }" :disabled="isRead">
                  </el-input>
                  &lt;!&ndash; {{ t.submitAnswer }} &ndash;&gt;
                </div>-->

              </div>
            </div>

          </div>
        </div>

        <!-- 题目导航 -->
        <div class="topic-nav " :class="isFixed?'isFixed':''" :style="topic_nav_style">
          <div class="topic-nav-describe" v-if="finishTest ">
            <span class="topic-nav-but correct"> </span> 正确
            <span class="space"></span>
            <span class="topic-nav-but error"> </span> 错误
          </div>
          <div class="topic-nav-describe" v-else>
            <span class="topic-nav-but hasAnswer"> </span> 已答
            <span class="space"></span>
            <span class="topic-nav-but "> </span> 未答
          </div>


          <div v-for="(topics, Topics_index) in sortedTopics" :key="Topics_index">

            <div class="topic-nav-item" v-if="topics.topic_content.length != 0">
              <div class="nav-title">{{topicTypeName_mixin(topics.topicType)}}</div>

              <!-- <span class="topic-nav-button" @click="topicNav(topics.topicType,index)" v-for="(item , index) in topics.topic_content" :key="index" :class="emptyAnswer(item.submitAnswer) ?'':'hasAnswer'">
                {{topicNavIndex_mixin(topics.topicType,index)}}
              </span> -->
              <span class="topic-nav-button" @click="topicNav(topics.topicType,index)" v-for="(item , index) in topics.topic_content" :key="index" :class="emptyAnswer(item)">
                {{topicNavIndex_mixin(topics.topicType,index)}}
              </span>
            </div>

          </div>
        </div>

      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
  import "@/assets/less/testPaper.less";
  import testPaperMixin from "@/mixins/testPaper-mixin";
  import { mapActions, mapGetters,mapState } from 'vuex'
  import {postAction, httpAction, getAction ,putAction} from '@/api/manage'

  export default {
    name: "MyExam",
    mixins: [testPaperMixin],
    data() {
      return {
        //按题目类型分类好的题目数据
        //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
        sortedTopics: [
          { topicType: 0, topic_content: [] },
          { topicType: 1, topic_content: [] },
          { topicType: 2, topic_content: [] },
          /*{ topicType: 3, topic_content: [] },
          { topicType: 4, topic_content: [] },*/
        ],
        //试卷数据
        testData: {
          testName:'testName',
          examInfo:{},
          userGrade:{}
        },
        model:{},

        remainTime: "00:00:00", //考试剩余时间
        expendTime: 0, //考试用时(秒)
        isRead: false, //是否为只读模式
        //forbid_copy: false, //是否禁止复制文本
        //switchPage: 0,

        //isPublishAnswer: false, //是否公布答案
        finishTest: false, //是否完成试卷
        //侧导航栏是否悬浮
        isFixed: false,
        topic_nav_style: "top:0px",
      };
    },
    computed:{
      //按填空符(三个下划线)划分字符串
      /*fillSymbolStr() {
        return function (str) {
          var q = str.split("___");
          return q;
        };
      },*/
    },

    created() {
      this.getTestPaperData();
    },

    mounted() {
      window.addEventListener("scroll", this.handleScroll);
      //window.addEventListener("visibilitychange", this.visibilitychange);
    },

    methods: {
      //获取当前用户信息
      ...mapGetters(["nickname", "avatar","userInfo"]),
      //提交试卷
      submitTestpaper() {
        var topic = [];
        console.log(this.testData.smartTopicVoList);
        for (let i = 0; i < this.testData.smartTopicVoList.length; i++) {
          var item = JSON.parse(JSON.stringify(this.testData.smartTopicVoList[i]))
            console.log(item);
            if(item.submitAnswer === null || item.submitAnswer.length === 0){
              this.$message.warning(`第${item.index}题目未选答案`);
              return
          }
          //处理多选/填空答案
          if (item.topicType == 1 ) {
            if (item.submitAnswer instanceof Array) {
              var submitAnswer = "";
              item.submitAnswer.forEach((c) => {
                submitAnswer += c + "\n";
              });
              item.submitAnswer = submitAnswer.slice(0, -1);
            }
          }
          topic.push({
            //classesId: this.$route.params.c_id,
            questionId: item.questionId,
            paperId: "1463590206010097665",
            //examId: this.$route.params.tp_id,
            type:item.topicType,
            submitAnswer: item.submitAnswer,
          });
        }

        console.log(topic);

        var request = {
          examId:"",
          //paperName:  this.testData.paperName,
          //userName: this.$store.state.userName,
          //answerTime: this.expendTime,
          smartSubmitList: topic,

        };
        console.log(request);
        postAction('/SmartPaper/smartExam/submitTestPaper' ,request).then(res =>{
          if (res.success) {
            console.log(res.result);
            var grade = res.result;
            this.$message.success(res.message);
            const h = this.$createElement;
            this.$msgbox({
              title: '成绩',
              message: h('p', null, [
                h('span', null, '本次考试成绩为 '),
                h('i', { style: 'color: teal' }, grade)
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              /*beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = '执行中...';
                  setTimeout(() => {
                    done();
                    setTimeout(() => {
                      instance.confirmButtonLoading = false;
                    }, 300);
                  }, 3000);
                } else {
                  done();
                }
              }*/
            }).then(action => {
              this.$message({
                type: 'info',
                message: '考试完成！'
              });
            });
          }
            //location.reload()
          else{
            this.$message.error(res.message);
          }
        })
        postAction('/smartGradeNumber/smartGradeNumber/addPersonNumber'
          ,this.model).then(res=>{
            console.log(res)
            if(res.success){
                 that.$emit('ok');
            }


        })
      },

      //获取试卷数据
      getTestPaperData() {
        let params = {
          //id: this.$route.params.id
          id:"1463590206010097665"
        }
        getAction("/SmartPaper/smartPaper/getPaperById",params).then(res =>{
          if (res.success) {
            this.processTestPaperData(res.result);
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
      },

      //处理试卷的题目数据
      processTestPaperData(testData) {
        /* 判断试卷是否允许复制文本 */
       /* if (testData.permitCopy == 0) {
          this.forbid_copy = true;
        } else if (testData.permitCopy == 1) {
          this.forbid_copy = false;
        }*/

        /* 处理试卷的题目数据 */
        testData.smartTopicVoList.forEach((item) => {
          //按换行符分割字符串
          item.choice = item.choice.split(/[\n]/g);
          // item.correct_answer = item.correct_answer.split(/[\n]/g);
          //添加用户答案
          if (item.topicType == 1 ) {
            item.submitAnswer = [];
          } else {
            item.submitAnswer = "";
          }
        });

        /* 判断用户是否已经完成试卷 */

        if ( !testData.userGrade ) {
          console.log("开始考试");
          this.finishTest = false
          this.isRead = false;
        } else {
          console.log("查看试卷");
          this.finishTest = true
          this.isRead = true;
          //处理用户答案数据
          testData.smartSubmitList.forEach((item, index) => {
            //按换行符分割字符串
            if (item.submitAnswer.indexOf("\n") != -1) {
              item.submitAnswer = item.submitAnswer.split(/[\n]/g);
            }

            testData.smartTopicVoList[index].submitAnswer = item.submitAnswer;
            // console.log(item.submitAnswer);
          });
          //根据题目id写入用户答案

          testData.smartTopicVoList.forEach((item, index) => {
            //按换行符分割字符串
            item.correctAnswer = item.correctAnswer.split(/[\n]/g);
            //添加教师是否批改判断
            //item.status = testData.smartSubmitList[index].topicStatus;
            //添加评改分数
            //item.userScore = testData.smartSubmitList[index].userScore;
          });
          /* 判断是否公布答案 */
          /*if(testData.examClasses.publishAnswer == 1){
            this.isPublishAnswer = true;
            testData.smartTopicVoList.forEach((item, index) => {
              //按换行符分割字符串
              item.correctAnswer = item.correctAnswer.split(/[\n]/g);
              //添加教师是否批改判断
              //item.status = testData.smartSubmitList[index].topicStatus;
              //添加评改分数
              //item.userScore = testData.smartSubmitList[index].userScore;
            });
          }*/
        }



        this.testData = testData;
        console.log("this.testData ==> ", this.testData);

        //判断考试是否已经结束
        var nowDate = new Date().getTime();
        //var deadline = testData.examInfo.endTime;
        var deadline = '2021-12-03 03:27:52';
        // console.log('deadline',testData);
        var deadlineDate = new Date(
          Date.parse(deadline.replace(/-/g, "/"))
        ).getTime();
        if (nowDate < deadlineDate && this.finishTest === false) {
          //开始计时
          console.log('开始计时');
          this.remainTimer();
        } else {
          this.isRead = true;
        }

        /* 判断试卷是否打乱题目顺序 */
/*        if (testData.disruptOrder == 1) {
          testData.smartTopicVoList.sort(function(){
            return Math.random() > 0.5 ? -1:1
          })
        }*/

        //按题目类型分类并保存
        var topics = this.testData.smartTopicVoList;
        var topicsIndex = 1;
        // for (let i = 0; i < topics.length; i++) {
        //   for (let item of this.sortedTopics) {
        //     if (topics[i].topicType == item.topicType) {
        //       //添加
        //       topics[i].index = topicsIndex++;
        //       item.topic_content.push(topics[i]);
        //     }
        //   }
        // }
        for (let item of this.sortedTopics) {
          for (let i = 0; i < topics.length; i++) {
            if (topics[i].topicType == item.topicType) {
              //添加
              topics[i].index = topicsIndex++;
              item.topic_content.push(topics[i]);
            }
          }
        }
      },

      //计算剩余时间
      remainTimer() {
        var time = this.testData.time * 60;
        var timer = setInterval(() => {
          this.remainTime = this.computateTime(time);
          time--;
          this.expendTime++;
          if (time < 0) {
            clearInterval(timer);
            this.$message("考试结束");
            this.submitTestpaper();
          }
        }, 1000);
      },

      //格式化考试剩余时间
      computateTime(time) {
        var sec = "00";
        var minute = "00";
        var hour = "00";

        if (time >= 0) {
          sec = time % 60;
          if (sec < 10) {
            sec = "0" + sec;
          }
        }
        if (time / 60 >= 0) {
          minute = parseInt((time / 60) % 60);
          if (minute < 10) {
            minute = "0" + minute;
          }
        }
        if (time / 60 / 60 >= 0) {
          hour = parseInt((time / 60 / 60) % 60);
          if (hour < 10) {
            hour = "0" + hour;
          }
        }
        return hour + ":" + minute + ":" + sec;
      },

      //滚动事件
      handleScroll() {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop; // 滚动条偏移量
        if (scrollTop > 154) {
          this.topic_nav_style = "top:" + (scrollTop + 62) + "px";
          this.isFixed = true;
        } else {
          this.isFixed = false;
        }
      },

      /*visibilitychange(){
        if(this.testData.switchPage === -1){
          return
        }
        if (document.visibilityState == "visible") {
          console.log('页面回来了',this.switchPage);
        }
        if (document.visibilityState == "hidden") {
          this.switchPage += 1;

          if(this.switchPage >= this.testData.switchPage){
            console.log('提交试卷');
            this.submitTestpaper();
          }else{
            this.$msgbox({
              title: '警告',
              type: 'warning',
              message: '页面已被切换，如果次数为0将会自动提交试卷！ 剩余可以切换次数：' + (this.testData.switchPage-this.switchPage),
              confirmButtonText: '确定',
            });
          }
        }
      },*/

      //点击题号定位到题目位置
      topicNav(type,index) {
        var i = this.topicNavIndex_mixin(type,index);
        console.log(i);
        document
          .getElementsByClassName("_location")
          [i - 1].scrollIntoView({ behavior: "smooth", block: "start" });
      },

      //题目导航按钮颜色
      emptyAnswer(val) {
        //已完成试卷 与 是否公布答案
        if(this.finishTest === true && this.testData.examClasses.publishAnswer == 1){
          if(val.userScore == val.score){
            console.log(val);
            return "correct";
          } else {
            return "error";
          }

          //未完成试卷
        }else{
          //多选题
          // if (val.topicType == 1) {
          //   if (val.submitAnswer.join("") == "") {
          //     return "";
          //   }
          // }

          //填空题
          /*if (val.topicType == 3) {

            let q = val.question.split("___")
            if(q.length-1 != val.submitAnswer.length){
              return ""
            }

            for(let item of val.submitAnswer){
              if(item == ""){
                return ""
              }
            }
          }*/

          //单选/判断/简答
          if (val.submitAnswer.length == 0) {
            return "";
          }

          return 'hasAnswer';
        }
      },
      //转换选项为A,B,C,D
      getOption(index){
        let option = String.fromCharCode(65+index);
        return option;
      },
      //判断选择题是否回答正确
      isCheckboxCorrect(topic,val){
        if(this.finishTest === false  || this.testData.examClasses.publishAnswer != 1){
          return ''
        }
        let is = false
        topic.correctAnswer.forEach(item =>{
          if(item == val){
            console.log(item);
            is = true
          }
        })
        if(is){
          return "correct";
        } else {
          return "error";
        }
      },

    },
  };
</script>
<style>
  .fr {
    float: right;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

