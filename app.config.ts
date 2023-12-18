export default defineAppConfig({
  ui: {
    primary: 'mainGreen',
    gray: 'neutral',

    // Select
    select: {
      base: 'cursor-pointer',
      rounded: 'rounded-lg',
      variant: {
        none: 'bg-mainBlackInput ring-1 focus:ring-2 ring-mainBlackRing focus:ring-mainGreen-400',
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
        active: 'bg-gray-100 dark:bg-mainBlackBg',
      },
      background: 'bg-white dark:bg-mainBlackInput',
      ring: 'ring-1 ring-gray-200 dark:ring-mainBlackRing',
    },

    // Badge
    badge: {
      variant: {
        outline:
          'dark:bg-mainBlackInput dark:text-white ring-1 ring-mainBlackRing',
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
            'dark:ring-mainBlackRing dark:bg-mainBlackInput dark:hover:bg-mainBlackBg',
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
          outline: 'dark:bg-mainBlackInput dark:ring-mainBlackRing',
        },
      },
      default: {
        size: 'md',
      },
    },

    // Card
    card: {
      background: 'dark:bg-mainBlackBg',
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
    },

    // Skeleton
    skeleton: {
      background: 'bg-neutral-800',
    },
  },
})
