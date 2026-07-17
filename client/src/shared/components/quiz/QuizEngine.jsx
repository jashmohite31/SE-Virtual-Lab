import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../lib/axiosInstance.js';
import { Button } from '../ui/Button.jsx';
import { Card, CardBody } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { CheckCircle2, XCircle, Award, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuizEngine = ({ experimentSlug, onComplete }) => {
  const queryClient = useQueryClient();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState({}); // questionId -> selectedIndex
  const [result, setResult] = useState(null); // stores the response from backend evaluation

  // Fetch the quiz questions (without correct indices)
  const { data: quizRes, isLoading, error } = useQuery({
    queryKey: ['quiz', experimentSlug],
    queryFn: () => axiosInstance.get(`/api/quizzes/${experimentSlug}`)
  });

  const submitAttempt = useMutation({
    mutationFn: (answers) => axiosInstance.post(`/api/quizzes/${experimentSlug}/attempt`, { answers }),
    onSuccess: (res) => {
      setResult(res.data.data);
      queryClient.invalidateQueries(['student-progress']);
      queryClient.invalidateQueries(['student-certificates']);
      if (onComplete) onComplete(res.data.data);
    }
  });

  const quiz = quizRes?.data?.data;
  const questions = quiz?.questions || [];

  const handleSelect = (qId, optionIdx) => {
    setSelections((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const answers = Object.entries(selections).map(([questionId, selectedIndex]) => ({
      questionId,
      selectedIndex
    }));
    submitAttempt.mutate(answers);
  };

  const handleRetry = () => {
    setSelections({});
    setCurrentIdx(0);
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="font-semibold">Failed to load quiz checkpoint.</p>
        <p className="text-xs mt-1">{error.response?.data?.message || 'Please try again.'}</p>
      </div>
    );
  }

  // Quiz evaluation results view
  if (result) {
    const { score, passed, certificate } = result;
    return (
      <div className="space-y-6">
        <Card className={`border-t-4 ${passed ? 'border-green-500' : 'border-red-500'}`}>
          <CardBody className="text-center p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-slate-50 dark:bg-slate-900">
              {passed ? (
                <CheckCircle2 className="text-green-500" size={48} />
              ) : (
                <XCircle className="text-red-500" size={48} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{passed ? 'Congratulations!' : 'Attempt Failed'}</h2>
              <p className="text-sm text-slate-500 mt-1">
                You scored <strong className="text-slate-900 dark:text-slate-100">{score}%</strong> on the assessment.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button onClick={handleRetry} variant="secondary" className="flex items-center gap-2">
                <RefreshCw size={14} /> Retry Quiz
              </Button>
              {passed && certificate && (
                <Link
                  to={`/certificates/${certificate.serialNumber}`}
                  className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm bg-indigo-650 hover:bg-indigo-750 text-white gap-2"
                >
                  <Award size={14} /> View Certificate <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Detailed graded questions review list */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <BookOpen size={18} /> Graded Question Review
          </h3>
          {result.questions.map((q, idx) => (
            <Card key={idx} className={`border-l-4 ${q.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <CardBody className="p-5 space-y-3 text-left">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Question {idx + 1}: {q.questionText}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = q.selectedIndex === optIdx;
                    const isCorrectOpt = q.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${
                          isCorrectOpt
                            ? 'border-green-200 bg-green-50/50 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-300'
                            : isSelected
                            ? 'border-red-200 bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-650'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrectOpt && <CheckCircle2 size={14} className="text-green-500" />}
                        {isSelected && !isCorrectOpt && <XCircle size={14} className="text-red-500" />}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border rounded-lg text-xs leading-relaxed text-slate-500 mt-2">
                    <strong className="text-slate-700 dark:text-slate-350 block mb-0.5">RATIONAL:</strong>
                    {q.explanation}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Active quiz stepper view
  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) return null;

  const selectedOpt = selections[currentQuestion._id];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-semibold">
        <Badge variant="info">
          Question {currentIdx + 1} of {questions.length}
        </Badge>
        <span className="text-slate-500">
          {Math.round(((currentIdx + 1) / questions.length) * 100)}% Progress
        </span>
      </div>

      <Card>
        <CardBody className="p-6 space-y-6 text-left">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {currentQuestion.questionText}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleSelect(currentQuestion._id, optIdx)}
                className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all hover:scale-[1.01] ${
                  selectedOpt === optIdx
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        <Button onClick={handlePrev} variant="secondary" disabled={currentIdx === 0}>
          Previous
        </Button>

        {currentIdx === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={Object.keys(selections).length < questions.length || submitAttempt.isPending}
          >
            {submitAttempt.isPending ? 'Grading...' : 'Submit Assessment'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="primary" disabled={selectedOpt === undefined}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
