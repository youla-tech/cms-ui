<template>
  <div>
    <p>
      扩展字段
      <a-icon type="right" />
    </p>
    <div class="table-operator">
      <a-button
        style="margin-bottom: 5px;"
        type="primary"
        icon="plus"
        @click="handleAddExtendsField"
      >添加字段</a-button>
      <span style="font-size:12px">PS:内容扩展字段(sdescription,title,keyword,text,cover,data)不可用增加行</span>
    </div>

    <a-table
      bordered
      :pagination="false"
      ref="table"
      rowKey="id"
      :columns="columns"
      size="small"
      :dataSource="dataSource"
    >
      <template v-for="col in extendsField" :slot="col.name" slot-scope="text, record, index">
        <a-form-item :key="col.name" style="padding:0;margin:0">
          <a-input-number
            v-if="col.type === 'number' "
            :min="0"
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: col.required, message: '不能为空' }],
                   initialValue:text, validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          />
          <a-input
            v-if="col.type === 'text' "
            :min="0"
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: col.required, message: '不能为空' }],
                   initialValue:text, validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          />

          <a-radio
            v-if="col.type === 'radio' "
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: col.required, message: '不能为空' }],
                   initialValue:text, validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          ></a-radio>

          <a-checkbox
            v-if="col.type === 'checkbox' "
            :checked="text"
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: col.required, message: '不能为空' }],
                   initialValue:text, validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          ></a-checkbox>

          <a-textarea
            v-if="col.type === 'textarea' "
            :rows="1"
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: col.required, message: '不能为空' }],
                   initialValue:text, validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          ></a-textarea>

          <a-select
            v-if="col.type === 'select'"
            :options="inputType"
            v-decorator="[
                  `${col.name}-${index}`,
                  {rules: [{ required: true, message: '不能为空' }],
                   initialValue:text,validateTrigger: 'change'}
                ]"
            @change="e => handleChange(e, record.id, col.name, index,col.type)"
          ></a-select>
        </a-form-item>
      </template>
      <span slot="action" slot-scope="text, record, index">
        <template>
          <a-popconfirm
            title="确定要删除该明细吗？"
            @confirm="handleDeleteExtendsField(record, index)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
import { inputTypes } from "./index";
export default {
  components: {},
  data() {
    return {
      moptions: [],
      fields: [],
      checkDefaultFields: [],
      dataSource: [],
      inputType: [],
      form: this.$form.createForm(this),
      extendsField: [
        {
          name: "code",
          type: "text",
          required: true
        },
        {
          name: "inputType",
          type: "select",
          required: true
        },
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "isRequired",
          type: "checkbox",
          required: true
        },
        {
          name: "isSearch",
          type: "checkbox",
          required: true
        },
        {
          name: "defaultValue",
          type: "text",
          required: false
        },
        {
          name: "maxlength",
          type: "number",
          required: true
        },
        {
          name: "description",
          type: "textarea",
          required: false
        },
        {
          name: "sort",
          type: "number",
          required: false
        }
      ],
      // 表头
      columns: [
        {
          title: "编码",
          dataIndex: "code",
          align: "center",
          width: "140px",
          scopedSlots: {
            customRender: "code"
          }
        },
        {
          title: "字段类型",
          dataIndex: "inputType",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "inputType"
          }
        },
        {
          title: "名称",
          dataIndex: "name",
          align: "center",
          width: "120px",
          scopedSlots: {
            customRender: "name"
          }
        },
        {
          title: "必填",
          dataIndex: "isRequired",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "isRequired"
          }
        },
        {
          title: "可搜索",
          dataIndex: "isSearch",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "isSearch"
          }
        },
        {
          title: "默认值",
          dataIndex: "defaultValue",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "defaultValue"
          }
        },
        {
          title: "最大长度",
          dataIndex: "maxlength",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "maxlength"
          }
        },
        {
          title: "描述",
          dataIndex: "description",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "description"
          }
        },
        {
          title: "排序",
          dataIndex: "sort",
          align: "center",
          width: "100px",
          scopedSlots: {
            customRender: "sort"
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: "80px",
          scopedSlots: {
            customRender: "action"
          }
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.inputType = inputTypes;
  },
  methods: {
    handleAddExtendsField() {
      const newData = {
        code: "",
        inputType: this.inputType[0].value,
        name: "",
        isRequired: false,
        isSearch: false,
        defaultValue: "",
        maxlength: "",
        description: "",
        sort: 0,
        id: Date.now()
      };
      this.dataSource = [...this.dataSource, newData];
    },
    handleDeleteExtendsField(record, index) {
      this.dataSource.splice(index, 1);
    },
    setDataSource(data) {
      this.dataSource = data;
    },
    getDataSource() {
      return this.dataSource ;
    },
    clearDataSource() {
      this.dataSource = [];
    },
    handleChange(e, key, column, index, inputType) {
      const newData = [...this.dataSource];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        if (inputType === "checkbox") {
          target[column] = e.target.checked;
        } else {
          target[column] = e instanceof Object ? e.target.value : e;
        }
      }
    }
  }
};
</script>
