<template>
  <LazyUModal v-model="isOpen" :fullscreen="isMobile">
    <UCard>
      <template #header
        ><div class="flex items-center justify-between">
          {{ isEditing ? 'Edit' : 'Add' }} Transaction
          <UIcon
            @click="isOpen = false"
            name="i-heroicons-x-mark"
            class="h-6 w-6 cursor-pointer opacity-50 transition-all hover:opacity-100"
          /></div
      ></template>
      <UForm :state="state" :schema="schema" ref="formRef" @submit="save">
        <!-- Amount -->
        <UFormGroup label="Amount" required name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
            :size="isMobile ? 'xl' : 'md'"
          >
            <template #trailing>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                selectedCurrency
              }}</span>
            </template>
          </UInput>
        </UFormGroup>

        <div class="flex justify-between gap-x-4">
          <!-- Transaction Type -->
          <UFormGroup
            label="Transaction Type"
            name="type"
            class="mb-4"
            required
            style="flex: 1"
          >
            <USelect
              :disabled="isEditing"
              placeholder="Select transaction type"
              :options="types"
              v-model="state.type"
              :size="isMobile ? 'xl' : 'md'"
            />
          </UFormGroup>
          <!-- Category for Income -->
          <UFormGroup
            v-if="state.type === 'Income'"
            label="Category"
            name="category"
            class="mb-4"
            required
            style="flex: 1"
          >
            <USelect
              placeholder="Select category"
              :options="categoriesIncome"
              v-model="state.category"
              :size="isMobile ? 'xl' : 'md'"
            />
          </UFormGroup>

          <!-- Category for Expense -->
          <UFormGroup
            v-if="state.type === 'Expense'"
            label="Category"
            name="category"
            class="mb-4"
            required
            style="flex: 1"
          >
            <USelect
              placeholder="Select category"
              :options="categoriesExpense"
              v-model="state.category"
              :size="isMobile ? 'xl' : 'md'"
            />
          </UFormGroup>
        </div>

        <!-- Description -->
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            placeholder="Description"
            v-model="state.description"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <!-- Transaction Date -->
        <UFormGroup
          label="Transaction Date"
          required
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="inputDate"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <div class="flex gap-x-2">
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            :size="isMobile ? 'xl' : 'md'"
            :label="isEditing ? 'Save' : 'Add transaction'"
            :loading="isLoading"
          />
          <UButton
            v-if="isEditing"
            label="Delete"
            color="white"
            variant="ghost"
            :loading="isLoadingDel"
            @click="deleteTransaction"
          />
        </div>
      </UForm>
    </UCard>
  </LazyUModal>
</template>

<script setup>
import { z } from 'zod'
import { types } from '~/constants'
import { format, isSameDay, endOfDay } from 'date-fns'

const isMobile = useIsMobile()

