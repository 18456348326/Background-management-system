<template>
  <div class="lineChart"
       ref='chart'></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'lineChart',
  mounted () {
    let lineCharts = echarts.init(this.$refs.chart)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [{
        type: 'line',
        data: [12, 32, 23, 52, 13, 43, 26],
        itemStyle: {
          // 拐点透明度
          opacity: 0
        },
        // 设置是否波浪性的平滑曲线
        smooth: true,
        lineStyle: {
          // 线条的颜色
          color: 'purple',
        },
        areaStyle: {
          // 线条下面填充的颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'purple' // 0% 处的颜色
            }, {
              offset: 1, color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }

      }],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    })
  }

}

</script>

<style>
.lineChart {
  width: 100%;
  height: 100%;
}
</style>