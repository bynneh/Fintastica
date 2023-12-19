<template>
  <div v-if="hasAvatar" :style="avatarStyles"></div>
  <div v-else :style="placeholderStyles">
    <UIcon name="i-heroicons-photo" :style="iconStyles" class="opacity-50" />
  </div>
</template>

<script setup>
const props = defineProps({
  w: Number,
  h: Number,
})

const user = useSupabaseUser()
const { url } = useAvatarUrl()

const hasAvatar = computed(() => Boolean(url.value))

const avatarStyles = computed(() => ({
  borderRadius: '50%',
  backgroundImage: `url('${url.value}')`,
  width: `${props.w}px`,
  height: `${props.h}px`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))

const placeholderStyles = computed(() => ({
  borderRadius: '50%',
  width: `${props.w}px`,
  height: `${props.h}px`,
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const iconStyles = computed(() => ({
  width: `${Math.floor(props.w / 2.4)}px`,
  height: `${Math.floor(props.h / 2.4)}px`,
}))
</script>
