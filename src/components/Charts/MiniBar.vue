<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y+'%'
  })
]

const scale = [{
  dataKey: 'x',
  title: '使用项',
}, {
  dataKey: 'y',
  title: '使用率',
}]

export default {
  name: 'MiniBar',
  data () {
    return {
      data:[],
      tooltip,
      scale,
      height: 100
    }
  },
  methods: {
    setData(data) {
      this.data = data
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
