<template>
  <div class="thermal-protection-page">
    <PageHeader :headerText="'Thermal Protection'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <div :class="['setting-title', !enable['thermalprotection'] ? 'ban-click' : '']"
            @click="changeBox('thermalprotection')">
            <img src="@/assets/images/icon_select.png" v-if="info.thermalprotection" />
            <span class="circle" v-else />
            Thermal Protection
          </div>
          <el-form label-width="120px" :rules="rules" :model="info" ref="formRef">
            <el-form-item label="Derating Start" prop="deratingStart">
              <el-input v-model="info.deratingStart" min="0" max="4294967295" type="number"
                @input="checkInput('deratingStart')" :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : info.thermalprotection"
                @blur="onBlur($event, 'deratingStart')">
                <span slot="suffix">ohm</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Derating End" prop="deratingend">
              <el-input v-model="info.deratingend" min="0" max="4294967295" type="number"
                @input="checkInput('deratingend')" :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : info.thermalprotection"
                @blur="onBlur($event, 'deratingend')">
                <span slot="suffix">ohm</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Min Output" prop="minoutput">
              <el-input v-model="info.minoutput" type="number" @input="checkInput('minoutput')"
                :disabled="!enable['thermalprotection'] ? !enable['thermalprotection'] : info.thermalprotection" @blur="onBlur($event, 'minoutput')">
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
  props: ['nfcInfo', 'enable'],
  components: {
    PageHeader,
    LineEchartsVue
  },
  data() {
    let checkRuler = (rule, value, callback, type) => {
      let text = ''
      let condition = ''
      switch (type) {
        case 'deratingStart':
        case 'deratingend':
          text = '范围为0~4294967295'
          condition = value < 0 || value > 4294967295
          break;
        case 'minoutput':
          text = "范围为0~100"
          condition = value < 0 || value > 100
          break;
        default:
          return ''
      }
      if (!value && value != 0) {
        return callback(new Error('请输入值'));
      }
      if (condition) {
        callback(new Error(text));
      } else {
        callback();
      }
    }
    return {
      config: {
        id: 'thermalMain',
        title: 'Derating Cruve',
        subtext: 'Output(%) vs NFT Resistance(kΩ)',
        areaOpacity: 0,
        yData: [100, 100, 100, 100, 100, 100, 100],
        xData: []
      },
      info: {
        deratingStart: 6500,
        deratingend: 5000,
        minoutput: 50,
        tpderatingstart: '',
        thermalprotection: false
      },
      rules: {
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
    }
  },
  watch: {
    /* nfcInfo: {
      handler(val) {
        this.initInfo(val)
      },
      immediate: true,
      deep: true
    }, */
    info: {
      handler() {
        console.log('infosss')
        this.$nextTick(() => {
          this.$refs['LineEchartsVueRef'].initChart()
        })
      },
      deep: true

    }
  },
  updated() {
    EventBus.$off('constantLumenInit')
    EventBus.$once('constantLumenInit', (data) => {
      this.initInfo(data)

    })
  },
  mounted() {
    this.initInfo(this.nfcInfo)
  },
  methods: {
    inputChange(val) {
      if (!Object.keys(this.nfcInfo).length) return
      const data = this.nfcInfo
      if (val.deratingStart) data.params.tpderatingstart = int2hex(val.deratingStart, 8)
      if (val.deratingend) data.params.tpderatingend = int2hex(val.deratingend, 8)
      if (val.minoutput) data.params.tpminoutput = int2hex(val.minoutput, 2)
      data.params.thermalprotectionenabled = val.thermalprotection ? '01' : '00'
      this.$emit('updateInfo', data)
      this.initInfo(data)
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
        case 'deratingStart':
          if (e.target.value < 0 || e.target.value == '') this.info.deratingStart = 0
          if (e.target.value > 4294967295) this.info.deratingStart = 4294967295
          return
        case 'deratingend':
          if (e.target.value < 0 || e.target.value == '') this.info.deratingend = 0
          if (e.target.value > 4294967295) this.info.deratingend = 4294967295
          return
        case 'minoutput':
          if (e.target.value < 0 || e.target.value == '') this.info.minoutput = 0
          if (e.target.value > 100) this.info.minoutput = 100
          return
      }
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