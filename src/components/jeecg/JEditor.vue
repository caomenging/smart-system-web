<template>
  <div class="tinymce-editor">
    <editor v-if="!reloading" v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"> </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import 'tinymce/icons/default'
import 'tinymce/plugins/template' //内容模板
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/quickbars' //快速工具栏
import 'tinymce/plugins/hr' //水平分割线
import 'tinymce/plugins/insertdatetime' //插入日期时间
import '@npkg/tinymce-plugins/attachment'
import { uploadAction, getFileAccessHttpUrl } from '@/api/manage'
import { getVmParentByName } from '@/utils/util'
export default {
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      required: false,
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        'autoresize print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave attachment lineheight',
    },
    toolbar: {
      type: [String, Array],
      default:
        'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                table image media charmap hr pagebreak insertdatetime print preview | code lineheight selectall searchreplace visualblocks | indent2em  formatpainter axupimgs attachment',
      branding: false,
    },
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        height: 500,
        min_height: 400,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        toolbar_drawer: false,
        attachment_max_size: 209715200,
        attachment_style:'.attachment>img{display:inline-block!important;max-width:30px!important;}',
        attachment_icons_path: 'https://unpkg.com/@npkg/tinymce-plugins/plugins/attachment/icons',

        fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //字体样式
        lineheight_formats: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5', //行高配置，也可配置成"12px 14px 16px 20px"这种形式

        file_picker_types: 'file image media', //分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数

        file_picker_callback: (callback, value, meta) => {
          let filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg' //限制文件的上传类型
          let inputElem = document.createElement('input') //创建文件选择
          inputElem.setAttribute('type', 'file')
          inputElem.setAttribute('accept', filetype)
          inputElem.click()
          inputElem.onchange = () => {
            let upurl = ''
            let file = inputElem.files[0] //获取文件信息
            if (file.type.slice(0, 5) == 'video') {
              //判断文件类型
              upurl = window._CONFIG['domianURL'] + '/sys/common/upload'
            } else {
              upurl = window._CONFIG['domianURL'] + '/sys/common/upload'
            }
            if (file.type.slice(0, 5) == 'image' && file.size / 1024 / 1024 > 2) {
              alert('上传失败，图片大小请控制在2M以内')
            } else if (file.type.slice(0, 5) == 'video' && file.size / 1024 / 1024 > 500) {
              alert('上传失败，视频大小请控制在 500M 以内')
            } else if (file.size / 1024 / 1024 > 10) {
              alert('上传失败，文件大小请控制在 10M 以内')
            } else {
              let params = new FormData()
              params.append('file', file)
              params.append('biz','jeditor')
              params.append('jeditor', '1')
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
              console.log(upurl)
              uploadAction(upurl, params).then((res) => {
                if (res.success) {
                  callback(getFileAccessHttpUrl(res.message))
                } else {
                  alert('上传失败')
                }
              })
              .catch(() => {
                  alert('上传出错，服务器开小差了呢')
                })
            }
          }
        },

        images_upload_handler: (blobInfo, success) => {
          let formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          formData.append('biz', 'jeditor')
          formData.append('jeditor', '1')
          uploadAction(window._CONFIG['domianURL'] + '/sys/common/upload', formData).then((res) => {
            if (res.success) {
              if (res.message == 'local') {
                const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                success(img)
              } else {
                let img = getFileAccessHttpUrl(res.message)
                console.log(img)
                success(img)
              }
            }
          })
        },

        attachment_upload_handler: (file, succFun, failFun, progressCallback) => {
          let params = new FormData()
          params.append('file', file)

          uploadAction(window._CONFIG['domianURL'] + '/sys/common/upload', params).then((res) => {
                if (res.success) {
                  succFun(getFileAccessHttpUrl(res.message))
                } else {
                  alert('上传失败')
                }
              })
              .catch(() => {
                  alert('上传出错，服务器开小差了呢')
                })
        } 

      },
      myValue: this.value,
      reloading: false,
    }
  },
  mounted() {
    this.initATabsChangeAutoReload()
  },
  methods: {
    reload() {
      this.reloading = true
      this.$nextTick(() => (this.reloading = false))
    },

    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    },

    /**
     * 自动判断父级是否是 <a-tabs/> 组件，然后添加事件监听，自动触发reload()
     *
     * 由于 tabs 组件切换会导致 tinymce 无法输入，
     * 只有重新加载才能使用（无论是vue版的还是jQuery版tinymce都有这个通病）
     */
    initATabsChangeAutoReload() {
      // 获取父级
      let tabs = getVmParentByName(this, 'ATabs')
      let tabPane = getVmParentByName(this, 'ATabPane')
      if (tabs && tabPane) {
        // 用户自定义的 key
        let currentKey = tabPane.$vnode.key
        // 添加事件监听
        tabs.$on('change', (key) => {
          // 切换到自己时执行reload
          if (currentKey === key) {
            this.reload()
          }
        })
        //update--begin--autor:liusq-----date:20210316------for：富文本编辑器tab父组件可能导致的赋值问题------
        this.reload()
        //update--end--autor:liusq-----date:20210316------for：富文本编辑器tab父组件可能导致的赋值问题------
      } else {
        //update--begin--autor:wangshuai-----date:20200724------for：富文本编辑器切换tab无法修改------
        let tabLayout = getVmParentByName(this, 'TabLayout')
        //update--begin--autor:liusq-----date:20210713------for：处理特殊情况excuteCallback不能使用------
        try {
          tabLayout.excuteCallback(() => {
            this.reload()
          })
        } catch (error) {
          if (tabLayout) {
            this.reload()
          }
        }
        //update--end--autor:liusq-----date:20210713------for：处理特殊情况excuteCallback不能使用------
        //update--begin--autor:wangshuai-----date:20200724------for：文本编辑器切换tab无法修改------
      }
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue == null ? '' : newValue
    },
    myValue(newValue) {
      if (this.triggerChange) {
        this.$emit('change', newValue)
      } else {
        this.$emit('input', newValue)
      }
    },
  },
}
</script>
<style scoped>
</style>