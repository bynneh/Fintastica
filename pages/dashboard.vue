<template>
  <section class="mb-7 flex items-center justify-between sm:mb-8">
    <div class="flex w-full flex-col items-center justify-between md:flex-row">
      <h1 class="mb-5 text-3xl font-extrabold md:mb-0 lg:text-5xl">Summary</h1>
      <div
        class="flex flex-col items-center justify-between gap-x-3 gap-y-3 sm:flex-row md:grid-cols-2"
      >
        <div class="flex gap-x-3">
          <USelectMenu
            v-model="selectedYear"
            :options="yearOptions"
            class="w-[6rem]"
          />
          <USelectMenu
            v-model="selectedMonth"
            :options="monthOptionsFiltered"
            value-attribute="id"
            option-attribute="name"
            class="w-[9rem]"
          >
            <template #label>
              {{ currentMonth.name }}
            </template>
          </USelectMenu>
        </div>
        <div class="flex flex-row items-center gap-x-2">
          <USelectMenu
            v-model="selectedStartDay"
            :options="startDayOptions"
            class="w-[4.6rem] cursor-pointer"
          />-
          <USelectMenu
            v-model="selectedEndDay"
            :options="endDayOptions"
            class="w-[4.8rem]"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="mb-8 grid grid-cols-2 gap-2 md:grid-cols-4 lg:mb-9 lg:gap-3">
    <Trend
      color="green"
      title="Income"
      :amount="financialMetricsFiltered.incomeTotal"
      :last-amount="lastMonthMetrics.incomeTotal"
      :pending="pending"
      :selectedCurrency="selectedCurrency"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="financialMetricsFiltered.expenseTotal"
      :last-amount="lastMonthMetrics.expenseTotal"
      :pending="pending"
      :selectedCurrency="selectedCurrency"
    />
    <Trend
      :income="yearlyFinancialMetrics.incomeTotal"
      :expense="yearlyFinancialMetrics.expenseTotal"
      :pending="pending"
      :yearly="true"
      :year="selectedYear"
      :selectedCurrency="selectedCurrency"
      :filteredCategory="categoryFilter"
    />
  </section>

  <section
    class="mb-4 flex flex-col items-center justify-between sm:mb-6 sm:flex-row"
  >
    <div class="mb-5 flex flex-col items-center sm:mb-0 sm:items-start">
      <h2 class="text-xl font-bold md:mb-1">
        {{ currentMonth.name }}, {{ selectedYear }}
      </h2>
      <div class="text-md dark:text-neutral-600">
        You have {{ financialMetrics.incomeCount }} incomes and
        {{ financialMetrics.expenseCount }} expenses this period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refresh()" />
      <div class="flex items-center gap-x-2">
        <UButton
          v-if="categoryFilter"
          color="white"
          variant="solid"
          size="md"
          label="Reset Filters"
          @click="resetFilters"
        />
        <UButton
          icon="i-heroicons-plus-circle"
          color="primary"
          variant="solid"
          label="Add"
          size="md"
          @click="isOpen = true"
        />
      </div>
    </div>
  </section>

  <section v-if="!pending">
    <div
      v-for="(transactionsOnDay, date) in filteredTransactionsByDate"
      :key="date"
      class="mb-6 sm:mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="handleTransactionDeleted(transaction.id)"
        @filteredCategory="toggleCategoryFilter(transaction.category)"
        @filteredYearlyCategory="
          toggleCategoryYearlyFilter(transaction.category)
        "
        @edited="refresh()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="mb-2 h-8 w-full" v-for="i in 4" :key="i" />
  </section>
</template>

<!-- ---------------- -->
<!-- ---------------- -->
<!-- ---- Script ---- -->
<!-- ---------------- -->
<!-- ---------------- -->

<script setup>
useRedirectIfAnon()
useSeoMeta({
  title: 'Dashboard - Fintastica',
  description:
    'View your financial summary, transactions, and trends on the Fintastica Dashboard.',
})

import { yearOptions, monthOptions } from '~/constants'
import { getDaysInMonth } from 'date-fns'

const now = new Date()

// Helper function to determine the initial end day
const initialEndDay = () => {
  const daysInCurrentMonth = getDaysInMonth(now)
  return now.getFullYear() === selectedYear.value &&
    now.getMonth() === selectedMonth.value
    ? now.getDate()
    : daysInCurrentMonth
}

