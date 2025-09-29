/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

// NO usar IIFE automático, sino funciones que se puedan llamar cuando sea necesario

const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = theme => localStorage.setItem('theme', theme)

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = theme => {
  if (theme === 'auto') {
    document.documentElement.setAttribute('data-bs-theme', 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}

const showActiveTheme = (theme, focus = false) => {
  const themeSwitcher = document.querySelector('#bd-theme')

  if (!themeSwitcher) {
    console.warn('Theme switcher not found')
    return
  }

  const themeSwitcherText = document.querySelector('#bd-theme-text')
  const activeThemeIcon = document.querySelector('.theme-icon-active use')
  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
  
  if (!btnToActive) {
    console.warn(`Button for theme "${theme}" not found`)
    return
  }

  const svgUseElement = btnToActive.querySelector('svg use')
  if (!svgUseElement) {
    console.warn(`SVG use element not found for theme "${theme}"`)
    return
  }

  const svgOfActiveBtn = svgUseElement.getAttribute('href')

  // Remove active class from all theme buttons
  document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
    element.classList.remove('active')
    element.setAttribute('aria-pressed', 'false')
  })

  // Set active theme
  btnToActive.classList.add('active')
  btnToActive.setAttribute('aria-pressed', 'true')
  
  if (activeThemeIcon) {
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
  }
  
  if (themeSwitcherText) {
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  }

  if (focus) {
    themeSwitcher.focus()
  }
}

// Función principal que se llamará desde index.js
const initColorModes = () => {
  'use strict'
  
  console.log('Inicializando color modes...')
  
  // Set initial theme
  setTheme(getPreferredTheme())

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  // Wait a bit for DOM elements to be ready
  setTimeout(() => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault()
          const theme = toggle.getAttribute('data-bs-theme-value')
          console.log('Switching to theme:', theme)
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  }, 200)
}