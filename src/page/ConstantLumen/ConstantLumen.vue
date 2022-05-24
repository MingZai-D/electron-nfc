<template>
  <div class="constant-lumen-page">
    <PageHeader :headerText="'Constant Lumen'" />
    <div class="page-container">
      <div class="setting-container">
        <div class="setting-content">
          <div :class="['setting-title', !enable['constantlumen'] ? 'ban-click' : '']"
            @click="changeBox('constantlumen')">
            <img src="@/assets/images/icon_select.png" v-if="info.constantlumen" />
            <span class="circle" v-else />
            Constant Lumen
          </div>
          <div class="Operational-time">Operational Time {{ info.operationtime.length ?
              info.operationtime[info.operationtime.length - 1][`operationtime${info.operationtime.length - 1}`] : ''
          }} kh</div>
          <el-form label-width="120px" :model="info" ref="formRef">
            <el-form-item label="Output Level">
              <el-form-item v-for="(item, idx) in info.ouputlevl" :key="idx"
                :prop="'ouputlevl.' + idx + ('.ouputlevl' + idx)" :rules="rules[`ouputlevl${idx}`]">
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
                :prop="'operationtime.' + idx + ('.operationtime' + idx)" :rules="rules[`operationtime${idx}`]">
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
  props: ['nfcInfo', 'enable'],
  components: {
    PageHeader,
    LineEchartsVue
  },
  data() {
    let checkRuler = (rule, value, callback, type) => {
      console.log(value, type, 'value')
      let text = ''
      let condition = ''
      switch (type) {
        case 'ouputlevl':
          text = '100~150'
          condition = value < 100 || value > 150
          break;
        case 'operationtime':
          text = '3~100'
          condition = value < 3 || value > 100
          break;
        default:
          return ''
      }
      if (!value) {
        return callback(new Error('请输入值'));
      }
      if (condition) {
        callback(new Error(text));
      } else {
        callback();
      }
    }
    return {
      radio1: '',
      config: {
        id: 'constantMain',
        title: '',
        subtext: '',
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
        constantlumen: false
      },
      rules: {
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
        'operationtime6': [{ validator: (rule, value, callback) => checkRuler(rule, value, callback, 'operationtime'), trigger: 'blur' }],
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
      deep: true,
    }

  },
  updated() {
    EventBus.$off('constantLumenInit')
    EventBus.$once('constantLumenInit', (data) => {
      this.initInfo(data)

    })
  },
  mounted() {
    EventBus.$off('constantLumenInit')
    EventBus.$once('constantLumenInit', (data) => {
      this.initInfo(data)
    })
    this.initInfo(this.nfcInfo)
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
      this.initInfo(data)
    },
    initInfo(value) {
      console.log(this.info,'this.info')
      if (!Object.keys(value).length) return
      const val = value.params
      const lev = this.allHex2int([...val.cloutputlevel14, ...val.cloutputlevel57])
      const time = this.allHex2int([...val.cloperationtime14, ...val.cloperationtime57])
      this.info.constantlumen = val.constantlumenenabled == '01' ? true : false
      this.assignment(lev,'ouputlevl')
      this.assignment(time,'operationtime')
      this.config.yData = lev
      this.config.xData = time
      console.log(this.info,'this.info')
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
      if (type.includes('ouputlevl')) {
        if (e.target.value < 100 || e.target.value == '') this.info.ouputlevl[idx][`ouputlevl${idx}`] = 100
        if (e.target.value > 150) this.info.ouputlevl[idx][`ouputlevl${idx}`] = 150
      } else {
        if (e.target.value < 3 || e.target.value == '') this.info.operationtime[idx][`operationtime${idx}`] = 3
        if (e.target.value > 100) this.info.operationtime[idx][`operationtime${idx}`] = 100
      }
      this.inputChange(this.info)
    },
    assignment(val,type){
      val.map((item,idx)=>{
        this.info[type][idx][`${type}${idx}`] = item
      })
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

        .Operational-time {
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>