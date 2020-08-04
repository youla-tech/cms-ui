<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="5">
        <div class="table-operator">
          <a-button type="primary"
                    icon="plus"
                    v-has="{perm:'category:save'}"
                    @click="$refs.formHandle.add(selectTreObj)">创建分类</a-button>
        </div>
      </a-col>
      <a-col :md="19">
        <div class="table-operator"></div>
      </a-col>
    </a-row>
    <a-divider />
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
      <a-col :md="20">
        <s-table ref="table"
                 size="default"
                 rowKey="id"
                 :columns="columns"
                 :data="loadData"
                 :locale="{emptyText: '暂无子分类'}">
          <span slot="action"
                slot-scope="text, record">
            <template>
              <a-tag color="orange"
                     @click="handleEdit(record)"
                     v-has="{perm:'category:update'}">编辑</a-tag>
              <a-tag color="red"
                     v-has="{perm:'category:delete'}"
                     @click="handleDelete(record)">删除</a-tag>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>重新生成栏目静态化列表</span>
                </template>
                <a-tag color="green"
                       v-has="{perm:'category:restatic'}"
                       @click="reStaticFile(record)">静态化</a-tag>
              </a-tooltip>

              <a-tooltip placement="top">
                <template slot="title">
                  <span>将该栏目下的内容模型应用为当前栏目对应的模型</span>
                </template>
                <a-tag color="blue"
                v-has="{perm:'category:model'}"
                       @click="updateContentModel(record)">重置模型</a-tag>
              </a-tooltip>
            </template>
          </span>
          <span slot="categoryExtendId"
                slot-scope="text">
            <template>
              <a-tag color="green"
                     v-if="text">是</a-tag>
              <a-tag color="red"
                     v-if="!text">否</a-tag>
            </template>
          </span>
          <span slot="hidden"
                slot-scope="text">
            <template>
              <a-tag color="green"
                     v-if="text">是</a-tag>
              <a-tag color="red"
                     v-if="!text">否</a-tag>
            </template>
          </span>
          <span slot="allowContribute"
                slot-scope="text">
            <template>
              <a-tag color="green"
                     v-if="text">是</a-tag>
              <a-tag color="red"
                     v-if="!text">否</a-tag>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
    <notify-socket ref="NotifySocket"></notify-socket>
  </a-card>
</template>

<script>
// import moment from 'moment'
import formHandle from './handle'
import { treeCategory, page, reStaticFileByCid, deleteByCategoryId, updateContentModel } from '@/api/cms/category'
import { STable } from '@/components'
import NotifySocket from '@/components/NotifySocket/NotifySocket.vue'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle,
    NotifySocket
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
      treeData: [],
      defaultSelectedKeys: ['0'],
      selectTreObj: {},
      queryParam: {
        dto: { id: '0' }
      },
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name'
        },
        {
          title: '父分类',
          dataIndex: 'parentName'
        },
        {
          title: '分类编码',
          dataIndex: 'code'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '是否扩展分类',
          dataIndex: 'categoryExtendId',
          scopedSlots: { customRender: 'categoryExtendId' }
        },
        {
          title: '前台显示',
          dataIndex: 'hidden',
          scopedSlots: { customRender: 'hidden' }
        },
        {
          title: '允许投稿',
          dataIndex: 'allowContribute',
          scopedSlots: { customRender: 'allowContribute' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '350px',
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
    this.treeCategory()
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          deleteByCategoryId({ id: record.id })
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
    reStaticFile(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要重新生成静态页面?',
        onOk() {
          reStaticFileByCid({ id: record.id })
            .then(response => {
              if (response.code === 0) {
                that.$message.info('请稍后~~')
                setTimeout(function() {
                  that.$refs.NotifySocket.open()
                }, 500)
              } else {
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
    treeCategory() {
      treeCategory().then(response => {
        const treeDataArr = []
        if (response.res) { treeDataArr.push(response.res) }
        this.treeData = treeDataArr
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk() {
      this.treeCategory()
      this.$refs.table.refresh()
    },
    onExpand(expandedKeys) {
      // this.expandedKeys = expandedKeys;
      // this.autoExpandParent = false;
    },
    onSelect(selectedKeys, e) {
      this.selectTreObj = e.node.dataRef
      this.queryParam.dto.id = e.node.dataRef.id
      this.handleOk()
    },
    updateContentModel(record) {
      updateContentModel({ id: record.id }).then(response => {
        if(response.code===0)
        this.$message.info(response.msg)
        else
        this.$message.error(response.msg)
      })
    },
    resetSearchForm() {
      this.queryParam = {
        dto: { id: '0' }
      }
      this.selectTreObj = {}
      this.handleOk()
    }
  }
}
</script>
