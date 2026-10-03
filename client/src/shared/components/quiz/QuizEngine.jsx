import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../lib/axiosInstance.js';
import { Button } from '../ui/Button.jsx';
import { Card, CardBody } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import {
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  BookOpen,
  History,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuizEngine = ({ experimentSlug, fallbackQuestions = null, onComplete }) => {
  const queryClient = useQueryClient();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState({}); // questionId -> selectedIndex
  const [result, setResult] = useState(null); // stores the response from backend evaluation
  const [showHistory, setShowHistory] = useState(false);
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);

  // Fetch the quiz questions (without correct indices)
  const { data: quizRes, isLoading, error } = useQuery({
    queryKey: ['quiz', experimentSlug],
    queryFn: () => axiosInstance.get(`/api/quizzes/${experimentSlug}`),
    retry: 1
  });

  // Fetch previous attempts for this quiz
  const { data: attemptsRes, refetch: refetchAttempts } = useQuery({
    queryKey: ['quiz-attempts', experimentSlug],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/quizzes/${experimentSlug}/attempts`);
        const serverAttempts = res.data?.data?.attempts || [];
        localStorage.setItem(`vlab_quiz_attempts_${experimentSlug}`, JSON.stringify(serverAttempts));
        return res;
      } catch (err) {
        const cached = localStorage.getItem(`vlab_quiz_attempts_${experimentSlug}`);
        if (cached) {
          return { data: { data: { attempts: JSON.parse(cached) } } };
        }
        return { data: { data: { attempts: [] } } };
      }
    }
  });

  const attempts = attemptsRes?.data?.data?.attempts || [];
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;

  const submitAttempt = useMutation({
    mutationFn: (answers) => axiosInstance.post(`/api/quizzes/${experimentSlug}/attempt`, { answers }),
    onSuccess: (res) => {
      setResult(res.data.data);
      queryClient.invalidateQueries(['student-progress']);
      queryClient.invalidateQueries(['student-certificates']);
      queryClient.invalidateQueries(['experiment-progress', experimentSlug]);
      queryClient.invalidateQueries(['quiz-attempts', experimentSlug]);
      if (onComplete) onComplete(res.data.data);
    }
  });

  const serverQuestions = quizRes?.data?.data?.questions;
  const isGeneric =
    serverQuestions &&
    serverQuestions.length > 0 &&
    serverQuestions[0]?.questionText?.includes('primary learning objective');
  const shouldUseFallback = Boolean(
    fallbackQuestions && (error || !serverQuestions || serverQuestions.length === 0 || isGeneric)
  );

  const questions = shouldUseFallback
    ? fallbackQuestions.map((q, idx) => ({ _id: q._id || `fallback-q-${idx}`, ...q }))
    : serverQuestions || [];

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

  const evaluateLocally = (answersMap) => {
    let correctCount = 0;
    const graded = questions.map((q) => {
      const selectedIndex = answersMap[q._id];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q._id,
        selectedIndex,
        isCorrect,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      };
    });
    const percentageScore = Math.round((correctCount / questions.length) * 100);
    const passed = percentageScore >= 60;

    const localAttempt = {
      _id: `local-att-${Date.now()}`,
      score: percentageScore,
      passed,
      createdAt: new Date().toISOString(),
      totalQuestions: questions.length,
      correctCount,
      questions: questions.map((q, idx) => ({
        questionText: q.questionText,
        options: q.options,
        selectedIndex: graded[idx].selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect: graded[idx].isCorrect,
        explanation: q.explanation
      }))
    };

    // Save to local cached attempts
    try {
      const existing = JSON.parse(localStorage.getItem(`vlab_quiz_attempts_${experimentSlug}`) || '[]');
      const updated = [localAttempt, ...existing];
      localStorage.setItem(`vlab_quiz_attempts_${experimentSlug}`, JSON.stringify(updated));
      queryClient.setQueryData(['quiz-attempts', experimentSlug], { data: { data: { attempts: updated } } });
    } catch (e) {
      console.warn('Could not cache local attempt', e);
    }

    // Save progress update to backend
    axiosInstance
      .post(`/api/progress/${experimentSlug}`, {
        quizCompleted: true,
        maxQuizScore: percentageScore
      })
      .catch(() => {});

    return {
      score: percentageScore,
      passed,
      questions: localAttempt.questions
    };
  };

  const handleSubmit = () => {
    const answers = Object.entries(selections).map(([questionId, selectedIndex]) => ({
      questionId,
      selectedIndex
    }));

    if (shouldUseFallback) {
      submitAttempt.mutate(answers, {
        onSuccess: (res) => {
          if (
            res.data?.data?.questions &&
            res.data.data.questions[0]?.questionText === questions[0]?.questionText
          ) {
            setResult(res.data.data);
          } else {
            const localResult = evaluateLocally(selections);
            setResult(localResult);
            if (onComplete) onComplete(localResult);
          }
        },
        onError: () => {
          const localResult = evaluateLocally(selections);
          setResult(localResult);
          if (onComplete) onComplete(localResult);
        }
      });
    } else {
      submitAttempt.mutate(answers, {
        onError: () => {
          if (fallbackQuestions) {
            const localResult = evaluateLocally(selections);
            setResult(localResult);
            if (onComplete) onComplete(localResult);
          }
        }
      });
    }
  };

  const handleRetry = () => {
    setSelections({});
    setCurrentIdx(0);
    setResult(null);
    setShowHistory(false);
  };

  const toggleExpandAttempt = (id) => {
    setExpandedAttemptId((prev) => (prev === id ? null : id));
  };

  if (isLoading && !fallbackQuestions) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !shouldUseFallback) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="font-semibold">Failed to load quiz checkpoint.</p>
        <p className="text-xs mt-1">{error.response?.data?.message || 'Please try again.'}</p>
      </div>
    );
  }

  // =========================================================================
  // VIEW: PREVIOUS ATTEMPTS HISTORY
  // =========================================================================
  if (showHistory) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <History size={18} className="text-indigo-600" /> Previous Quiz Attempts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your past quiz assessments, scores, timestamps, and answer breakdowns.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bestScore !== null && (
              <Badge variant="indigo" className="text-xs px-2.5 py-1">
                Best Score: {bestScore}%
              </Badge>
            )}
            <Button
              onClick={() => setShowHistory(false)}
              variant="secondary"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft size={14} /> Back to Assessment
            </Button>
          </div>
        </div>

        {attempts.length === 0 ? (
          <Card>
            <CardBody className="p-8 text-center space-y-3">
              <Clock size={36} className="mx-auto text-slate-400" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">No Previous Attempts Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't submitted any quiz attempts for this laboratory yet. Complete the practice quiz to see your
                history recorded here.
              </p>
              <Button onClick={() => setShowHistory(false)} variant="primary" className="text-xs">
                Start Practice Quiz
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((att, idx) => {
              const attemptNumber = attempts.length - idx;
              const isExpanded = expandedAttemptId === att._id;
              const formattedDate = att.createdAt
                ? new Date(att.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })
                : 'Recent attempt';

              return (
                <Card
                  key={att._id || idx}
                  className={`border-l-4 transition-all ${
                    att.passed ? 'border-l-emerald-500' : 'border-l-rose-500'
                  }`}
                >
                  <CardBody className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            Attempt #{attemptNumber}
                          </span>
                          <Badge variant={att.passed ? 'success' : 'danger'}>
                            {att.passed ? 'Passed' : 'Needs Improvement'}
                          </Badge>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {att.score}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {formattedDate}
                          </span>
                          <span>•</span>
                          <span>
                            {att.correctCount !== undefined
                              ? `${att.correctCount} / ${att.totalQuestions || 10} correct`
                              : `${Math.round(((att.score || 0) / 100) * (att.totalQuestions || 10))} / ${att.totalQuestions || 10} correct`}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleExpandAttempt(att._id)}
                        variant="secondary"
                        className="flex items-center gap-1.5 text-xs font-semibold self-start sm:self-center"
                      >
                        <BookOpen size={13} />
                        {isExpanded ? 'Hide Review' : 'Review Questions'}
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </Button>
                    </div>

                    {/* Expandable Question Breakdown for this Attempt */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                          Question Review for Attempt #{attemptNumber}
                        </h5>
                        {att.questions && att.questions.length > 0 ? (
                          att.questions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                                q.isCorrect
                                  ? 'bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/30'
                                  : 'bg-rose-50/30 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900/30'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  Q{qIdx + 1}: {q.questionText}
                                </span>
                                {q.isCorrect ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold shrink-0">
                                    <CheckCircle2 size={14} /> Correct
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-rose-600 font-bold shrink-0">
                                    <XCircle size={14} /> Incorrect
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = q.selectedIndex === optIdx;
                                  const isCorrectOpt = q.correctIndex === optIdx;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2.5 rounded-lg border text-[11px] font-medium flex items-center justify-between ${
                                        isCorrectOpt
                                          ? 'border-emerald-300 bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                                          : isSelected
                                          ? 'border-rose-300 bg-rose-100/60 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
                                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {isCorrectOpt && <CheckCircle2 size={13} className="text-emerald-600" />}
                                      {isSelected && !isCorrectOpt && (
                                        <XCircle size={13} className="text-rose-600" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {q.explanation && (
                                <div className="p-2.5 bg-white/70 dark:bg-slate-900/60 rounded-lg border text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                  <strong className="text-slate-700 dark:text-slate-300 mr-1">RATIONALE:</strong>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">
                            Detailed question logs not recorded for this legacy attempt.
                          </p>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: QUIZ EVALUATION RESULTS VIEW (Just submitted)
  // =========================================================================
  if (result) {
    const { score, passed, certificate } = result;
    return (
      <div className="space-y-6">
        <Card className={`border-t-4 ${passed ? 'border-emerald-500' : 'border-rose-500'}`}>
          <CardBody className="text-center p-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-slate-50 dark:bg-slate-900">
              {passed ? (
                <CheckCircle2 className="text-emerald-500" size={48} />
              ) : (
                <XCircle className="text-rose-500" size={48} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{passed ? 'Congratulations!' : 'Attempt Completed'}</h2>
              <p className="text-sm text-slate-500 mt-1">
                You scored <strong className="text-slate-900 dark:text-slate-100">{score}%</strong> on the assessment.
                {passed
                  ? ' Quiz milestone has been recorded!'
                  : ' You need 60% or higher to earn certification. You can retry anytime.'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button onClick={handleRetry} variant="secondary" className="flex items-center gap-2 text-xs">
                <RefreshCw size={14} /> Retry Quiz
              </Button>
              <Button
                onClick={() => setShowHistory(true)}
                variant="primary"
                className="flex items-center gap-2 text-xs"
              >
                <History size={14} /> View All Previous Attempts ({attempts.length})
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Detailed graded questions review list */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-left">
            <BookOpen size={18} /> Graded Question Review
          </h3>
          {result.questions.map((q, idx) => (
            <Card key={idx} className={`border-l-4 ${q.isCorrect ? 'border-emerald-500' : 'border-rose-500'}`}>
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
                            ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300'
                            : isSelected
                            ? 'border-rose-200 bg-rose-50/50 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-650'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrectOpt && <CheckCircle2 size={14} className="text-emerald-500" />}
                        {isSelected && !isCorrectOpt && <XCircle size={14} className="text-rose-500" />}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border rounded-lg text-xs leading-relaxed text-slate-500 mt-2">
                    <strong className="text-slate-700 dark:text-slate-350 block mb-0.5">RATIONALE:</strong>
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

  // =========================================================================
  // VIEW: ACTIVE QUIZ STEPPER VIEW
  // =========================================================================
  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) return null;

  const selectedOpt = selections[currentQuestion._id];

  return (
    <div className="space-y-6">
      {/* Quiz Top Action Bar with Attempts Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <Badge variant="info">
            Question {currentIdx + 1} of {questions.length}
          </Badge>
          <span className="text-slate-500">
            {Math.round(((currentIdx + 1) / questions.length) * 100)}% Progress
          </span>
        </div>

        <div className="flex items-center gap-2">
          {bestScore !== null && (
            <Badge variant="indigo" className="text-[11px] font-semibold">
              Best: {bestScore}%
            </Badge>
          )}
          <Button
            onClick={() => setShowHistory(true)}
            variant="secondary"
            className="flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5"
          >
            <History size={13} />
            Previous Attempts ({attempts.length})
          </Button>
        </div>
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
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300 shadow-sm'
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
