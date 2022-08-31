<template>
  <div class="current-setting-page">
    <PageHeader :headerText="'Current Setting'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <el-form label-width="120px" :rules="rules" :model="info" ref="formRef">
            <el-form-item label="Max Current">
              <el-input v-model="info.maxcurrent" disabled>
                <span slot="suffix">mA</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Min Current">
              <el-input v-model="info.mincurrent" disabled>
                <span slot="suffix">mA</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Op Current" prop="opcurrent">
              <el-input v-model="info.opcurrent" min="0" max="65536" type="number" :disabled="!enable['opcurrent']"
                @input="checkInput('opcurrent', 1)" @blur="onBlur($event, 'opcurrent')">
                <span slot="suffix">mA</span>
              </el-input>
            </el-form-item>
            <el-form-item label="Output Voltage" prop="outputvoltage">
              <el-input v-model="info.outputvoltage" min="100" max="500" disabled>
                <span slot="suffix">V</span>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="display: inline-block">
        <div v-show="enable['dimtooff']" :class="['setting-status-content', !enable['dimtooff'] ? 'ban-click' : '']"
          @click="changeBox('dimtooff')">
          <img src="@/assets/images/icon_select.png" v-if="info.dimtooff" />
          <span class="circle" v-else />
          Dim to Off
        </div>
      </div>
      <div v-show="enable['softstart']" :class="['setting-container', !enable['softstart'] ? 'ban-click' : '']">
        <div style="display: inline-block">
          <div class="setting-status-content" @click="changeBox('softstart')">
            <img src="@/assets/images/icon_select.png" v-if="info.softstart" />
            <span class="circle" v-else />
            Soft Start
          </div>
        </div>
      </div>
      <div class="setting-container">
        <div v-show="enable['endoflife']" :class="['setting-content', !enable['endoflife'] ? 'ban-click' : '']">
          <div style="display: inline-block">
            <div class="setting-title" @click="changeBox('endoflife')">
              <img src="@/assets/images/icon_select.png" v-if="info.endoflife" />
              <span class="circle" v-else />
              End of Life
            </div>
          </div>
          <div class="lable-container">
            <el-form label-width="120px" :rules="rules" :model="info" ref="formRef2">
              <el-form-item label="Driver Life" prop="driverlife">
                <el-input v-model="info.driverlife" min="3" max="100" type="number"
                  :disabled="!enable['endoflife'] ? !enable['endoflife'] : !info.endoflife" class="suffix-icon"
                  @input="checkInput('driverlife', 2)" @blur="onBlur($event, 'driverlife')">
                  <span slot="suffix">Kh</span>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";
