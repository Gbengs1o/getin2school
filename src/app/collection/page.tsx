// src/app/collection/page.tsx
import {
  Bot,
  Smartphone,
  Book,
  BookOpen,
  Gamepad,
  Brain,
  Code,
  Star,
  Download
} from "lucide-react"
import Link from 'next/link'

export default function Collection() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Our Collection
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
          Discover our comprehensive suite of AI-powered educational tools and applications
        </p>
      </section>

      <section className="py-12 bg-muted/50 rounded-xl">
      <div className="container px-4">
        
        <h2 className="text-3xl font-bold text-center mb-12">AI Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Tutor */}
          <div className="flex flex-col bg-background rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
            <div className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Personal Tutor</h3>
              <p className="text-muted-foreground mb-4">
                24/7 personalized tutoring powered by advanced AI
              </p>
              <div className="text-xs text-yellow-600 mb-2">
                🔬 Beta Testing: This feature is now ready for beta testing!
              </div>
              <Link href="/ai-tutor">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>

          {/* Smart Study Planner */}
          <div className="flex flex-col bg-background rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
            <div className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Study Planner</h3>
              <p className="text-muted-foreground mb-4">
                AI-optimized study schedules and learning paths
              </p>
              <div className="text-xs text-orange-600 mb-2">
                🛠️ Development in Progress: Feature under active development
              </div>
              <Link href="/studyplannerai">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Plan Now
                </button>
              </Link>
            </div>
          </div>

          {/* Assignment Assistant */}
          <div className="flex flex-col bg-background rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
            <div className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Assignment Assistant</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered homework help and writing assistance
              </p>
              <div className="text-xs text-orange-600 mb-2">
                🛠️ Development in Progress: Feature under active development
              </div>
              <Link href="/assignmentassistant">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Get Help
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* App Store Section */}
<section className="py-12">
  <div className="container px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Educational Apps</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Learning App */}
      <div className="bg-background rounded-lg shadow-lg p-4 hover:scale-105 transition-transform">
        <div className="relative aspect-square mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
          <Book className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Interactive Learning</h3>
        <p className="text-sm text-muted-foreground mb-2">Creation in progress</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-muted-foreground">4.8</span>
        </div>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Quiz App */}
      <div className="bg-background rounded-lg shadow-lg p-4 hover:scale-105 transition-transform">
        <div className="relative aspect-square mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
          <Gamepad className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Educational Quiz Games</h3>
        <p className="text-sm text-muted-foreground mb-2">In beta testing phase</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-muted-foreground">4.7</span>
        </div>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Study Tools */}
      <div className="bg-background rounded-lg shadow-lg p-4 hover:scale-105 transition-transform">
        <div className="relative aspect-square mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
          <Code className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Study Tools</h3>
        <p className="text-sm text-muted-foreground mb-2">Will be available for public use soon</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-muted-foreground">4.9</span>
        </div>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Mobile Companion */}
      <div className="bg-background rounded-lg shadow-lg p-4 hover:scale-105 transition-transform">
        <div className="relative aspect-square mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Mobile Learning Companion</h3>
        <p className="text-sm text-muted-foreground mb-2">Creation in progress</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-muted-foreground">4.6</span>
        </div>
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Elevate Your Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get started with our AI-powered educational tools today
            </p>
            <button className="px-8 py-4 bg-background text-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              Explore All Features
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}