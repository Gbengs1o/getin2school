import React, { useState } from 'react';

const PopupAI1: React.FC<{
  onSubmit: (details: {
    subject: string;
    description: string;
    educationLevel: string;
    studyTime: number;
  }) => void;
}> = ({ onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [studyTime, setStudyTime] = useState(10);

  const handleSubmit = () => {
    if (!subject || !educationLevel || studyTime < 10) {
      alert('Please fill all required fields and ensure study time is at least 10 minutes');
      return;
    }

    onSubmit({
      subject,
      description,
      educationLevel,
      studyTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Learning Setup</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Subject</label>
          <input 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject (e.g., Mathematics, Physics)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">What topic under this subject or specific part of that topic would you like to learn</label>
          <input 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Topic: Algebra(Solving Quadratic Equations)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Education Level</label>
          <select 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
          >
            <option value="">Select education level</option>
            <option value="primary">Primary School</option>
            <option value="secondary">Secondary School</option>
            <option value="university">University</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Study Time (minutes)</label>
          <input 
            type="number"
            min={10}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={studyTime}
            onChange={(e) => setStudyTime(Number(e.target.value))}
          />
        </div>

        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          Note: This AI model is excellent with theoretical concepts but may have limitations with complex calculations.
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Start Learning Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupAI1;