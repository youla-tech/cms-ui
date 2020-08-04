<template>
  <a-modal
    :title="modalTitle"
    :width="389"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24">
        <a-col :md="24">
          <div style="border:1px dashed #e8e8e8;max-height: 600px;overflow-y: auto;">
            <a-directory-tree
              multiple
              :defaultExpandAll="true"
              :treeData="treeData"
              @select="onSelect"
            ></a-directory-tree>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { treeTemps } from "@/api/cms/webfile";
export default {
  props: {
    searchTempActive: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      modalTitle: "",
      treeData: [],
      param:null,
      fileItem: {
        filePath: "",
        isLeaf: false
      },
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false
    };
  },
  created() {
    this.listTreeTemps();
  },
  methods: {
    selectTemp(param) {
      this.param=param
      this.modal("选择模板文件", 0);
    },
    edit(record) {
      this.modal("编辑页面片段", 1);
    },
    listTreeTemps() {
      treeTemps().then(response => {
        const treeDataArr = [];
        if (response.res) {
          treeDataArr.push(response.res);
        }
        this.treeData = treeDataArr;
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
    },
    onSelect(keys, e) {
      if (e.node.isLeaf && e.node.dataRef.relativePath) {
        this.fileItem.filePath = e.node.dataRef.relativePath.replace(
          /\\/g,
          "/"
        );
      }
    },
    handleSubmit() {
      if (this.fileItem.filePath) {
        this.$emit("ok", this.fileItem.filePath, this.searchTempActive,this.param);
        this.handleCancel();
      } else {
        this.$message.error("请选择模板！");
      }
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
    }
  }
};
</script>
