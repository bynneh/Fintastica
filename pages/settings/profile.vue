<template>
  <h1 class="mb-6 text-4xl font-semibold">Profile</h1>

  <!-- Name Form -->
  <div class="mb-3">
    <span class="text-sm text-gray-500">Full Name: </span
    >{{ currentName || 'Choose your name' }}
  </div>
  <UForm
    :state="state"
    :schema="nameSchema"
    @submit="saveName"
    class="flex justify-center gap-x-3"
  >
    <UFormGroup class="mb-5 flex-1" name="name">
      <UInput
        icon="i-heroicons-user"
        v-model="inputName"
        placeholder="Enter your new name"
        :size="isMobile ? 'xl' : 'md'"
      />
    </UFormGroup>
    <UButton
      type="submit"
      color="primary"
      :size="isMobile ? 'xl' : 'md'"
      variant="solid"
      label="Save"
      :loading="pendingName"
      class="self-start"
    />
  </UForm>

  <div class="mb-4 mt-[-0.6rem] w-4/5 text-sm text-mainRed-500">
    {{ errorMsg }}
  </div>

  <!-- Email Form -->
  <div class="mb-3">
    <span class="text-sm text-gray-500">Email: </span>{{ currentEmail }}
  </div>
  <UForm
    :state="state"
    :schema="emailSchema"
    @submit="saveEmail"
    class="flex justify-center gap-x-3"
  >
    <UFormGroup class="mb-5 flex-1" name="email">
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
      :loading="pendingEmail"
      class="self-start"
    />
  </UForm>

  <div class="mb-4 mt-[-0.6rem] w-4/5 text-sm text-mainRed-500">
    {{ errorMsgEmail }}
  </div>
</template>

<script setup>
import { z } from 'zod'

// Hooks and refs
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const pendingName = ref(false)
const pendingEmail = ref(false)
const inputName = ref('')
const inputEmail = ref('')
const errorMsg = ref(null)
const errorMsgEmail = ref(null)

// Computed properties
const currentName = computed(() => user.value.user_metadata.full_name)
const currentEmail = computed(() => user.value.email)

// Initial state
const state = ref({
  name: user.value.user_metadata.full_name || '',
  email: user.value.email || '',
})

// Schemas
const nameSchema = z.object({
  name: z.string().max(20).optional(),
})

const emailSchema = z.object({
  email: z.string().email().optional(),
})

// Common function to update user
const updateUser = async (data) => {
  const { error } = await supabase.auth.updateUser(data)
  if (error) throw error
}

// Common function to handle errors
const handleError = (error, errorMsgRef) => {
  toast.add({
    title: 'Error',
    description: 'Something went wrong, try again',
    color: 'red',
    icon: 'i-heroicons-exclamation-circle',
  })
  console.error(error)
  errorMsgRef.value = undefined
}

// Function to save name
const saveName = async () => {
  const newName = { name: inputName.value || undefined }
  const result = nameSchema.safeParse(newName)

  if (!result.success) {
    errorMsg.value = result.error.issues[0].message
    return
  }

  state.value.name = result.data.name || state.value.name
  if (state.value.name === user.value.user_metadata.full_name) return

  pendingName.value = true

  try {
    await updateUser({ data: { full_name: state.value.name } })
    toast.add({
      title: 'Success',
      description: 'Name Saved!',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    errorMsg.value = null
  } catch (error) {
    handleError(error, errorMsg)
  } finally {
    pendingName.value = false
    inputName.value = ''
  }
}

// Function to save email
const saveEmail = async () => {
  const newEmail = { email: inputEmail.value || undefined }
  const result = emailSchema.safeParse(newEmail)

  if (!result.success) {
    errorMsgEmail.value = result.error.issues[0].message
    return
  }

  state.value.email = result.data.email || state.value.email
  if (state.value.email === user.value.email) return

  pendingEmail.value = true

  try {
    await updateUser({ data: { email: state.value.email } })
    toast.add({
      title: 'Success',
      description: `Check your new email: ${state.value.email} to confirm`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    errorMsgEmail.value = null
  } catch (error) {
    handleError(error, errorMsgEmail)
  } finally {
    pendingEmail.value = false
    inputEmail.value = ''
  }
}
</script>
