// src/app/layout.tsx
import { ThemeProvider } from "./components/theme-provider"
import { AutoTheme } from "./components/AutoTheme"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./globals.css"

export const metadata = {
  title: "Getin2School - Smart Education Platform",
  description: "Empowering education through AI and technology",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'afternoon']}
        >
          <AutoTheme />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}