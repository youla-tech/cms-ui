<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="用户账户">
              <a-input v-model="queryParam.dto.username"
                       placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.dto.status"
                        placeholder="请选择"
                        default-value="0">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">锁定</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="用户姓名">
                <a-input v-model="queryParam.dto.name"
                         style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="用户邮箱">
                <a-input v-model="queryParam.dto.email"
                         style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24"
                 :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="resetSearchForm()">重置</a-button>
              <a @click="toggleAdvanced"
                 style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary"
                v-has="{perm:'user:save'}"
                icon="plus"
                @click="$refs.formHandle.add()">新建用户</a-button>
      <a-button type="dashed"
                @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} 批量操作</a-button>
      <a-dropdown v-action:edit
                  v-if="selectedRowKeys.length > 0"
                  v-has="{perm:'user:batch'}">
        <a-menu slot="overlay">
          <a-menu-item key="1"
                       @click="handleOpera(-1)">
            <a-icon type="delete" />删除
          </a-menu-item>
          <a-menu-item key="2"
                       @click="handleOpera(1)">
            <a-icon type="lock" />锁定
          </a-menu-item>
          <a-menu-item key="3"
                       @click="handleOpera(0)">
            <a-icon type="unlock" />解除锁定
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table ref="table"
             size="default"
             rowKey="id"
             :columns="columns"
             :data="loadData"
             :alert="options.alert"
             :rowSelection="options.rowSelection">
      <span slot="serial"
            slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action"
            slot-scope="text, record">
        <template>
          <a-tag color="orange"
                 @click="handleEdit(record)"
                 v-has="{perm:'user:update'}">编辑</a-tag>
          <a-tag color="red"
                 @click="handleDelete(record)"
                 v-has="{perm:'user:delete'}">删除</a-tag>
          <a-tag color="green"
                 @click="resetPass(record)"
                 v-has="{perm:'user:resetPass'}">密码重置</a-tag>
        </template>
      </span>

      <span slot="status" slot-scope="text, record">
        <template>
          <a-tag v-if="text===0" color="green">正常</a-tag>
          <a-tag v-else color="red">锁定</a-tag>
        </template>
      </span>

    </s-table>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
    <pass-notify ref="passNotify"></pass-notify>
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import passNotify from './passNotify'
import { page, delByPk, batch, resetPass } from '@/api/system/user'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle,
    passNotify
  },
  props: {},
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
      columns: [
        {
          title: '用户账号',
          dataIndex: 'username'
        },
        {
          title: '用户姓名',
          dataIndex: 'name'
        },
        {
          title: '用户邮箱',
          dataIndex: 'email'
        },
        {
          title: '用户电话',
          dataIndex: 'mobile'
        },
        {
          title: '用户性别',
          dataIndex: 'sex',
          sorter: true,
          needTotal: false,
          customRender: text => {
            return text === 1 ? '男' : '女'
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'gmtCreate',
          sorter: true,
          needTotal: false,
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
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
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  filters: {},
  created() {
    this.tableOption()
    this.loadData(this.queryParam)
  },
  methods: {
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id })
            .then(res => {
              if (res.code === 0) { that.$message.info('操作成功!') } else { that.$message.error(res.msg) }
              that.$refs.table.refresh()
            })
            .catch(() => console.log('Oops errors!'))
        },
        onCancel() { }
      })
    },
    handleOpera(type) {
      batch({ type: type, userIds: this.selectedRowKeys })
        .then(reponse => {
          this.$message.info(reponse.msg)
          this.$refs.table.refresh()
          this.options.rowSelection.selectedRowKeys = []
        })
        .catch(() => console.log('Oops errors!'))
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetPass(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要重置密码吗?',
        onOk() {
          resetPass({ id: record.id })
            .then(res => {
              if(res.code===0){
                that.$message.info('操作成功!')
                that.$refs.passNotify.open(res)
                that.$refs.table.refresh()
              }else{
                 that.$message.error(res.msg)
              }
            })
            .catch(() => console.log('Oops errors!'))
        },
        onCancel() { }
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
