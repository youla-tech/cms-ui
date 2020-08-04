<template>
  <a-modal :title="modalTitle"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="业务ID"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="false">
          <a-input v-if="modalOpera==1"
                   v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="站点名称"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['siteName', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

        <a-form-item label="域名"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['domain', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

        <a-form-item label="关键字"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <tag ref="mytag"></tag>

        </a-form-item>

        <a-form-item label="logo"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="false">
          <a-input v-decorator="['siteLogo', {rules: [{required: false, message: '请选择logo！'}]}]" />
        </a-form-item>

        <a-form-item label="LOGO"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-upload name="file"
                    :action="uploadUrl"
                    :headers="headers"
                    listType="picture-card"
                    :fileList="fileList"
                    :remove="removeFile"
                    @preview="handlePreview"
                    @change="handleFileChange">
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传LOGO</div>
            </div>
          </a-upload>

        </a-form-item>

        <a-form-item label="站点描述"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['siteDesc', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

        <a-form-item label="统计代码"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['statisticalCode', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

        <a-form-item label="评论代码"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['commentCode', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

        <a-form-item label="分享代码"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['shareCode', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from '@/api/cms/site'
import pick from 'lodash.pick'
import tag from '@/components/tags'
import { ApiUrl } from '@/utils/request.js'
import { deleteFile } from '@/api/cms/resource/index'
import store from '@/store'
export default {
  components: {
    tag
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      fileList: [],
      modalTitle: '',
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      },
      modalOpera: 0, // 0：新增 1：编辑
      uploadUrl: ApiUrl + '/upload/uploadFile',
      visible: false,
      confirmLoading: false,
      disable: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
  },
  methods: {
    add() {
      this.modal('新建站点', 0)
    },
    edit(record) {
      this.modal('编辑站点', 1)
      getById({ id: record.id }).then(response => {
        const result = response.res
        if (result.siteKeyWords) {
          this.$refs.mytag.setTags(result.siteKeyWords)
        }
        this.form.setFieldsValue(pick(result, 'id', 'siteName', 'siteDesc', 'statisticalCode', 'shareCode', 'domain', 'siteLogo', 'commentCode'))
        if (result.siteLogo) {
          this.fileList = [{
            uid: result.id,
            name: 'logo',
            status: 'done',
            url: result.siteLogo
          }]
        }
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const { form: { validateFields }} = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const tags = this.$refs.mytag.getTagStr()
          if (tags) {
            values.siteKeyWords = tags
          }
          if (this.modalOpera === 0) {
            save(values).then(response => {
              if(response.code===0){
                 this.$message.info(response.msg)
                 this.$emit('ok')
                 this.handleCancel()
              }else{
                 this.$message.error(response.msg)
              }
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              if(response.code===0){
                 this.$message.info(response.msg)
                 this.$emit('ok')
                 this.handleCancel()
              }else{
                 this.$message.error(response.msg)
              }
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleFileChange(e) {
      this.fileList = e.fileList
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true
        this.form.setFieldsValue({ siteLogo: e.file.response.res.fileFullPath })
      }
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
      window.open(file.url, '_blank')
    },
    removeFile(file) {
      this.disable = false
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path
        }).then(response => {
          if (response.code === 0) {
            console.log('delete file success')
          }
        })
      }
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.disable = false
      this.$refs.mytag.clearTags()
      this.form.resetFields()
      this.fileList = []
    }
  }
}
</script>
