export const useCurrency = (amount, selectedCurrency) => {
  const currency = computed(() => {
    const numericAmount = typeof amount.value === 'number' ? amount.value : 0
    const currencyCode = selectedCurrency.value || 'EUR' // Default to EUR if no currency is selected

    let formattedCurrency
    if (currencyCode === 'RUB') {
      formattedCurrency = `${new Intl.NumberFormat('ru-RU').format(
        numericAmount,
      )} Р`
    } else {
      formattedCurrency = new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2, // Adjusted for possible decimal places in currencies
      }).format(numericAmount)
    }

    return formattedCurrency
  })

  return {
    currency,
  }
}
