<template>
  <div class="createTest testPaper" @click.self="edit(-1,-1)">
    <div class="w">
      <!--<div class="header"></div>-->
      <!-- 试卷信息 -->
      <div class="title ">
        <el-input v-model="testData.paperName" class="testName" placeholder="请输入试卷标题" :disabled="isRead"></el-input>
        <ul>
          <li class="test-info" style="margin-top: 3px" >出卷者: {{ getCreatorName()}}</li>
          <li class="test-info">
            答题时间:
            <el-input-number v-model="testData.time" controls-position="right" :step="10" size="mini" :min="1" :disabled="isRead"/>
            分钟
          </li>
          <li class="test-info" style="margin-top: 3px">题目数量: 共 {{ topicNavIndex_mixin(4,sortedTopics[4].topic_content.length-1) }} 道</li>
          <li class="test-info" style="margin-top: 3px">总分: {{ totalScore }} 分</li>
          <li class="test-info">
            及格分数:
            <el-input-number v-model="testData.passMark" controls-position="right" :step="1" size="mini" :min="0" :max="totalScore" :disabled="isRead"/>
            分
          </li>
          <li class="fr">
            <el-button v-if="params.opt === 'add' || params.opt === 'edit'" size="mini" type="primary" @click="submit()">保存试卷</el-button>
            <!--<el-button v-if="testData.releasing === 0 || params.type === 'add'" size="mini" type="primary" @click="submit()">保存试卷</el-button>-->
            <!--<el-button v-else size="mini" type="primary" @click="copy()">复制试卷</el-button>-->
          </li>
          <!-- <li class="test-info">所属班级: {{ testData.classes_name }}</li> -->
          <li style="clear:both;"></li>
        </ul>
        <!--<ul>
&lt;!&ndash;          <li class="test-info">允许学生切换页面次数:
            <el-input-number v-model="testData.switchPage" controls-position="right" :step="1" size="mini" :min="-1" />
            <el-tooltip class="item" effect="light" content="-1表示允许学生无限次切换页面" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>&ndash;&gt;
&lt;!&ndash;          <li class="test-info">是否允许复制文本:
            <el-switch v-model="testData.permitCopy" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>&ndash;&gt;
          &lt;!&ndash;<li class="test-info">是否打乱题目顺序:
            <el-switch v-model="testData.disruptOrder" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>&ndash;&gt;
          &lt;!&ndash;<li class="test-info">是否自动评分:
            <el-switch v-model="testData.autoMack" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
            <el-tooltip class="item" effect="light" content="取消自动评分系统依然会自动批改,但会先显示分数为0分,等待教师审批确认" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>&ndash;&gt;
          <li style="clear:both;"></li>
        </ul>-->
      </div>

      <div class="title fixed" v-if="isFixed">
        <el-input v-model="testData.paperName" class="testName" placeholder="请输入试卷标题" :disabled="isRead"></el-input>
        <ul>
          <li class="test-info" style="margin-top: 3px" >出卷者: {{ getCreatorName()}}</li>
          <li class="test-info">
            答题时间:
            <el-input-number v-model="testData.time" controls-position="right" :step="10" size="mini" :min="1" :disabled="isRead"/>
            分钟
          </li>
          <li class="test-info" style="margin-top: 3px">题目数量: 共 {{ topicNavIndex_mixin(4,sortedTopics[4].topic_content.length-1) }} 道</li>
          <li class="test-info" style="margin-top: 3px">总分: {{ totalScore }} 分</li>
          <li class="test-info">
            及格分数:
            <el-input-number v-model="testData.passMark" controls-position="right" :step="1" size="mini" :min="0" :max="totalScore" :disabled="isRead"/>
            分
          </li>
          <li class="fr">
            <el-button v-if="params.opt === 'add' || params.opt === 'edit'" size="mini" type="primary" @click="submit()">保存试卷</el-button>
            <!--<el-button v-if="testData.releasing === 0 || params.type === 'add'" size="mini" type="primary" @click="submit()">保存试卷</el-button>-->
            <!--<el-button v-else size="mini" type="primary" @click="copy()">复制试卷</el-button>-->
          </li>
          <!-- <li class="test-info">所属班级: {{ testData.classes_name }}</li> -->
          <li style="clear:both;"></li>
        </ul>
        <!--<ul>
