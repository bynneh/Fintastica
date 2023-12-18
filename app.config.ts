export default defineAppConfig({
  ui: {
    primary: 'mainGreen',
    gray: 'neutral',

    // Select
    select: {
      base: 'cursor-pointer',
      rounded: 'rounded-lg',
      variant: {
        none: 'bg-[#222223] ring-1 focus:ring-2 ring-[#2E2E2F] focus:ring-mainGreen-400',
      },

      default: {
        size: 'md',
        variant: 'none',
        color: 'gray',
      },
    },
    selectMenu: {
      option: {
        base: 'cursor-pointer',
        active: 'bg-gray-100 dark:bg-[#1D1D1E]',
      },
      background: 'bg-white dark:bg-[#222223]',
      ring: 'ring-1 ring-gray-200 dark:ring-[#2E2E2F]',
    },

    // Badge
    badge: {
      variant: {
        outline: 'dark:bg-[#262627] dark:text-white ring-1 ring-[#2E2E2F]',
      },
      default: {
        size: 'sm',
        variant: 'outline',
      },
    },

    // Button
    button: {
      rounded: 'rounded-lg',
      color: {
        white: {
          solid:
            'dark:ring-[#2E2E2F] dark:bg-[#222223] dark:hover:bg-[#1D1D1E]',
        },
      },
      variant: {
        ghost: 'hover:bg-[#171719]',
      },
      default: {
        size: 'sm',
      },
    },

    // Input
    input: {
      rounded: 'rounded-lg',

      color: {
        white: {
          outline: 'dark:bg-[#222223] dark:ring-[#2E2E2F]',
        },
      },
      default: {
        size: 'md',
      },
    },

    // Card
    card: {
      background: 'dark:bg-[#1D1D1E]',
      rounded: 'rounded-2xl',
      body: {
        padding: 'px-6 py-5 sm:p-6',
      },
      header: {
        padding: 'px-6 py-5 sm:px-6',
      },
    },

    // Modal
    modal: {
      rounded: 'rounded-2xl',
      overlay: {
        background: 'dark:bg-gray-950/75',
      },
    },

    // VerticalNavigation
    verticalNavigation: {
      padding: 'px-4 py-3',
      rounded: 'rounded-lg',
      base: 'before:rounded-lg dark:hover:bg-[#222223]',
      active: 'rounded-lg dark:hover:bg-[#222223]',
    },

    // Skeleton
    skeleton: {
      background: 'bg-neutral-800',
    },
  },
})
