import React, { useState, useEffect } from 'react';

interface AITutorGuidePopupProps {
  onClose: () => void;
}

const AITutorGuidePopup: React.FC<AITutorGuidePopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen the guide before
    const hasSeenGuide = localStorage.getItem('aiTutorGuideShown');
    
    if (!hasSeenGuide) {
      setIsVisible(true);
      localStorage.setItem('aiTutorGuideShown', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Welcome to Your AI Personal Tutor!</h2>
        
        <div className="space-y-4 text-gray-700">
          <section>
            <h3 className="font-semibold text-lg mb-2">How It Works</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Start by selecting your study subject, description, and desired study time</li>
              <li>An AI tutor will generate initial study notes to help you get started</li>
              <li>Chat with the AI tutor, ask questions, and dive deep into your learning topic</li>
              <li>The timer will track your study session and prepare practice questions at the end</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Study Session Features</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Real-time interaction with an AI tutor</li>
              <li>Personalized study notes generation</li>
              <li>Dynamic practice question creation</li>
              <li>Customizable study duration</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Tips for Best Experience</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Be specific about your learning goals</li>
              <li>Ask follow-up questions and seek clarification</li>
              <li>Use the chat to explore different aspects of your topic</li>
              <li>Review the generated practice questions at the end of your session</li>
            </ul>
          </section>

          <div className="text-sm text-gray-500 italic mt-4">
            Note: You can start a new session anytime by clicking the &ldquo;New Chat&rdquo; button
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.removeItem('aiTutorGuideShown');
                } else {
                  localStorage.setItem('aiTutorGuideShown', 'true');
                }
              }}
            />
            <span className="text-sm">Show this guide on next login</span>
          </label>
          <button 
            onClick={handleClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorGuidePopup;