<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="事件标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入事件标题"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="事件详情" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="eventDetail">
              <a-textarea v-model="model.eventDetail" rows="4" placeholder="请输入事件详情"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="背景颜色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isFinished">
              <el-color-picker v-model="model.backgroundColor"></el-color-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="整天" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="allDay">
              <el-switch
                v-model="model.allDay"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startTime">
              <j-date placeholder="请选择开始时间" v-model="model.startTime" :show-time="true"
                      date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-show="model.allDay === 0">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date placeholder="请选择结束时间" v-model="model.endTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss"
                      style="width: 100%"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import {httpAction, getAction} from '@/api/manage'
import {validateDuplicateValue} from '@/utils/util'

export default {
  name: 'CalendarEventForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      confirmLoading: false,
      validatorRules: {
        title: [
          { required: true, message: '请输入事件标题!'},
        ],
        startTime: [
          { required: true, message: '请输入开始时间!'},
        ],
      },
      url: {
        add: "/calendarEvent/calendarEvent/add",
        edit: "/calendarEvent/calendarEvent/edit",
        queryById: "/calendarEvent/calendarEvent/queryById"
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model));
  },
  methods: {
    add(selectInfo) {
      this.modelDefault.backgroundColor = '#409EFF';
      if (selectInfo) {
        this.modelDefault.allDay = selectInfo.allDay ? 1 : 0;
        this.modelDefault.startTime = this.$moment(selectInfo.startStr).format("YYYY-MM-DD HH:mm:ss");
        this.modelDefault.endTime = this.$moment(selectInfo.endStr).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.modelDefault.allDay = 0;
      }
      this.edit(this.modelDefault);
    },
    edit(record) {
      this.model = Object.assign({}, record);
      this.visible = true;
    },
    submitForm() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
  }
}
</script>