<template>
  <a-modal :title="modalTitle"
           :width="1100"
           :height="900"
           :maskClosable="false"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-tabs v-model="tabActiveKey"
                @change="changeTabs">
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="database" />基础信息
            </span>
          </a-tab-pane>

          <a-tab-pane key="2">
            <span slot="tab">
              <a-icon type="line-chart" />
              推荐内容
            </span>
          </a-tab-pane>
        </a-tabs>
        <div v-show="tabActiveKey==='1'">
          <dynamic-field ref="dynamicField"
                         :form="form"></dynamic-field>
          <a-form-item label="分类"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       v-show="false">
            <a-input v-decorator="['categoryId', {rules: [{required: modalOpera ===1, message: '请输入分类！'}]}]" />
          </a-form-item>

          <a-form-item label="id"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       v-show="false">
            <a-input v-decorator="['id', {rules: [{required:  modalOpera ===1, message: '请输入ID！'}]}]" />
          </a-form-item>

          <a-form-item label="status"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       v-show="false">
            <a-input v-decorator="['status', {rules: [{required:  modalOpera ===1, message: '请输入status！'}]}]" />
          </a-form-item>
          <a-form-item label="hasStatic"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       v-show="false">
            <a-input v-decorator="['hasStatic', {rules: [{required: false, message: '请输入hasStatic！'}]}]" />
          </a-form-item>
          <a-form-item label="rulesData"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       v-show="false">
            <a-input v-decorator="['rulesData', {rules: [{required:  false, message: '请输入rulesData！'}]}]" />
          </a-form-item>
        </div>

        <div v-show="tabActiveKey==='2'">
          <related ref="related" />
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import DynamicField from '@/components/DynamicField/DynamicField.vue'
import related from './related.vue'
import {
  getCreateForm,
  saveContent,
  updateContent,
  getById
} from '@/api/cms/content'
import { formatExtendFields } from '@/components/ExtendsField'
import pick from 'lodash.pick'
export default {
  components: {
    DynamicField,
    related
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      tabActiveKey: '1',
      selectTreObj: { id: '0', key: '0' },
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      dataSource: [],
      inputType: [],
      form: this.$form.createForm(this)
      // 表头
    }
  },
  created() { },
  methods: {
    add(selectTreObj) {
      this.selectTreObj = selectTreObj
      const that = this
      this.modal('创建内容', 0)
      setTimeout(function() {
        that.getCreateForm(selectTreObj.id)
      }, 500)
    },
    getCreateForm(id) {
      getCreateForm({ categoryId: id }).then(response => {
        if (response.code === 0) {
          this.$refs.dynamicField.setDynamicFields(response.res, response.hasFiles)
        } else {
          this.$refs.dynamicField.setDynamicFields([])
        }
      })
    },
    edit(record) {
      this.modal('编辑内容', 1)
      getById({
        id: record.id
      }).then(response => {
        const that = this
        const result = response.res
        this.form.setFieldsValue(pick(result, 'id', 'categoryId', 'status', 'rulesData', 'hasStatic'))
        this.$refs.dynamicField.setDynamicFields(result.allFields, result.hasFiles)
        this.$refs.dynamicField.setDynamicAttachFiles(result.attachFiles)
        if (result.tags && result.tags.length > 0) {
          setTimeout(function() {
            that.$refs.dynamicField.setTags(result.tags)
          }, 500)
        }
        that.$refs.related.loadRelated(record.id)
      })
    },
    changeTabs(key) {
      const that = this
      this.tabActiveKey = key
      if (key === '2') {
        setTimeout(function() {
          if (that.modalOpera === 1) {
            const id = that.form.getFieldValue('id')
            if (id) {
              that.$refs.related.loadRelated(id)
            }
          }
        }, 100)
      }
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          const params = this.$refs.dynamicField.getParams()
          const relatedRows = this.$refs.related.getRelatedRows()
          params.cmsContentRelateds = relatedRows
          if (this.modalOpera === 0) {
            params.categoryId = this.selectTreObj.id
            saveContent(params).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.$emit('ok')
                this.handleCancel()
              }else{
                this.$message.error(response.msg)
              }
              this.confirmLoading = false
            })
          } else if (this.modalOpera === 1) {
            updateContent(params).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.$emit('ok')
                this.handleCancel()
              }else{
                this.$message.error(response.msg)
              }
              this.confirmLoading = false
            })
          }
        }
        //  this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.tabActiveKey = '1'
      this.$refs.dynamicField.resetDynamicFields()
      this.$refs.related.clearRelatedRows()
    }
  }
}
</script>
