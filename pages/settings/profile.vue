<template>
  <h1 class="mb-6 text-4xl font-semibold">Profile</h1>
  <div class="mb-3">
    <span class="text-sm text-gray-500">Full Name: </span
    >{{ currentName || 'Choose your name' }}
  </div>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-5" name="name">
      <UInput
        icon="i-heroicons-user"
        v-model="inputName"
        placeholder="Enter your new name"
        :size="isMobile ? 'xl' : 'md'"
      />
    </UFormGroup>

    <div class="mb-3">
      <span class="text-sm text-gray-500">Email: </span>{{ currentEmail }}
    </div>

    <UFormGroup class="mb-5" name="email" :help="message">
      <UInput
        icon="i-heroicons-at-symbol"
        v-model="inputEmail"
        placeholder="Enter your new Email"
        :size="isMobile ? 'xl' : 'md'"
      />
    </UFormGroup>

    <UButton
      type="submit"
      color="primary"
      :size="isMobile ? 'xl' : 'md'"
      variant="solid"
      label="Save"
      :loading="pending"
    />
  </UForm>
</template>

<script setup>
import { z } from 'zod'
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const pending = ref(false)

const inputName = ref('')
const inputEmail = ref('')

const currentName = computed(() => user.value.user_metadata.full_name)
const currentEmail = computed(() => user.value.email)

const message = ref(
  'You will receive a confirmation email if you modify the email address',
)

const state = ref({
  name: user.value.user_metadata.full_name || '',
  email: user.value.email || '',
})

const schema = z.object({
  name: z.string().max(20).optional(),
  email: z.string().email().optional(),
})

const saveProfile = async () => {
  const newProfile = {
    ...(inputName.value && { name: inputName.value }),
    email: inputEmail.value || undefined,
  }

  const result = schema.safeParse(newProfile)

  if (!result.success) {
    console.log(result.error.issues)
    return
  }

  // Update state with validated data
  state.value.name = result.data.name || state.value.name
  state.value.email = result.data.email || state.value.email

  if (
    state.value.name === user.value.user_metadata.full_name &&
    state.value.email === user.value.email
  ) {
    // If nothing has changed, do not proceed with update
    return
  }

  pending.value = true

  try {
    const data = {
      data: {
        full_name: state.value.name,
      },
    }

    if (state.value.email !== user.value.email) {
      data.email = state.value.email
    }

    const { error } = await supabase.auth.updateUser(data)

    if (error) {
      throw error
    } else {
      if (state.value.email !== user.value.email) {
        message.value = `Check your new email: ${state.value.email} to confirm`
      } else {
        message.value = 'Saved!'
      }
    }
  } catch (error) {
    message.value = 'Something went wrong, try again'
    console.log(error)
  } finally {
    pending.value = false
    inputName.value = ''
    inputEmail.value = ''
  }
}
</script>
