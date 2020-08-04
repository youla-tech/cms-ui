<template>
  <a-card :bordered="false">
    <p>
      内容
      <a-icon type="right" />
    </p>
    <Editor :id="id" v-model="tinymceHtml" :init="editorInit" ref="tinymce"></Editor>
    <simple-vue-upload ref="uploader" @uploadOk="uploadOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/code' // 显示源代码插件
import 'tinymce/plugins/fullscreen' // 显示全屏插件
import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/code' // 代码
import 'tinymce/plugins/codesample' // 代码

import 'tinymce/plugins/preview' // 超链接
import 'tinymce/plugins/searchreplace' // 超链接
import { uploadFile } from '@/api/cms/resource/index'
import SimpleVueUpload from '@/components/SimpleVueUpload/SimpleVueUpload.vue'
// import { fdfsUrl } from '@/utils/request.js'
import { ApiUrl } from '@/utils/request.js'
export default {
  name: 'Tinymce',
  components: {
    Editor,
    SimpleVueUpload
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        'lists image media table wordcount fullscreen link codesample code uploadVideo'
    },
    toolbar: {
      type: [String, Array],
      default:
        'uploadVideo | codesample | code | searchreplace | undo redo |  formatselect | fontsizeselect  | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table  | removeformat | paste-upload | fullscreen | link | preview '
    }
  },
  data() {
    const that = this
    return {
      id: 'tinymce',
      editorInit: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide', // 如果主题不存在，指定一个主题路径
        content_css: '/tinymce/skins/content/default/content.css',
        height: 500,
        plugins: this.plugins, // 插件
        toolbar: this.toolbar, // 工具栏
        branding: false, // 技术支持(Powered by Tiny || 由Tiny驱动)
        menubar: true, // 菜单栏
        theme: 'silver', // 主题
        images_upload_url: ApiUrl + '/resource/uploadFile', // 图片上传路径
        images_upload_credentials: true,
        images_upload_base_path: '', // 如果图片上传路径是相对路径，则指定一个基本路径
        images_upload_handler: this.uploadImgFile,
        zIndex: 1101,
        setup(editor) {
          editor.ui.registry.addButton('uploadVideo', {
            text: '本地视频',
            // 是否显示图标
            icon: 'browse',
            onAction: () => {
              that.$refs.uploader.openUpload('video/*')
            }
          })
        }
      },
      content: '',
      tinymceHtml: ''
    }
  },
  destroyed() {},
  watch: {
    content: {
      handler(newVal, oldVal) {
        this.tinymceHtml = newVal
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    moment,
    setDynamicFields(dynamicFields) {},
    resetDynamicFields() {},
    formater(date) {
      return moment(date)
    },
    getContent() {
      return this.tinymceHtml
    },
    setContent(content) {
      this.content = content
    },
    uploadOk(response) {
      if (response.code === 0) this.insertVideo(response.res.fileFullPath)
      else this.$message.error('插入失败!')
    },
    insertVideo(src) {
      // data-mce-p-controls="controls"  data-mce-p-loop="loop"
      src = encodeURI('<source src=' + src + ' />')
      const video = `<img data-mce-p-autoplay="autoplay" data-mce-p-controls="controls" data-mce-p-loop="loop" data-mce-html="${src}" width="314" height="157" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-mce-object="video" class="mce-object mce-object-video" data-mce-selected="1">`
      this.$refs.tinymce.editor.insertContent(video)
    },
    hiddenToolbar() {
	 var objs = document.getElementsByClassName('tox-toolbar__overflow')
	 if (objs.length > 0) {
		 const moreObj = document.getElementsByClassName('tox-tbtn--enabled')
		 if (moreObj.length > 0) {
			 moreObj[0].click()
		 }
		 // objs[0].style.display = 'none'
	 }
    },
    uploadImgFile(blobInfo, success, failure) {
      const fd = new FormData()
      fd.append('file', blobInfo.blob())
      uploadFile(fd)
        .then(response => {
          const result = response.res
          success(result.fileFullPath)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
