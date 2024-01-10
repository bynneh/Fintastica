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
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap',
      as: 'style',
      onload: "this.onload=null;this.rel='stylesheet'",
      crossOrigin: 'anonymous',
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
