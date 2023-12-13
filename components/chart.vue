<template>
  <div>
    <div :style="myStyles">
      <Doughnut
        v-if="!chartEmpty"
        :data="chartData"
        :options="chartOptions"
        :key="chartKey"
      />
      <div v-else class="chartEmpty"></div>
    </div>
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

const chartKey = useState('sharedChartKey')

const props = defineProps({
  income: Number,
  expense: Number,
})

const chartEmpty = computed(() => props.income === 0 && props.expense === 0)

ChartJS.register(ArcElement, Tooltip, Legend)

const chartData = ref({
  datasets: [
    {
      backgroundColor: ['#CAFD36', '#F44F2B'],
      data: [props.income, props.expense],
      borderWidth: 0,
    },
  ],
  // These labels appear in the legend and in the tooltips when hovering different arcs
  // labels: ['Red', 'Yellow', 'Blue'],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  // animation: false,
  animation: {
    duration: 1200,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
})

const myStyles = computed(() => ({
  height: '80px',
  width: '80px',
}))

// Watch for changes in income and expense to update the chart data
watch(
  () => [props.income, props.expense],
  () => {
    chartData.value.datasets[0].data = [props.income, props.expense]
  },
  { deep: true },
)
</script>

<style scoped>
.chartEmpty {
  width: 80px;
  height: 80px;
  border: 20px solid #1d1d1e;
  border-radius: 50%;
}
</style>
