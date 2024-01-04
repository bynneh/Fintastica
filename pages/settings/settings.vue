<template>
  <h1 class="mb-6 text-4xl font-semibold">Settings</h1>

  <h2 class="mb-4 text-xl">Choose your currency</h2>
  <div class="flex gap-x-3">
    <USelectMenu
      class="mb-7 flex-1"
      v-model="selectedCurrency"
      :options="['EUR', 'USD', 'RUB', 'JPY', 'GBP', 'AUD']"
      :size="isMobile ? 'xl' : 'md'"
    />
    <UButton
      label="Save"
      @click="saveCurrency"
      :size="isMobile ? 'xl' : 'md'"
      class="self-start"
      :loading="pendingCurrency"
    />
  </div>

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
          v-model="stateExpense.newCategory"
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
          v-model="stateIncome.newCategory"
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

const { isMobile } = useDevice()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Initializing state variables
const pendingCurrency = ref(false)
const pending = ref(false)
const selectedCurrency = useState(
  'sharedSelectedCurrency',
  () => user.value.user_metadata?.selectedCurrency ?? 'EUR',
)

const state = ref({
  categoriesExpense: user.value.user_metadata?.categoriesExpense ?? [],
  categoriesIncome: user.value.user_metadata?.categoriesIncome ?? [],
})

const stateExpense = ref({ newCategory: '' })
const stateIncome = ref({ newCategory: '' })

// Defining validation schemas
const schemaExpense = z.object({
  newCategory: z.string().max(20).optional(),
})
const schemaIncome = z.object({
  newCategory: z.string().max(20).optional(),
})
const schemaCurrency = z.enum(['EUR', 'USD', 'RUB', 'JPY', 'GBP', 'AUD'])

// Function to update categories in the database
const updateCategories = async (categories) => {
  const { error } = await supabase.auth.updateUser({ data: categories })
  if (error) throw error
}

// Function to save categories
const saveCategories = async () => {
  pending.value = true
  try {
    await updateCategories({
      categoriesExpense: state.value.categoriesExpense,
      categoriesIncome: state.value.categoriesIncome,
    })
    toast.add({ title: 'Categories updated', icon: 'i-heroicons-check-circle' })
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

// Function to add a new category
const addCategory = async (categoryState, categoryList) => {
  const newCategory = categoryState.value.newCategory
  if (newCategory) {
    if (categoryList.includes(newCategory)) {
      toast.add({
        title: 'Category already exists',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
    } else {
      categoryList.unshift(newCategory)
      categoryState.value.newCategory = ''
      await saveCategories()
    }
  }
}

// Function to delete a category
const deleteCategory = async (index, categoryList) => {
  if (categoryList.length > 1) {
    categoryList.splice(index, 1)
    await saveCategories()
  } else {
    toast.add({
      title: 'At least one category is required',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  }
}

// Function to add an expense category
const addExpenseCategory = () =>
  addCategory(stateExpense, state.value.categoriesExpense)

// Function to delete an expense category
const deleteExpenseCategory = (index) =>
  deleteCategory(index, state.value.categoriesExpense)

// Function to add an income category
const addIncomeCategory = () =>
  addCategory(stateIncome, state.value.categoriesIncome)

// Function to delete an income category
const deleteIncomeCategory = (index) =>
  deleteCategory(index, state.value.categoriesIncome)

// Function to save selected currency
const saveCurrency = async () => {
  try {
    pendingCurrency.value = true
    schemaCurrency.parse(selectedCurrency.value)
    await updateCategories({ selectedCurrency: selectedCurrency.value })
    toast.add({ title: 'Currency updated', icon: 'i-heroicons-check-circle' })
  } catch (error) {
    console.error('Error saving currency:', error.message)
  } finally {
    pendingCurrency.value = false
  }
}
</script>
