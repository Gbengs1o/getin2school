// src/app/page.tsx
import { Rocket, Brain, Sparkles, Laptop, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}

      <section className="text-center space-y-6 py-12">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
        Welcome to Getin2School
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
        Transforming education through AI and cutting-edge technology, making learning fun and accessible for everyone.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link href="/collection">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
            Get Started
          </button>
        </Link>
        <Link href="/about">
          <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
            Learn More
          </button>
        </Link>
      </div>
    </section>

      {/* Features Grid */}
      <section className="py-12 bg-muted/50 rounded-xl">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Getin2School?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Learning */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Personalized learning paths adapted to your unique needs and pace.
              </p>
            </div>

            {/* Interactive Experience */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Experience</h3>
              <p className="text-muted-foreground">
                Engaging content and activities that make learning enjoyable.
              </p>
            </div>

            {/* Smart Technology */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Laptop className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Technology</h3>
              <p className="text-muted-foreground">
                Cutting-edge tools and platforms for enhanced learning experience.
              </p>
            </div>

            {/* Global Community */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                Connect with learners worldwide and share knowledge.
              </p>
            </div>

            {/* Accessible Learning */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessible Learning</h3>
              <p className="text-muted-foreground">
                Education that fits your schedule and learning style.
              </p>
            </div>

            {/* Innovation */}
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover-scale">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Always up-to-date with the latest educational technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students already experiencing the future of education.
            </p>
            <Link href="/collection">
            <button className="px-8 py-4 bg-background text-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              Start Learning Now
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">AI-Powered Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Learning Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}