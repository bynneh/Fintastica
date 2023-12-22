<template>
  <div class="mt-8 flex justify-center xs:mt-16 md:mt-24">
    <UCard class="w-[28rem] shadow-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl">Reset password</h1>
        </div>
      </template>
      <UForm :state="state" :schema="schema" @submit="updatePassword">
        <!-- New Password -->
        <UFormGroup label="New Password" name="password" class="mb-4" required>
          <UInput
            icon="i-heroicons-finger-print"
            type="password"
            placeholder="Enter your new password"
            v-model="state.password"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <!-- Confirm New Password -->
        <UFormGroup
          label="Confirm New Password"
          name="confirmPassword"
          class="mb-4"
          required
        >
          <UInput
            icon="i-heroicons-finger-print"
            type="password"
            placeholder="Confirm your new password"
            v-model="state.confirmPassword"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          variant="solid"
          :size="isMobile ? 'xl' : 'md'"
          label="Update Password"
          :loading="pending"
        />
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['redirect-from-confirm'] })
useRedirectIfAnon()

import { z } from 'zod'
const { isMobile } = useDevice()
const supabase = useSupabaseClient()
const toast = useToast()
const pending = ref(false)
const router = useRouter()

const state = ref({
  password: '',
  confirmPassword: '',
})

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'Must be at least 6 characters')
      .max(20, 'Must be at most 20 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Must be at least 6 characters')
      .max(20, 'Must be at most 20 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

async function updatePassword() {
  pending.value = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: state.value.password,
    })

    if (updateError) throw updateError

    router.push('/dashboard')
    toast.add({
      title: 'Password updated successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
  } catch (error) {
    toast.add({
      title: 'Error updating password',
      description: error.message ? error.message : 'An unknown error occurred',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    pending.value = false
    state.value.password = ''
    state.value.confirmPassword = ''
  }
}
</script>
