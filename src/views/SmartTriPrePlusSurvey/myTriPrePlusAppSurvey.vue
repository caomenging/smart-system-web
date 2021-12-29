<template>
  <div class="createTest testPaper">
    <div class="w">
      <!-- 考试信息 -->
      <div class="title " >
        <!-- {{testData}} -->
        <ul>
          <!--<li class="test-info">试卷Id: E{{ testData.id }}</li>-->
          <li class="test-info">调查问卷名称: {{ testData.paperName }}</li>

          <!--<li class="test-info">出卷者: {{testData.creatorName}}</li>-->
          <li class="test-info" >调查人: {{ nickname() }}</li>
          <li class="test-info">户主：{{userName}}</li>
          <li class="test-info">被访人：{{userName}}</li>
<!--          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>-->
          <li class="test-info">题目数量: 共 {{ testData.topicNum }} 道</li>
          <li class="test-info" v-show="testData.isMark == 1">总分: {{ testData.totalScore }} 分</li>
          <li class="test-info" v-if="finishTest">得分: {{ testData.userGrade.grade + '分' }}</li>
<!--          <li class="test-info" v-else>剩余时间: {{ remainTime }}</li>-->
          <li class="fr">
            <el-button type="primary" size="mini" @click="supDialog"
                       :disabled="isRead">交卷</el-button>
          </li>
        </ul>
      </div>

      <div class="title fixed" v-if="isFixed">
        <ul>

          <!--<li class="test-info">试卷Id: E{{ testData.id }}</li>-->
          <li class="test-info">调查问卷名称: {{ testData.paperName }}</li>
          <!--<li class="test-info">出卷者: {{testData.creatorName}}</li>-->
          <li class="test-info">调查人: {{ nickname() }}</li>
          <li class="test-info">户主： {{hostText}}</li>
          <li class="test-info">被访人：{{userName}}</li>
<!--          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>-->
          <li class="test-info">题目数量: 共 {{ testData.topicNum }} 道</li>
          <li class="test-info" v-show="testData.isMark == 1">总分: {{ testData.totalScore }} 分</li>
<!--          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>-->
          <li class="test-info" v-if="finishTest">得分: {{ testData.userGrade.grade + '分' }}</li>
