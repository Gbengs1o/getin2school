"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Sunset, MessageSquare, User, LogIn } from "lucide-react"
import UserDetails from "../components/UserDetails"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userDetails = UserDetails.getUserDetails()
    setIsLoggedIn(!!userDetails)
  }, [])

  const toggleNav = () => setIsOpen(!isOpen)
  const toggleAiMode = () => setAiMode(!aiMode)

  // Don't render theme controls until mounted to prevent hydration mismatch
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

            {/* AI Mode Toggle */}
            <button
              onClick={toggleAiMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                aiMode ? 'bg-primary text-primary-foreground' : ''
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleNav}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleNav}
              >
                About
              </Link>
              <Link
                href="/collection"
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleNav}
              >
                Collection
              </Link>

              {/* Account/Login Link */}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleNav}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleNav}
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Login / Create Account</span>
                  </div>
                </Link>
              )}

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
                onClick={() => {
                  toggleAiMode();
                  toggleNav();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full ${
                  aiMode ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>AI Mode</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar