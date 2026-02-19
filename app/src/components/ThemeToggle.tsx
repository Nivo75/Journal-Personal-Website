import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Load theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    // Default to light mode if no preference saved
    const shouldBeDark = saved === 'dark'
    
    setIsDark(shouldBeDark)
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
