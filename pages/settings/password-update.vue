<template>
  <h1 class="mb-6 text-4xl font-semibold">Update password</h1>
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
</template>
<script setup>
import { z } from 'zod'
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const toast = useToast()
const pending = ref(false)

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
    const { error } = await supabase.auth.updateUser({
      password: state.value.password,
    })

    if (error) throw error

    toast.add({
      title: 'Successfully updated password',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    router.push('/dashboard')
  } catch (error) {
    toast.add({
      title: 'Error updating password',
      description: error.message,
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
