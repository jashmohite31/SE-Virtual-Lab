import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Layout, Plus, Trash2, Eye, ShieldCheck } from 'lucide-react';

export const PrototypeUatActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [components, setComponents] = useState(savedData.components || [
    { id: 'c1', type: 'header', value: 'Customer Portal Login' },
    { id: 'c2', type: 'input', value: 'Enter email address' }
  ]);
  const [newType, setNewType] = useState('input');
  const [newValue, setNewValue] = useState('');
  const [uatPassed, setUatPassed] = useState(false);
  const [uatFeedback, setUatFeedback] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const compOptions = [
    { value: 'header', label: 'Title Header' },
    { value: 'input', label: 'Text Input Box' },
    { value: 'button', label: 'Submit Button' },
    { value: 'link', label: 'Navigation Link' }
  ];

  const handleAddComponent = () => {
    if (newValue.trim()) {
      const newComp = {
        id: `c_${Date.now()}`,
        type: newType,
        value: newValue.trim()
      };
      setComponents([...components, newComp]);
      setNewValue('');
    }
  };

  const handleDeleteComponent = (id) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleRunUAT = () => {
    // Requirements verification: must contain a header, an input, and a button.
    const feedbackList = [];
    const hasHeader = components.some((c) => c.type === 'header');
    const hasInput = components.some((c) => c.type === 'input');
    const hasButton = components.some((c) => c.type === 'button');

    if (hasHeader) {
      feedbackList.push('✅ Title Header: Present and styled.');
    } else {
      feedbackList.push('❌ Missing Requirement: UI must contain a Title Header.');
    }

    if (hasInput) {
      feedbackList.push('✅ Username/Email Input Box: Present.');
    } else {
      feedbackList.push('❌ Missing Requirement: UI must contain a Text Input Box.');
    }

    if (hasButton) {
      feedbackList.push('✅ Login Submission Button: Present.');
    } else {
      feedbackList.push('❌ Missing Requirement: UI must contain a Submit Button.');
    }

    const passed = hasHeader && hasInput && hasButton;
    setUatPassed(passed);
    setUatFeedback(feedbackList);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      components,
      connections: [],
      uatResults: { passed: uatPassed, feedback: uatFeedback }
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            Prototype Wireframe Builder & UAT
          </h2>
          <p className="text-sm text-slate-500">
            Assemble a basic layout mockup. Verify that all compliance requirements are met using the UAT evaluator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Component Drawer */}
          <div className="space-y-4 border-r pr-6 text-left">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">UI Elements Drawer</h3>
            <Select
              label="Component Type"
              options={compOptions}
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <Input
              label="Label Text / Placeholder"
              placeholder="e.g. Sign In"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Button onClick={handleAddComponent} variant="secondary" className="w-full text-xs flex items-center justify-center gap-1.5">
              <Plus size={14} /> Add Component
            </Button>
          </div>

          {/* Canvas mockup panel */}
          <div className="md:col-span-2 space-y-6 text-left">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider mb-3">Wireframe Mockup Screen</h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 min-h-[240px] space-y-4 max-w-sm mx-auto flex flex-col justify-center">
                {components.map((comp) => (
                  <div key={comp.id} className="relative group p-2 border rounded bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between text-xs">
                    {comp.type === 'header' && (
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250 w-full text-center py-1">{comp.value}</h4>
                    )}
                    {comp.type === 'input' && (
                      <input type="text" placeholder={comp.value} disabled className="w-full px-3 py-1.5 border rounded bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 text-[10px]" />
                    )}
                    {comp.type === 'button' && (
                      <button disabled className="w-full py-1.5 bg-indigo-600 text-white rounded font-bold text-[11px]">{comp.value}</button>
                    )}
                    {comp.type === 'link' && (
                      <span className="text-indigo-500 font-semibold hover:underline text-[10px] w-full text-center cursor-pointer">{comp.value}</span>
                    )}
                    <button
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="absolute top-1.5 right-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {components.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-12">Layout is empty. Add elements above.</p>
                )}
              </div>
            </div>

            {/* UAT Evaluator */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-250">User Acceptance Test Evaluator</h4>
                {uatFeedback.length > 0 && (
                  <Badge variant={uatPassed ? 'success' : 'danger'}>
                    {uatPassed ? 'UAT Approved' : 'Feedback Required'}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleRunUAT} variant="secondary" className="text-xs w-full flex items-center justify-center gap-1.5">
                  <Eye size={14} /> Run UAT Verification
                </Button>
              </div>

              {uatFeedback.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border rounded-xl space-y-2.5 text-xs font-semibold">
                  {uatFeedback.map((fb, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {fb}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Lock Mockup & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PrototypeUatActivity;
