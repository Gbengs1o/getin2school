"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUpCircle } from "lucide-react"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Getin2School</h3>
            <p className="text-muted-foreground text-sm">
              Transforming education through AI and innovative technology, making learning accessible and enjoyable for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/FAQ" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-tutoring" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Tutoring
                </Link>
              </li>
              <li>
                <Link href="/virtual-classroom" className="text-muted-foreground hover:text-primary transition-colors">
                  Virtual Classroom
                </Link>
              </li>
              <li>
                <Link href="/mobile-learning" className="text-muted-foreground hover:text-primary transition-colors">
                  Mobile Learning
                </Link>
              </li>
              <li>
                <Link href="/personalized-learning" className="text-muted-foreground hover:text-primary transition-colors">
                  Personalized Learning
                </Link>
              </li>
              <li>
                <Link href="/study-resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Study Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>No1, Kudayisi Street Alapo Village Ibadan</span>
              </li>
              <li>
                <a href="tel:+1234567890" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>08050488519</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@getin2school.com" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>firewole8@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Getin2School. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Scroll to top"
              >
                <span className="text-sm">Back to top</span>
                <ArrowUpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer