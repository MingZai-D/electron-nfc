<template>
  <div class="constant-lumen-page">
    <PageHeader :headerText="'Constant Lumen'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <div style="display: inline-block">
            <div :class="['setting-title', !enable['constantlumen'] ? 'ban-click' : '']"
            @click="changeBox('constantlumen')">
              <img src="@/assets/images/icon_select.png" v-if="info.constantlumen" />
              <span class="circle" v-else />
              Constant Lumen
            </div>
          </div>
          <div class="Operational-time">Operating Time 
            <el-input class="reset-inputs" size="mini" :value="info.operationtime.length ?
              info.operationtime[info.operationtime.length - 1][`operationtime${info.operationtime.length - 1}`] : ''"></el-input>
            kh</div>
          <div class="Operational-time">
            100% current
            <el-input class="reset-inputs" size="mini" :value="info.opcurrent">
            </el-input> mA
          </div>
          <el-form label-width="120px" :model="info" ref="formRef">
            <el-form-item label="Output Level">
              <el-form-item v-for="(item, idx) in info.ouputlevl" :key="idx"
                :prop="'ouputlevl.' + idx + ('.ouputlevl' + idx)" :rules="initRulers(`ouputlevl${idx}`)">
                <el-input size="mini" class="reset-input" type="number" v-model="item[`ouputlevl${idx}`]"
                  @input="inputChange(info, 'ouputlevl.' + idx + ('.ouputlevl' + idx))"
                  @blur="onBlur($event, idx, 'ouputlevl.' + idx)"
                  :disabled="!enable['constantlumen'] ? !enable['constantlumen'] : !info.constantlumen"
                  ></el-input>
              </el-form-item>
              %
            </el-form-item>
            <el-form-item label="Operating Time">
              <el-form-item v-for="(item, idx) in info.operationtime" :key="idx"
                :prop="'operationtime.' + idx + ('.operationtime' + idx)" :rules="initRulers(`operationtime${idx}`)">
                <el-input size="mini" class="reset-input" type="number" v-model="item[`operationtime${idx}`]"
                  @input="inputChange(info, 'operationtime.' + idx + ('.operationtime' + idx))"
                  @blur="onBlur($event, idx, 'operationtime.' + idx)"
                  :disabled="!enable['constantlumen'] ? !enable['constantlumen'] : !info.constantlumen"
                  >
                </el-input>
              </el-form-item>
              kh
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div style="padding:30px 0 0 30px">
        <LineEchartsVue :configs="config" ref="LineEchartsVueRef" />
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";
import LineEchartsVue from "@/components/LineEcharts.vue"
import { EventBus } from "@/utils/eventBus.js"
import { hex2int } from "../../utils/method"
import { int2hex } from "../../utils/method"
export default {
  props: ['nfcInfo', 'enable','readTag'],
  components: {
    PageHeader,
    LineEchartsVue
  },
  data() {
    return {
      radio1: '',
      minimum: 0,
      maximum: 0,
      config: {
        id: 'constantMain',
        title: 'Constant Lumen Timetable',
        subtext: 'Output(%) vs Operating Time(KH)',
        areaOpacity: 1,
        yData: [],
        xData: []
      },
      info: {
        ouputlevl: [
          { 'ouputlevl0': '' },
          { 'ouputlevl1': '' },
          { 'ouputlevl2': '' },
          { 'ouputlevl3': '' },
          { 'ouputlevl4': '' },
          { 'ouputlevl5': '' },
          { 'ouputlevl6': '' },
        ],
        operationtime: [
          { 'operationtime0': '' },
          { 'operationtime1': '' },
          { 'operationtime2': '' },
          { 'operationtime3': '' },
          { 'operationtime4': '' },
          { 'operationtime5': '' },
          { 'operationtime6': '' },
        ],
        constantlumen: false,
        opcurrent:''
      },
    }
  },
  watch: {
    info: {
      handler() {
        this.$nextTick(() => {
          this.$refs['LineEchartsVueRef'].initChart()
        })
      },
      deep: true,
    },
    readTag(){
      this.initInfo(this.nfcInfo)
    }

  },
  activated(){
    this.initInfo(this.nfcInfo)
    EventBus.$off('constantLumenInit')
    EventBus.$once('constantLumenInit', (data) => {
      this.initInfo(data)
    })
    
  },
  methods: {
    allHex2int(list) {
      if (!(Array.isArray(list) && list.length)) return
      let arr = []
      list.forEach((item) => {
        arr.push(hex2int(item))
      })
      return arr
    },
    allInt2hex(list) {
      if (!(Array.isArray(list) && list.length)) return
      let arr = []
      list.forEach((item) => {
        arr.push(int2hex(item, 2))
      })
      return arr
    },
    inputChange(val, type) {
      if (type) this.$refs.formRef.validateField(type)
      this.config.yData = val.ouputlevl.map((item, idx) => item[`ouputlevl${idx}`])
      this.config.xData = val.operationtime.map((item, idx) => item[`operationtime${idx}`])
      if (!Object.keys(this.nfcInfo).length) return
      const data = this.nfcInfo
      data.params.cloutputlevel14 = this.allInt2hex(this.config.yData).slice(0, 4)
      data.params.cloutputlevel57 = this.allInt2hex(this.config.yData).slice(4, 7)
      data.params.cloperationtime14 = this.allInt2hex(this.config.xData).slice(0, 4)
      data.params.cloperationtime57 = this.allInt2hex(this.config.xData).slice(4, 7)
      data.params.constantlumenenabled = val.constantlumen ? '01' : '00'
      this.$emit('updateInfo', data)
    },
    initInfo(value) {
      if (!Object.keys(value).length) return
      const val = value.params
      const minCurrent = hex2int(value.params.mincurrent)
      const maxCurrent = hex2int(value.params.maxcurrent)
      const opCurrent = hex2int(value.params.operationcurrent)
      this.minimum  = parseInt(minCurrent / opCurrent * 100)
      this.maximum = maxCurrent / opCurrent * 100 > 150 ? 150 : parseInt(maxCurrent / opCurrent * 100)
      const lev = this.allHex2int([...val.cloutputlevel14, ...val.cloutputlevel57])
      const time = this.allHex2int([...val.cloperationtime14, ...val.cloperationtime57])
      this.info.constantlumen = val.constantlumenenabled == '01' ? true : false
      this.info.opcurrent = hex2int(value.params.operationcurrent)
      this.assignment(lev,'ouputlevl')
      this.assignment(time,'operationtime')
      this.config.yData = lev
      this.config.xData = time
    },
    changeBox(type) {
      this.info[type] = !this.info[type]
      this.inputChange(this.info)
    },
    allString(list) {
      let arr = []
      list.map(ele => {
        arr.push(String(ele))
      })
      return arr
    },

    onBlur(e, idx, type) {
      let regex = /^[0]+/
      const newValue = Number(e.target.value.replace(regex,""));
      if (type.includes('ouputlevl')) {
        this.info.ouputlevl[idx][`ouputlevl${idx}`] = newValue
        if (newValue < this.minimum || newValue == '') this.info.ouputlevl[idx][`ouputlevl${idx}`] = this.minimum
        if (newValue > this.maximum) this.info.ouputlevl[idx][`ouputlevl${idx}`] = this.maximum
      } else {
        this.info.operationtime[idx][`operationtime${idx}`] = newValue
        if (newValue < 3 || newValue == '') this.info.operationtime[idx][`operationtime${idx}`] = 3
        if (newValue > 100) this.info.operationtime[idx][`operationtime${idx}`] = 100
      }
      this.inputChange(this.info)
    },
    assignment(val,type){
      val.map((item,idx)=>{
        this.info[type][idx][`${type}${idx}`] = item
      })
    },
    // Output Level Operating Time 校验
    initRulers(id){
      let checkRuler = (rule, value, callback, type) => {
      let text = ''
      let condition = ''
      switch (type) {
        case 'ouputlevl':
          text = `${this.minimum}~${this.maximum}`
          condition = value < this.minimum || value > this.maximum
          break;
        case 'operationtime':
          text = '3~100'
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
    let rules = {
        'ouputlevl0': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl1': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl2': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl3': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl4': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl5': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'ouputlevl6': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'ouputlevl'), trigger: 'blur' }],
        'operationtime0': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime1': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime2': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime3': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime4': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime5': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
        'operationtime6': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }]
      }
    return rules[id]
    }
  },

};
</script>

