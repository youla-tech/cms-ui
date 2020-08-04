<template>
  <a-modal
    :title="modalTitle"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
        <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>
        <p>
          基础信息
          <a-icon type="right" />
        </p>
        <a-row :gutter="12">
          <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 12}">
            <a-form-item label="模型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 16}" :lg="{span: 8}" :md="{span: 12}">
            <a-form-item label="模型选项" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-checkbox
                :value="moption.value"
                :key="moption.value"
                :checked="moptions.indexOf(moption.value) >=0"
                v-for="moption in modelOptions"
                @change="onChangeMoption"
              >{{ moption.label }}</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 24}">
            <a-form-item label="内容模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-search
                v-decorator="['templatePath', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]"
                @search="onSearchTemp"
                disabled
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
      <search-temp ref="searchTemp" @ok="confirm"></search-temp>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update, listDefaultField } from "@/api/cms/model";
import { inputTypes } from "@/api/cms/fieldtype";
import searchTemp from "./searchTemp";
import pick from "lodash.pick";
import InputType from "@/components/InputType/InputType.vue";
export default {
  components: {
    searchTemp,
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
      modelOptions: [
        {
          label: "含子模型",
          value: "hasChild"
        },
        {
          label: "含附件",
          value: "hasFiles"
        }
      ],
      moptions: [],
      fields: [],
      checkDefaultFields: [],
      form: this.$form.createForm(this)
    };
  },
  created() {
    listDefaultField({}).then(response => {
      this.fields = response.res;
    });
  },
  mounted() {
    this.inputType = inputTypes;
  },
  methods: {
    add() {
      this.modal("新建模型", 0);
    },
    edit(record) {
      const that = this;
      this.modal("编辑模型", 1);
      setTimeout(function() {
        that.getDetail(record);
      }, 100);
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
    },
    confirm(path) {
      this.form.setFieldsValue({ templatePath: path });
    },
    getDetail(record) {
      const that = this;
      getById({
        pk: record.id
      }).then(response => {
        const result = response.res;
        this.form.setFieldsValue(
          pick(
            result,
            "id",
            "parentId",
            "name",
            "templatePath",
            "defaultFieldList"
          )
        );
        if (result.extendFieldList) {
          this.setDataSource(JSON.parse(result.extendFieldList));
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
        this.setModelOptions(result);
      });
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          const param = this.bulidData(values);
          this.confirmLoading = true;
          console.log(param);
          if (this.modalOpera === 0) {
            save(param).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.msg);
              }
            });
          } else if (this.modalOpera === 1) {
            update(param).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.msg);
              }
            });
          }
        }
        this.confirmLoading = false;
      });
    },
    bulidData(values) {
      const param = {
        id: values.id,
        name: values.name,
        templatePath: values.templatePath,
        hasChild: this.moptions.indexOf("hasChild") >= 0,
        hasFiles: this.moptions.indexOf("hasFiles") >= 0,
        hasImages: this.moptions.indexOf("hasImages") >= 0,
        defaultFieldList: JSON.stringify(this.fields),
        extendFieldList: JSON.stringify(this.$refs.inputType.getDataSource())
      };
      return param;
    },
    handleCancel() {
      this.moptions = [];
      this.initFields();
      this.checkDefaultFields = [];
      this.visible = false;
      this.confirmLoading = false;
      this.clearDataSource();
    },
    onChangeMoption(moption) {
      const value = moption.target.value;
      if (moption.target.checked) {
        this.moptions.push(value);
      } else {
        const index = this.moptions.indexOf(value);
        this.moptions.splice(index, 1);
      }
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
    setModelOptions(obj) {
      const that = this;
      this.modelOptions.forEach(function(item, index) {
        if (obj && obj[item.value]) {
          that.moptions.push(item.value);
        }
      });
    },
    onSearchTemp() {
      this.$refs.searchTemp.selectTemp();
    },
    setDataSource(data) {
      this.$refs.inputType.setDataSource(data);
    },
    clearDataSource() {
      this.$refs.inputType.clearDataSource();
    },
    initFields() {
      this.fields.forEach(function(item, index) {
        if (item.fieldName !== "title") {
          item.initCheck = false;
          item.initSwitch = false;
          item.reFieldNote = item.fieldNote;
        }
      });
    }
  }
};
</script>
