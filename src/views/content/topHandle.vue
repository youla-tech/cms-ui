<template>
  <div>
    <a-modal title="置顶"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
              <a-row>
      <a-input-number :min="1"
                      placeholder="置顶等级"
                      v-model="value"
                      @change="onChange" />

    
    <a-select mode="tags" style="width: 60%;margin-left: 20px;" placeholder="置顶标签(可不填)" v-model="editTopTag" allowClear=true>
         <a-select-option v-for="(tag,index) in topTags" :key="index"  :value="tag">{{tag}}</a-select-option> 
    </a-select>
</a-row>
<a-divider dashed />
                   <a-row> <a-switch  v-model="recommend" checkedChildren="设为推荐" unCheckedChildren="取消推荐"/></a-row>

                   <a-divider dashed />
                   <a-row> <a-switch  v-model="notice" checkedChildren="设为公告" unCheckedChildren="取消公告"/></a-row>
 <a-divider dashed />
                    <a-row> <a-switch  v-model="hot" checkedChildren="设为热门" unCheckedChildren="取消热门"/></a-row>
    </a-modal>
  </div>
</template>
<script>
import { top,getTopTag } from '@/api/cms/content'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      value: 0,
      recommend: false,
      notice: false,
      hot: false,
      editTopTag:[],
      topTags:[],
      record: {}
    }
  },
  methods: {
    top(record) {
      this.visible = true
      this.value = record.sort
      this.recommend = record.recommend
      this.notice = record.notice
      this.hot = record.hot
      this.topTag=record.topTag
      this.record = record
      this.selectTopTag()
      if(record.topTag){
        console.log(record.topTag.split(','))
         this.editTopTag=record.topTag.split(',')
      }else{
         this.editTopTag=[]
      }
    },
    handleOk(e) {
      const param = {
        id: this.record.id,
        recommend: this.recommend,
        notice: this.notice,
        hot: this.hot,
        sort: this.value,
        topTags:this.editTopTag
      }
      top(param).then(response => {
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
    selectTopTag(){
       getTopTag().then(response=>{
         if(response.code===0){
           this.topTags=response.res
         }
       })
    },
    onChange(e) {

    }
  }
}
</script>