<style lang="scss" scoped>
.constant-lumen-page {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .page-container {
    flex: auto;
    background: #ffffff;

    .setting-container {
      border-bottom: 1px solid #dddddd;

      .setting-content {
        max-width: 600px;
        padding: 30px 0 0 30px;

        /deep/.el-form-item__content {
          display: flex;
        }

        .rest-botton {
          color: #dddddd;

          .el-radio-button {
            /deep/.el-radio-button__inner {
              border-left: 1px solid #DCDFE6;
              margin-left: 5px;
              padding: 6px;
              border-radius: 0;
              box-shadow: none;
            }
          }

        }

        .reset-input {
          width: 40px;
          margin-right: 10px;

          /deep/.el-input__inner {
            text-align: center;
            padding: 0;
          }
        }

        .setting-title {
          display: flex;
          margin-bottom: 20px;
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

        .Operational-time {
          margin-bottom: 20px;
          .reset-inputs{
            width: 40px;
          margin-right: 10px;

          /deep/.el-input__inner {
            text-align: center;
            padding: 0;
          }
          }
        }
        .Operational-current{
          margin-bottom: 20px;
          .reset-inputs{
            width: 80px;

            /deep/.el-input__suffix {
              display: flex;
              align-items: center;
            }
        
          }
        }
      }
    }
  }
}
</style>