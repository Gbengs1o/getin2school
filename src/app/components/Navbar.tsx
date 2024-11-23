// src/app/components/Navbar.tsx
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Sunset, MessageSquare, User, LogIn } from "lucide-react"
import UserDetails from "./UserDetails"

interface NavbarProps {
  aiMode: boolean;
  setAiMode: (value: boolean) => void;
}

const Navbar = ({ aiMode, setAiMode }: NavbarProps) => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkLoginStatus = () => {
      const userDetails = UserDetails.getUserDetails()
      setIsLoggedIn(!!userDetails)
    }

    // Initial check
    checkLoginStatus()

    // Set interval to check login status every second
    const intervalId = setInterval(checkLoginStatus, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  const toggleNav = () => setIsOpen(!isOpen)
  
  // Now using the setAiMode prop instead of local state
  const toggleAiMode = () => setAiMode(!aiMode)

  // Early return for SSR
  if (!mounted) {
    return (
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-primary">
                Getin2School
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              Getin2School
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/collection" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Collection
              </Link>
            </div>
          </div>

          {/* Theme, AI Mode Controls, and Account Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10' : ''}`}
                aria-label="Light Mode"
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10' : ''}`}
                aria-label="Dark Mode"
              >
                <Moon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme('afternoon')}
                className={`p-2 rounded-lg ${theme === 'afternoon' ? 'bg-primary/10' : ''}`}
                aria-label="Afternoon Mode"
              >
                <Sunset className="w-5 h-5" />
              </button>
            </div>

            {/* AI Mode Toggle - Now using the prop */}
            <button
              onClick={toggleAiMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                aiMode ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Mode</span>
            </button>

            {/* Account/Login Button */}
            {isLoggedIn ? (
              <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10 text-foreground"
              >
                <LogIn className="w-5 h-5" />
                <span>Login / Create Account</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleNav}
              className="p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/collection"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
              >
                Collection
              </Link>
              
              {/* Mobile Theme Switcher */}
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10' : ''}`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10' : ''}`}
                >
                  <Moon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('afternoon')}
                  className={`p-2 rounded-lg ${theme === 'afternoon' ? 'bg-primary/10' : ''}`}
                >
                  <Sunset className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile AI Mode Toggle */}
              <button
                onClick={toggleAiMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full ${
                  aiMode ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>AI Mode</span>
              </button>

              {/* Mobile Account/Login Button */}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Login / Create Account</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar