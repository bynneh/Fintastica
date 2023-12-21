<template>
  <UCard>
    <template #header> Signing in... </template>
    Wait a moment while we sign you in...
  </UCard>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()

// Define categories data outside of the onMounted hook
const categoriesData = ref({
  categoriesExpense: [
    'Food and Groceries',
    'Transportation',
    'Housing',
    'Entertainment',
    'Clothing',
    'Healthcare',
  ],
  categoriesIncome: ['Salary', 'Rental Income'],
})

// Function to update user data
const updateUser = async () => {
  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.value.user_metadata,
      categoriesExpense: categoriesData.value.categoriesExpense,
      categoriesIncome: categoriesData.value.categoriesIncome,
      dataFilledUponSignUp: true,
    },
  })
  if (error) {
    console.error('Error updating user:', error.message)
    throw error
  }
}

// Function to insert transactions
const insertTransactions = async () => {
  const transactions = [
    {
      category: 'Salary',
      amount: 2950,
      type: 'Income',
      user_id: user.value.id,
    },
    {
      category: 'Rent',
      description: 'Monthly apartment rent',
      amount: 1200,
      type: 'Expense',
      user_id: user.value.id,
    },
    {
      category: 'Utilities',
      description: 'Electricity bill',
      amount: 200,
      type: 'Expense',
      user_id: user.value.id,
    },
  ]

  const { error } = await supabase.from('transactions').insert(transactions)

  if (error) {
    console.error('Error inserting transactions:', error.message)
    throw error
  }
}

onMounted(async () => {
  const accepted = route.query.accepted
  const passwordReset = route.query.resetPassword
  try {
    if (
      accepted &&
      user.value &&
      !user.value.user_metadata?.dataFilledUponSignUp
    ) {
      await updateUser()
      await insertTransactions()
      window.location.reload()
    } else if (passwordReset) {
      router.push('/reset-password')
    } else {
      useRedirectIfAuthenticated()
      useRedirectIfAnon()
    }
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})
</script>
