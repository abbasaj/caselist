// app/(main)/client/case/intake/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const questions = [
  { id: 1, type: 'text', text: 'What is the case title?', key: 'title' },
  { id: 2, type: 'textarea', text: 'Can you describe the situation briefly?', key: 'brief' },
  { id: 3, type: 'specialization', text: 'Which legal specialization best fits your case?', key: 'specialization', options: ['Family Law', 'Criminal Law', 'Corporate Law', 'Real Estate'] },
];

export default function CaseIntakePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [caseSummary, setCaseSummary] = useState('');
  const router = useRouter();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialization = (option) => {
    setFormData((prev) => ({ ...prev, specialization: option }));
    handleNext();
  };

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gpt/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate summary');
      const data = await response.json();
      setCaseSummary(data.summary);
    } catch (error) {
      console.error(error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitCase = async () => {
    setIsLoading(true);
    // Submit final case summary and form data to your backend API
    // You'll need to create this API route in `app/api/cases/create/route.ts`
    try {
      const response = await fetch('/api/cases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, caseSummary }),
      });
      if (!response.ok) throw new Error('Failed to submit case');
      const data = await response.json();
      router.push(`/client/case/${data.caseId}`); // Redirect to the new case page
    } catch (error) {
      console.error(error);
      alert('Failed to submit case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-xl border border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Case Intake Form</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep < questions.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-4"
              >
                <h2 className="text-xl text-muted-text">
                  {questions[currentStep].text}
                </h2>
                
                {questions[currentStep].type === 'text' && (
                  <Input
                    type="text"
                    name={questions[currentStep].key}
                    value={formData[questions[currentStep].key] || ''}
                    onChange={handleChange}
                    className="rounded-2xl border border-accent p-4 focus:ring-primary focus:ring-offset-2"
                  />
                )}
                
                {questions[currentStep].type === 'textarea' && (
                  <textarea
                    name={questions[currentStep].key}
                    value={formData[questions[currentStep].key] || ''}
                    onChange={handleChange}
                    rows={4}
                    className="rounded-2xl border border-accent p-4 focus:ring-primary focus:ring-offset-2"
                  />
                )}

                {questions[currentStep].type === 'specialization' && (
                  <div className="flex flex-wrap gap-4">
                    {questions[currentStep].options.map((option) => (
                      <Button
                        key={option}
                        onClick={() => handleSpecialization(option)}
                        className="rounded-2xl border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <Button onClick={handlePrev} className="rounded-2xl bg-gray-500 text-white">Back</Button>
                  )}
                  {questions[currentStep].type !== 'specialization' && (
                    <Button onClick={handleNext} className="rounded-2xl bg-primary text-white">Next</Button>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === questions.length && !caseSummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-4"
              >
                <h2 className="text-xl text-center text-muted-text">
                  You're all set! Let's generate a formal summary.
                </h2>
                <Button 
                  onClick={generateSummary}
                  disabled={isLoading}
                  className="rounded-2xl bg-secondary text-white"
                >
                  {isLoading ? 'Generating...' : 'Generate Case Summary'}
                </Button>
              </motion.div>
            )}
            
            {caseSummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-primary">Generated Summary</h2>
                <pre className="mt-4 rounded-xl border border-accent bg-gray-100 p-4 text-muted-text">
                  {caseSummary}
                </pre>
                <div className="flex justify-between mt-6">
                  <Button onClick={submitCase} disabled={isLoading} className="rounded-2xl bg-primary text-white">
                    {isLoading ? 'Submitting...' : 'Submit Case & Find Lawyer'}
                  </Button>
                  {/* You'll add a PDF download button here later */}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
