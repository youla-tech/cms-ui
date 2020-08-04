<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4"
                 :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.dto.title"
                       placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="4"
                 :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.dto.status"
                        placeholder="请选择"
                        default-value="">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="0">未发布</a-select-option>
                <a-select-option value="1">已发布</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6"
                 :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">
                <a-icon type="search" />查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="resetSearchForm()">
                <a-icon type="loading-3-quarters" />重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-row :gutter="24">
      <a-col :md="4">
        <div class="table-operator">
          <a-button type="primary"
                    size="small"
                    :disabled="!allowContribute || (singlePage&&resRowNum>1)"
                    v-has="{perm:'content:save'}"
                    @click="$refs.formHandle.add(selectTreObj)">
            <a-icon type="plus" />创建文章</a-button>
        </div>
      </a-col>
      <a-col :md="20">
        <div class="table-operator">
          <a-button type="primary"
                    size="small"
                    style="margin-bottom: 2px"
                    v-has="{perm:'content:deleteBatch'}"
                    @click="handleDeletes">
            <a-icon type="delete" />批量删除</a-button>
          <a-button type="primary"
                    size="small"
                    style="margin-bottom: 2px"
                    v-has="{perm:'content:auditBatch'}"
                    @click="publish(1)">
            <a-icon type="notification" />批量发布</a-button>
          <a-button type="primary"
                    size="small"
                     style="margin-bottom: 2px"
                    v-has="{perm:'content:reAuditBatch'}"
                    @click="publish(0)">
            <a-icon type="rollback" />批量撤销发布</a-button>

          <a-button type="primary"
                    size="small"
                    style="margin-bottom: 2px"
                    v-has="{perm:'content:batchRemove'}"
                    @click="batchMove">
            <a-icon type="double-right" />批量移动</a-button>

          <a-button type="primary"
                    size="small"
                    style="margin-bottom: 2px"
                    v-has="{perm:'content:batchGen'}"
                    @click="batchGenCid">
           <a-icon type="redo" />批量生成</a-button>

            <a-button type="primary"
                    size="small"
                    style="margin-bottom: 2px"
                    v-has="{perm:'content:timingpub'}"
                    @click="timingPub">
           <a-icon type="clock-circle" />定时发布</a-button>

        </div>
      </a-col>
    </a-row>
    <!-- <a-divider /> -->
    <a-row :gutter="24">
      <a-col :md="4">
        <div style="border:1px dashed #e8e8e8">
          <a-tree @expand="onExpand"
                  @select="onSelect"
                  showIcon
                  :treeData="treeData"
                  :defaultSelectedKeys="defaultSelectedKeys" />
        </div>
      </a-col>
      <a-col :md="19">
        <s-table ref="table"
                 size="default"
                 rowKey="id"
                 bordered
                 :scroll="{ x: 1500 }"
                 :columns="columns"
                 :data="loadData"
                 :locale="{emptyText: '暂无内容'}"
                 :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange:onSelectChange }">
          >
          <span slot="status"
                slot-scope="state, record">
            <template>
              <a-tag color="orange"
                     v-if="state == '0' ">草稿 {{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
              <a-tag color="red"
                     v-if="state == '1' ">已发布{{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
              <a-tag color="red"
                     v-if="state == '2' ">已删除{{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
            </template>
          </span>

          <span slot="titleData"
                slot-scope="text, record">
            <template>
              <span v-html="($options.filters['substr'](text,26))"></span>
            </template>
          </span>

         <span slot="expiryDate"
                slot-scope="text, record">
            <template>
              <span v-if="text"> <a-icon type='clock-circle' />{{formaterDate(text)}} </span>
              <span v-if="!text"> <a-icon type="close-circle" /> </span>
            </template>
          </span>

          <span slot="action"
                slot-scope="text, record">
            <template>
              <a-tag color="orange"
                     @click="handleEdit(record)"
                     v-has="{perm:'content:update'}">编辑</a-tag>
              <a-tag color="red"
                     @click="handleDelete(record)"
                     v-has="{perm:'content:delete'}">删除</a-tag>
              <a-tag color="green"
                     @click="handleTop(record)"
                     v-has="{perm:'content:top'}">置顶</a-tag>
              <a-tag color="blue"
                     @click="handleView(record)"
                    >预览</a-tag>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
    <top-handle ref="topHandle"
                @ok="handleOk" />

    <batch-move ref="batchMove"
                @ok="handleOk" />

    <notify-socket ref="NotifySocket"></notify-socket>
    <job-publish ref="jobPublish" @ok="handleOk" />
    <handle-view ref="handleView"/>
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import topHandle from './topHandle'
import batchMove from './batchMove'
import jobPublish from './jobPublish'
import handleView from './handleView'
import { treeCategoryAuth } from '@/api/cms/category'
import { page, delByPk, delByPks, publish, reStaticBatchGenCid } from '@/api/cms/content'
import { STable } from '@/components'
import NotifySocket from '@/components/NotifySocket/NotifySocket.vue'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle,
    topHandle,
    batchMove,
    jobPublish,
    NotifySocket,
    handleView
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
      fileItem: {
        fileContent: '',
        filePath: null,
        isLeaf: false
      },
      codeOptions: {
        lineNumbers: true,
        smartIndent: true,
        theme: 'ambiance'
      },
      advanced: false,
      allowContribute: true,
      singlePage: false,
      resRowNum: 0,
      treeData: [],
      selectedRowKeys: [],
      selectedRows: [],
      defaultSelectedKeys: ['0'],
      selectTreObj: {},
      queryParam: {
        dto: { categoryId: '0' }
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          width: 350,
          scopedSlots: { customRender: 'titleData' }
        },
        {
          title: '分类',
          dataIndex: 'categoryName'
        },
        {
          title: '模型',
          dataIndex: 'modelName'
        },
        {
          title: '状态/发布人',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '置顶级别',
          dataIndex: 'sort'
        },
        {
          title: '创建日期',
          dataIndex: 'gmtCreate',
          customRender: data => {
            if (data) return moment(data).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '发布日期',
          dataIndex: 'publishDate',
          customRender: data => {
            if (data) return moment(data).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '是否定时',
          dataIndex: 'expiryDate',
          scopedSlots: { customRender: 'expiryDate' }
        },

        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: '280px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            this.resRowNum = response.res.total
            return response.res
          }
        )
      }
    }
  },
  created() {
    this.treeCategory()
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
               if(response.code===0){
                  that.$message.info(response.msg)
                  that.handleOk()
               }else{
                 that.$message.error(response.msg)
               }
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() { }
      })
    },
    formaterDate(date) {
      return moment(date).format('YY-MM-DD HH:mm:ss')
    },
    handleDeletes() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPks(that.selectedRowKeys)
            .then(response => {
              if(response.code===0){
                 that.$message.info(response.msg)
                 that.handleOk()
              }else{
                 that.$message.error(response.msg)
              }
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() { }
      })
    },
    publish(status) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要执行该操作吗?',
        onOk() {
          publish({ ids: that.selectedRowKeys, status: status })
            .then(response => {
              if(response.code===0){
              that.$message.info(response.msg)
              that.handleOk()
              }else{
              that.$message.error(response.msg)
              }
              
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() { }
      })
    },
    batchMove() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      this.$refs.batchMove.open(this.selectedRowKeys)
    },
    batchGenCid() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要重新生成静态页面?',
        onOk() {
          reStaticBatchGenCid(that.selectedRowKeys)
            .then(response => {
              if (response.code === 0) {
                that.$message.info('请稍后~~')
                setTimeout(function() {
                  that.$refs.NotifySocket.open()
                }, 500)
              } else {
                that.$message.warn(response.msg)
              }
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() { }
      })
    },
    treeCategory() {
      treeCategoryAuth().then(response => {
        const treeDataArr = []
        if (response.res) { treeDataArr.push(response.res) }
        this.treeData = treeDataArr
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk() {
      //  this.treeCategory()
      this.$refs.table.refresh()
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onExpand(expandedKeys) {
      // this.expandedKeys = expandedKeys;
      // this.autoExpandParent = false;
    },
    onSelect(selectedKeys, e) {
      this.selectTreObj = e.node.dataRef
      this.queryParam.dto.categoryId = e.node.dataRef.id
      this.handleOk()
      if (e.node.dataRef.attributes) {
        this.allowContribute = e.node.dataRef.attributes.allowContribute
        this.singlePage = e.node.dataRef.attributes.singlePage
      }
    },
    handleTop(record) {
      this.$refs.topHandle.top(record)
    },
    handleView(record) {
      this.$refs.handleView.view(record)
    },
    timingPub() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      this.$refs.jobPublish.job(this.selectedRowKeys)
    },
    resetSearchForm() {
      this.queryParam = {
        dto: { categoryId: '0' }
      }
      this.selectTreObj = {}
      this.handleOk()
    }
  }
}
</script>
