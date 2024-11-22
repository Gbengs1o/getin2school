import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Terms of Service
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
          Understand the terms and conditions that govern your use of Getin2School&apos;s services.
        </p>
      </section>

      {/* Terms of Service Content */}
      <section className="py-12 bg-muted/50 rounded-xl">
        <div className="container px-4 space-y-8">
          <h2 className="text-3xl font-bold">Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to Getin2School! By accessing or using our services, you agree to abide by these Terms of Service.
          </p>

          <h2 className="text-3xl font-bold">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By registering, accessing, or using our platform, you acknowledge that you have read, understood, and agree to these terms. If you do not agree, please refrain from using our services.
          </p>

          <h2 className="text-3xl font-bold">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Ensure the accuracy of the information you provide.</li>
            <li>Respect other users and refrain from any malicious activity.</li>
            <li>Comply with all applicable laws and regulations.</li>
          </ul>

          <h2 className="text-3xl font-bold">Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content, logos, and materials on Getin2School are the intellectual property of Getin2School or its licensors. Unauthorized use is strictly prohibited.
          </p>

          <h2 className="text-3xl font-bold">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Getin2School is not liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </p>

          <h2 className="text-3xl font-bold">Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to suspend or terminate your account if you violate these terms or engage in unlawful activities.
          </p>

          <h2 className="text-3xl font-bold">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these Terms of Service from time to time. Continued use of our platform constitutes your acceptance of the updated terms.
          </p>

          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            For questions or concerns about these terms, please contact us at{" "}
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