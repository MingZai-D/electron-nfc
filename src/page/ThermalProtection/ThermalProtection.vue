<template>
  <div class="thermal-protection-page">
    <PageHeader :headerText="'Thermal Protection'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <div style="display: inline-block">
            <div :class="['setting-title', !enable['thermalprotection'] ? 'ban-click' : '']"
            @click="changeBox('thermalprotection')">
              <img src="@/assets/images/icon_select.png" v-if="info.thermalprotection" />
              <span class="circle" v-else />
              Thermal Protection
            </div>
          </div>
          <el-form label-width="120px" :model="info" ref="formRef">
            <el-form-item label="Derating Start" prop="deratingStart" :rules="initRulers('deratingStart')">
              <el-input v-model="info.deratingStart"  type="number"
                @input="checkInput('deratingStart')"
                :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : !info.thermalprotection"
                @blur="onBlur($event, 'deratingStart')">
                <span slot="suffix">ohm</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Derating End" prop="deratingend" :rules="initRulers('deratingend')">
              <el-input v-model="info.deratingend" type="number" @input="checkInput('deratingend')"
                :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : !info.thermalprotection"
                @blur="onBlur($event, 'deratingend')">
                <span slot="suffix">ohm</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Min Output" prop="minoutput" :rules="initRulers('minoutput')">
              <el-input v-model="info.minoutput" type="number" @input="checkInput('minoutput')"
                :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : !info.thermalprotection"
                @blur="onBlur($event, 'minoutput')">
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="padding:30px 0 0 30px">
        <LineEchartsVue ref="LineEchartsVueRef" :configs="config" />
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue"
import LineEchartsVue from "@/components/LineEcharts.vue"
import { EventBus } from "@/utils/eventBus.js"
import { hex2int } from "../../utils/method"
import { int2hex } from "../../utils/method"
export default {
  props: ['nfcInfo', 'enable', 'readTag'],
  components: {
    PageHeader,
    LineEchartsVue
  },
  data() {
    return {
      config: {
        id: 'thermalMain',
        title: 'Derating Cruve',
        subtext: 'Output(%) vs NTC Resistance(kΩ)',
        areaOpacity: 0,
        yData: [100, 100, 100, 100, 100, 100, 100],
        xData: []
      },
      info: {
        deratingStart: 6.5,
        deratingend: 5,
        minoutput: 50,
        tpderatingstart: '',
        thermalprotection: false
      }
    }
  },
  watch: {
    info: {
      handler() {
        this.$nextTick(() => {
          this.$refs['LineEchartsVueRef'].initChart()
        })
      },
      deep: true

    },
    readTag() {
      this.initInfo(this.nfcInfo)
    }
  },
  activated() {
    this.initInfo(this.nfcInfo)
    EventBus.$off('constantLumenInit')
    EventBus.$once('constantLumenInit', (data) => {
      this.initInfo(data)
    })
  },
  methods: {
    inputChange(val) {
      if (!Object.keys(this.nfcInfo).length || val.deratingStart < 0 || val.deratingend < 0 || val.minoutput < 0) return
      const data = this.nfcInfo
      if (val.deratingStart) data.params.tpderatingstart = int2hex(val.deratingStart, 8)
      if (val.deratingend) data.params.tpderatingend = int2hex(val.deratingend, 8)
      if (val.minoutput) data.params.tpminoutput = int2hex(val.minoutput, 2)
      data.params.thermalprotectionenabled = val.thermalprotection ? '01' : '00'
      this.$emit('updateInfo', data)
      this.updateEchart()
      // this.initInfo(data)
    },
    initInfo(value) {
      const len = Object.keys(value).length
      this.info = {
        deratingStart: len && value.params.tpderatingstart ? hex2int(value.params.tpderatingstart) : this.info.deratingStart,
        deratingend: len && value.params.tpderatingend ? hex2int(value.params.tpderatingend) : this.info.deratingend,
        minoutput: len && value.params.tpminoutput ? hex2int(value.params.tpminoutput) : this.info.minoutput,
        thermalprotection: len && value.params.thermalprotectionenabled == '01' ? true : this.info.thermalprotection
      }
      this.updateEchart()
    },
    updateEchart() {
      let start = []
      let end = []
      for (let i = 0; i < 7; i++) {
        start.push(this.info.deratingStart)
      }
      for (let i = 0; i < 2; i++) {
        end.push(this.info.deratingend)
      }
      this.config.xData = [...start, ...end]
      this.config.yData[7] = 100 * this.info.minoutput * 0.01
      this.config.yData[8] = 100 * this.info.minoutput * 0.01
    },
    changeBox(type) {
      this.info[type] = !this.info[type]
    },
    checkInput(type) {
      this.$refs.formRef.validateField(type)
      this.inputChange(this.info)
    },
    onBlur(e, type) {
      switch (type) {
        case 'deratingStart':{
          let regex = /^[0]+/
          const newValue = Number(e.target.value.replace(regex,""));
          this.info.deratingStart = newValue
          if (newValue < 0 || newValue == '' || newValue < this.info.deratingend) this.info.deratingStart = this.info.deratingend ? this.info.deratingend : 0
          if (newValue > 100000) this.info.deratingStart = 100000
          this.inputChange(this.info)
          return
        }
          
        case 'deratingend':{
          let regex = /^[0]+/
          const newValue = Number(e.target.value.replace(regex,""));
          console.log(newValue,'new')
          this.info.deratingend = newValue
          if (newValue > this.info.deratingStart) this.info.deratingend = this.info.deratingStart
          if (newValue < 0 || newValue == '' || this.info.deratingStart === 0) this.info.deratingend = 0
          this.inputChange(this.info)
          return
        }
        case 'minoutput':{
          let regex = /^[0]+/
          const newValue = e.target.value.replace(regex,"");
          this.info.minoutput = newValue
          if (newValue < 0 || newValue == '') this.info.minoutput = 0
          if (newValue > 100) this.info.minoutput = 100
          this.inputChange(this.info)
          return
        }
      }
    },
    initRulers(label) {
      let checkRuler = (rule, value, callback, type) => {
        const numvalue = Number(value)
        let text = ''
        let condition = ''
        switch (type) {
          case 'deratingStart':
            text = `${this.info.deratingend}~100000`
            condition = numvalue < this.info.deratingend || numvalue > 100000
            break;
          case 'deratingend':
            if(this.info.deratingStart === 0){
              text = 'Derating End value should not greater than the Start value.'
            }else{
              text = `0~${this.info.deratingStart}`
            }
            condition = numvalue < 0 || numvalue > this.info.deratingStart
            console.log(this.info.deratingStart, value,value > this.info.deratingStart,'val')
            console.log(condition,'condition')
            break;
          case 'minoutput':
            text = "0~100"
            condition = numvalue < 0 || numvalue > 100
            break;
          default:
            return ''
        }
        if (condition || (!value && value !== 0)) {
          callback(new Error(text));
        } else {
          callback();
        }
      }
      let rules = {
        "deratingStart": [
          { validator: (rule, value, callback) => checkRuler(rule, value, callback, 'deratingStart'), trigger: 'blur' }
        ],
        "deratingend": [
          { validator: (rule, value, callback) => checkRuler(rule, value, callback, 'deratingend'), trigger: 'blur' }
        ],
        "minoutput": [
          { validator: (rule, value, callback) => checkRuler(rule, value, callback, 'minoutput'), trigger: 'blur' }
        ]
      }
      return rules[label]
    }
  }
}
</script>

<style lang="scss" scoped>
.thermal-protection-page {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .page-container {
    flex: auto;
    background: #FFFFFF;

    .setting-container {
      border-bottom: 1px solid #dddddd;

      .setting-content {
        max-width: 600px;
        padding: 30px 0 0 30px;

        .setting-title {
          display: flex;
          margin-bottom: 30px;
          cursor: pointer;

          &>img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }

          .circle {
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #DADADA;
            border: 1px solid #979797;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>