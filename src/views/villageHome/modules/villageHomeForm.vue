<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="所在镇" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zhenId" disabled='ture'>
              <!-- <j-select-depart v-model="model.selecteddeparts" :multi="false" @back="backDepartInfo" :backDepart="true" :treeOpera="true"/>-->
              <a-tree-select
                style="width:100%"
                :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                :treeData="departTree2"
                v-model="model.zhenId"
                placeholder="请选择镇"
                allow-clear
                tree-default-expand-all>
              </a-tree-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
          <a-form-model-item label="所在村" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departId" disabled='true'>
            <!-- <j-select-depart v-model="model.selecteddeparts" :multi="false" @back="backDepartInfo" :backDepart="true" :treeOpera="true"/>-->
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
              v-model="model.departId"
              placeholder="请选择村"
              allow-clear
              tree-default-expand-all>
            </a-tree-select>
          </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="户主" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hostId">-->
<!--              <a-input v-model="model.hostId" placeholder="请输入户主"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="家庭地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入家庭地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="户口本编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="homeCode" >
              <a-input v-model="model.homeCode" placeholder="请输入户口本编号"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="户主姓" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="homeSurname" >
              <a-input v-model="model.homeSurname" placeholder="请输入户主姓"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="户主" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="idnumber">
              <select-user-by-village v-model="model.idnumber" @info = "getHostUser" store='idnumber'/>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="户主姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="realname" disabled='disabled'>-->
<!--              <a-input v-model="model.realname" placeholder="请输入姓名"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="户主手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone" >
              <a-input v-model="model.phone" placeholder="请输入手机号"  disabled='true'></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
          <a-form-model-item label="户主角色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="role" >
            <a-radio-group v-model="model.role" disabled='true'>
              <a-radio value="1463074308371800066">
                村长
              </a-radio>
              <a-radio value="1463112478345588738">
                村民
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          </a-col>
          <div v-for="(user,i) in model.userList">
            <ADivider></ADivider>
            <a-col :span="24">
              <a-form-model-item label="家庭成员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="">
                <a @click='deleteUser(user,i)'>删除</a>
              </a-form-model-item>
            </a-col>
<!--            <a-col :span="24">-->
<!--              <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="realname" disabled='disabled'>-->
<!--                <a-input v-model="user.realname" placeholder="请输入姓名"  ></a-input>-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
            <a-col :span="24">
              <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="id" >
                <a @click='getUserIndex(i)'><select-user-by-village v-model="user.id"  @info = "getUser" /></a>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone" >
                <a-input v-model="user.phone" placeholder="请输入手机号" disabled='true' ></a-input>
              </a-form-model-item>
            </a-col>
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="relation"
              label="家庭关系"
              required
            >
              <j-search-select-tag
                placeholder="请选择与户主的关系"
                dict="home_relation"
                v-model="user.relation"
              />
            </a-form-model-item>
            <a-col :span="24">
              <a-form-model-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="role" >
                <a-radio-group v-model="user.role" disabled='true'>
                  <a-radio value="1463074308371800066">
                    村长
                  </a-radio>
                  <a-radio value="1463112478345588738">
                    村民
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </div>
          <div class="operate">
            <a-button type="dashed" style="width: 100%" icon="plus" @click="newUser">添加家庭成员</a-button>
          </div>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import SelectUserByVillage from "../../../components/jeecgbiz/modal/SelectUserByVillage"
  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { queryVillageIdTree} from '@/api/api'

  export default {
    name: 'villageHomeForm',
    components: {
      SelectUserByVillage
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
          role:'',
          phone:'',
          idnumber:'',
          userList:[]
         },
        editDefault:{},
        memberList:[],
        userIndex:'',
        departTree:[],
        departTree2:[],
        homeUsers:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           homeSurname: [
              { required: true, message: '请输入户主姓!'},
           ],
          zhenId: [
            { required: true, message: '请选择镇!'},
          ],
          departId: [
            { required: true, message: '请选择村!'},
          ],
           address: [
              { required: true, message: '请输入家庭地址!'},
           ],
          homeCode: [
            { required: true, message: '请输入户口本编号!'},
          ],
          idnumber: [
            { required: true, message: '请选择户主!'},
          ]
        },
        url: {
          add: "/villageHome/villageHome/add",
          edit: "/villageHome/villageHome/edit",
          queryById: "/villageHome/villageHome/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.loadVillageTreeData();
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        console.log(record)
        console.log("========================================================")
        console.log(this.model);
        this.editDefault = JSON.parse(JSON.stringify(this.model));
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            for(let i=0;i<that.model.userList.length;i++)
            {
              if(that.model.userList[i].id!=null || that.model.userList[i].id!=="")
              {that.memberList.push(that.model.userList[i].id);}
            }
            that.memberList.push(that.model.hostId);
            console.log(that.memberList);
            for(let m=0;m<that.memberList.length-1;m++)
            {
              let everyId = that.memberList[m];
              for(let n=m+1;n<that.memberList.length;n++)
              {
                if(that.memberList[n] == everyId)
                {
                  that.memberList=[];
                  // that.model = Object.assign({}, that.editDefaultModel);
                  that.$message.warning("人员选择重复！");
                  return;
                }
              }
            }
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                // that.editDefaultModel = that.model;
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.memberList=[];
              // that.model=Object.assign({}, that.editDefaultModel);
            })
          }
         
        })
      },
      loadVillageTreeData(){
        var that = this;
        this.departTee = []
        this.departTree2 = []
        queryVillageIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            that.departTree2 = [];
            for (let j = 0; j < res.result.length; j++) {
              let temp = res.result[j];
              that.departTree.push(temp);
              that.departTree2.push(temp);
            }
          }

        })
      },
      getHostUser(back){
        let that = this
        that.model.idnumber = back[0].idnumber
        // that.model.realname= back[0].realname
        that.model.phone = back[0].phone
        that.model.role = back[0].role
      },
      getUser(back){
        let that = this
        this.model.userList.splice(that.userIndex,1,back[0]);
        // this.model.userList.forEach(function (item,index,arr){
        //   if (item.id == that.userId && i == 0) {
        //     arr.splice(index,1,back[0]);
        //     i = 1
        //   }
        // });

        // that.model.userList.user.id = back[0].id
        // that.user.realname= back[0].realname
        // that.model.userList.user.phone = back[0].phone
        // that.model.userList.user.role = back[0].role
      },
      getUserIndex(userIndex){
        let that = this;
        that.userIndex = userIndex;
      },
      newUser(){
        this.model.userList.push({
          id: "",
          phone:"",
          role:"",
          relation:""
        });
      },
      deleteUser(record,i){
        this.model.userList.splice(i,1);
        // this.model.userList.forEach(function (item,index,arr){
        //   if (item == record) {
        //     arr.splice(index,1);
        //     return;
        //   }
        // });
      },
      userListRefresh(){
        this.model = Object.assign({}, this.editDefaultUserList);
      }
    }
  }
</script>