&lt;!&ndash;          <li class="test-info">允许学生切换页面次数:
            <el-input-number v-model="testData.switchPage" controls-position="right" :step="1" size="mini" :min="-1" />
            <el-tooltip class="item" effect="light" content="-1表示允许学生无限次切换页面" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>&ndash;&gt;
&lt;!&ndash;          <li class="test-info">是否允许复制文本:
            <el-switch v-model="testData.permitCopy" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>&ndash;&gt;
          &lt;!&ndash;<li class="test-info">是否打乱题目顺序:
            <el-switch v-model="testData.disruptOrder" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>&ndash;&gt;
          &lt;!&ndash;<li class="test-info">是否自动评分:
            <el-switch v-model="testData.autoMack" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
            <el-tooltip class="item" effect="light" content="取消自动评分系统依然会自动批改,但会先显示分数为0分,等待教师审批确认" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>&ndash;&gt;
          <li style="clear:both;"></li>
        </ul>-->
      </div>

      <div class="test-content" @click.self="edit(-1,-1)">
        <div class="topics">
          <!-- 所有题目 -->
          <div class="topic" v-for="(s_topics, index) in sortedTopics" :key="index">
            <!-- 按类型分类好的题目 -->
            <div class="topicsType" v-if="s_topics.topic_content.length != 0">
              <div class="bigQuestionName">
                <h4> {{bigQuestionName_mixin(s_topics.type,index)}} </h4><!-- 题目类型名称 -->
                <div class="allScore">
                  <button :class="s_topics.showAllScore? 'active':''" @click="s_topics.showAllScore = !s_topics.showAllScore" v-show="isShow">统一设置题目分数</button>
                  <el-input v-if="s_topics.showAllScore" @change="setAllScore($event,s_topics.type)" v-model="s_topics.score" placeholder="请输入分数" :disabled="isRead"></el-input>
                </div>
              </div>

              <div v-for="(t, tIndex) in s_topics.topic_content" :key="tIndex" @click="edit(s_topics.type,tIndex)">
                <div class="topic-content" :class="isEdit(s_topics.type,tIndex)?'isEdit':''">
                  <!-- 题目 -->
                  <div class="question">
                    <strong class="question_nunber">{{ topicNavIndex_mixin(s_topics.type,tIndex) }}、</strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-input v-model="t.question" type="textarea" autosize placeholder="请输入题干" :disabled="isRead" required = "required"></el-input>
                    </span>
                    <span v-else>{{ t.question }}</span>
                  </div>

                  <!-- 单项选择题 -->
                  <div class="userAnswer" v-if="s_topics.type==0">
                    <div class="radios">
                      <el-radio v-for="(item, index) in t.choice" :key="index" v-model="t.correctAnswer" :label="getOption(index)" :disabled="isRead">
                        <span class="topicNavIndex">{{String.fromCharCode(65+index)}}、</span>
                        <span v-if="editInedx.type==0&&editInedx.index==tIndex">
                          <el-input v-model="t.choice[index]" type="textarea" autosize placeholder="请输入选项内容" :disabled="isRead" required = "required"></el-input>
                          <el-button class="delRadios" size="mini" type="danger" v-if="t.choice.length>2" @click="delRadios(0,tIndex,index)" v-show="isShow">
                            <i class="el-icon-close"></i>
                          </el-button>
                        </span>
                        <span v-else>{{item}}</span>
                      </el-radio>
                    </div>
                    <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addRadios(s_topics.type,tIndex)" v-show="isShow">添加选项</el-button>
                  </div>

                  <!-- 多项选择题 -->
                  <div class="userAnswer" v-if="s_topics.type==1">
                    <div class="checkbox">
                      <el-checkbox-group v-model="t.correctAnswer" :disabled="isRead">
                        <el-checkbox :label="getOption(index)" v-for="(item, index) in t.choice" :key="index">
                          <span class="topicNavIndex">{{String.fromCharCode(65+index)}}、</span>
                          <span v-if="editInedx.type==1&&editInedx.index==tIndex">
                            <el-input v-model="t.choice[index]" type="textarea" autosize placeholder="请输入选项内容" :disabled="isRead" required = "required"></el-input>
                            <!--<el-input v-model="t.choice[index]" type="textarea" autosize placeholder="请输入选项内容"></el-input>-->
                            <el-button class="delRadios" size="mini" type="danger" v-if="t.choice.length>2" @click="delRadios(1,tIndex,index)" v-show="isShow">
                              <i class="el-icon-close"></i>
                            </el-button>
                          </span>
                          <span v-else>{{item}}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addRadios(s_topics.type,tIndex)" v-show="isShow">添加选项</el-button>
                  </div>

                  <!-- 判断题 -->
                  <div class="userAnswer" v-if="s_topics.type==2">
                    <div class="TrueOrFalse">
                      <el-radio v-model="t.correctAnswer" label="T" :disabled="isRead">正确</el-radio>
                      <el-radio v-model="t.correctAnswer" label="F" :disabled="isRead">错误</el-radio>
                    </div>
                  </div>

                  <!-- 填空题 -->
                  <div class="userAnswer" v-if="s_topics.type==3">
                  <el-button size="mini" @click="addFillSymbol(tIndex)" v-show="isShow">插入填空符</el-button>
                  <!--<span style="font-size:12px;">(三个下划线为一个填空符)</span>-->

                  <div class="fillInBlank">
                    <div v-for="(q, index) in fillSymbolStr(t.question)" :key="index">
                      <el-input type="textarea" autosize placeholder="请回答" v-if="index!=fillSymbolStr(t.question).length-1" v-model="t.correctAnswer[index]"
                                :disabled="isRead" required = "required">
                      </el-input>
                    </div>
                  </div>
                </div>

                  <!-- 简答题 -->
                  <div class="userAnswer" v-if="s_topics.type==4">
                    <div class="text">
                      <strong>&nbsp;&nbsp;关键字</strong>
                      <div v-for="(q, index) in t.correctAnswer" :key="index">
                        <el-input type="textarea" autosize placeholder="请输入关键字" v-model="t.correctAnswer[index]" :disabled="isRead" required = "required"> </el-input>
                      </div>
                      <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addKeyWord(tIndex)" v-show="isShow">添加关键字</el-button>
                      <!-- {{t.correctAnswer}} -->
                    </div>
                  </div>

                  <!-- 正确答案 -->
                  <p class="correctAnswer">
                    <strong>正确答案: </strong>
                    {{ t.correctAnswer}}
                  </p>
                  <div>
                    <!--<div class="difficulty">
                      <strong>难度: </strong>
                      <span v-if="isEdit(s_topics.type,tIndex)">
                        <el-select v-model="t.difficulty" placeholder="请选择" size="mini">
                          <el-option v-for="item in topicDifficultyOptions" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </span>
                      <span v-else>{{t.difficulty}}</span>
                    </div>-->
                    <div class="topicScore">
                      <strong>分值: </strong>
                      <span v-if="isEdit(s_topics.type,tIndex)">
                        <el-input-number v-model="t.score" controls-position="right" :step="1" size="mini" :min="0" :disabled="isRead"/>
                      </span>
                      <span v-else>{{t.score}}</span>
                      (分)
                    </div>
                    <!--<div class="required">
                      <strong>是否必填: </strong>
                      <el-switch v-model="t.required" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
                    </div>-->
                  </div>
                  <!--<div class="analysis">
                    <strong>题目解析: </strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-input v-model="t.analysis" type="textarea" autosize></el-input>
                    </span>
                    <span v-else>{{t.analysis}}</span>
                  </div>-->

                </div>
                <el-divider></el-divider>
              </div>

            </div>
          </div>

        </div>

        <!-- 题目导航 -->
        <div class="topic-nav" :class="isFixed ? 'isFixed' : ''" :style="topic_nav_style">
          <!-- 工具 -->
          <div class="tool">
            <transition name="el-zoom-in-top">
              <div v-show="!isEdit(-1,-1)">
                <el-button icon="el-icon-top" title="上移" @click="moveTopic(-1)" v-show="isShow"></el-button>
                <el-button icon="el-icon-bottom" title="下移" @click="moveTopic(1)" v-show="isShow"></el-button>

                <!--<transition name="el-zoom-in-center">
                  <div v-show="true" style="display:inline-block;margin:0 10px">
                    <el-button icon="el-icon-picture-outline" title="上传图片" @click="moveDowmTopic()"></el-button>
                  </div>
                </transition>-->

                <el-button type="danger" icon="el-icon-delete" title="删除" @click="delTopic()" v-show="isShow"></el-button>
              </div>
            </transition>
          </div>

          <!-- 导航按钮 -->
          <ul v-for="(topics, Topics_index) in sortedTopics" :key="Topics_index">
            <li class="topic-nav-item" @click.self="edit(-1,-1)">
              <div class="nav-title">{{topicTypeName_mixin(topics.type)}}</div>
              <span class="topic-nav-button" :class="editInedx.type==topics.type" v-for="(item , index) in topics.topic_content" :key="index" @click="topicNav(Topics_index,index)">
                {{topicNavIndex_mixin(Topics_index,index)}}
              </span>

              <span class="topic-nav-button" @click="newTopic(topics.type)" v-show="isShow">
                <i class="el-icon-plus"></i>
              </span>
            </li>
          </ul>
        </div>

        <div style="clear:both;"></div>
      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import "@/assets/less/testPaper.less";
  import testPaperMixin from "@/mixins/testPaper-mixin";
  import {postAction, httpAction, getAction ,putAction} from '@/api/manage'
  import { mapActions, mapGetters,mapState } from 'vuex'

  export default {
    name: "Paper",
    mixins: [testPaperMixin],
    data() {
      return {
        //按题目类型分类好的题目数据
        //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
        sortedTopics: [
          { type: 0, topic_content: [], score: 0, showAllScore: false },
          { type: 1, topic_content: [], score: 0, showAllScore: false },
          { type: 2, topic_content: [], score: 0, showAllScore: false },
          { type: 3, topic_content: [], score: 0, showAllScore: false },
          { type: 4, topic_content: [], score: 0, showAllScore: false },
        ],

        // //试卷数据
        testData: {
          //id: -1,
          paperName: '', //试卷名称
          time: 30, //答题时间
          topicNum: 0, //题目数量
          passMark: 0,
          totalScore:'',
          createBy:'',
          creatorName:'',
          smartTopicVoList:{}
          //autoMack: 1, //是否自动评分
          //permitCopy: 1, //是否允许复制文本
          //repeatTest: 1, //用户可重复考试次数
          //switchPage: -1,
          //disruptOrder: 0, //是否打乱题目顺序
          //creatorName: this.$store.state.userName,
        },
        //用户数据
        userData: {
          id: "",
          name: "李子建",
        },

        //当前编辑的题目索引
        editInedx: {
          type: "-1",
          index: "-1",
          input: "-2",
        },

        //topicDifficultyOptions: ["简单", "中等", "困难"], //题目难度选项

        //侧导航栏是否悬浮
        isFixed: false,
        topic_nav_style: "top:0px",
        isRead: false, //是否为只读模式
        isShow:true //是否展示添加选项按钮
      };
    },

      computed: {
      params(){
        return this.$route.params;
      },
      //试卷总分
      totalScore() {
        let score = 0;
        this.sortedTopics.forEach((element) => {
          element.topic_content.forEach((item) => {
            // console.log(typeof(item.score));
            score += parseInt(item.score);
          });
        });
        this.testData.totalScore = score;
        return score;
      },

      //按填空符(三个下划线)划分字符串
      fillSymbolStr() {
        return function (str) {
          let q = str.split("___");
          return q;
        };
      },
    },
    created() {
      console.log(this.$route)
      let type = this.$route.params.opt;
      if (type === "add") {
      }
      if (type === "edit") {
        this.getTestPaper();
      }
      if (type === "detail") {
        this.getTestPaper();
        this.isRead = true;
        this.isShow = false;
      }
    },

    mounted() {
      // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
      window.addEventListener("scroll", this.handleScroll);
    },

    methods: {
      //获取出题者姓名
      getCreatorName:function (){
        if(this.testData.creatorName){
          return this.testData.creatorName;
        }else{
          console.log(this.$store.getters.nickname);
          return this.$store.getters.nickname;
        }
      },
      // 复制试卷
      /*copy() {
        this.testData.examName = "点击编辑试卷名称";
        this.$router.push({
          name: "createExam",
          params: { type: "add", data: this.testData },
        });
        this.$message.success("复制成功");
      },*/
      //获取当前用户信息
      ...mapGetters(["nickname", "avatar","userInfo"]),
      //提交试卷
      submit() {
        /*  处理题目信息 */
        let topicData = [];
        this.sortedTopics.forEach((element) => {
          if (element.topic_content.length != 0) {
            element.topic_content.forEach((item) => {
              //深拷贝
              let newItem = JSON.parse(JSON.stringify(item));
              topicData.push(newItem);
            });
          }
        });

        //处理选择题选项
        topicData.forEach((item) => {
          let choice = "";

          if(item.topicType ==="0" || item.topicType === "1") {

            item.choice.forEach((c) => {
              console.log(item.choice)
              console.log(c)
              if(c ===""){
                this.$message.warning("有题目存在空选项！");
                return
              }else{
                choice += c + "\n";
                item.choice = choice.slice(0, -1);
              }

            });
          }

        });

        //处理正确答案
        for(let item of topicData) {
          if(!item.correctAnswer){
            this.$message.warning("有题目未选答案！");
            return
          }
          if (item.correctAnswer instanceof Array) {
            if(item.correctAnswer.length === 1 && item.correctAnswer[0] === ''){
              this.$message.warning("有题目未选答案！");
              return
            }
            let correctAnswer = "";
            item.correctAnswer.forEach((c) => {
              correctAnswer += c + "\n";
            });
            item.correctAnswer = correctAnswer.slice(0, -1);
          }
        };

        //处理试卷信息
        this.testData.creatorName = this.getCreatorName();
        this.testData.smartTopicVoList= topicData;
        this.testData.topicNum = topicData.length;
        //testData.autoMack = testData.autoMack == true ? "1" : "0";
        //testData.disruptOrder = testData.disruptOrder == true ? "1" : "0";
        //testData.permitCopy = testData.permitCopy == true ? "1" : "0";

        if (this.params.opt === "edit") {
          let id = this.$route.params.id
          let url = "/SmartPaper/smartPaper/edit/"+id;
          putAction(url, this.testData).then((res) => {
            if (res.success) {
              this.$elmessage({
                type:"success",
                message: "修改成功！",
                duration:300,
                onClose:()=> {
                  //此处写提示关闭后需要执行的函数
                  window.location.href="about:blank";
                  window.close();
                  window.opener.location.reload();
                }
              })
            }
            else{
              this.$elmessage({
                type:"error",
                message: "修改失败！",
                duration:300,
              })
            }
          });
        } else if (this.params.opt === "add") {
          let url = "/SmartPaper/smartPaper/add";
          postAction(url, this.testData).then((res) => {
            if (res.success) {
              this.$elmessage({
                type:"success",
                message: "添加成功！",
                duration:300,
                onClose:()=> {
                  //此处写提示关闭后需要执行的函数
                  window.location.href="about:blank";
                  window.close();
                  window.opener.location.reload();
                }
              })
            }
            else{
              this.$elmessage({
                type:"error",
                message: "添加失败！",
                duration:300,
              })
            }
          });
        }
        console.log(this.testData);
      },

      //编辑试卷---获取试卷信息
      async getTestPaper() {
        let params = {
          id:this.$route.params.id,
        };
        //console.log(typeof(params.id));
        await getAction("/SmartPaper/smartPaper/getPaperById", params).then((res) => {
          //console.log("result.data ==> ", res.result);
          if (res.success) {
            var testData = res.result;
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message)
          }
          //处理试卷的题目数据
          if(testData.smartTopicVoList) {
            testData.smartTopicVoList.forEach((item) => {
              //if (item.topicType == 4 || item.topicType == 3 || item.topicType == 1)
              if (item.topicType == 4 || item.topicType == 3 ||item.topicType == 1) {
                item.correctAnswer = item.correctAnswer.split(/[\n]/g);
              }
              //按换行符分割字符串
              item.choice = item.choice.split(/[\n]/g);
              //item.required = item.required === 1 ? true : false;
            });
          }
          /*testData.autoMack = testData.autoMack == 1 ? true : false;
          testData.disruptOrder = testData.disruptOrder == 1 ? true : false;*/
          //testData.permitCopy = testData.permitCopy == 1 ? true : false;
          this.testData = testData;
          console.log("testData ==> ", this.testData);

          //按题目类型分类并保存
          let topics = this.testData.smartTopicVoList;
          if(topics){
            for (let i = 0; i < topics.length; i++) {
              for (let item of this.sortedTopics) {
                //     // console.log(topics[i].topicType,item.type);
                if (topics[i].topicType == item.type) {
                  item.topic_content.push(topics[i]);
                }
              }
            }
          }
          console.log(this.sortedTopics);
        });
      },

      //统一设置题目分数
      setAllScore(val, type) {
        val = parseInt(val);
        this.sortedTopics[type].topic_content.forEach((item) => {
          item.score = val;
        });
      },

      //设置当前编辑中的题目
      edit(type, index) {
        if (this.editInedx.type == type && this.editInedx.index == index) {
          console.log("拦截");
          return;
        }
        this.editInedx.type = type;
        this.editInedx.index = index;
      },

      //是否在编辑状态
      isEdit(type, index, input = -2) {
        if (
          this.editInedx.type == type &&
          this.editInedx.index == index &&
          this.editInedx.input == input
        ) {
          return true;
        } else {
          return false;
        }
      },

      //滚动事件
      handleScroll() {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop; // 滚动条偏移量
        if (scrollTop > 154) {
          this.topic_nav_style = "top:" + (scrollTop + 20) + "px";
          this.isFixed = true;
        } else {
          this.isFixed = false;
        }
      },

      //点击题号导航跳转
      topicNav(type, index) {
        let totalIndex = this.topicNavIndex_mixin(type, index) - 1;
        setTimeout(() => {
          document
            .getElementsByClassName("topic-content")
            [totalIndex].scrollIntoView({ behavior: "smooth" });
        }, 100);
        this.edit(type, index);
      },

      //新建题目
      newTopic(type) {
        this.sortedTopics[type].topic_content.push({
          //u_id: this.userData.id,
          topicType: type,
          question: "",
          choice: [],
          correctAnswer: [],
          //analysis: "",
          //difficulty: "中等",
          score: 5,
          //subjectId: "1",
          //required: true
        });

        let time = setTimeout(() => {
          this.topicNav(type, this.sortedTopics[type].topic_content.length - 1);
          clearInterval(time);
        }, 100);
      },

      //删除当前正在编辑的题目
      delTopic() {
        let type = this.editInedx.type;
        let index = this.editInedx.index;
        this.sortedTopics[type].topic_content.splice(index, 1);
      },

      //上移或下移当前正在编辑的题目  -1:上移   1:下移（只能在一个题型内移动）
      moveTopic(n) {
        let type = this.editInedx.type;
        let index = this.editInedx.index;

        if (index == 0 && n == -1) {
          console.log("拦截");
          return;
        }
        if (index == this.sortedTopics[type].topic_content.length - 1 && n == 1) {
          console.log("拦截");
          return;
        }

        let topic = this.sortedTopics[type].topic_content[index];
        let upTopic = this.sortedTopics[type].topic_content[index + n];

        this.sortedTopics[type].topic_content.splice(index, 1, upTopic);
        this.sortedTopics[type].topic_content.splice(index + n, 1, topic);

        let time = setTimeout(() => {
          this.topicNav(type, index + n, 10);
          clearInterval(time);
        }, 100);
      },

      //删除选项
      delRadios(type, tIndex, index) {
        this.sortedTopics[type].topic_content[tIndex].choice.splice(index, 1);
      },

      //添加选项，最多10个
      addRadios(type, tIndex) {
        let choiceLength = this.sortedTopics[type].topic_content[tIndex].choice.length + 1;
        if (choiceLength > 10) {
          this.$message({
            message: "不能再添加选项了喔!",
            type: "warning",
          });
          return;
        }
        //this.sortedTopics[type].topic_content[tIndex].choice.push("请输入选项" + choiceLength);
        this.sortedTopics[type].topic_content[tIndex].choice.push('');
      },
      //转换选项为A,B,C,D
      getOption(index){
        let option = String.fromCharCode(65+index);
        return option;
      },

      //添加填空符
      addFillSymbol(tIndex) {
        var str = this.sortedTopics[3].topic_content[tIndex].question;
        // console.log(str);
        this.sortedTopics[3].topic_content[tIndex].question = str + "___";
      },

      //添加关键字
      addKeyWord(tIndex) {
        this.sortedTopics[4].topic_content[tIndex].correctAnswer.push("");
        console.log(this.sortedTopics[4].topic_content[tIndex]);
      },
    },
  };
</script>
<style lang="less" scoped>
 .fr {
  float: right;
}
 ul {
   list-style: none;
   padding: 0;
   margin: 0;
 }
</style>
