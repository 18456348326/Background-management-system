<template>
  <el-card class="box-card"
           style="margin:10px 0px">
    <div slot="header"
         class="clearfix">
      <el-tabs class="tab"
               v-model="activeName">
        <el-tab-pane label='销售额'
                     name='销售额'></el-tab-pane>
        <el-tab-pane label='访问量'
                     name='访问量'></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span>今日</span>
        <span>本周</span>
        <span>本月</span>
        <span>本年</span>
        <el-date-picker type="daterange"
                        class="date"
                        size='mini'
                        range-separator="|"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="18">
          <div class="charts"
               ref="charts"></div>
        </el-col>
        <el-col :span="6"
                class="right">
          <h3>门店销售额排名</h3>
          <ul>
            <li>
              <span class="index">1</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span class="index">2</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span class="index">3</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="value">1241241</span>
            </li>

          </ul>

        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Sale',
  data () {
    return {
      activeName: '销售额'
    }
  },
  mounted () {
    let mycharts = echarts.init(this.$refs.charts)
    mycharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 110, 98, 23, 34, 56]
        }
      ]
    })
  }
}
</script>

<style scoped>
.el-tabs__item {
  font-size: 18px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 200px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0%;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.index {
  border-radius: 50%;
  background: black;
  color: white;
}
span:first-child {
  text-align: center;
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 20px;
}
.value {
  float: right;
}
</style>