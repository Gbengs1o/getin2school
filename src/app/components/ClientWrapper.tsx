// src/app/components/ClientWrapper.tsx
'use client'

import { useState } from 'react'
import Navbar from "./Navbar"
import ChatButton from "./ChatButton"

interface ClientWrapperProps {
  children: React.ReactNode
}

const ClientWrapper = ({ children }: ClientWrapperProps) => {
  const [aiMode, setAiMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar aiMode={aiMode} setAiMode={setAiMode} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <ChatButton show={aiMode} />
    </div>
  );
};

export default ClientWrapper;