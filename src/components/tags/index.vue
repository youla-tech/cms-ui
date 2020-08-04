<template>
  <div class="input ant-input"
       contenteditable
       placeholder="请输入文字">
    <div contenteditable="false">
      <template v-for="tag in tags">
        <a-tag color="orange"
               :key="tag"
               :closable="true"
               :afterClose="() => handleClose(tag)">
          {{ tag }}
        </a-tag>
      </template>

      <a-input v-if="inputVisible"
               ref="input"
               type="text"
               size="small"
               :style="{ width: '78px' }"
               :value="inputValue"
               @change="handleInputChange"
               @blur="lostFocusConfirm"
               @keyup.enter="handleInputConfirm"
               @keyup.delete="handleInputDelete"
               style="margin-bottom: 3px;margin-top:3px"
               placeholder="Enter确认" />
      <a-tag v-else
             @click="showInput"
             style="background: #fff; borderStyle: dashed;"
             disabled="true">
        <a-icon type="plus" />创建标签
      </a-tag>
      <a-tag
             @click="selectTags"
             style="borderStyle: dashed;margin-left:8px;"
             color="#87d068"
             disabled="true">
        <a-icon type="plus" />选择标签
      </a-tag>
    </div>
     <tags-belong ref="tagsBelong" @ok="selectTagsOk" />
  </div>
</template>
<script>
import tagsBelong from './tagsBelong.vue'
export default {
  components: {
    tagsBelong
  },
  data() {
    return {
      tags: [],
      readonly: false,
      inputVisible: false,
      inputValue: '',
      click : 0
    }
  },
  watch: {
    tags(newValue, oldValue) {
    },
    inputVisible(newValue, oldValue){
      if(!newValue){
        this.click=0
      }
    }
  },
  methods: {
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag)
      this.tags = tags
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(function() {
        this.$refs.input.focus()
      })
    },
    handleInputChange(e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
      this.showInput()
    },
    handleInputDelete(e) {
      const value = e.target.value
      if (!value) {
        this.click=this.click+1
        if( this.click>1){
          this.inputVisible = false
        }
      }
      e.preventDefault()
    },
    lostFocusConfirm(e) {
      e.target.value = ''
      this.$refs.input.blur()
      this.inputVisible = false
    },
    getTagArr() {
      return this.tags
    },
    getTagStr() {
      let str = ''
      if (this.tags.length > 0) {
        this.tags.forEach(function(item, index) {
          str = str + item + ','
        })
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    setTags(tags) {
      if (tags) {
        this.tags = tags.split(',')
      }
    },
    setTagArr(tagArr) {
      if (tagArr && tagArr.length > 0) {
        this.tags = tagArr
      }
    },
    clearTags() {
      this.tags = []
    },
    selectTags(){
        this.$refs.tagsBelong.open()
    },
    selectTagsOk(tags){
      let that =  this
      let tagArrs=this.tags
      if(tagArrs.length===0){
        this.setTagArr(tags)
      }else{
        if(tags&&tags.length>0){
          tags.forEach(function(item,index){
            console.log(tags.indexOf(item))
              if(that.tags.indexOf(item)<0){
                that.tags.push(item)
              }
          })
        }
      }
    }
  }
}
</script>

<style type="text/css">
/**css样式*/
.input {
  width: 100%;
  height: 100%;
  line-height: 24px;
  font-size: 14px;
  padding: 5px 8px;
  border: 1px solid #ddd;
}

.input:empty::before {
  content: attr(placeholder);
}
</style>