const props = defineProps({
  transaction: {
    type: Object,
    required: false,
  },
  modelValue: Boolean,
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isEditing = computed(() => {
  const editing = !!props.transaction
  if (editing) {
    const [year, month, day] = props.transaction.created_at
      .split('T')[0]
      .split('-')
    inputDate.value = format(
      new Date(Date.UTC(year, month - 1, day)),
      'yyyy-MM-dd',
    )
  }
  return editing
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const isLoading = ref(false)
const isLoadingDel = ref(false)
const emit = defineEmits(['saved', 'update:modelValue'])
const selectedCurrency = useState('sharedSelectedCurrency')

const categoriesExpense = computed(
  () => user.value.user_metadata?.categoriesExpense ?? [],
)
const categoriesIncome = computed(
  () => user.value.user_metadata?.categoriesIncome ?? [],
)

// Function to get the initial category based on the transaction type
const determineCategory = (type) => {
  if (type === 'Income') {
    return categoriesIncome.value.length > 0
      ? categoriesIncome.value[0]
      : undefined
  } else if (type === 'Expense') {
    return categoriesExpense.value.length > 0
      ? categoriesExpense.value[0]
      : undefined
  }
  return undefined
}

const defaultType = types.length > 0 ? types[0] : undefined

const formRef = ref()
const inputDate = ref('')

const state = ref(
  isEditing.value
    ? {
        type: props.transaction.type,
        amount: props.transaction.amount,
        created_at: props.transaction.created_at.split('T')[0],
        description: props.transaction.description || undefined,
        category: props.transaction.category,
      }
    : {
        type: defaultType,
        amount: 0,
        created_at: format(new Date(), 'yyyy-MM-dd'),
        description: undefined,
        category: determineCategory(defaultType),
      },
)

const schema = computed(() => {
  const maxDate = endOfDay(new Date()).toISOString()

  const defaultSchema = z.object({
    created_at: z.string().refine(
      (date) => {
        const dateOnly = date.split('T')[0]
        const maxDateOnly = maxDate.split('T')[0]
        return new Date(dateOnly) <= new Date(maxDateOnly)
      },
      {
        message: 'From the future much?',
      },
    ),
    description: z.string().optional(),
    amount: z.number().positive('Amount needs to be more than 0'),
    category: z.string(),
  })

  return z.object({
    type: z.enum(types),
    ...defaultSchema.shape,
  })
})

async function save() {
  let updatedState

  if (isEditing.value) {
    const [year, month, day] = props.transaction.created_at
      .split('T')[0]
      .split('-')
    const dateChanged = !isSameDay(
      new Date(inputDate.value),
      new Date(Date.UTC(year, month - 1, day)),
    )
    updatedState = { ...state.value }
    if (dateChanged) {
      const transactionDate = new Date(props.transaction.created_at)
      const utcDate = new Date(
        Date.UTC(
          year,
          month - 1,
          day,
          transactionDate.getUTCHours(),
          transactionDate.getUTCMinutes(),
          transactionDate.getUTCSeconds(),
        ),
      )
      updatedState.created_at = `${inputDate.value}T${
        utcDate.toISOString().split('T')[1]
      }`
    } else {
      updatedState.created_at = props.transaction.created_at
    }
  } else {
    updatedState = {
      ...state.value,
      created_at: `${inputDate.value}T${format(new Date(), 'HH:mm:ss')}`,
    }
  }

  const result = schema.value.safeParse(updatedState)

  if (!result.success) {
    console.error(result.error)
    return
  }

  isLoading.value = true

  try {
    const { error } = await supabase
      .from('transactions')
      .upsert(
        { ...result.data, id: props.transaction?.id },
        { returning: 'minimal' },
      )

    if (!error) {
      toast.add({
        title: 'Transaction saved',
        icon: 'i-heroicons-check-circle',
      })
      isOpen.value = false
      emit('saved')
      resetForm()
      return
    }
    throw error
  } catch (e) {
    toast.add({
      title: 'Transaction not saved',
      description: e.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  // Reset state to initial values for a new transaction
  state.value = {
    type: defaultType,
    amount: 0,
    created_at: format(new Date(), 'yyyy-MM-dd'),
    description: undefined,
    category: determineCategory(defaultType),
  }
  inputDate.value = format(new Date(), 'yyyy-MM-dd')
  formRef.value.clear() // Ensure this line correctly clears the form
}

// Method to handle the deletion of a transaction
async function deleteTransaction() {
  isLoadingDel.value = true
  if (props.transaction && props.transaction.id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .match({ id: props.transaction.id })

    if (error) {
      toast.add({
        title: 'Error deleting transaction',
        description: error.message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
    } else {
      toast.add({
        title: 'Transaction deleted',
        icon: 'i-heroicons-check-circle',
      })
      isOpen.value = false
      isLoadingDel.value = false
      emit('saved')
      resetForm()
    }
  }
}

watch(isOpen, (newVal) => {
  if (newVal && !isEditing.value) {
    // For new transactions, set to today's date
    inputDate.value = format(new Date(), 'yyyy-MM-dd')
  }
})

watch(
  () => inputDate.value,
  (newDate) => {
    state.value.created_at = newDate
  },
)

// Watch for changes in the transaction type
watch(
  () => state.value.type,
  (newType) => {
    // Only reset category when not editing an existing transaction
    if (!isEditing.value) {
      state.value.category = determineCategory(newType)
    }
  },
  { immediate: true },
)
</script>
