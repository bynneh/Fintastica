<template>
  <h1 class="mb-6 text-4xl font-semibold">Avatar</h1>
  <div class="mb-4">
    <UFormGroup class="w-full" help="This would be blank by default">
      <Avatar :w="100" :h="100" />
    </UFormGroup>
  </div>

  <div class="mb-4">
    <UFormGroup
      label="New avatar"
      class="w-full"
      name="avatar"
      help="After choosing an image click Save to upload the new avatar"
    >
      <UInput type="file" ref="fileInput" />
    </UFormGroup>
  </div>

  <UButton
    type="submit"
    color="primary"
    variant="solid"
    label="Save"
    :size="isMobile ? 'xl' : 'md'"
    :loading="uploading"
    @click="saveAvatar"
  />
</template>

<script setup>
const isMobile = useIsMobile()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const uploading = ref(false)
const fileInput = ref(null)

// File resize and webp convert

const resizeAndConvertImage = (file) => {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas')
      const maxSize = 200
      const scaleSize = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * scaleSize
      canvas.height = img.height * scaleSize

      // Draw image on canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Convert to webp
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Error in image processing.'))
        }
      }, 'image/webp')
    }
    img.onerror = (error) => {
      reject(error)
    }
  })
}

// Save avatar functionality

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]

  if (!file) {
    toast.add({
      title: 'Select a file to upload first',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
    })
    return
  }

  try {
    uploading.value = true

    // Process the image
    const processedFile = await resizeAndConvertImage(file)
    const fileExt = 'webp'
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.user_avatar

    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, processedFile)

    if (error) throw error

    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        user_avatar: fileName,
      },
    })

    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) throw error
    }

    // 5. Reset the file input

    fileInput.value.input.value = null

    toast.add({
      title: 'Avatar uploaded',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    toast.add({
      title: 'Error uploading avatar',
      icon: 'i-heroicons-exlamation-circle',
      description: error.message,
      color: 'red',
    })
  } finally {
    uploading.value = false
  }
}
</script>
