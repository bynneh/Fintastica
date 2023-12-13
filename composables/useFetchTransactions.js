import {
  subMonths,
  startOfMonth,
  endOfMonth,
  formatISO,
  startOfDay,
  endOfDay,
  addDays,
  startOfYear,
  endOfYear,
} from 'date-fns'

export const useFetchTransactions = () => {
  const supabase = useSupabaseClient()
  const userId = useSupabaseUser().value.id
  const selectedYear = useState('sharedSelectedYear')
  const selectedMonth = useState('sharedSelectedMonth')
  const selectedStartDay = useState('sharedSelectedStartDay')
  const selectedEndDay = useState('sharedSelectedEndDay')
  const yearlyTransactions = ref([])
  const pending = ref(false)
  const chartKey = useState('sharedChartKey')

  // Helper function to format date to ISO string
  const formatDate = (date) => formatISO(date, { representation: 'date' })

  // Fetch transactions for the entire year
  const fetchYearlyTransactions = async () => {
    const startDate = startOfYear(new Date(selectedYear.value, 0))
    const endDate = endOfYear(new Date(selectedYear.value, 11))

    try {
      const { data } = await useAsyncData('yearlyTransactions', async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .eq('user_id', userId)
          .gte('created_at', formatDate(startDate))
          .lte('created_at', formatDate(endDate))
          .order('created_at', { ascending: false })
        if (error) throw new Error(error.message)
        return data || []
      })

      return data.value
    } catch (error) {
      console.error('Error fetching yearly transactions:', error.message)
    }
  }

  // Refresh transactions data
  const refresh = async () => {
    pending.value = true
    yearlyTransactions.value = await fetchYearlyTransactions()
    chartKey.value++
    pending.value = false
  }

  // Watch for changes in date selection and refresh transactions
  watch(selectedYear, refresh)

  // Group transactions by date
  const transactionsGroupedByDate = (transactions) =>
    transactions.reduce((grouped, transaction) => {
      const date = transaction.created_at.split('T')[0]
      grouped[date] = grouped[date] || []
      grouped[date].push(transaction)
      return grouped
    }, {})

  // Compute financial metrics from transactions
  const computeFinancialMetrics = (transactions) => {
    let incomeTotal = 0
    let expenseTotal = 0
    let incomeCount = 0
    let expenseCount = 0

    transactions.forEach((t) => {
      if (t.type === 'Income') {
        incomeTotal += t.amount
        incomeCount++
      } else if (t.type === 'Expense') {
        expenseTotal += t.amount
        expenseCount++
      }
    })

    return {
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    }
  }

  const getCurrentMonthTransactions = () => {
    const startDate = selectedStartDay.value
      ? new Date(
          Date.UTC(
            selectedYear.value,
            selectedMonth.value,
            selectedStartDay.value,
          ),
        )
      : startOfMonth(
          new Date(Date.UTC(selectedYear.value, selectedMonth.value)),
        )
    let endDate = selectedEndDay.value
      ? new Date(
          Date.UTC(
            selectedYear.value,
            selectedMonth.value,
            selectedEndDay.value,
          ),
        )
      : endOfMonth(new Date(Date.UTC(selectedYear.value, selectedMonth.value)))

    // Add one day to the endDate to include the entire day
    endDate = addDays(endDate, 1)

    // Filter the yearly transactions to match the selected date range
    return yearlyTransactions.value.filter(
      (transaction) =>
        new Date(transaction.created_at) >= startDate &&
        new Date(transaction.created_at) < endDate,
    )
  }

  const getLastMonthTransactions = () => {
    const lastMonth = subMonths(
      new Date(selectedYear.value, selectedMonth.value, 1),
      1,
    )
    const lastMonthStart = startOfMonth(lastMonth)
    const lastMonthEnd = endOfMonth(lastMonth)
    return yearlyTransactions.value.filter(
      (transaction) =>
        new Date(transaction.created_at) >= lastMonthStart &&
        new Date(transaction.created_at) <= lastMonthEnd,
    )
  }

  const currentMonthTransactions = computed(getCurrentMonthTransactions)
  const lastMonthTransactions = computed(getLastMonthTransactions)

  return {
    currentMonthTransactions,
    lastMonthTransactions,
    yearlyTransactions,
    pending,
    refresh,
    transactionsGroupedByDate,
    computeFinancialMetrics,
  }
}
