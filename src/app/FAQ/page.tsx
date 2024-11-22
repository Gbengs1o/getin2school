// src/app/faq.tsx
import Link from "next/link";

export default function FAQ() {
  const faqs = [
    {
      question: "What is Getin2School?",
      answer:
        "Getin2School is a platform that leverages AI and cutting-edge technology to provide personalized, accessible, and engaging learning experiences.",
    },
    {
      question: "How do I get started?",
      answer:
        "Click on the 'Get Started' button on the homepage or visit the Collection page to explore our courses and resources.",
    },
    {
      question: "Is Getin2School free to use?",
      answer:
        "We offer both free and premium resources. While many features are available for free, premium plans unlock advanced tools and courses.",
    },
    {
      question: "What kind of support is available?",
      answer:
        "Our team is available 24/7 to assist with any issues or questions. Reach out to us at support@getin2school.com.",
    },
    {
      question: "Can I access Getin2School on mobile devices?",
      answer:
        "Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktops.",
    },
    {
      question: "How does AI personalize learning?",
      answer:
        "Our AI analyzes your learning preferences, pace, and goals to create tailored learning paths and recommendations.",
    },
  ];

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
          Find answers to commonly asked questions about Getin2School.
        </p>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-muted/50 rounded-xl">
        <div className="container px-4 space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-12 text-center">
        <Link href="/">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
            Back to Home
          </button>
        </Link>
      </section>
    </div>
  );
}
