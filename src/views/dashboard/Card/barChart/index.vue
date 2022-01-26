<template>
  <div class="barChart"
       ref='chart'></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'barChart',
  mounted () {
    let barCharts = echarts.init(this.$refs.chart)
    barCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [{
        type: 'bar',
        data: [12, 32, 23, 52, 13, 43, 26],
      }],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }

}

</script>

<style>
.barChart {
  width: 100%;
  height: 100%;
}
</style>