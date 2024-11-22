// First, let's create the necessary files and structure

// /styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Light theme */
  --light-bg: #ffffff;
  --light-text: #1a1a1a;
  --light-accent: #4f46e5;
  
  /* Dark theme */
  --dark-bg: #1a1a1a;
  --dark-text: #ffffff;
  --dark-accent: #818cf8;
  
  /* Afternoon theme */
  --afternoon-bg: #fef3c7;
  --afternoon-text: #92400e;
  --afternoon-accent: #d97706;
}

.theme-light {
  background-color: var(--light-bg);
  color: var(--light-text);
}

.theme-dark {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

.theme-afternoon {
  background-color: var(--afternoon-bg);
  color: var(--afternoon-text);
}

// /components/Layout.js
import { useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  const [aiMode, setAiMode] = useState(false);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`min-h-screen theme-${theme}`}>
      <nav className="p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-80">
            GetIn2School
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-80">Home</Link>
            <Link href="/about" className="hover:opacity-80">About</Link>
            <Link href="/collection" className="hover:opacity-80">Collection</Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTheme('light')}
                className="px-3 py-1 rounded bg-white text-black"
              >
                Light
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className="px-3 py-1 rounded bg-gray-800 text-white"
              >
                Dark
              </button>
              <button
                onClick={() => toggleTheme('afternoon')}
                className="px-3 py-1 rounded bg-yellow-100 text-yellow-800"
              >
                Afternoon
              </button>
            </div>
            
            <button
              onClick={() => setAiMode(!aiMode)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              AI Mode
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {aiMode ? (
          <div className="fixed bottom-4 right-4 w-96 h-96 bg-white shadow-xl rounded-lg p-4">
            <div className="h-full flex flex-col">
              <div className="font-bold mb-2">AI Assistant</div>
              <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
                {/* Chat messages would go here */}
              </div>
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ) : null}
        
        {children}
      </main>

      <footer className="p-4 text-center">
        <p>&copy; 2024 GetIn2School. All rights reserved.</p>
      </footer>
    </div>
  );
}

// /pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

// /pages/index.js
export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to GetIn2School</h1>
      <p className="text-xl mb-8">
        Empowering education through AI and technology
      </p>
      <div className="max-w-2xl mx-auto">
        <p className="mb-6">
          Experience a new way of learning that's engaging, interactive, and tailored to your needs.
          With GetIn2School, quality education is just a tap away.
        </p>
        <button className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Start Learning
        </button>
      </div>
    </div>
  );
}

// /pages/about.js
export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About GetIn2School</h1>
      <div className="space-y-6">
        <p>
          GetIn2School is revolutionizing education by bringing AI-powered learning
          to students worldwide. Our mission is to make quality education accessible
          to anyone with a smartphone and internet connection.
        </p>
        <p>
          We believe that learning should be fun, engaging, and adaptable to each
          student's unique needs. Through our innovative platform, we combine
          cutting-edge AI technology with proven educational methods to create
          an immersive learning experience.
        </p>
        <h2 className="text-2xl font-bold mt-8">Our Vision</h2>
        <p>
          To create a world where quality education is accessible to all,
          regardless of geographical or economic barriers. We envision a future
          where technology and education work hand in hand to empower the next
          generation of learners.
        </p>
      </div>
    </div>
  );
}

// /pages/collection.js
export default function Collection() {
  const services = [
    {
      title: "AI Tutor",
      description: "24/7 personalized tutoring powered by advanced AI",
      icon: "🤖"
    },
    {
      title: "Interactive Courses",
      description: "Engaging lessons designed for mobile learning",
      icon: "📱"
    },
    {
      title: "Study Tools",
      description: "Smart apps and resources to enhance your learning",
      icon: "🛠️"
    },
    {
      title: "Progress Tracking",
      description: "AI-powered analytics to monitor your growth",
      icon: "📊"
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}