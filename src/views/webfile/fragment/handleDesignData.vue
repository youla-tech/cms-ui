<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form" >
      <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
        <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
      </a-form-item>

      <!-- <p>
        分类扩展名称
        <a-icon type="right" />
      </p> -->
      <a-row :gutter="6">
        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}" v-show="false">
          <a-form-item label="id" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['id', {rules: [{required: false, message: '请输入！'}]}]" />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}" v-show="false">
          <a-form-item label="fragmentFileModelId" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['fragmentFileModelId', {rules: [{required: true, message: '请输入！'}]}]" />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="所在目录" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['filePathName', {rules: [{required: true, message: '请输入！'}]}]" disabled />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="片段别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['alias', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]" disabled/>
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="6">
        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="片段编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['code', {rules: [{required: true, message: '请输入'}],initialValue:''}]" disabled/>
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="数据条数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number style="width: 100%;" :min="1" v-decorator="['size', {rules: [{required: true, message: '请输入'}],initialValue:1}]" disabled/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider dashed />

      <a-collapse accordion @change="changeCollapse" v-model="collapseKey" v-show="collapseShow">
        <a-collapse-panel header="页面数据" key="1">
          <a-row :gutter="6">
            <s-table ref="table" size="small" rowKey="id" :columns="columns" :data="loadData">
              <span slot="action" slot-scope="text, record">
                <template>
                  <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'fragment:data:update'}"> 编辑 </a-tag>
                  <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'fragment:data:delete'}" >删除</a-tag>
                </template>
              </span>
            </s-table>
          </a-row>
          <a-divider dashed />
        </a-collapse-panel>
        <a-collapse-panel header="表单操作" key="2" :disabled="false">
          <a-row :gutter="6">
            <dynamic-field ref="dynamicField" :form="form"></dynamic-field>
          </a-row>
          <a-divider dashed />
        </a-collapse-panel>
      </a-collapse>
    </a-form>
	<handle-edit-design-data ref="handleEditDesignData" @ok="editSuccess"></handle-edit-design-data>
  </a-spin>
</template>

<script>
import {
  getFragmentDesignByPk,
  page,
  saveFragment,
  delFragmentByPk
} from '@/api/cms/webfile/fragment.js'
import moment from 'moment'
import pick from 'lodash.pick'
import { formatExtendFields } from '@/components/ExtendsField'
import { STable } from '@/components'
import DynamicField from '@/components/DynamicField/DynamicField.vue'
import handleEditDesignData from './handleEditDesignData'
export default {
  components: {
    STable,
    DynamicField,
	handleEditDesignData
  },
  data () {
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
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
	  collapseKey: null,
	  queryParam: {
		  dto: { fragmentFileModelId: null }
	  },
      confirmLoading: false,
	  collapseShow: true,
      dataSource: [],
	  modelField: [],
      form: this.$form.createForm(this),
      // 表头
      columns: [{
        title: '标题',
        dataIndex: 'title',
        align: 'center',
        width: '140'
      },
	  {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        customRender: text => {
          if (text) return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: '150px',
        scopedSlots: {
          customRender: 'action'
        }
      }
      ],
	  loadData: parameter => {
        if (this.queryParam.dto.fragmentFileModelId) {
          return page(Object.assign(parameter, this.queryParam)).then(
			  response => {
			    return response.res
			  }
          )
        }
	  }
    }
  },
  created () {
  },
  methods: {
    moment,
    init (record) {
      getFragmentDesignByPk({
        id: record.fileKey
      }).then(response => {
        const result = response.res
        let filePathName = '根目录'
        if (result.filePath) {
          filePathName = result.filePath
        }
        this.modelField = result.modelFieldDtos
        this.form.setFieldsValue({ 'filePathName': filePathName })
        this.form.setFieldsValue(pick(result, 'alias', 'size'))
        this.form.setFieldsValue({ 'fragmentFileModelId': result.id })
        this.form.setFieldsValue({ 'code': result.code })
		this.collapseShow  = result.size > 0
      })
	  this.queryParam.dto.fragmentFileModelId = record.fileKey
    },
    handleDelete (record) {
      delFragmentByPk({ id: record.id }).then(response => {
        if (response.code === 0) {
          this.handleOk()
          this.$message.info(response.msg)
        }else {
          this.$message.error(response.msg)
        }
      })
    },
    changeCollapse (key) {
      const that = this
      if (key === '2') {
        let modelFields = that.modelField
        if (!modelFields) {
          modelFields = []
        }
        setTimeout(function () {
          that.$refs.dynamicField.setDynamicFields(modelFields)
        }, 500)
      } else {
		  setTimeout(function () {
		    that.handleOk()
		  }, 500)
	  }
      this.$emit('open', key)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handleSubmit () {
      const {
        form: {
          validateFields
        }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
		      const params = this.$refs.dynamicField.getParams()
          saveFragment(params).then(response => {
          if (response.code === 0) {
            this.toCollapse('1')
            this.changeCollapse('1')
              this.$message.info(response.msg)
            }else{
              this.$message.error(response.msg)
            }
          })
        }
        this.confirmLoading = false
      })
    },
    handleEdit (record) {
	  this.$refs.handleEditDesignData.handleEdit(record.id)	
    },
    toCollapse (key) {
		 this.collapseKey = key
    },
	editSuccess (key) {
		 this.toCollapse('1')
		 this.handleOk()
	},
    initFields () {
      this.confirmLoading = false
	  this.collapseKey = null
	  this.form.resetFields()
	  this.collapseShow = true
    }
  }
}
</script>
