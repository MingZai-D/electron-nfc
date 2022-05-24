<template>
  <div ref="main" style="width: 350px;height:300px;"></div>
</template>

<script>
export default {
  props: {
    configs:{
      type:Object,
      required:true
    }
  },
  methods: {
    initChart() {
    let myChart = this.$echarts.getInstanceByDom(this.$refs.main); //有的话就获取已有echarts实例的DOM节点。
     if (myChart == null) { // 如果不存在，就进行初始化。
         myChart = this.$echarts.init(this.$refs.main);
     }
      // const myChart = this.$echarts.init(this.$refs.main);
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.configs.title,
          subtext: this.configs.subtext,
          top: 0,
          left: '30%',
          textStyle: {
            fontSize: 16
          },
          subtextStyle: {
            align: 'center',
          }
        },
        grid: {
          x: 40
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.configs.xData,
          splitLine: { //网格线
            show: true
          },
        },
        yAxis: {
          // type:'value',
          name: this.configs.areaOpacity ? '' : '%',
          axisLabel: {
            formatter: (value) => {
              return value
            }
          },
          min: 0,
          max: () => {
            return this.configs.areaOpacity ? null : 100
          }
        },
        series: [{
          name: '',
          type: 'line',
          data: this.configs.yData,
          areaStyle: { color: '#ff6600', opacity: this.configs.areaOpacity }
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

    },
    
  },
  mounted() {
    this.initChart();
  }
}
</script>

<style>
</style>