const user = useSupabaseUser()

const isOpen = useState('sharedIsOpen', () => false)
const selectedYear = useState('sharedSelectedYear', () => now.getFullYear())
const selectedMonth = useState('sharedSelectedMonth', () => now.getMonth())
const selectedStartDay = useState('sharedSelectedStartDay', () => 1)
const selectedEndDay = useState('sharedSelectedEndDay', initialEndDay)
const categoryFilter = ref(null)
const categoryYearlyFilter = ref(null)
const chartKey = useState('sharedChartKey', () => 0)

const selectedCurrency = useState(
  'sharedSelectedCurrency',
  () => user.value.user_metadata?.selectedCurrency ?? 'EUR',
)

// Function to filter month options based on the current year
const filterMonthOptions = (year) => {
  return year === now.getFullYear()
    ? monthOptions.filter((month) => month.id <= now.getMonth())
    : monthOptions
}

// Computed properties for UI elements
const monthOptionsFiltered = computed(() =>
  filterMonthOptions(selectedYear.value),
)
const currentMonth = computed(() =>
  monthOptions.find((month) => month.id === selectedMonth.value),
)

// Function to generate day options
const generateDayOptions = (start, end, includeFutureDays) => {
  if (
    !includeFutureDays &&
    selectedYear.value === now.getFullYear() &&
    selectedMonth.value === now.getMonth()
  ) {
    end = Math.min(end, now.getDate())
  }
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

const startDayOptions = computed(() =>
  generateDayOptions(1, selectedEndDay.value, false),
)
const endDayOptions = computed(() => {
  const daysInMonth = getDaysInMonth(
    new Date(selectedYear.value, selectedMonth.value),
  )
  return generateDayOptions(selectedStartDay.value, daysInMonth, false)
})

// Fetching and computing transaction data
const {
  currentMonthTransactions,
  lastMonthTransactions,
  yearlyTransactions,
  pending,
  refresh,
  transactionsGroupedByDate,
  computeFinancialMetrics,
} = useFetchTransactions()

const lastMonthMetrics = computed(() =>
  computeFinancialMetrics(lastMonthTransactions.value),
)
const financialMetrics = computed(() =>
  computeFinancialMetrics(currentMonthTransactions.value),
)
const { filteredTransactions: filteredYearlyTransactions } = useCategoryFilter(
  yearlyTransactions,
  categoryYearlyFilter,
)
const yearlyFinancialMetrics = computed(() =>
  computeFinancialMetrics(filteredYearlyTransactions.value),
)

// Computing filtered transactions and financial metrics
const { filteredTransactions } = useCategoryFilter(
  currentMonthTransactions,
  categoryFilter,
)

const filteredTransactionsByDate = computed(() =>
  transactionsGroupedByDate(filteredTransactions.value),
)

const financialMetricsFiltered = computed(() =>
  computeFinancialMetrics(filteredTransactions.value),
)

// Transaction handling: deletion, category filtering, and resetting filters
const handleTransactionDeleted = (transactionId) => {
  const index = yearlyTransactions.value.findIndex(
    (t) => t.id === transactionId,
  )
  if (index > -1) {
    yearlyTransactions.value.splice(index, 1)
    chartKey.value++
  }
}

const toggleCategoryFilter = (category) => {
  categoryFilter.value = categoryFilter.value === category ? null : category
  chartKey.value++
}

const toggleCategoryYearlyFilter = (category) => {
  categoryYearlyFilter.value =
    categoryYearlyFilter.value === category ? null : category
  chartKey.value++
}

function resetFilters() {
  categoryFilter.value = null
}

// Watchers to handle changes in date selections
watch(
  [selectedYear, selectedMonth, selectedStartDay, selectedEndDay],
  () => {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear.value, selectedMonth.value),
    )
    selectedStartDay.value = Math.min(selectedStartDay.value, daysInMonth)
    selectedEndDay.value = Math.min(selectedEndDay.value, daysInMonth)
  },
  { immediate: true },
)

// Initialization
onMounted(async () => {
  await refresh().catch((error) =>
    console.error('Failed to refresh data:', error),
  )
})
</script>