import { hex2int } from "../../utils/method"
import { int2hex } from "../../utils/method"
export default {
  props: ['nfcInfo', 'enable'],
  data() {
    return {
      info: {
        maxcurrent: '',
        mincurrent: '',
        opcurrent: '',
        outputvoltage: '',
        driverlife: '',
        endoflife: false,
        softstart: false,
        dimtooff: false
      },
      rules: {
        "opcurrent": [
          { validator: (rule, value, callback) => this.checkRuler(rule, value, callback, 'opcurrent'), trigger: 'blur' }
        ],
        "outputvoltage": [
          { validator: (rule, value, callback) => this.checkRuler(rule, value, callback, 'outputvoltage'), trigger: 'blur' }
        ],
        "minoutput": [
          { validator: (rule, value, callback) => this.checkRuler(rule, value, callback, 'minoutput'), trigger: 'blur' }
        ],
        "driverlife": [
          { validator: (rule, value, callback) => this.checkRuler(rule, value, callback, 'driverlife'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    PageHeader,
  },
  watch: {
    nfcInfo: {
      handler(val) {
        this.initInfo(val)
      },
      immediate: true,
      deep: true
    },
    info: {
      handler(val) {
        this.inputChange(val)
      },
      deep: true
    }
  },
  methods: {
    inputChange(val) {
      const data = this.nfcInfo
      if (!Object.keys(data).length || val.opcurrent < 0 || val.driverlife < 0) return
      if (val.opcurrent) data.params.operationcurrent = int2hex(val.opcurrent, 4)
      if (val.driverlife) data.params.endoflifeindication = int2hex(val.driverlife, 2)
      data.params.endoflifeenabled = val.endoflife ? '01' : '00'
      data.params.softstartenabled = val.softstart ? '01' : '00'
      data.params.dimtooff = val.dimtooff ? '01' : '00'
      // this.info.outputvoltage = this.getVotage()
      this.$emit('updateInfo', data)
    },
    getVotage() {
      if (!Object.keys(this.nfcInfo).length) return
      const val = this.nfcInfo.params
      let displayoutputvoltage = hex2int(val.minvoltage).toFixed(1) + " - "
      var X, Y;
      const maxvoltage = hex2int(val.maxvoltage)
      const maxpower = hex2int(val.maxpower)
      const operationcurrent = hex2int(val.operationcurrent)
      if (maxvoltage == 0) {
        X = maxvoltage
      }
      else {
        X = maxpower / maxvoltage
      }

      if (operationcurrent == 0) {
        Y = maxpower
      }
      else {
        Y = maxpower * 1000 / operationcurrent
      }
      if (operationcurrent <= X * 1000) {
        displayoutputvoltage += maxvoltage.toFixed(1)
      }
      else {
        displayoutputvoltage += Y.toFixed(1)
      }
      return displayoutputvoltage
    },
    initInfo(value) {
      const len = Object.keys(value).length
      this.info = {
        maxcurrent: len && value.params.maxcurrent ? hex2int(value.params.maxcurrent) : this.info.maxcurrent,
        mincurrent: len && value.params.mincurrent ? hex2int(value.params.mincurrent) : '',
        opcurrent: len && value.params.operationcurrent ? hex2int(value.params.operationcurrent) : '',
        outputvoltage: this.getVotage(),
        driverlife: len && value.params.endoflifeindication ? hex2int(value.params.endoflifeindication) : '',
        endoflife: len && value.params.endoflifeenabled == '01' ? true : false,
        softstart: len && value.params.softstartenabled == '01' ? true : false,
        dimtooff: len && value.params.dimtooff == '01' ? true : false
      }
    },
    changeBox(type) {
      this.info[type] = !this.info[type]
    },
    checkInput(type, formNum) {
      if (formNum == 1) {
        this.$refs['formRef'].validateField(type)
      } else {
        this.$refs['formRef2'].validateField(type)
      }

      this.inputChange(this.info)
    },
    onBlur(e, type) {
      switch (type) {
        case 'opcurrent':{
          let regex = /^[0]+/
          const newValue = Number(e.target.value.replace(regex,""));
          this.info.opcurrent = newValue
          if (newValue < this.info.mincurrent || newValue == '') this.info.opcurrent = this.info.mincurrent
          if (newValue > this.info.maxcurrent) this.info.opcurrent = this.info.maxcurrent
          return
        }
        case 'driverlife':{
          let regex = /^[0]+/
          const newValue = Number(e.target.value.replace(regex,""));
          this.info.driverlife = newValue
          if (newValue < 3 || newValue == '') this.info.driverlife = 3
          if (newValue > 100) this.info.driverlife = 100
          return
        }
      }
    },
    checkRuler(rule, value, callback, type) {
      const info = this.info
      let text = ''
      let condition = ''
      switch (type) {
        case 'opcurrent':
          text = `${info.mincurrent} ~ ${info.maxcurrent}`
          condition = value < info.mincurrent || value > info.maxcurrent
          break;
        case 'driverlife':
          text = "3~100"
          condition = value < 3 || value > 100
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
  }
};
</script>

<style lang="scss" scoped>
.current-setting-page {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;

  .page-container {
    flex: auto;
    background: #ffffff;

    .setting-container {
      border-bottom: 1px solid #dddddd;

      .setting-content {
        max-width: 600px;
        padding: 30px 0 0 30px;

        .lable-container {
          margin-bottom: 30px;

          &>label {
            width: 130px;
            text-align: right;
            margin-right: 20px;
          }

          .suffix-icon {
            /deep/.el-input__suffix {
              display: flex;
              align-items: center;
            }
          }
        }

        .setting-title {
          display: flex;
          margin-bottom: 30px;
          cursor: pointer;

          &>img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }
        }
      }
    }

    .setting-status-content {
      cursor: pointer;
      padding: 30px 0 30px 30px;
      display: flex;
      align-items: center;

      &>img {
        margin-right: 6px;
      }
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
</style>