<template>
  <div>
    <a-modal  title="文章预览"
              :visible="visible"
              :width="modalwidth"
              style="top: 20px;"
              class="modalclass"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
            <a-row>
            <a-col :md="2" :sm="24">
              <a-icon type="laptop" style="font-size: 30px;" @click="preview(0)"/>
               <div style="width:30px">
                  <a-divider/>
               </div>
               <a-icon type="mobile" style="font-size: 30px;" @click="preview(1)"/>
            </a-col>

            <a-col :md="22" :sm="24">
            <div v-if="loadUrl!==''" class="ifreamdiv" >      
            <iframe :src="loadUrl"
                frameborder="no"
                border="0"
                :width="dywidth"
                :height="dyheigth"
                :style="{'min-height':dyheigth}"></iframe>
           </div>
           <div v-else style="text-align:center">~暂无预览~</div>
           </a-col>
           </a-row>

    </a-modal>
  </div>
</template>
<script>
import { domainUrl } from '@/utils/request.js'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      loadUrl:'',
      dyheigth: 500,
      dywidth: 900,
      modalwidth:'100%',
      record: {}
    }
  },
  created() {
    this.dyheigth = (window.innerHeight*0.7) 
    this.dywidth = (window.innerWidth) 
  },
  methods: {
    view(record) {
      console.log(record)
      this.visible = true
      this.record = record
      if(record.url){
        this.loadUrl=domainUrl+record.url
      }
    },
    preview(type){
       if(type===0){
          this.dyheigth = (window.innerHeight*0.7) 
          this.dywidth = (window.innerWidth) 
          this.modalwidth='100%'
       }else if(type===1){
          this.dyheigth = (window.innerHeight*0.7) 
          this.dywidth = 450
          this.modalwidth=490
          this.dyheigth = (window.innerHeight*0.9) 
       }
    },
    handleOk(e) {
      this.handleCancel()
    },
    handleCancel(e) {
      this.preview(0)
      this.visible = false
      this.modalwidth='100%'
    }

  }
}
</script>
<style>
.modalclass{
  overflow-x: auto;
}
.ifreamdiv{
  border: 2px solid #c74563e8;
  overflow-x: auto;
  border-radius: 8px;
}
</style>