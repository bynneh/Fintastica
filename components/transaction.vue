<template>
  <div
    class="flex flex-col items-center justify-between gap-x-6 gap-y-2 border-b border-[#2B2B2B] px-3 py-4 text-gray-100 sm:flex-row sm:gap-y-3 sm:px-0 sm:py-4"
  >
    <div class="flex w-full items-center gap-x-1">
      <UIcon :name="icon" :class="[iconColor, 'mr-1 flex-shrink-0 xs:mr-2']" />
      <div class="flex-shrink text-sm text-gray-400 md:text-base">
        {{ transaction.description || (isIncome ? 'Income' : 'Expense') }}
      </div>
    </div>

    <div
      class="flex w-full flex-shrink-0 flex-row-reverse justify-between sm:w-[20rem] sm:flex-row"
    >
      <UBadge
        class="ml-6 cursor-pointer xs:ml-7 sm:m-0"
        color="white"
        v-if="transaction.category"
        @click="
          emit('filteredCategory', transaction.category),
            emit('filteredYearlyCategory', transaction.category)
        "
        >{{ transaction.category }}</UBadge
      >

      <div class="flex items-center space-x-2">
        <div><span v-if="!isIncome">-</span>{{ formattedCurrency }}</div>
        <div>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton
              color="white"
              variant="ghost"
              trailing-icon="i-heroicons-ellipsis-horizontal"
              :loading="isLoading"
            />
            <TransactionModal
              v-model="isOpen"
              :transaction="transaction"
              @saved="emit('edited')"
            />
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object,
})

const selectedCurrency = useState('sharedSelectedCurrency')
const emit = defineEmits([
  'deleted',
  'edited',
  'filteredCategory',
  'filteredYearlyCategory',
])
const isIncome = computed(() => props.transaction.type === 'Income')
const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left',
)
const iconColor = computed(() =>
  isIncome.value ? 'text-mainGreen-400' : 'text-mainRed-500',
)

// Updated useCurrency call to include selectedCurrency
const { currency: formattedCurrency } = useCurrency(
  toRef(props.transaction.amount, 'amount'),
  selectedCurrency,
)

const isOpen = ref(false)

const isLoading = ref(false)
const toast = useToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id)
    toast.add({
      title: 'Transaction deleted',
      icon: 'i-heroicons-check-circle',
    })
    emit('deleted', props.transaction.id)
  } catch (error) {
    toast.add({
      title: 'Transaction deleted',
      icon: 'i-heroicons-exclamation-circle',
    })
  } finally {
    isLoading.value = false
  }
}

const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => (isOpen.value = true),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
]
</script>
