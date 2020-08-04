<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="模块名称">
              <a-input v-model="queryParam.dto.type"
                       placeholder="" />
            </a-form-item>
          </a-col>
           <a-col :md="6"
                 :sm="24">
            <a-form-item label="操作账户">
              <a-input v-model="queryParam.dto.username"
                       placeholder="" />
            </a-form-item>
          </a-col>
           <a-col :md="6"
                 :sm="24">
            <a-form-item label="IP地址">
              <a-input v-model="queryParam.dto.ip"
                       placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
    </div>
    <s-table ref="table"
             size="default"
             rowKey="id"
             :columns="columns"
             :data="loadData">
      <span slot="params"
            slot-scope="text, record">
        <span v-html="($options.filters['substr'](text,10))"></span>
      </span>
      <!-- <span slot="action" slot-scope="text, record">
        <template>
        <a @click="handleEdit(record)" v-has="{perm:'role:update'}">编辑</a>
        <a-divider type="vertical" v-has="{perm:'role:update'}"/>
        <a @click="handleDelete(record)" v-has="{perm:'role:delete'}">删除</a>
        <a-divider type="vertical" v-has="{perm:'role:assign'}"/>
        <a @click="handleMenu(record)" v-has="{perm:'role:assign'}">其他操作</a>
        </template>
    </span> -->
    </s-table>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import {
  page,
  delByPk
} from '@/api/log'
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
      advanced: false,
      queryParam: {
        dto: {}
      },
      columns: [{
        title: '模块标识',
        dataIndex: 'type'
      },
      {
        title: '模块名称',
        dataIndex: 'module'
      },
      {
        title: '操作账户',
        dataIndex: 'username'
      },
      {
        title: '操作人',
        dataIndex: 'name'
      },
      {
        title: '用户操作',
        dataIndex: 'operation'
      },
      {
        title: '响应时间',
        dataIndex: 'time',
        customRender: (text) => {
          if (text < 1000) {
            return text + '  ms'
          } else if (text >= 1000) {
            return (text / 1000) + '  s'
          } else {
            return text + '  ms'
          }
        }
      },
      {
        title: '请求方法',
        dataIndex: 'method'
      },
      {
        title: '请求参数',
        dataIndex: 'params',
        scopedSlots: {
          customRender: 'params'
        }
      },
      {
        title: 'IP地址',
        dataIndex: 'ip'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        sorter: true,
        needTotal: false,
        customRender: (text) => {
          if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss') }
        }
      }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '250px',
        //   scopedSlots: {
        //     customRender: 'action'
        //   }
        // }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(response => {
          return response.res
        })
      }
    }
  },
  created() { },
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
            that.$message.info(response.message)
            that.$refs.table.refresh()
          }).catch((response) => {
            that.$message.warn(response.message)
          })
        },
        onCancel() { }
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
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
