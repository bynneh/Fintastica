<template>
  <div class="mt-8 flex justify-center xs:mt-16 md:mt-24">
    <UCard class="w-[28rem] shadow-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl">Log in</h1>
          <div class="ml-4 text-sm text-neutral-500">
            Don't have an account?
            <NuxtLink
              to="/signup"
              class="text-white transition-colors hover:text-mainGreen-400"
              >Sign up</NuxtLink
            >
          </div>
        </div>
      </template>

      <UForm v-if="!isReset" :schema="schema" :state="state" @submit="signIn">
        <!-- Email -->
        <UFormGroup label="Email" name="email" class="mb-4" required>
          <UInput
            icon="i-heroicons-at-symbol"
            type="text"
            placeholder="email@mail.com"
            v-model="state.email"
            autocomplete="email"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <!-- Password -->
        <UFormGroup label="Password" name="password" class="mb-6" required>
          <UInput
            icon="i-heroicons-finger-print"
            type="password"
            placeholder="Enter your password"
            v-model="state.password"
            autocomplete="current-password"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>

        <div class="flex items-center justify-between">
          <div class="flex items-center justify-between gap-x-1 xs:gap-x-2">
            <UButton
              type="submit"
              color="primary"
              variant="solid"
              :size="isMobile ? 'xl' : 'md'"
              label="Log in"
              :loading="pending"
            />
            <div
              :class="
                isMobile
                  ? 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white opacity-90 transition-all hover:opacity-100'
                  : 'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white opacity-90 transition-all hover:opacity-100'
              "
              @click="signInWithGithub"
            >
              <img
                src="/github-mark.svg"
                alt="Github logo"
                class="h-[1.4rem] transition-opacity hover:opacity-100"
              />
            </div>
            <div
              :class="
                isMobile
                  ? 'flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white opacity-90 transition-all hover:opacity-100'
                  : 'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white opacity-90 transition-all hover:opacity-100'
              "
              @click="signInWithGoogle"
            >
              <img
                src="/googleLogo.svg"
                alt="Google logo"
                class="h-[1.4rem] transition-opacity hover:opacity-100"
              />
            </div>
          </div>
          <NuxtLink
            @click="isReset = !isReset"
            class="cursor-pointer text-sm text-neutral-500 transition-colors hover:text-white"
            >Forgot password?</NuxtLink
          >
        </div>

        <div class="mt-2 w-4/5 text-mainRed-500">{{ errorMsg }}</div>
      </UForm>
      <UForm
        v-else
        :state="resetState"
        :schema="resetSchema"
        @submit="resetPassword"
      >
        <UFormGroup label="Email" name="email" class="mb-5" required>
          <UInput
            icon="i-heroicons-at-symbol "
            type="text"
            placeholder="email@mail.com"
            v-model="resetState.email"
            :size="isMobile ? 'xl' : 'md'"
          />
        </UFormGroup>
        <div class="mb-6 text-sm font-normal text-neutral-500">
          A link to password reset will be sent to your email. <br />For your
          security, this link is only valid
          <span class="text-white">in this browser</span>.
        </div>
        <div class="flex items-center">
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            :size="isMobile ? 'xl' : 'md'"
            label="Reset password"
            :loading="pending"
          /><NuxtLink
            v-if="isReset"
            @click="isReset = false"
            class="ml-6 cursor-pointer text-sm text-neutral-500 transition-colors hover:text-white"
            >Go back to log in</NuxtLink
          >
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
useRedirectIfAuthenticated()
definePageMeta({ middleware: ['redirect-to-dashboard'] })

useSeoMeta({
  title: 'Log In - Fintastica',
  description:
    'Log in to your Fintastica account and manage your finances with ease.',
})

import { z } from 'zod'
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()
const isReset = ref(false)
const redirectUrl = useRuntimeConfig().public.baseUrl

const state = reactive({
  email: undefined,
  password: undefined,
})
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters'),
})

const resetState = reactive({
  email: undefined,
})
const resetSchema = z.object({
  email: z.string().email('Invalid email'),
})

const errorMsg = ref(null)
const pending = ref(false)

// OAuth login

async function signInWithOAuth(provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${redirectUrl}/confirm?accepted=true`,
    },
  })
  if (error) console.log(error.message)
}

const signInWithGithub = () => signInWithOAuth('github')
const signInWithGoogle = () => signInWithOAuth('google')

// Password login

async function signIn() {
  pending.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    })
    if (error) throw error
    router.push('/dashboard')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    pending.value = false
  }
}

// Reset password

async function resetPassword() {
  pending.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      resetState.email,
      {
        redirectTo: `${redirectUrl}/confirm?resetPassword=true`,
      },
    )
    if (error) {
      throw error
    }
    // Display a success message to the user
    toast.add({
      title: 'Password reset email sent',
      description: 'Please check your email to reset your password.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })

    isReset.value = false
  } catch (error) {
    // Display the error message to the user
    toast.add({
      title: 'Error resetting password',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    pending.value = false
    resetState.email = undefined
    errorMsg.value = undefined
    state.email = undefined
    state.password = undefined
  }
}
</script>
