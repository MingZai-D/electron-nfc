<template>
  <div class="region-func">
    <p v-show="crcStatus" style="color:red">crc verification failed</p>
    <!-- <el-select v-model="version" size="mini">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
    <el-checkbox style="{marginBottom:'10px'}" v-model="checked">Program data to A2 block</el-checkbox>
    <el-button @click="onLink">{{ !onReading ? 'Read' : 'Stop' }}</el-button>
    <el-button @click="onWrite">{{ !onWriting ? 'Program' : 'Stop' }}</el-button>
    <el-dialog
      title="prompt"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{promptText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template> 

<script>
import { Message } from "element-ui"
import { ReadNFCAll, CompositeWriteParam, faultDescriptionList, DraverCheck } from "../../NodeMapping/mapping"
import { hex2int } from "../utils/method"
// const remote = require('electron').remote
export default {
  props: ['nfcInfo', 'crcStatus'],
  data() {
    return {
      testText: '',
      checked: false,
      onReading: false,
      onWriting: false,
      reRun: 0,// 重新执行次数
      timer: undefined,
      dialogVisible:false,
      promptText:'',
    }
  },
  methods: {
    onLink() {
      DraverCheck().then(res=>{
        console.log(res,'111')
      })
      if (this.onWriting) return
      this.onReading = true
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = undefined
        this.onReading = false
        this.reRun = 0
        return
      }
      this.timer = setInterval(() => {
        ReadNFCAll().then(res => {
          if (res && res.status == 0) {
            this.onReading = false
            this.reRun = 0
            let key = res.data.params.faultcodegentercrc !== res.data.params.faultcodecrc ? '0' : String(hex2int(res.data.params.faultcode))
            const text = faultDescriptionList[key]
            this.promptText = text
            if(text) this.dialogVisible = true
            this.$emit('changeInfo', res)
            this.$emit('increaseTag')
            clearInterval(this.timer)
            this.timer = undefined
            Message.success('Read succesfully')
          } else {
            if (this.reRun > 10) {
              this.onReading = false
              this.reRun = 0
              this.$emit('changeInfo', res)
              this.$emit('increaseTag')
              Message.error('Read failed')
              clearInterval(this.timer)
              this.timer = undefined
            }
            this.reRun++
          }
        })
      }, 1000)
    },
    onWrite() {
      if (this.onReading) return
      if (!Object.keys(this.nfcInfo).length) return Message.error('Please read the data first')
      this.onWriting = true
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = undefined
        this.onWriting = false
        this.reRun = 0
        this.$emit('changeLoading', false)
        return
      }
      this.$emit('changeLoading', true)
      this.timer = setInterval(() => {
        const tempalte = JSON.parse(JSON.stringify(this.nfcInfo))
        CompositeWriteParam(tempalte, this.checked).then(res => {
          if (res && res.status == 0) {
            this.onWriting = false
            this.reRun = 0
            this.$emit('changeLoading', false)
            if (res.msg === 'Next: Power up the driver to activate your new settings') {
              Message.success(res.msg)
            } else {
              Message.error(res.msg)
            }
            clearInterval(this.timer)
            this.timer = undefined
          } else {
            if (this.reRun > 10) {
              this.onWriting = false
              this.reRun = 0
              this.$emit('changeLoading', false)
              Message.error(res.msg)
              clearInterval(this.timer)
              this.timer = undefined
            }
            this.reRun++
          }
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.region-func {
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
    width: 147px
  }

  .el-checkbox {
    margin-bottom: 10px;
    display: none;
  }

  .el-select{
    width: 80px;
    margin-bottom: 10px;
  }
  .el-dialog__wrapper{
    /deep/.el-dialog{
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0 !important;
      .el-dialog__footer{
        display: flex;
    justify-content: flex-end;
      }
      .el-button{
        margin-bottom: 0;
      }
    }
  }
}
</style>