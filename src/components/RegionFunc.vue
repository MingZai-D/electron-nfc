<template>
  <div class="region-func">
    <p v-show="crcStatus" style="color:red">crc verification failed</p>
    <el-checkbox style="{marginBottom:'10px'}" v-model="checked">Program data to A2 block</el-checkbox>
    <el-button @click="onLink" :disabled="onRequest">Read</el-button>
    <el-button @click="onWrite" :disabled="onRequest">Write</el-button>
  </div>
</template> 

<script>
// import { ReadInfo } from "../utils/method"
import { Message } from "element-ui"
import { ReadNFCAll } from "../../NodeMapping/mapping"
import { CompositeWriteParam } from "../../NodeMapping/mapping"
export default {
  props: ['nfcInfo', 'crcStatus'],
  data() {
    return {
      testText: '',
      checked: false,
      onRequest: false,
      reRun: 0 // 重新执行次数
    }
  },
  methods: {
    onLink() {
      console.log('执行')
      ReadNFCAll().then(res => {
        console.log(res, 'ressss')
        if (res && res.status == 0) {
          this.onRequest = false
          this.reRun = 0
          this.$emit('changeInfo', res)
          Message.success('Read success')
        } else {
          if (this.reRun > 5){
            this.onRequest = false
            this.reRun = 0
            return Message.error('Read error')
          } 
          this.reRun++
          this.onRequest = true
          setTimeout(() => {
            this.onLink()
          }, 1000)
        }
      })
    },
    onWrite() {
      if (!Object.keys(this.nfcInfo).length) return Message.error('Please read the data first')
      CompositeWriteParam(this.nfcInfo, this.checked).then(res => {
        if (res && res.status == 0) {
          this.onRequest = false
          Message.success('Write success')
        } else {
          if (this.reRun > 5){
            this.onRequest = false
            return Message.error('Read error')
          }
          this.reRun++
          this.onRequest = true
          setTimeout(() => {
            this.onWrite()
          }, 1000) 
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.region-func {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-button {
    display: block;
    background: #FF6600;
    color: #FFFFFF;
    margin-bottom: 20px;
    margin-left: 0;
    padding: 10px 45px;
  }

  .el-checkbox {
    margin-bottom: 10px;
  }
}
</style>