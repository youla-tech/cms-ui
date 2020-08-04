<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{perm:'org:save'}"
          v-if="false"
          @click="handleAdd(null)"
        >新建组织</a-button>
      </div>
    </template>

    <div class="table-page-search-wrapper">
      <a-table :columns="columns" :dataSource="data">
        <!-- :rowSelection="rowSelection" -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'org:update'}">编辑</a-tag>
            <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'org:delete'}">删除</a-tag>
            <a-tag color="green" @click="handleAdd(record)" v-has="{perm:'org:save'}">新增</a-tag>
            <a-tag color="blue" @click="handleAssign(record)" v-has="{perm:'org:save'}">栏目分配</a-tag>
          </template>
        </span>

        <span slot="tagType" slot-scope="text">
          <a-tag color="#108ee9" v-if="text=='0' ">集团</a-tag>
          <a-tag color="orange" v-if="text=='1'">公司</a-tag>
          <a-tag color="#87d068" v-if="text=='2'">部门</a-tag>
        </span>
      </a-table>
      <form-handle ref="formHandle" @ok="handleOk" />
      <form-handle-org ref="formHandleOrg" @ok="handleOk" />
    </div>
  </a-card>
</template>

<script>
import { page, delByPk } from '@/api/system/org'
import formHandle from './handle'
import moment from 'moment'
import formHandleOrg from './handleOrg'

const columns = [
  {
    title: '组织名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '组织代码',
    dataIndex: 'attributes.orgCode',
    key: 'attributes.orgCode',
    width: '16%'
  },
  {
    title: '组织类型',
    dataIndex: 'attributes.level',
    width: '16%',
    key: 'type',
    scopedSlots: { customRender: 'tagType' }
  },
  {
    title: '创建时间',
    dataIndex: 'attributes.createTime',
    width: '16%',
    sorter: true,
    needTotal: false,
    customRender: text => {
      if (text) return moment(text).format('YYYY-MM-DD')
    }
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
    formHandle,
    formHandleOrg
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
    handleAssign(record) {
      this.$refs.formHandleOrg.assignColumn(record)
    },
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id }).then(response => {
            if (response.code === 0) {
              that.$message.info(response.msg)
              that.handleOk()
            } else {
              that.$message.error(response.msg)
            }
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
