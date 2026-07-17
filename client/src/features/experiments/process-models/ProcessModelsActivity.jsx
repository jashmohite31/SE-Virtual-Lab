import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ProcessModelsActivity = ({ submission, onSave }) => {
  const [selectedModel, setSelectedModel] = useState(submission?.data?.selectedModel || '');
  const [feedback, setFeedback] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const scenario = {
    title: 'Pacemaker Firmware Update',
    desc: 'You are contracting for a medical hardware firm. The task is to write a critical firmware patch for a heart pacemaker. System integrity is vital (life-threatening if failing). Requirements are fully specified, approved by regulators, and will not change. Budget is fixed.',
    correctModel: 'waterfall',
    options: [
      { value: 'waterfall', label: 'Waterfall Model (Sequential & Rigid)' },
      { value: 'spiral', label: 'Spiral Model (Risk-Driven & Iterative)' },
      { value: 'agile', label: 'Agile/Scrum Model (Flexible & Short Sprints)' }
    ]
  };

  useEffect(() => {
    if (selectedModel) {
      evaluateSelection(selectedModel);
    }
  }, [selectedModel]);

  const evaluateSelection = (model) => {
    if (model === 'waterfall') {
      setFeedback('✅ Correct Choice! The Pacemaker firmware project has highly stable, regulatory-mandated requirements with zero tolerance for errors. A sequential, rigid Waterfall process ensures complete validation and verification before release.');
      setTimeline([
        { phase: 'Requirements Specification', duration: '3 months', cost: '$50,000' },
        { phase: 'System Architecture Design', duration: '2 months', cost: '$30,000' },
        { phase: 'Rigid Implementation (Coding)', duration: '4 months', cost: '$60,000' },
        { phase: 'Vigorous Integration & Testing', duration: '3 months', cost: '$70,000' },
        { phase: 'Deployment & Medical Signoff', duration: '1 month', cost: '$20,500' }
      ]);
    } else if (model === 'spiral') {
      setFeedback('⚠️ Suboptimal. While the Spiral model addresses risk, it is extremely expensive and iterative. For fully fixed regulatory specs with zero expected requirements modifications, it introduces unnecessary iteration overhead.');
      setTimeline([
        { phase: 'Initial Risk Analysis', duration: '2 months', cost: '$40,000' },
        { phase: 'Prototyping Cycle 1', duration: '3 months', cost: '$60,005' },
        { phase: 'Prototyping Cycle 2', duration: '3 months', cost: '$60,000' },
        { phase: 'Verification & Testing', duration: '4 months', cost: '$80,000' }
      ]);
    } else {
      setFeedback('❌ Warning: High Risk! Agile processes emphasize change and quick releases. In medical firmware where a single code bug can be fatal, launching fast incremental sprints without exhaustive, sequential validation is highly dangerous and unacceptable.');
      setTimeline([
        { phase: 'Sprint 1: Core Drivers', duration: '2 weeks', cost: '$10,000' },
        { phase: 'Sprint 2: UI integration', duration: '2 weeks', cost: '$10,000' },
        { phase: 'Sprint 3: Refactoring', duration: '2 weeks', cost: '$10,000' },
        { phase: 'Regression Testing Sprints', duration: '12 weeks', cost: '$80,000' }
      ]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      selectedModel,
      simulationTimeline: timeline,
      calculatedMetrics: {
        totalDuration: timeline.reduce((acc, curr) => acc + parseFloat(curr.duration), 0) || 13,
        totalBudget: timeline.reduce((acc, curr) => acc + parseFloat(curr.cost.replace(/[^0-9.]/g, '')), 0) || 230500
      }
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            Case Scenario: {scenario.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border">
            {scenario.desc}
          </p>
        </div>

        <div className="space-y-4">
          <Select
            label="Select the most appropriate SDLC Model"
            options={[{ value: '', label: 'Choose a model...' }, ...scenario.options]}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          />

          {feedback && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold flex gap-2 ${
              selectedModel === 'waterfall'
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-300'
                : 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-300'
            }`}>
              {selectedModel === 'agile' ? <ShieldAlert className="shrink-0" size={18} /> : <AlertTriangle className="shrink-0" size={18} />}
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {timeline.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock size={16} /> Projected Simulation Timeline
            </h3>
            <div className="space-y-2.5">
              {timeline.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-350">
                    Phase {idx + 1}: {step.phase}
                  </span>
                  <div className="flex gap-4 font-mono font-bold text-slate-500">
                    <span>{step.duration}</span>
                    <span className="text-indigo-650">{step.cost}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              variant="primary"
              className="w-full mt-4"
              disabled={!selectedModel || submitting}
            >
              {submitting ? 'Submitting...' : 'Complete Simulation'}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ProcessModelsActivity;
