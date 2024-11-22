import { Award, BookOpen, Target, Users2, GraduationCap, Heart } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
              About Getin2School
            </h1>
            <p className="text-xl text-muted-foreground">
              We&apos;re revolutionizing education by combining AI technology with engaging learning experiences, making quality education accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold">
                Empowering Students Through Technology
              </h2>
              <p className="text-muted-foreground">
                At Getin2School, we believe that quality education should be accessible to everyone. Our mission is to harness the power of AI and modern technology to create personalized, engaging learning experiences that adapt to each student&apos;s unique needs and learning style.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-6 rounded-xl shadow-lg">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Vision</h3>
                <p className="text-sm text-muted-foreground">
                  To become the global leader in AI-powered education
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Values</h3>
                <p className="text-sm text-muted-foreground">
                  Innovation, accessibility, and student success
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Method</h3>
                <p className="text-sm text-muted-foreground">
                  Engaging, interactive learning experiences
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg">
                <Users2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Global network of learners and educators
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do at Getin2School, from developing new features to supporting our students.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Excellence in Education",
                description: "We strive to provide the highest quality educational content and experiences, leveraging cutting-edge technology and proven pedagogical methods."
              },
              {
                icon: Users2,
                title: "Inclusive Learning",
                description: "We believe everyone deserves access to quality education, regardless of their background, location, or circumstances."
              },
              {
                icon: Award,
                title: "Innovation First",
                description: "We continuously innovate and improve our platform, incorporating the latest advances in AI and educational technology."
              }
            ].map((value, index) => (
              <div key={index} className="bg-background p-8 rounded-xl shadow-lg">
                <value.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {[
              {
                year: "2020",
                title: "The Beginning",
                description: "Getin2School was founded with a vision to revolutionize online education."
              },
              {
                year: "2021",
                title: "AI Integration",
                description: "Launched our first AI-powered learning features and personalized study paths."
              },
              {
                year: "2022",
                title: "Global Expansion",
                description: "Expanded our services to reach students across multiple countries."
              },
              {
                year: "2023",
                title: "Mobile Learning",
                description: "Launched our mobile app to make learning accessible anywhere, anytime."
              }
            ].map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-24 flex-shrink-0 pt-1">
                  <span className="text-xl font-bold text-primary">{event.year}</span>
                </div>
                <div className="flex-grow border-l-2 border-primary/20 pl-6 pb-8">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of the future of education. Start your learning journey with Getin2School today.
            </p>
            <Link href="/auth">
            <button className="px-8 py-4 bg-background text-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              Get Started Now
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}