<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="表名称">
              <a-input v-model="queryParam.dto.tableName" placeholder="" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="表注释">
              <a-input v-model="queryParam.dto.tableNote" placeholder="" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" v-has="{perm:'role:save'}" @click="$refs.formHandle.add()">新建角色</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'role:update'}">编辑</a-tag>
          <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'role:update'}">删除</a-tag>
          <a-tag color="green" @click="handleAuto(record)" v-has="{perm:'role:update'}">代码生成</a-tag>
        </template>
      </span>
    </s-table>
    <form-handle ref="formHandle" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import {
  page,
  delByPk,
  down
} from '@/api/online'
import {
  STable
} from '@/components'
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        dto: {}
      },
      // 表头
      columns: [{
        title: '表名称',
        dataIndex: 'tableName'
      },
      {
        title: '表注释',
        dataIndex: 'tableNote'
      },
      {
        title: '作者',
        dataIndex: 'author'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        needTotal: false,
        customRender: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD')
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '250px',
        scopedSlots: {
          customRender: 'action'
        }
      }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(response => {
          return response.res
        })
      },
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({
            id: record.id
          }).then(response => {
            if(response.code===0){
             that.$message.info(response.msg)
             that.$refs.table.refresh()
            }else{
              that.$message.error(response.msg)
            }
            
          }).catch((response) => {
            that.$message.warn(response.message)
          })
        },
        onCancel() {}
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleAuto(record) {
      down({
        id: record.id
      }).then(response => {
        if (response.code === 0) {
          setTimeout(() => {
            this.$message.info('靓仔，你的代码已生成!')
          }, 1000)
        } else {
          this.$message.error(response.msg)
        }
      }).catch((response) => {
        this.$message.warn(response.msg)
      })
    },
    handleOk() {
      this.$refs.table.refresh()
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
