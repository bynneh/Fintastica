<template>
  <h1 class="mb-6 text-4xl font-semibold">Settings</h1>

  <h2 class="mb-4 text-xl">Choose your currency</h2>
  <USelectMenu
    class="mb-7"
    v-model="selectedCurrency"
    :options="['EUR', 'USD', 'RUB', 'JPY', 'GBP', 'AUD']"
    :size="isMobile ? 'xl' : 'md'"
  />

  <!-- Expense Categories -->
  <h2 class="mb-4 text-xl">Expense Categories</h2>
  <UForm
    :schema="schemaExpense"
    :state="stateExpense"
    @submit="addExpenseCategory"
  >
    <UFormGroup class="mb-5" name="newExpenseCategory">
      <div class="flex space-x-2">
        <UInput
          v-model="stateExpense.newExpenseCategory"
          placeholder="Add new Expense Category"
          class="w-full"
          :size="isMobile ? 'xl' : 'md'"
        />
        <UButton
          icon="i-heroicons-plus-circle"
          type="submit"
          color="primary"
          label="Add"
          :size="isMobile ? 'xl' : 'md'"
        />
      </div>
    </UFormGroup>

    <ul>
      <li
        v-for="(category, index) in state.categoriesExpense"
        :key="`expense-${index}`"
        class="mb-2 flex items-center justify-between border-b py-2 pr-3 text-sm dark:border-[#2B2B2B]"
      >
        <div>{{ category }}</div>
        <div>
          <UIcon
            class="cursor-pointer"
            @click="deleteExpenseCategory(index)"
            name="i-heroicons-trash"
          />
        </div>
      </li>
    </ul>
  </UForm>

  <!-- Income Categories -->
  <h2 class="mb-4 mt-10 text-xl">Income Categories</h2>
  <UForm
    :schema="schemaIncome"
    :state="stateIncome"
    @submit="addIncomeCategory"
  >
    <UFormGroup class="mb-5" name="newIncomeCategory">
      <div class="flex space-x-2">
        <UInput
          v-model="stateIncome.newIncomeCategory"
          placeholder="Add new Income Category"
          class="w-full"
          :size="isMobile ? 'xl' : 'md'"
        />
        <UButton
          icon="i-heroicons-plus-circle"
          type="submit"
          label="Add"
          :size="isMobile ? 'xl' : 'md'"
        />
      </div>
    </UFormGroup>
    <ul>
      <li
        v-for="(category, index) in state.categoriesIncome"
        :key="`income-${index}`"
        class="mb-2 flex items-center justify-between border-b py-2 pr-3 dark:border-[#2B2B2B]"
      >
        <div>{{ category }}</div>
        <div>
          <UIcon
            class="cursor-pointer"
            @click="deleteIncomeCategory(index)"
            name="i-heroicons-trash"
          />
        </div>
      </li>
    </ul>
  </UForm>
</template>

<script setup>
import { z } from 'zod'
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const pending = ref(false)
const selectedCurrency = useState(
  'sharedSelectedCurrency',
  () => user.value.user_metadata?.selectedCurrency ?? 'EUR',
)

// Define the state
const state = ref({
  categoriesExpense: user.value.user_metadata?.categoriesExpense ?? [],
  categoriesIncome: user.value.user_metadata?.categoriesIncome ?? [],
})

const stateExpense = ref({
  newExpenseCategory: '',
})

// Zod schema for category validation
const schemaExpense = z.object({
  newExpenseCategory: z.string().max(20).optional(),
})

const stateIncome = ref({
  newIncomeCategory: '',
})

// Zod schema for category validation
const schemaIncome = z.object({
  newIncomeCategory: z.string().max(20).optional(),
})

// Zod schema for currency validation
const schemaCurrency = z.enum(['EUR', 'USD', 'RUB', 'JPY', 'GBP', 'AUD'])

// Function to save categories to Supabase
const saveCategories = async () => {
  pending.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        categoriesExpense: state.value.categoriesExpense,
        categoriesIncome: state.value.categoriesIncome,
      },
    })
    if (error) throw error
    toast.add({
      title: 'Categories updated',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    toast.add({
      title: 'Error saving currency',
      description: error.message,
      color: 'red',
    })
  } finally {
    pending.value = false
  }
}

// Add a new expense category and save
const addExpenseCategory = async () => {
  if (
    stateExpense.value.newExpenseCategory &&
    !state.value.categoriesExpense.includes(
      stateExpense.value.newExpenseCategory,
    )
  ) {
    state.value.categoriesExpense.unshift(stateExpense.value.newExpenseCategory)
    stateExpense.value.newExpenseCategory = ''
    await saveCategories()
  }
}

// Delete an expense category and save
const deleteExpenseCategory = async (index) => {
  if (state.value.categoriesExpense.length > 1) {
    state.value.categoriesExpense.splice(index, 1)
    await saveCategories()
  } else {
    toast.add({
      title: 'At least one expense category is required',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  }
}

// Add a new income category and save
const addIncomeCategory = async () => {
  if (
    stateIncome.value.newIncomeCategory &&
    !state.value.categoriesIncome.includes(stateIncome.value.newIncomeCategory)
  ) {
    state.value.categoriesIncome.unshift(stateIncome.value.newIncomeCategory)
    stateIncome.value.newIncomeCategory = ''
    await saveCategories()
  }
}

// Delete an income category and save
const deleteIncomeCategory = async (index) => {
  if (state.value.categoriesIncome.length > 1) {
    state.value.categoriesIncome.splice(index, 1)
    await saveCategories()
  } else {
    toast.add({
      title: 'At least one income category is required',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  }
}

const saveCurrency = async (newCurrency) => {
  try {
    // Validate the currency
    schemaCurrency.parse(newCurrency)

    const { error } = await supabase.auth.updateUser({
      data: {
        selectedCurrency: newCurrency,
      },
    })
    if (error) throw error
    toast.add({
      title: 'Currency updated',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    console.error('Error saving currency:', error.message)
  }
}

watch(selectedCurrency, (newCurrency) => {
  saveCurrency(newCurrency)
})
</script>
