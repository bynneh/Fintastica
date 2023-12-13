<template>
  <NuxtLayout><NuxtPage /><UNotifications /></NuxtLayout>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap',
      crossorigin: '',
    },
  ],
})
</script>

<style>
body {
  font-family: 'Outfit', sans-serif;
  @apply bg-[#1B1B1C];
}
</style>
