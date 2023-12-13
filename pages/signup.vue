<template>
  <div v-if="!successMsg" class="mt-8 flex justify-center xs:mt-16 md:mt-24">
    <UCard class="w-[28rem] shadow-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl">Sign up</h1>
          <div class="ml-4 text-sm text-neutral-500">
            Already have an account?
            <NuxtLink to="/login" class="text-white">Log In</NuxtLink>
          </div>
        </div>
      </template>

      <UForm :schema="schema" :state="state" @submit="signUp">
        <!-- Email -->
        <UFormGroup label="Email" name="email" class="mb-4" required>
          <UInput
            icon="i-heroicons-user-plus"
            type="text"
            placeholder="email@mail.com"
            v-model="state.email"
            autocomplete="email"
          />
        </UFormGroup>

        <!-- Password -->
        <UFormGroup label="Password" name="password" class="mb-4" required>
          <UInput
            icon="i-heroicons-finger-print"
            type="password"
            placeholder="Enter your password"
            v-model="state.password"
            autocomplete="password"
          />
        </UFormGroup>

        <!-- Confirm Password -->
        <UFormGroup
          label="Confirm Password"
          name="confirmPassword"
          class="mb-4"
          required
        >
          <UInput
            icon="i-heroicons-finger-print"
            type="password"
            placeholder="Confirm your password"
            v-model="state.confirmPassword"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          variant="solid"
          size="md"
          label="Sign up"
          :loading="pending"
        />

        <div class="mt-2 w-4/5 text-mainRed-500">{{ errorMsg }}</div>
      </UForm>
    </UCard>
  </div>
  <section v-else class="mt-10">
    <UCard>
      <template #header>
        <span class="text-lg font-semibold">Email has been sent</span>
      </template>

      <div class="py-5 text-center">
        <p class="mb-3">
          We have sent an email to
          <span class="text-mainGreen-600">{{ state.email }}</span> with a link
          to activate your account.
        </p>
        <p class="mb-6 text-neutral-400">
          <span class="text-white">If the link is not there</span>, please check
          your spam folder.
        </p>
        <UButton label="Try again" @click="clear" />
      </div>
    </UCard>
  </section>
</template>

<script setup>
useRedirectIfAuthenticated()
definePageMeta({ middleware: ['redirect-to-dashboard'] })

useSeoMeta({
  title: 'Sign Up - Fintastica',
  description:
    'Create a new account on Fintastica and take charge of your financial life.',
})

import { z } from 'zod'
const supabase = useSupabaseClient()

const state = reactive({
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
})

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const errorMsg = ref(null)
const successMsg = ref(null)
const pending = ref(false)

function clear() {
  successMsg.value = null
  errorMsg.value = null
  state.password = undefined
  state.confirmPassword = undefined
}

async function signUp() {
  pending.value = true
  try {
    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,

      options: {
        data: {
          categoriesExpense: [
            'Food and Groceries',
            'Transportation',
            'Housing',
            'Entertainment',
            'Clothing',
            'Healthcare',
          ],
          categoriesIncome: ['Salary', 'Rental Income'],
        },
        emailRedirectTo: 'https://fintastica.space/confirm',
      },
    })
    if (error) throw error
    successMsg.value = 'Check your email to confirm your account.'
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    pending.value = false
  }
}
</script>
