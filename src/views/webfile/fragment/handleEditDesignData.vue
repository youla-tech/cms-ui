<template>
  <a-modal
    :title="modalTitle"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input  v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-row :gutter="6">
          <dynamic-field ref="dynamicField" :form="form"></dynamic-field>
        </a-row>
        <a-divider dashed />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getInfoByPk,
  updateFragment
} from '@/api/cms/webfile/fragment.js'
import moment from 'moment'
import {
  formatExtendFields
} from '@/components/ExtendsField'
import {
  STable
} from '@/components'
import DynamicField from '@/components/DynamicField/DynamicField.vue'
export default {
  components: {
    STable,
    DynamicField
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
	  visible: false,
      modalOpera: 0, // 0：新增 1：编辑
      confirmLoading: false,
      modelField: [],
      form: this.$form.createForm(this)
    }
  },
  created () {},
  methods: {
    moment,
    handleSubmit () {
      const {
        form: {
          validateFields
        }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = this.$refs.dynamicField.getParams()
          updateFragment(params).then(response => {
            if (response.code === 0) {
              this.$refs.dynamicField.resetDynamicFields()
              this.$emit('ok')	
              this.$message.info(response.msg)
			        this.handleCancel()
            }else{
              this.$message.error(response.msg)
            }
          })
        }
        this.confirmLoading = false
      })
    },

    handleCancel () {
	  this.visible = false
	  this.confirmLoading = false
    },
    handleEdit (id) {
	  this.visible = true
      getInfoByPk({
        id: id
      }).then(response => {
    	const result = response.res
		this.form.setFieldsValue({ 'id': id })
        if (response.code === 0 && result.length > 0) {
          this.$refs.dynamicField.setDynamicFields(result)
        } else {
          this.$refs.dynamicField.setDynamicFields([])
        }
      })
    }
  }
}
</script>
