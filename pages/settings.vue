<template>
  <div class="grid grid-cols-6 gap-8 md:gap-12">
    <UVerticalNavigation
      :links="links"
      class="col-span-6 flex flex-row justify-self-start sm:col-span-2 sm:flex-col sm:justify-self-stretch"
    />
    <div class="col-span-6 sm:col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
useRedirectIfAnon()
useSeoMeta({
  title: 'Settings - Fintastica',
  description: 'Manage your Fintastica account settings.',
})

const links = [
  {
    label: 'Profile',
    to: '/settings/profile',
  },
  {
    label: 'Password',
    to: '/settings/password-update',
  },
  {
    label: 'Avatar',
    to: '/settings/avatar',
  },
  {
    label: 'Settings',
    to: '/settings/settings',
  },
]
</script>

<style scoped>
.vertical-navigation {
  display: flex;
  flex-direction: row;
  align-items: center; /* Adjust as needed */
}
</style>
