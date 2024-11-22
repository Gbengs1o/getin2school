import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Privacy Policy
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
          Your privacy matters to us. Learn how we collect, use, and protect your personal information.
        </p>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 bg-muted/50 rounded-xl">
        <div className="container px-4 space-y-8">
          <h2 className="text-3xl font-bold">Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to Getin2School&apos;s Privacy Policy. This document explains how we handle your data.
          </p>

          <h2 className="text-3xl font-bold">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Personal details such as name, email address, and phone number.</li>
            <li>Usage data including your interactions with our platform.</li>
            <li>Cookies and tracking technologies to improve your experience.</li>
          </ul>

          <h2 className="text-3xl font-bold">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use your information to provide and enhance our services, including personalizing your experience, responding to inquiries, and improving our platform.
          </p>

          <h2 className="text-3xl font-bold">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, modify, or delete your personal data. Please contact us at{" "}
            <Link href="mailto:support@getin2school.com" className="text-primary underline">
              support@getin2school.com
            </Link>{" "}
            for assistance.
          </p>

          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions or concerns about this Privacy Policy, please reach out to us at{" "}
            <Link href="mailto:support@getin2school.com" className="text-primary underline">
              support@getin2school.com
            </Link>.
          </p>
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