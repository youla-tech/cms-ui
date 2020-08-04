<template>
  <div>
    <a-modal
      title="移动至栏目"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-tree-select
        style="width: 300px"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="treeData"
        placeholder="请选择"
        treeDefaultExpandAll
        @change="changeTree"
        v-model="value"
      >
        <span
          style="color: #08c"
          slot="title"
          slot-scope="{key, value}"
          v-if="key='0-0-1'"
        >Child Node1 {{value}}</span>
      </a-tree-select>
    </a-modal>
  </div>
</template>
<script>
import { moveToCategory } from '@/api/cms/content'
import { treeCategory } from '@/api/cms/category'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      value: '',
      categoryId: '',
      selectedRowKeys: [],
      treeData: []
    }
  },
  created() {
    this.treeCategory()
  },
  methods: {
    open(selectedRowKeys) {
      this.visible = true
      this.selectedRowKeys = selectedRowKeys
    },
    treeCategory() {
      treeCategory().then(response => {
        const treeDataArr = []
        if (response.res) {
          treeDataArr.push(response.res)
        }
        this.treeData = treeDataArr
      })
    },
    changeTree(value, label, extra) {
      this.categoryId = value
    },
    handleOk(e) {
      if (!this.categoryId) {
        this.$message.error('请选择栏目')
        return
      }
      moveToCategory({ ids: this.selectedRowKeys, categoryId: this.categoryId }).then(response => {
        if (response.code === 0) {
          this.$emit('ok')
          this.handleCancel()
          this.$message.info(response.msg)
        }else{
          this.$message.error(response.msg)
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    },
    onChange(e) {}
  }
}
</script>
