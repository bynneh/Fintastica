<template>
  <div
    v-if="!yearly"
    class="flex flex-col items-center justify-center rounded-2xl bg-[#222223] px-4 py-5 sm:py-6 md:rounded-3xl md:py-6 lg:py-7"
  >
    <div class="mb-0 text-xs font-bold sm:text-base" :class="[color]">
      {{ title }}
    </div>
    <div
      class="mb-1 text-xl font-semibold text-black dark:text-white sm:mb-2 sm:text-2xl"
    >
      <USkeleton
        class="mt-2 h-5 w-28 dark:bg-[#2B2B2C] xs:w-28 sm:h-7 md:w-20 lg:w-32"
        v-if="pending"
      />
      <div v-else>{{ formattedCurrency }}</div>
    </div>

    <div>
      <USkeleton
        class="h-4 w-24 dark:bg-[#2B2B2C] xs:w-24 md:w-20 lg:w-32"
        v-if="pending"
      />
      <div v-else class="flex items-center space-x-[0.3rem] text-sm">
        <UIcon
          :name="icon"
          class="h-4 w-4"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-xs dark:text-gray-500">
          {{ percentageTrend }} vs last month
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="col-span-2 flex items-center justify-center gap-x-5 rounded-2xl bg-[#222223] px-5 py-6 font-semibold xs:gap-x-7 sm:gap-x-6 sm:py-7 md:justify-start md:rounded-3xl lg:gap-x-8 lg:pl-7"
  >
    <Chart :income="income" :expense="expense" />
    <div>
      <div class="mb-2 text-sm text-neutral-500">Total — {{ year }}</div>
      <div class="flex gap-x-4 xs:gap-x-6 md:gap-x-5 lg:gap-x-8">
        <div>
          <div class="green mb-[0.1rem] text-sm font-bold">Income</div>
          <USkeleton
            class="h-7 w-20 dark:bg-[#2B2B2C] xs:w-28 md:w-20 lg:w-32"
            v-if="pending"
          />
          <div v-else class="text-md xs:text-lg lg:text-[1.35rem]">
            {{ formattedCurrencyYearlyIncome }}
          </div>
        </div>
        <div>
          <div class="red mb-[0.1rem] text-sm font-bold">Expense</div>
          <USkeleton
            class="h-7 w-20 dark:bg-[#2B2B2C] xs:w-28 md:w-20 lg:w-32"
            v-if="pending"
          />
          <div v-else class="text-md xs:text-lg lg:text-[1.35rem]">
            {{ formattedCurrencyYearlyExpense }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ---------------- -->
<!-- ---------------- -->
<!-- ---- Script ---- -->
<!-- ---------------- -->
<!-- ---------------- -->

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  income: Number,
  expense: Number,
  color: String,
  pending: Boolean,
  yearly: Boolean,
  year: Number,
})

const selectedCurrency = useState('sharedSelectedCurrency')

const trendingUp = computed(() => props.amount >= props.lastAmount)
const icon = computed(() =>
  trendingUp.value
    ? 'i-heroicons-arrow-trending-up'
    : 'i-heroicons-arrow-trending-down',
)

// Update useCurrency calls to use selectedCurrency
const { currency: formattedCurrency } = useCurrency(
  toRef(props, 'amount'),
  selectedCurrency,
)
const { currency: formattedCurrencyYearlyIncome } = useCurrency(
  toRef(props, 'income'),
  selectedCurrency,
)
const { currency: formattedCurrencyYearlyExpense } = useCurrency(
  toRef(props, 'expense'),
  selectedCurrency,
)

const percentageTrend = computed(() => {
  if (props.lastAmount === 0) {
    return props.amount > 0 ? '100%' : '0%'
  }

  const change = props.amount - props.lastAmount
  const ratio = (change / props.lastAmount) * 100
  return `${Math.round(ratio)}%`
})
</script>

<style scoped>
.green {
  @apply text-mainGreen-400;
}
.red {
  @apply text-mainRed-500;
}
</style>
