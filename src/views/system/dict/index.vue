<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="标签名">
              <a-input v-model="queryParam.dto.name" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="数据值">
              <a-input v-model="queryParam.dto.value" placeholder />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select placeholder="请选择类型" v-model="queryParam.dto.type" @change="$refs.table.refresh()">
                <a-select-option
                  v-for="(obj, index) in types"
                  :key="index"
                  :value="obj.type"
                >{{ obj.type }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="{perm:'base:save'}"
        @click="$refs.formHandle.add()"
      >新建基础数据</a-button>
    </div>
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'base:update'}">编辑</a-tag>
          <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'base:delete'}">删除</a-tag>
          <a-tag color="green" @click="handleAddChild(record)" v-has="{perm:'base:child'}">添加子项</a-tag>
        </template>
      </span>
    </s-table>
    <form-handle ref="formHandle" @ok="handleOk" />
  </a-card>
</template>

<script>
import formHandle from './handle'
import { page, delByPk, listType } from '@/api/system/dict'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      mdl: {},
      advanced: false,
      types: [],
      queryParam: {
        dto: {}
      },
      columns: [
        {
          title: '标签名',
          dataIndex: 'name'
        },
        {
          title: '数据值',
          dataIndex: 'value'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '排序',
          dataIndex: 'num'
        },
        {
          title: '备注信息',
          dataIndex: 'remarks'
        },

        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res
          }
        )
      }
    }
  },
  created() {
    this.listType()
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ pk: record.id })
            .then(response => {
              if (response.code === 0) { that.$message.info('操作成功!') } else { that.$message.error(response.msg) }
              that.handleOk()
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() {}
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleAddChild(record) {
      this.$refs.formHandle.addChild(record)
    },
    handleOk() {
      this.listType()
      this.$refs.table.refresh()
    },
    listType() {
      listType({}).then(response => {
        this.types = response.res
      })
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    }
  }
}
</script>
