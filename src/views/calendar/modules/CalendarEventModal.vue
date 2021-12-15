<template>
  <a-modal
    ref="modal"
    :class="getClass(modalClass)"
    :style="getStyle(modalStyle)"
    :visible="visible"
    :width='width'
    v-bind="_attrs"
    v-on="$listeners"
    @ok="handleOk"
    @cancel="handleCancel"
    destroyOnClose
  >
    <slot></slot>
    <!--有设置标题-->
    <template v-if="!isNoTitle" slot="title">
      <a-row class="j-modal-title-row" type="flex">
        <a-col class="left">
          <slot name="title">{{ title }}</slot>
        </a-col>
        <a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
          <a-button class="ant-modal-close ant-modal-close-x" ghost type="link" :icon="fullscreenButtonIcon"/>
        </a-col>
      </a-row>
    </template>
    <!--没有设置标题-->
    <template v-else slot="title">
      <a-row class="j-modal-title-row" type="flex">
        <a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
          <a-button class="ant-modal-close ant-modal-close-x" ghost type="link" :icon="fullscreenButtonIcon"/>
        </a-col>
      </a-row>
    </template>

    <!-- 处理 scopedSlots -->
    <template v-for="slotName of scopedSlotsKeys" :slot="slotName">
      <slot :name="slotName"></slot>
    </template>

    <!-- 处理 slots -->
    <template v-for="slotName of slotsKeys" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>

    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">
        关闭
      </a-button>
      <a-popconfirm
        title="确定删除这个日程?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleDelete"
      >
        <a-button v-show="curId !== ''" key="delete" :loading="loading" type="danger">
          删除
        </a-button>
      </a-popconfirm>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        确定
      </a-button>
    </template>
    <calendar-event-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></calendar-event-form>
  </a-modal>
</template>

<script>

import CalendarEventForm from './CalendarEventForm'
import { getClass, getStyle } from '@/utils/props-util'
import { triggerWindowResizeEvent } from '@/utils/util'
import { deleteAction } from '@api/manage'

export default {
  name: 'CalendarEventModal',
  components: {
    CalendarEventForm
  },
  data() {
    return {
      width: 800,
      disableSubmit: false,
      title: String,
      // 可使用 .sync 修饰符
      visible: false,
      // 是否全屏弹窗，当全屏时无论如何都会禁止 body 滚动。可使用 .sync 修饰符
      fullscreen: false,
      loading: false,
      //附件
      attach: '',
      // 是否允许切换全屏（允许后右上角会出现一个按钮）
      switchFullscreen: true,
      // 点击确定按钮的时候是否关闭弹窗
      okClose: true,

      // 内部使用的 slots ，不再处理
      usedSlots: ['title'],
      // 实际控制是否全屏的参数
      innerFullscreen: this.fullscreen,
      curId: '',
      url: {
        list: '/calendarEvent/calendarEvent/list',
        edit: '/calendarEvent/calendarEvent/edit',
        delete: '/calendarEvent/calendarEvent/delete',
        deleteBatch: '/calendarEvent/calendarEvent/deleteBatch',
        exportXlsUrl: '/calendarEvent/calendarEvent/exportXls',
        importExcelUrl: 'calendarEvent/calendarEvent/importExcel'
      },
    }
  },
  methods: {
    add(selectInfo) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add(selectInfo);
      })
    },
    edit(record) {
      this.visible = true
      this.curId = record.id
      this.$nextTick(() => {
        this.$refs.realForm.edit(record);
      })
    },
    close() {
      this.visible = false;
      this.loading = false
      this.curId = ''
    },
    handleOk() {
      this.$refs.realForm.submitForm();
    },
    submitCallback() {
      this.$emit('ok');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },

    handleDelete() {
      if(!this.url.delete){
        this.$message.error("请设置url.delete属性!")
        return
      }
      this.loading = true
      let that = this;
      deleteAction(that.url.delete, {id: that.curId}).then((res) => {
        if (res.success) {
          //重新计算分页问题
          that.$message.success(res.message);
          that.$emit('ok');
          that.close()
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    getClass(clazz) {
      return { ...getClass(this), ...clazz }
    },
    getStyle(style) {
      return { ...getStyle(this), ...style }
    },

    /** 切换全屏 */
    toggleFullscreen() {
      this.innerFullscreen = !this.innerFullscreen
      triggerWindowResizeEvent()
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.innerFullscreen = this.fullscreen
      }
    },
    innerFullscreen(val) {
      this.$emit('update:fullscreen', val)
    },
  },
  computed: {
    // 一些未处理的参数或特殊处理的参数绑定到 a-modal 上
    _attrs() {
      let attrs = { ...this.$attrs }
      // 如果全屏就将宽度设为 100%
      if (this.innerFullscreen) {
        attrs['width'] = '100%'
      }
      return attrs
    },
    modalClass() {
      return {
        'j-modal-box': true,
        'fullscreen': this.innerFullscreen,
        'no-title': this.isNoTitle,
        'no-footer': this.isNoFooter,
      }
    },
    modalStyle() {
      let style = {}
      // 如果全屏就将top设为 0
      if (this.innerFullscreen) {
        style['top'] = '0'
      }
      return style
    },
    isNoTitle() {
      return !this.title && !this.allSlotsKeys.includes('title')
    },
    isNoFooter() {
      return this._attrs['footer'] === null
    },
    slotsKeys() {
      return Object.keys(this.$slots).filter(key => !this.usedSlots.includes(key))
    },
    scopedSlotsKeys() {
      return Object.keys(this.$scopedSlots).filter(key => !this.usedSlots.includes(key))
    },
    allSlotsKeys() {
      return Object.keys(this.$slots).concat(Object.keys(this.$scopedSlots))
    },
    // 切换全屏的按钮图标
    fullscreenButtonIcon() {
      return this.innerFullscreen ? 'fullscreen-exit' : 'fullscreen'
    },
  },
}
</script>

<style lang="less">

.j-modal-box {
  &.fullscreen {
    top: 0;
    left: 0;
    padding: 0;

    // 兼容1.6.2版本的antdv
    & .ant-modal {
      top: 0;
      padding: 0;
      height: 100vh;
    }

    & .ant-modal-content {
      height: 100vh;
      border-radius: 0;

      & .ant-modal-body {
        /* title 和 footer 各占 55px */
        height: calc(100% - 55px - 55px);
        overflow: auto;
      }
    }

    &.no-title, &.no-footer {
      .ant-modal-body {
        height: calc(100% - 55px);
      }
    }
    &.no-title.no-footer {
      .ant-modal-body {
        height: 100%;
      }
    }
  }

  .j-modal-title-row {
    .left {
      width: calc(100% - 56px - 56px);
    }

    .right {
      width: 56px;
      position: inherit;

      .ant-modal-close {
        right: 56px;
        color: rgba(0, 0, 0, 0.45);

        &:hover {
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }
  }
  &.no-title{
    .ant-modal-header {
      padding: 0px 24px;
      border-bottom: 0px !important;
    }
  }
}

@media (max-width: 767px) {
  .j-modal-box.fullscreen {
    margin: 0;
    max-width: 100vw;
  }
}
</style>