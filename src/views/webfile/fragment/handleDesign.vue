<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
        <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
      </a-form-item>

      <p>
        分类扩展名称
        <a-icon type="right" />
      </p>
      <a-row :gutter="6">
        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}" v-show="false">
          <a-form-item label="id" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['id', {rules: [{required: true, message: '请输入！'}]}]" />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="所在目录" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['filePathName', {rules: [{required: true, message: '请输入！'}]}]"
              disabled
            />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="片段别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['alias', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="6">
        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="片段编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['code', {rules: [{required: true, message: '请输入'}],initialValue:''}]"
            />
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
          <a-form-item label="数据条数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number
              style="width: 100%;"
              :min="0"
              v-decorator="['size', {rules: [{required: true, message: '请输入'}],initialValue:1}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider dashed />
      <p>
        内容系统字段
        <a-icon type="right" />
      </p>

      <a-row :gutter="6" v-for="(field,index) in fields" :key="index">
        <a-col :xl="{span: 5}" :lg="{span: 8}" :md="{span: 24}">
          <a-form-item
            :label="field.fieldNote"
            :labelCol="labelCol"
            :wrapperCol="{xs: {span: 24},sm:{ span: 4}}"
          >
            <a-checkbox
              :value="field.fieldName"
              :checked="field.initCheck"
              v-if="!field.visibleCheck"
              @change="checkDefaultField"
            ></a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span: 24}">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
            <p>{{ field.fieldName }}( {{ field.fieldType }} )</p>
          </a-form-item>
        </a-col>

        <a-col
          :xl="{span: 5}"
          :lg="{span: 8}"
          :md="{span: 24}"
          v-if="field.visibleSwitch && checkDefaultFields.indexOf(field.fieldName)>=0"
        >
          <a-form-item label="必填" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch v-model="field.initSwitch" />
          </a-form-item>
        </a-col>

        <a-col
          :xl="{span: 5}"
          :lg="{span: 8}"
          :md="{span: 24}"
          v-if="checkDefaultFields.indexOf(field.fieldName)>=0"
        >
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-model="field.reFieldNote" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider dashed />
      <input-type ref="inputType" />
    </a-form>
  </a-spin>
</template>

<script>
import {
  getDesignById,
  updateFragmentDesignFile
} from "@/api/cms/webfile/fragment.js";
import InputType from "@/components/InputType/InputType.vue";
import pick from "lodash.pick";
export default {
  components: {
    InputType
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
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      fields: [],
      checkDefaultFields: [],
      form: this.$form.createForm(this)
    };
  },
  created() {},
  methods: {
    init(record) {
      let that = this;
      getDesignById({
        id: record.fileKey
      }).then(response => {
        const result = response.res;
        let filePathName = "根目录";
        if (result.filePath) {
          filePathName = result.filePath;
        }
        this.form.setFieldsValue({ filePathName: filePathName });
        this.form.setFieldsValue(pick(result, "id", "alias", "size", "code"));
        this.fields = result.modelFieldDtos;
        if (result.extendFieldList) {
          this.setDataSource(JSON.parse(result.extendFieldList));
        } else {
          this.clearDataSource();
        }
        if (result.defaultFieldList) {
          const defaultFieldList = JSON.parse(result.defaultFieldList);
          if (defaultFieldList.length > 0) {
            this.fields = defaultFieldList;
            defaultFieldList.forEach(function(item, index) {
              if (item.initCheck) {
                that.checkDefaultFields.push(item.fieldName);
              }
            });
          }
        }
      });
    },
    initFields() {
      this.checkDefaultFields = [];
      this.fields.forEach(function(item, index) {
        item.initCheck = false;
        item.initSwitch = false;
        item.reFieldNote = item.fieldNote;
      });
    },
    checkDefaultField(e) {
      //  选中 系统内置的 checkbox
      if (e.target.checked) {
        this.checkDefaultFields.push(e.target.value);
      } else {
        const index = this.checkDefaultFields.indexOf(e.target.value);
        if (index >= 0) {
          this.checkDefaultFields.splice(index, 1);
        }
      }
      this.getDefaultFieldByCode(e.target.value).initCheck = e.target.checked;
    },
    getDefaultFieldByCode(code) {
      let field = null;
      if (this.fields.length > 0) {
        this.fields.forEach(function(item, index) {
          if (item.fieldName === code) {
            field = item;
          }
        });
        return field;
      }
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      // this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.bulidData(values);
          updateFragmentDesignFile(values).then(response => {
            this.$emit("ok");
            if (response.code === 0) {
              this.$message.info(response.msg);
            } else {
              this.$message.error(response.msg);
            }
          });
        }
        this.confirmLoading = false;
      });
    },
    bulidData(values) {
      values.modelFieldDtos = this.fields;
      values.extendFieldList = JSON.stringify(this.getDataSource());
    },
    handleCancel() {
      this.initFields();
      this.visible = false;
      this.confirmLoading = false;
      this.clearDataSource()
    },
    setDataSource(data) {
      this.$refs.inputType.setDataSource(data);
    },
    getDataSource() {
      return this.$refs.inputType.getDataSource();
    },
    clearDataSource() {
      this.$refs.inputType.clearDataSource();
    }
  }
};
</script>
