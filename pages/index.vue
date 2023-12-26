<template>
  <div>
    <section
      class="mt-12 flex flex-col items-center justify-center text-center xs:mt-16 md:mt-24 lg:mt-32"
    >
      <NuxtImg
        src="v1703227212/logo_eeipf7.svg"
        alt="Fintastica"
        class="mb-8"
        width="134"
        height="33"
      />
      <span
        class="mb-6 text-[2.2rem] font-semibold leading-tight xs:text-[2.8rem] sm:text-[3.2rem] md:text-[3.8rem] lg:mb-9 lg:text-[4.2rem] xl:mb-11 xl:text-[4.6rem]"
        >Take charge of your<br />financial life with Fintastica</span
      >

      <span
        class="mb-10 w-10/12 text-base font-normal leading-6 text-[#858585] md:text-lg lg:mb-14 xl:mb-16 xl:text-xl"
        >Empower your financial decisions with intuitive tracking and
        easy-to-use tools. <span class="text-white">Fintastica</span> makes
        managing income and expenses straightforward and stress-free.</span
      >

      <nuxt-link
        to="/login"
        class="mb-11 flex h-16 w-full items-center justify-center rounded-lg bg-gradient-to-r from-mainGreen-400 to-[#E2F966] px-8 text-sm font-semibold uppercase text-[#24280C] shadow-2xl shadow-[rgba(226,249,102,0.40)] transition-all hover:shadow-[rgba(226,249,102,0.65)] sm:w-96"
      >
        Go to dashboard
      </nuxt-link>

      <div class="mb-12 w-72 text-neutral-500 md:mb-24 xl:mb-32">
        <span class="text-white">Simplify</span> your finances – Quick sign-up,
        long lasting benefits.
      </div>

      <div class="relative w-full">
        <NuxtImg
          preload
          placeholder
          src="v1702287876/app-screen_efybnw.png"
          alt="Screenshot of Fintastica app interface"
          sizes="92vw lg:1264"
          class="relative left-1/2 z-10 block h-auto max-w-none -translate-x-1/2 transform lg:w-[calc(100%+8rem)] xl:w-[calc(100%+19rem)]"
        />
        <div
          class="absolute left-1/2 top-0 h-48 w-full -translate-x-1/2 transform rounded-full bg-[#E1FA62] opacity-[0.50] sm:top-[16rem] sm:mt-8 sm:h-[45rem] sm:w-[53rem] sm:-translate-y-1/2 sm:opacity-[0.20]"
          style="filter: blur(190px)"
        ></div>
      </div>
    </section>

    <div
      class="max-w-full bg-white py-12 text-center text-base md:py-16 lg:py-24 xl:pb-40 xl:pt-32"
    >
      <section class="flex flex-col items-center justify-center">
        <div
          class="mb-8 rounded-full bg-mainGreen-400 px-3 py-1 text-[0.69rem] font-semibold uppercase text-[#596615]"
        >
          Completely free!
        </div>
        <div class="text-lg text-[#191A1D] sm:text-xl lg:text-2xl">
          Experience the ultimate ease in managing <br />
          your finances with our user-friendly app
        </div>
        <div
          class="my-14 px-4 text-2xl font-semibold text-[#191A1D] xs:text-3xl sm:my-20 sm:px-0 lg:text-[2.375rem] lg:leading-[2.93rem] xl:my-[5.625rem]"
        >
          Designed for simplicity, it enables you to effortlessly track incomes
          and expenses. With
          <span class="text-[#989898]">convenient filtering</span> options,
          <span class="text-[#989898]">intuitive tagging</span>, and a clear
          view of your <span class="text-[#989898]">yearly totals</span>,
          staying on top of your financial health has never been easier. Perfect
          for personal use, our app makes finance management a breeze.
        </div>
        <div class="font-semibold text-[#191A1D]">Got any questions?</div>
        <div class="flex flex-col items-center">
          <a
            href="mailto:hello@fintastica.space"
            class="mb-6 text-2xl font-normal text-neutral-400 transition-all hover:text-mainGreen-400"
            >hello@fintastica.space</a
          >
          <a href="https://github.com/bynneh/Fintastica" target="_blank">
            <NuxtImg
              src="v1703226799/github-mark_xmwrah.svg"
              alt="Github logo"
              class="opacity-30 transition-opacity hover:opacity-100"
              width="34"
              height="33"
            />
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Fintastica web app - Take Charge of Your Financial Life',
  ogTitle: 'Fintastica web app - Take Charge of Your Financial Life',
  description:
    'Empower your financial decisions with Fintastica. Our intuitive tracking and easy-to-use tools make managing income and expenses straightforward and stress-free. No passwords needed, create your account or login with the confirmation link.',
  ogDescription:
    'Empower your financial decisions with Fintastica. Our intuitive tracking and easy-to-use tools make managing income and expenses straightforward and stress-free. No passwords needed, create your account or login with the confirmation link.',
  ogImage:
    'https://res.cloudinary.com/drwinsusg/image/upload/v1702294070/og_incimz.jpg',
  twitterCard: 'summary_large_image',
})

definePageMeta({
  layout: 'custom',
})
</script>

<style scoped>
section {
  @apply container mx-auto max-w-5xl px-3 xs:px-6 md:px-8;
}
</style>
