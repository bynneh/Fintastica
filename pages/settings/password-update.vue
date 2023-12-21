<template>
  <h1 class="mb-6 text-4xl font-semibold">Update password</h1>
  <UForm :state="state" :schema="schema" @submit="updatePassword">
    <!-- Old Password -->
    <UFormGroup label="Old Password" name="oldPassword" class="mb-4" required>
      <UInput
        icon="i-heroicons-finger-print"
        type="password"
        placeholder="Enter your old password"
        v-model="state.oldPassword"
        :size="isMobile ? 'xl' : 'md'"
      />
    </UFormGroup>

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
const router = useRouter()

const state = ref({
  oldPassword: '',
  password: '',
  confirmPassword: '',
})

const schema = z
  .object({
    oldPassword: z
      .string()
      .min(6, 'Must be at least 6 characters')
      .max(20, 'Must be at most 20 characters'),
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
    const user = useSupabaseUser()
    if (!user) {
      throw new Error('User is not signed in')
    }

    // Validate old password by signing in
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: user.value.email,
        password: state.value.oldPassword,
      },
    )

    if (signInError) {
      toast.add({
        title: 'Invalid old password',
        description:
          'Your current password is not valid. Please re-log for security reasons',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    if (data?.user?.id) {
      // If validation is successful, proceed with password update
      const { error: updateError } = await supabase.auth.updateUser({
        password: state.value.password,
      })

      if (updateError) throw updateError

      // Notify user of successful password update
      toast.add({
        title: 'Password updated successfully',
        icon: 'i-heroicons-check-circle',
        color: 'green',
      })
    }
  } catch (error) {
    // Notify user of error during password update
    toast.add({
      title: 'Error updating password',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    pending.value = false
    state.value.oldPassword = ''
    state.value.password = ''
    state.value.confirmPassword = ''
  }
}
</script>