<!--          <li class="test-info" v-else>剩余时间: {{ remainTime }}</li>-->
          <!-- {{expendTime}} -->
          <li class="fr">
            <el-button type="primary" size="mini" @click="supDialog" :disabled="isRead">交卷</el-button>
          </li>
        </ul>
      </div>
      <div class="test-content" >
        <!-- 题目内容 -->
        <div class="topics" >
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
                  <span class="score" v-show="testData.isMark == 1">({{ t.score }}分)</span>
                </div>

                <!-- 单选题 -->
                <div class="radio" v-if="t.topicType==0">
                  <el-radio v-for="(item, index) in t.choice" :key="index" v-model="t.submitAnswer"
                            :class="isCorrect(t,index)"
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
                                 :class="isCheckboxCorrect(t,index)">
                      {{String.fromCharCode(65+index)}}、{{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 判断题 -->
                <div class="TrueOrFalse" v-if="t.topicType == 2">
                  <!--<el-radio v-model="t.submitAnswer" label="T" :disabled="isRead" :class="'T' == t.correctAnswer? 'correct':'error'" >正确</el-radio>
                  <el-radio v-model="t.submitAnswer" label="F" :disabled="isRead" :class="'F'== t.correctAnswer? 'correct':'error'" >错误</el-radio>-->
                  <el-radio v-model="t.submitAnswer" label="T" :disabled="isRead"  >正确</el-radio>
                  <el-radio v-model="t.submitAnswer" label="F" :disabled="isRead" >错误</el-radio>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 填空题 -->
                <div class="fillInBlank" v-if="t.topicType == 3">
                  <!-- <div v-for="(q, index) in t.correct_answer" :key="index">
                    <el-input type="textarea" autosize placeholder="请回答" :disabled="isRead" v-model="t.submitAnswer[index]">
                    </el-input>
                  </div> -->
                  <div v-for="(q, index) in fillSymbolStr(t.question)" :key="index">
                    <el-input type="textarea" autosize
                              :disabled="isRead"
                              v-if="index!=fillSymbolStr(t.question).length-1"
                              v-model="t.submitAnswer[index]">
                    </el-input>
                  </div>
                  <!-- {{ t.submitAnswer }} -->
                </div>

                <!-- 简答题 -->
                <div class="text" v-if="t.topicType == 4">
                  <el-input type="textarea" v-model="t.submitAnswer" :autosize="{ minRows: 3, maxRows: 10 }" :disabled="isRead">
                  </el-input>
                  <!-- {{ t.submitAnswer }} -->
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>

    </div>

    <!-- 选择满意度及线索-->
    <el-dialog customClass="customWidth" title="补充调查" :visible.sync="dialogFormVisible"  @closed="handleClose">
      <el-form :model="form" ref="form" :rules="rules">
<!--        <el-form-item label="1、本次调查满意度" prop="satisfaction">
          <el-rate :style="{fontSize:'30px'}" v-model="form.satisfaction" show-text :texts="['不满意', '基本满意', '满意', '非常满意', '完全满意']"></el-rate>
        </el-form-item>-->
        <el-form-item label="是否发现线索" prop="isReport">
          <el-radio-group v-model="form.isReport" >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right" type="primary" @click="submitTriSurvey(form)">确 定</el-button>
          <el-button style="float:right;margin-right:15px" @click="closeDialog">取 消</el-button>
        </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitTriSurvey()">确 定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import "@/assets/less/testPaper.less";
  import testPaperMixin from "@/mixins/testPaper-mixin";
  import { mapActions, mapGetters,mapState } from 'vuex'
  import {postAction, httpAction, getAction ,putAction} from '@/api/manage'

  export default {
    name: "MyTripreAppSurvey",
    mixins: [testPaperMixin],
    data() {
      // 满意度必填
      var validateSatisfaction = (rule, value, callback) => {
        if (value === '' || value == undefined || value == 0) {
          callback(new Error('请选择满意度'));
        }
        callback();
      };
      var validateIsReport = (rule, value, callback) => {
        if (value === '' || value == undefined ) {
          callback(new Error('请选择是否发现线索'));
        }
        callback();
      };
      return {
        dialogFormVisible: false,
        form:{
          satisfaction:'',
          isReport:''
        },
        rules:{
          satisfaction:[
             //{ required: true, message: '请选择满意度', trigger: 'blur' },
            {validator:validateSatisfaction,trigger: 'change'},
          ],
          isReport:[
            //{ required: true, message: '请选择是否发现线索', trigger: 'blur' },
            {validator:validateIsReport,trigger: 'change'},
          ]
        },
      //被访人信息
        userName:'',
        userId:'',
        model:{
         // person_name:'',
          //exam_grade:'',
          /*excellent_number:'0',
          good_number:'0',
          pass_number:'0',
          fail_number:'0',*/
        },

        //按题目类型分类好的题目数据
        //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
        sortedTopics: [
          { topicType: 0, topic_content: [] },
          { topicType: 1, topic_content: [] },
          { topicType: 2, topic_content: [] },
          { topicType: 3, topic_content: [] },
          { topicType: 4, topic_content: [] },
        ],
        //试卷数据
        testData: {
          isMark:'',
          testName:this.$route.params.examName,
          examInfo:{},
        },

        //remainTime: "", //考试剩余时间
        //expendTime: 0, //考试用时(秒)
        isRead: false, //是否为只读模式
        //forbid_copy: false, //是否禁止复制文本
        //switchPage: 0,

        isPublishAnswer: false, //是否公布答案
        finishTest: false, //是否完成试卷
        //侧导航栏是否悬浮
        isFixed: false,
        topic_nav_style: "top:0px",
        grade:'',
      };
    },
    computed:{
      //按填空符(三个下划线)划分字符串
      fillSymbolStr() {
        return function (str) {
          var q = str.split("___");
          return q;
        };
      },
    },

    created() {
      console.log(this.$route.query)
      this.userName = this.$route.query.userName
      this.getTestPaperData();
    },
    watch:{
      remainTime(){
        //console.log(this.remainTime)
        if(this.remainTime === "00:00:00"){
          this.autoSubmit();
        }
      }
    },

    mounted() {
      window.addEventListener("scroll", this.handleScroll);
      //window.addEventListener("visibilitychange", this.visibilitychange);
    },

    methods: {
      //满意度分数
      getGrade(satisfaction){
        let that = this
        if(satisfaction == 1){
          that.$set(that.form,'satisfaction','2')
        }else if(satisfaction == 2){
          that.$set(that.form,'satisfaction','4')
        }else if(satisfaction == 3){
          that.$set(that.form,'satisfaction','6')
        }else if(satisfaction == 4){
          that.$set(that.form,'satisfaction','8')
        }else if(satisfaction == 5){
          that.$set(that.form,'satisfaction','10')
        }
      },
      supDialog(){
        this.dialogFormVisible = true
      },
      handleClose () {
        this.form = {}
        this.$refs.form.resetFields()
        //this.$emit('handleClose')
      },
      closeDialog(){
        this.dialogFormVisible  = false
        this.form = {}
        this.$refs.form.resetFields()
      },
      submitTriSurvey(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitTestsurvey()
          } else {
            this.$refs.form.resetField();
          }
        })
      },
      //获取当前用户信息
      ...mapGetters(["nickname", "avatar","userInfo"]),
      //提交调查问卷
      submitTestsurvey() {
        var topic = [];
        var grade='';
        console.log(this.testData.smartTopicVoList);
        for (let i = 0; i < this.testData.smartTopicVoList.length; i++) {
          var item = JSON.parse(JSON.stringify(this.testData.smartTopicVoList[i]))
            console.log(item);
            if(item.submitAnswer === null || item.submitAnswer.length === 0){
              this.$message.warning(`第${item.index}题目未作答`);
              this.dialogFormVisible  = false
              return
          }
          //处理多选/填空答案
          if (item.topicType == 1 || item.topicType == 3) {
            if (item.submitAnswer instanceof Array) {
              var submitAnswer = "";
              item.submitAnswer.forEach((c) => {
                submitAnswer += c + "\n";
              });
              item.submitAnswer = submitAnswer.slice(0, -1);
            }
          }
          topic.push({
            //questionId: item.questionId,
            paperId: this.$route.query.paperId,
            type:item.topicType,
            submitAnswer: item.submitAnswer,
          });
        }

        console.log(topic);
        let personId = this.$route.query.userId
        let paperId = this.$route.query.paperId
        let isReport = this.form.isReport
        this.getGrade(this.form.satisfaction)
        console.log(isReport,this.form.satisfaction)
        var request = {
          examId:paperId,
          personId:personId,
          isMark:this.testData.isMark,
          smartSubmitList: topic,
          satisfaction:this.form.satisfaction,
          isReport: isReport
        };
        console.log(request);
        postAction('/SmartPaper/smartSubmit/submitTriPreSurvey' ,request).then(res =>{
          if (res.success) {
            console.log(res.result);
            let title = ""
            let describe = ""
            if(this.testData.isMark === 1){
              title = "成绩"
              describe = "本次问卷成绩为"
              grade = res.result;
            }else {
              title = "结果"
              describe = "本次问卷结束，感谢您的参与！"
              grade = ""
            }
            this.$message.success(res.message);
            const h = this.$createElement;
            this.$msgbox({
              title: title,
              message: h('p', null, [
                h('span', null, describe),
                h('i', { style: 'color: teal' }, grade)
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = 'Loading...';
                  setTimeout(() => {
                    done();
                    setTimeout(() => {
                      instance.confirmButtonLoading = false;
                    }, 100);
                  }, 1000);
                } else {
                  done();
                }
              },
            }).then(action => {
              this.$elmessage({
                type:"success",
                message: "本次调查结束！",
                //onClose: close(),
              });
              console.log(isReport)
              if(isReport == "1"){
                console.log("跳转...")
                this.$router.push({
                  name: "InsertReportingInformation",
                });
              }else{
                window.location.href="about:blank";
                window.close();
                window.opener.location.reload();
              }
            });
          }
            //location.reload()
          else{
            this.$message.error(res.message);
          }
        })

       /* postAction('/SmartPaper/smartGradeNumber/excellentCount',this.model).then(res=>{
          if (res.success) {
            this.$message.success(res.message);
          }
        })
        postAction('/SmartPaper/smartGradeNumber/goodCount',this.model).then(res=>{
          if (res.success) {
            this.$message.success(res.message);
          }
        })
        postAction('/SmartPaper/smartGradeNumber/passCount',this.model).then(res=>{
          if (res.success) {
            this.$message.success(res.message);
          }
        })
        postAction('/SmartPaper/smartGradeNumber/failCount',this.model).then(res=>{
          if (res.success) {
            this.$message.success(res.message);
          }
        })*/

      },

      //获取试卷数据
      getTestPaperData() {
        let id =this.$route.query.paperId
        let params = {
          id:id
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
          if (item.topicType == 1 || item.topicType == 0){
            item.choice = item.choice.split(/[\n]/g);
          }
          // item.correct_answer = item.correct_answer.split(/[\n]/g);
          //添加用户答案
          if (item.topicType == 1 || item.topicType == 3) {
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

          /*testData.smartTopicVoList.forEach((item, index) => {
            //按换行符分割字符串
            item.correctAnswer = item.correctAnswer.split(/[\n]/g);
            //添加教师是否批改判断
            //item.status = testData.smartSubmitList[index].topicStatus;
            //添加评改分数
            item.userScore = testData.smartSubmitList[index].userScore;
          });*/
          /* 判断是否公布答案 */
          if(testData.examClasses.publishAnswer == 1)
          {
            this.isPublishAnswer = true;
            testData.smartTopicVoList.forEach((item, index) => {
              //按换行符分割字符串
              item.correctAnswer = item.correctAnswer.split(/[\n]/g);
              //添加教师是否批改判断
              //item.status = testData.smartSubmitList[index].topicStatus;
              //添加评改分数
              //item.userScore = testData.smartSubmitList[index].userScore;
            });
          }
        }



        this.testData = testData;
        console.log("this.testData ==> ", this.testData);

        //判断考试是否已经结束
        /*var nowDate = new Date().getTime();
        //var deadline = testData.examInfo.endTime;
        var deadline = this.$route.query.deadline;
        console.log('deadline',deadline);
        var deadlineDate = new Date(
          Date.parse(deadline.replace(/-/g, "/"))
        ).getTime();
        if (nowDate < deadlineDate && this.finishTest === false) {
          //开始计时
          console.log('开始计时');
          this.remainTimer();
        } else {
          this.isRead = true;
        }*/


        //按题目类型分类并保存
        var topics = this.testData.smartTopicVoList;
        var topicsIndex = 1;

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
            //this.$message("考试结束");
             //this.submitTestsurvey();
          }
        }, 1000);
      },
      //答题时间到，自动交卷
      autoSubmit() {
        var topic = [];
        var grade ='';
        console.log(this.testData.smartTopicVoList);
        for (let i = 0; i < this.testData.smartTopicVoList.length; i++) {
          var item = JSON.parse(JSON.stringify(this.testData.smartTopicVoList[i]))

          console.log(item);
          //处理多选/填空答案
          if (item.topicType == 1 || item.topicType == 3) {
            if (item.submitAnswer instanceof Array) {
              var submitAnswer = "";
              item.submitAnswer.forEach((c) => {
                submitAnswer += c + "\n";
              });
              item.submitAnswer = submitAnswer.slice(0, -1);
            }
          }
          topic.push({
            //questionId: item.questionId,
            paperId: this.$route.query.paperId,
            type:item.topicType,
            submitAnswer: item.submitAnswer,
          });
        }

        console.log(topic);
        let examId = this.$route.query.examId
        var request = {
          examId:examId,
          isMark:this.testData.isMark,
          smartSubmitList: topic,
        };
        console.log(request);
        postAction('/SmartPaper/smartExam/submitTestSurvey' ,request).then(res =>{
          console.log(res)
          if (res.success) {
            console.log(res.result);
            let title = ""
            let describe = ""
            if(this.testData.isMark === 1){
              title = "成绩"
              describe = "已到答题时间，自动交卷，本次问卷成绩为"
              grade = res.result;
            }else {
              title = "结果"
              describe = "本次问卷结束，感谢您的参与！"
              grade = ""
            }
            console.log(grade)
            const h = this.$createElement;
            this.$msgbox({
              title: '提醒',
              message: h('p', null, [
                h('span', null, title),
                h('i', { style: 'color: teal' }, grade)
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = 'Loading...'
                  setTimeout(() => {
                    done()
                    setTimeout(() => {
                      instance.confirmButtonLoading = false
                    }, 100)
                  }, 1000)
                } else {
                  done()
                }
              },
            }).then(action => {
              this.$elmessage({
                type:"success",
                message: "本次调查完成！",
                onClose:()=> {
                  //此处写提示关闭后需要执行的函数
                  window.location.href="about:blank";
                  window.close();
                  window.opener.location.reload();
                }
              });
            });
          }
          //location.reload()
          else{
            this.$message.error(res.message);
          }
        })
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
        //if(this.finishTest === true && this.testData.examClasses.publishAnswer == 1)
          if(this.finishTest === true)
        {
          if(val.userScore == val.score){
            console.log(val);
            return "correct";
          } else {
            return "error";
          }

          //未完成试卷
        }else{
          //多选题
          /*if (val.topicType == 1) {
            if (val.submitAnswer.join("") == "") {
              return "";
            }
          }*/

          //填空题
          if (val.topicType == 3) {

            let q = val.question.split("___")
            if(q.length-1 != val.submitAnswer.length){
              return ""
            }

            for(let item of val.submitAnswer){
              if(item == ""){
                return ""
              }
            }
          }

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
      isCorrect(topic,val){
        if(this.finishTest === false ){
          return ''
        }
        let is = false
        let option = this.getOption(val);
        if(topic.correctAnswer == option){
          is =true;
        }
        if(is){
          return "correct";
        } else {
          return "error";
        }
      },
      //判断多选题是否回答正确
      isCheckboxCorrect(topic,val){
        if(this.finishTest === false ){
          return ''
        }
        let is = false
        let option = this.getOption(val);
        topic.correctAnswer.forEach(item =>{
          if(item == option){
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
  .w {
    width: 100%
  }
  .testPaper
  .topics {
    width: 100%
  }
  .topics .topic .el-radio, .topics .topic .el-checkbox {
    width: 100%
  }

  .customWidth{
        width:80%;
  }


</style>

