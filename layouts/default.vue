<template>
  <div class="container mx-auto max-w-5xl px-3 xs:px-6 md:px-8">
    <AppHeader />
    <main class="mt-4 md:mt-6 lg:mt-8">
      <slot />
    </main>
  </div>
</template>

<style>
body {
  @apply bg-[#1B1B1C];
}
</style>
