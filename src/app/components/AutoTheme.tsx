"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function AutoTheme() {
  const { setTheme } = useTheme() // Removed unused 'theme' variable
  const [autoThemeActive, setAutoThemeActive] = useState(true) // Flag to control AutoTheme

  useEffect(() => {
    const getTimeBasedTheme = () => {
      const hour = new Date().getHours()
      
      // 5 AM - 4 PM: Light mode
      if (hour >= 5 && hour < 16) {
        return 'light'
      }
      // 4 PM - 7 PM: Afternoon mode
      else if (hour >= 16 && hour < 19) {
        return 'afternoon'
      }
      // 7 PM - 5 AM: Dark mode
      else {
        return 'dark'
      }
    }

    if (autoThemeActive) {
      // Set initial theme
      setTheme(getTimeBasedTheme())

      // Disable AutoTheme after the first load
      setAutoThemeActive(false)
    }
  }, [autoThemeActive, setTheme])

  return null
}