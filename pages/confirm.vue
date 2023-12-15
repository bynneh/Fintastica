<template>
  <UCard>
    <template #header> Signing in... </template>
    Wait a moment while we sign you in...
  </UCard>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
useRedirectIfAuthenticated()
useRedirectIfAnon()
</script>
