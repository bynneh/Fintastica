export function useCategoryFilter(transactions, categoryFilter) {
  const filteredTransactions = computed(() => {
    if (categoryFilter.value) {
      return transactions.value.filter(
        (transaction) => transaction.category === categoryFilter.value,
      )
    }
    return transactions.value
  })

  return {
    filteredTransactions,
  }
}
