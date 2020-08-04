<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="任务名称">
              <a-input v-model="queryParam.dto.jobName"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="任务类型">
              <a-select v-model="queryParam.dto.jobClass">
                <a-select-option value="JOB_TIME_CRON">JOB_TIME_CRON</a-select-option>
                <a-select-option value="JOB_CLASS">JOB_CLASS</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        type="primary"
        v-has="{perm:'job:save'}"
        icon="plus"
        @click="$refs.formHandle.add()"
      >新建任务</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'job:update'}">编辑</a-tag>
          <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'job:delete'}">删除</a-tag>

          <a-tag color="green" @click="handleTaskAction(record,'0')" v-has="{perm:'job:action'}">启用</a-tag>
          <a-tag color="yellow" @click="handleTaskAction(record,'1')" v-has="{perm:'job:action'}">暂停</a-tag>
        </template>
      </span>

      <span slot="jobStatus" slot-scope="text, record">
        <template>
		  <a-tag color="orange" v-if="text==='-1' " >未启动</a-tag>	
          <a-tag color="green" v-if="text==='0' " >已启动</a-tag>
          <a-tag color="red" v-if="text==='1' " >已暂停</a-tag>
        </template>
      </span>

    </s-table>
    <form-handle ref="formHandle" @ok="handleOk" />
  </a-card>
</template>

<script>
import formHandle from './handle'
import { page, delByPk, taskAction } from '@/api/task'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        dto: {}
      },
      // 表头
      columns: [
        {
          title: '任务名称',
          dataIndex: 'jobName'
        },
        {
          title: '任务组',
          dataIndex: 'jobGroup'
        },
        {
          title: '任务表达式',
          dataIndex: 'cronExpression'
        },
        {
          title: '任务描述',
          dataIndex: 'jobDesc'
        },
        // {
        //   title: '任务类型',
        //   dataIndex: 'jobClass'
        // },
        {
		  title: '状态',
		  dataIndex: 'jobStatus',
		  scopedSlots: { customRender: 'jobStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '300px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res
          }
        )
      }
    }
  },
  filters: {},
  created () {},
  methods: {
    handleDelete (record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk () {
          delByPk({ id: record.id })
            .then(res => {
              if (res.code === 0) {
                that.$message.info('操作成功!')
                that.$refs.table.refresh()
              } else {
                that.$message.error(res.msg)
              }
            })
        },
        onCancel () {}
      })
    },
    handleTaskAction (record, action) {
      record.action = action
      taskAction(record).then(response => {
		  if (response.code === 0) {
		    this.$message.info('操作成功!')
		    this.handleOk()
		  } else {
		    this.$message.error(response.msg)
		  }
      })
    },
    handleEdit (record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    resetSearchForm () {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    }
  }
}
</script>
