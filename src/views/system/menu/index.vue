<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{perm:'menu:save'}"
          @click="handleAdd(null)"
        >新建菜单</a-button>
      </div>
    </template>

    <div class="table-page-search-wrapper">
      <a-table :columns="columns" :dataSource="data">
        <!-- :rowSelection="rowSelection" -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'menu:update'}">编辑</a-tag>
            <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'menu:delete'}">删除</a-tag>
            <a-tag color="green" @click="handleAdd(record)" v-has="{perm:'menu:save'}" v-if="record.attributes.type!=2" >新增</a-tag>
          </template>
        </span>

        <span slot="tagType" slot-scope="text">
          <a-tag color="#108ee9" v-if="text==0">目录</a-tag>
          <a-tag color="orange" v-if="text==1">菜单</a-tag>
          <a-tag color="#87d068" v-if="text==2">按钮</a-tag>
        </span>

      <span slot="url"
            slot-scope="text">
        <span v-html="($options.filters['substr'](text,18))"></span>
      </span>
      </a-table>
      <form-handle ref="formHandle" @ok="handleOk" />
    </div>
  </a-card>
</template>

<script>
import { page, delByPk } from '@/api/system/menu'
import formHandle from './handle'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '菜单标识',
    dataIndex: 'attributes.perms',
    key: 'perms',
    width: '16%'
  },
  {
    title: 'API接口',
    dataIndex: 'attributes.url',
    width: '16%',
    key: 'url',
    scopedSlots: {
      customRender: 'url'
    }
  },

  {
    title: '菜单类型',
    dataIndex: 'attributes.type',
    width: '16%',
    key: 'type',
    scopedSlots: { customRender: 'tagType' }
  },
  {
    title: '菜单排序',
    dataIndex: 'attributes.orderNum',
    width: '10%',
    key: 'orderNum'
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    scopedSlots: { customRender: 'action' }
  }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  data() {
    return {
      data: [],
      columns,
      rowSelection
    }
  },
  components: {
    formHandle
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      return page({}).then(response => {
        this.data = response.res.children
      })
    },
    handleAdd(record) {
      this.$refs.formHandle.add(record)
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id })
            .then(response => {
              if (response.code === 0) { that.$message.info('操作成功!') } else { that.$message.error(response.msg) }
              that.handleOk()
            })
            .catch(response => {
              that.$message.warn(response.data.msg)
            })
        },
        onCancel() {}
      })
    },
    handleOk() {
      this.loadData()
    }
  }
}
</script>
