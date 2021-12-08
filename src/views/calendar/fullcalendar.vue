<template>
  <div v-loading='loading' style='padding: 20px; background: white'>
    <a-row style='margin: 10px 0px'>
      <a-col>
        <a-button-group style='margin-top: 10px'>
          <a-button @click='calendarApi.prevYear()'>
            <a-icon type='double-left' />
          </a-button>
          <a-button @click='calendarApi.prev()'>
            <a-icon type='left' />
          </a-button>
          <a-button @click='calendarApi.today()'> Today</a-button>
          <a-button @click='calendarApi.next()'>
            <a-icon type='right' />
          </a-button>
          <a-button @click='calendarApi.nextYear()'>
            <a-icon type='double-right' />
          </a-button>
        </a-button-group>
        <a-select :default-value='initialView' style='width: 100px;margin-top: 10px;margin-left: 10px'
                  @change='changeView'>
          <a-select-option v-for='(item, index) in views' :key='index' :value='item.value'>
            {{ item.text }}
          </a-select-option>
        </a-select>
        <a-button @click='handleAdd' type='primary' icon='plus' style='margin-top: 10px;margin-left: 10px;'>新增</a-button>
      </a-col>
    </a-row>

    <FullCalendar
      ref='fullCalendar'
      :options='calendarOptions'
    >
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i style='margin-left: 5px'>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
    <calendar-event-modal ref='modalForm' @ok='modalFormOk'></calendar-event-modal>
  </div>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vit
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CalendarEventModal from './modules/CalendarEventModal'
import { getAction, httpAction } from '../../api/manage'

export default {
  name: 'fullcalendar',
  // mixins: [JeecgListMixin, mixinDevice],
  components: {
    CalendarEventModal,
    FullCalendar // make the <FullCalendar> tag available
  },
  props: {
    initialView: {
      type: String,
      required: false,
      default: 'listDay'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    firstDay: {
      type: Number,
      required: false,
      default: 1
    },
    dayGridHeight: {
      type: String | Number,
      required: false,
      default: null
    },
    timeGridHeight: {
      type: String | Number,
      required: false,
      default: null
    },
    weekHeight: {
      type: String | Number,
      required: false,
      default: null
    },
    dayHeight: {
      type: String | Number,
      required: false,
      default: null
    },
    listHeight: {
      type: String | Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      calData: [],
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin
        ],
        headerToolbar: {
          left: '',
          center: 'title',
          right: ''
        },
        initialView: this.initialView,
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: !this.disabled,
        selectable: !this.disabled,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventDrop,
        eventsSet: this.handleEvents,
        timeZone: 'local',
        firstDay: this.firstDay,
        views: {
          dayGrid: {
            // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
            contentHeight: this.dayGridHeight
          },
          timeGrid: {
            // options apply to timeGridWeek and timeGridDay views
            contentHeight: this.timeGridHeight
          },
          week: {
            // options apply to dayGridWeek and timeGridWeek views
            contentHeight: this.weekHeight
          },
          day: {
            // options apply to dayGridDay and timeGridDay views
            contentHeight: this.dayHeight
          },
          list: {
            // options apply to list views
            contentHeight: this.listHeight
          }
        }
        // events: this.getData(this)
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],
      calendarApi: null,
      loading: false,

      url: {
        list: '/calendarEvent/calendarEvent/list',
        edit: '/calendarEvent/calendarEvent/edit',
        delete: '/calendarEvent/calendarEvent/delete',
        deleteBatch: '/calendarEvent/calendarEvent/deleteBatch',
        exportXlsUrl: '/calendarEvent/calendarEvent/exportXls',
        importExcelUrl: 'calendarEvent/calendarEvent/importExcel'
      },
      views: [{
        text: '月',
        value: 'dayGridMonth'
      }, {
        text: '周',
        value: 'timeGridWeek'
      }, {
        text: '日',
        value: 'timeGridDay'
      }, {
        text: '月事件',
        value: 'listMonth'
      }, {
        text: '周事件',
        value: 'listWeek'
      }, {
        text: '日事件',
        value: 'listDay'
      }],
      dictOptions: {},
      superFieldList: []
    }
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.clearEvents()
    this.loadData()
  },
  methods: {
    reRender() {
      // 可以调用此函数重新绘制
      this.calendarApi.render()
    },

    changeView(type) {
      this.calendarApi.changeView(type)
    },

    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    modalFormOk() {
      this.clearEvents()
      this.loadData()
    },

    handleDateSelect(selectInfo) {
      this.$refs.modalForm.add(selectInfo)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },

    handleEventClick(clickInfo) {
      let event = clickInfo.event
      this.$refs.modalForm.edit({
        id: event.id,
        title: event.title,
        eventDetail: event.extendedProps.eventDetail,
        startTime: this.$moment(event.startStr).format('YYYY-MM-DD HH:mm:ss'),
        backgroundColor: event.backgroundColor,
        borderColor: event.backgroundColor,
        endTime: event.end ? this.$moment(event.endStr).format('YYYY-MM-DD HH:mm:ss') : '',
        allDay: event.allDay ? 1 : 0
      })
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },

    handleEventDrop(dropInfo) {
      // 弹出编辑框来修改
      // this.handleEventClick(dropInfo)
      let that = this
      let event = dropInfo.event
      this.loading = true
      // 后台自动修改
      let record = {
        id: event.id,
        startTime: event.start ? that.$moment(event.startStr).format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: event.end ? that.$moment(event.endStr).format('YYYY-MM-DD HH:mm:ss') : null,
        allDay: event.allDay ? 1 : 0
      }

      httpAction(that.url.edit, record, 'put').then((res) => {
        if (res.success) {
          that.$message.success(res.message)
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        that.loading = false
      })
    },

    clearEvents() {
      let events = this.calendarApi.getEvents()
      for (let i = 0; i < events.length; i++) {
        events[i].remove()
      }
    },

    handleEvents(events) {
      this.currentEvents = events
    },

    handleAdd() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },

    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      this.loading = true
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = {}//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.records.length; i++) {
            let event = res.result.records[i]
            // 向日历中添加事件
            this.calendarApi.addEvent({
              id: event.id,
              title: event.title,
              eventDetail: event.eventDetail,
              start: event.startTime,
              backgroundColor: event.backgroundColor,
              end: event.endTime,
              allDay: event.allDay === 1
            })
          }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>