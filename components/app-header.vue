<template>
  <header class="flex items-center justify-between pt-4 md:pt-8">
    <NuxtLink
      :to="
        ['dashboard', 'login', 'signup'].includes($route.name)
          ? '/'
          : '/dashboard'
      "
    >
      <img src="/logo.svg" alt="Fintastica" class="h-7 w-auto" />
    </NuxtLink>

    <UDropdown
      :items="items"
      :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
      ref="dropdownRef"
      v-if="isAuthenticated"
    >
      <div class="flex items-center gap-x-2 xs:gap-x-4" @click="toggleDropdown">
        <div
          class="flex items-center gap-x-1 text-xs text-neutral-400 xs:gap-x-2 xs:text-sm"
        >
          <span class="text-right">{{ userFullName || user.email }}</span>
          <UIcon
            :class="[
              'h-3 w-3',
              'icon-transition',
              isDropdownOpen ? 'icon-rotate' : '',
            ]"
            name="i-heroicons-chevron-down"
          />
        </div>
        <Avatar class="flex-shrink-0" :w="46" :h="46" />
      </div>

      <template #account>
        <div class="text-left">
          <p>Signed in as</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ user.email }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>
        <UIcon
          :name="item.icon"
          class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
        />
      </template>
    </UDropdown>
    <div v-else class="h-[46px]"></div>
  </header>
</template>

<script setup>
const emit = defineEmits(['click'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userFullName = computed(() => user.value.user_metadata?.full_name)

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

const items = [
  [
    {
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      click: () => {
        navigateTo('/settings/profile')
        toggleDropdown()
      },
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: async () => {
        navigateTo('/')
        await supabase.auth.signOut()
      },
    },
  ],
]

const isAuthenticated = ref(user.value !== null)

watch(
  user,
  (newUser) => {
    isAuthenticated.value = newUser !== null
  },
  { immediate: true },
)
</script>

<style scoped>
.icon-transition {
  transition: transform 0.15s ease-in-out;
}

.icon-rotate {
  transform: rotate(180deg);
}
</style>
