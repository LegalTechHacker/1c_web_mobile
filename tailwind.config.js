function withOpacity (variableName, opacityVal = 1) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgba(var(${variableName}), ${opacityVal})`
  }
}

const {
  rotate,
  spacing,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  opacity,
  fontFamily,
  fontSize,
  lineHeight
} = require('tailwindcss/defaultTheme')

module.exports = {
  prefix: 'tw-',
  content: [
    './*.html',
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
    './public/**/*.{js,ts,jsx,tsx,vue,html}'
  ],
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './*.html',
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
    './public/**/*.{js,ts,jsx,tsx,vue,html}'
  ],
  theme: {
    extend: {
      colors: {
        'skin-accent-color': withOpacity('--color-accent-base-mask-rgb'),
        'skin-accent-color-opacity-05': withOpacity(
          '--color-accent-base-mask-rgb',
          0.05
        ),
        'skin-accent-color-opacity-15': withOpacity(
          '--color-accent-base-mask-rgb',
          0.15
        ),
        'skin-accent-color-opacity-85': withOpacity(
          '--color-accent-base-mask-rgb',
          0.85
        ),
        'skin-background-color': withOpacity('--color-background-base-mask-rgb')
      },
      textColor: {
        'skin-base-text': withOpacity('--color-text-base-mask-rgb'),
        'skin-base-text-opacity-15': withOpacity(
          '--color-text-base-mask-rgb',
          0.15
        ),
        'skin-base-text-opacity-85': withOpacity(
          '--color-text-base-mask-rgb',
          0.85
        ),
        'skin-primary-text': withOpacity('--color-accent-base-mask-rgb'),
        'skin-primary-text-opacity-15': withOpacity(
          '--color-accent-base-mask-rgb',
          0.15
        ),
        'skin-primary-text-opacity-85': withOpacity(
          '--color-accent-base-mask-rgb',
          0.85
        ),
        'skin-secondary-text': withOpacity('--color-text-secondary-mask-rgb')
      },
      placeholderColor: {
        'skin-base-placeholder': withOpacity(
          '--color-placeholder-base-mask-rgb'
        )
      },
      backgroundColor: {
        'skin-primary-background': withOpacity('--color-accent-base-mask-rgb'),
        'skin-primary-background-opacity-05': withOpacity(
          '--color-accent-base-mask-rgb',
          0.05
        ),
        'skin-primary-background-opacity-15': withOpacity(
          '--color-accent-base-mask-rgb',
          0.15
        ),
        'skin-primary-background-opacity-85': withOpacity(
          '--color-accent-base-mask-rgb',
          0.85
        ),
        'skin-secondary-background': withOpacity(
          '--color-background-base-mask-rgb'
        ),
        'skin-white-background-opacity-50': 'rgba(255,255,255,0.50)'
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity('--color-accent-base-mask-rgb')
        }
      },
      borderColor: {
        'skin-primary-border': 'rgba(var(--color-base-mask-rgb), 0.15)',
        'skin-primary-text-opacity-15':
          'rgba(var(--color-accent-base-mask-rgb), 0.15)',
        'skin-secondary-border': 'rgba(var(--color-base-mask-rgb), 0.1)'
      },
      boxShadow: {
        'skin-primary-shadow':
          '0 2px 6px 0 rgba(var--color-base-mask-rgb), 0.1)',
        'skin-secondary-shadow':
          '0 1px 3px 0 rgba(var(--color-base-mask-rgb), 0.1)',
        'skin-primary-accent-shadow':
          '0 30px 40px 0 rgba(var(--color-accent-base-mask-rgb), 0.3)',
        'skin-secondary-accent-shadow':
          '0 0 0 2px rgba(var(--color-accent-base-mask-rgb), 0.7)'
      },
      rotate: {
        ...rotate,
        270: '270deg'
      },
      spacing: {
        ...spacing,
        0.5: '2.5px',
        1: '5px',
        1.5: '10px',
        2: '7px',
        3: '12px',
        3.5: '15px',
        4: '16px',
        5: '20px',
        6.5: '26px',
        8.5: '36px',
        10: '40px',
        11: '42px',
        12.5: '54px',
        14: '60px',
        22: '88px',
        32: '130px',
        64: '256px',
        70: '272px',
        76: '288px',
        pa4: '2cm',
        wa4: '21cm',
        ha4: '29.7cm'
      },
      minHeight: {
        ...minHeight,
        5: '20px',
        11: '42px',
        ha4: '29.7cm'
      },
      maxHeight: {
        ...maxHeight,
        5: '20px',
        11: '42px',
        16: '64px',
        20: '80px',
        ha4: '29.7cm',
        '4/6': '69.485vh',
        '4/5': '83.485vh'
      },
      minWidth: {
        ...minWidth,
        5: '20px',
        11: '42px',
        wa4: '21cm'
      },
      maxWidth: {
        ...maxWidth,
        '5xl': '1024px'
      },
      opacity: {
        ...opacity,
        10: '0.1',
        15: '0.15'
      },
      fontFamily: {
        ...fontFamily,
        sans: '"Open Sans", Arial'
      },
      fontSize: {
        ...fontSize,
        xb: '15px',
        lg: '18px',
        '2xl': '24px',
        '3xl': '30px',
        '3.5xl': '32px',
        '5xl': '60px'
      },
      lineHeight: {
        ...lineHeight,
        xb: '20px',
        lg: '26px',
        '3xl': '42px',
        '3.5xl': '38px',
        '5xl': '82px'
      }
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')]
}
