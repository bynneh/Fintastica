export const types = ['Expense', 'Income']

export const yearOptions = (() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year > currentYear - 10; year--) {
    years.push(year)
  }
  return years
})()

export const monthOptions = [
  { id: 0, name: 'January' },
  { id: 1, name: 'February' },
  { id: 2, name: 'March' },
  { id: 3, name: 'April' },
  { id: 4, name: 'May' },
  { id: 5, name: 'June' },
  { id: 6, name: 'July' },
  { id: 7, name: 'August' },
  { id: 8, name: 'September' },
  { id: 9, name: 'October' },
  { id: 10, name: 'November' },
  { id: 11, name: 'December' },
]
