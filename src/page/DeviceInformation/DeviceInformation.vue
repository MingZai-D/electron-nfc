<template>
  <div class="device-information-page">
    <PageHeader :headerText="'Device Information'" />
    <div class="page-container">
      <div class="connect-status" v-if="isLink">
        <img src="@/assets/images/icon_connect.png" />
        <p>NFC Device Connected</p>
      </div>
      <div class="connect-status" v-else>
        <img src="@/assets/images/icon_unconnect.png" />
        <p>NFC Device Not Connected</p>
      </div>
      <div class="connect-value">
        <el-form label-width="130px">
          <el-form-item label="Company Name">
            <el-input v-model="info.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="Device Model">
            <el-input v-model="info.model" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue"
import {modeList} from "../../../NodeMapping/mapping"
import { hex2int } from "../../utils/method"
export default {
  props: ['nfcInfo', 'isLink'],
  components: {
    PageHeader
  },
  data() {
    return {
      info: {
        name: '',
        model: ''
      }
    }
  },
  watch: {
    nfcInfo: {
      handler(val) {
        if (Object.keys(val).length) {
          this.info = {
            name: val['Company Code'] == "01" ? 'Ledvance' : 'unknown',
            model: modeList[hex2int(val['driver type'])]? modeList[hex2int(val['driver type'])].modelName : 'unknown'
          }
        }
      },
      immediate: true,
      deep: true
    },
    isLink: {
      handler(val) {
        this.isLink = val
      },
      immediate: true,
      deep: true
    }
  },
  updated() {
  }
}
</script>

<style lang="scss" scoped>
.device-information-page {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;

  .page-container {
    flex: auto;

    .connect-status,
    .connect-value {
      max-width: 600px;
      text-align: center;
    }

    .connect-status {
      padding-top: 60px;

      &>p {
        margin-bottom: 60px;
      }
    }
  }
}
</style>