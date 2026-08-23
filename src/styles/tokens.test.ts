import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const tokensCss = readFileSync(resolve('src/styles/tokens.css'), 'utf8')
const appCss = readFileSync(resolve('src/styles/app.css'), 'utf8')
const mainSource = readFileSync(resolve('src/main.tsx'), 'utf8')

const requiredColors = {
  '--color-background': '#1B1B3A',
  '--color-text': '#EFF2FF',
  '--color-accent': '#FFDFB2',
  '--color-secondary': '#74A4BC',
  '--color-validation': '#CFF2EC',
  '--color-track-sfx': '#FFAF87',
  '--color-track-ambience': '#E56399',
  '--color-track-music': '#9358FF',
  '--color-success-dark': '#83B692',
  '--color-success-light': '#355A40',
  '--color-error': '#A20021',
} as const

describe('design tokens', () => {
  it.each(Object.entries(requiredColors))('defines %s exactly once as %s', (token, value) => {
    const tokenPattern = new RegExp(`${token.replaceAll('-', '\\-')}\\s*:\\s*${value}`, 'gi')
    expect(tokensCss.match(tokenPattern)).toHaveLength(1)
  })

  it('keeps raw color definitions out of component CSS', () => {
    expect(appCss.match(/#[\da-f]{6}/gi)).toBeNull()
  })

  it('centralizes the required font families', () => {
    expect(tokensCss).toContain("--font-interface: 'Manrope'")
    expect(tokensCss).toContain("--font-book: 'Literata'")
    expect(tokensCss).toContain("--font-arabic: 'Noto Naskh Arabic'")
  })

  it.each([
    '@fontsource/manrope',
    '@fontsource/literata',
    '@fontsource/noto-naskh-arabic',
  ])('loads %s from a local package', (fontPackage) => {
    expect(mainSource).toContain(fontPackage)
  })
})
