<template>
  <div
    class="grid grid-cols-2 border-b border-[#2B2B2B] px-3 py-4 text-base font-bold text-neutral-500 sm:px-0"
  >
    <div>{{ formattedDate }}</div>

    <div class="flex items-center justify-end sm:mr-10">
      {{ currency }}
    </div>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns'

const selectedCurrency = useState('sharedSelectedCurrency')

const props = defineProps({
  date: String,
  transactions: Array,
})

const sum = computed(() => {
  return props.transactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === 'Income' ? transaction.amount : -transaction.amount)
    )
  }, 0)
})

const formattedDate = computed(() => {
  const dateObj = parseISO(props.date)
  return format(dateObj, 'd MMMM, yyyy')
})

const { currency } = useCurrency(sum, selectedCurrency)
</script>
