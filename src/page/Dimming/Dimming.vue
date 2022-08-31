<template>
  <div class="dimming-page">
    <PageHeader :headerText="'Dimming'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <div style="display: inline-block">
            <div :class="['setting-title', !enable['diming'] ? 'ban-click' : '']" @click="changeBox('diming')">
              <img src="@/assets/images/icon_select.png" v-if="info.diming" />
              <span class="circle" v-else />
              Dimming
            </div>
          </div>
          <el-form label-width="120px" ref="formRef" :model="info" :rules="rules">
            <el-form-item label="Dimming Level" prop="diminglevel">
              <el-input v-model="info.diminglevel" type="number"
                :disabled="!enable['diming'] ? !enable['diming'] : !info.diming" @input="checkInput('diminglevel')"
                @blur="onBlur($event, 'diminglevel')">
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
import { hex2int, int2hex } from "../../utils/method"
export default {
  props: ['nfcInfo', 'enable', 'readTag'],
  components: {
    PageHeader,
    LineEchartsVue
  },
  data() {
    let checkRuler = (rule, value, callback, type) => {
      let text = ''
      switch (type) {
        case 'diminglevel':
          text = '1~100'
          break;
        default:
          return ''
      }
      if (value < 1 || value > 100 || !value) {
        callback(new Error(text));
      } else {
        callback();
      }
    }
    return {
      config: {
        id: 'dimingMain',
        title: 'Dimming Curve',
        subtext: 'Output(%) vs Dimming Input(V)',
        areaOpacity: 0,
        yData: [100, 100, 100, 100],
        xData: [0, 1, 9, 10]
      },
      info: {
        diminglevel: '',
        diming: false
      },
      rules: {
        'diminglevel': [
          { validator: (rule, value, callback) => checkRuler(rule, value, callback, 'diminglevel'), trigger: 'blur' }
        ]
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
      if (val.diminglevel < 0) return
      this.config.yData[0] = 100 * (val.diminglevel * 0.01)
      this.config.yData[1] = 100 * (val.diminglevel * 0.01)
      if (!Object.keys(this.nfcInfo).length) return
      const data = this.nfcInfo
      if (val.diminglevel) {
        data.params.dimingleel = int2hex(val.diminglevel, 2)
        data.params.dimingenabled = val.diming ? '01' : '00'
        this.$emit('updateInfo', data)
      }
    },
    initInfo(value) {
      if (!Object.keys(value).length) return
      const val = value.params
      this.info = {
        diming: hex2int(val.dimingenabled) == '01' ? true : false,
        diminglevel: val.dimingleel ? hex2int(val.dimingleel) : ''
      }
      this.config.yData[0] = 100 * (hex2int(val.dimingleel) * 0.01)
      this.config.yData[1] = 100 * (hex2int(val.dimingleel) * 0.01)
    },
    changeBox(type) {
      this.info[type] = !this.info[type]
      this.inputChange(this.info)

    },
    checkInput(type) {
      this.inputChange(this.info)
      this.$refs['formRef'].validateField(type)
    },
    onBlur(e, type) {
      let regex = /^[0]+/
      const newValue = e.target.value.replace(regex, "");
      this.info[type] = newValue
      if (newValue < 1 || newValue == '') this.info[type] = 1
      if (newValue > 100) this.info[type] = 100
      this.inputChange(this.info)
    }
  },
}
</script>

<style lang="scss" scoped>
.dimming-page {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .page-container {
    flex: auto;

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