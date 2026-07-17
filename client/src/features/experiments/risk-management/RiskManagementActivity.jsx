import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { ShieldAlert, Plus, Trash2, ArrowRight } from 'lucide-react';

export const RiskManagementActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [risks, setRisks] = useState(savedData.identifiedRisks || [
    { id: 'R1', description: 'Development team lacks experience in React Native.', likelihood: 3, impact: 4, exposure: 12, strategy: 'mitigate', action: 'Conduct 2 weeks of developer bootcamps.' },
    { id: 'R2', description: 'Database performance bottlenecks under peak concurrency.', likelihood: 2, impact: 5, exposure: 10, strategy: 'avoid', action: 'Migrate to DynamoDB / Serverless auto-scaling database.' }
  ]);

  const [description, setDescription] = useState('');
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [strategy, setStrategy] = useState('mitigate');
  const [action, setAction] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const strategyOptions = [
    { value: 'mitigate', label: 'Mitigate (Reduce Likelihood/Impact)' },
    { value: 'avoid', label: 'Avoid (Change plan to bypass risk)' },
    { value: 'transfer', label: 'Transfer (Delegate to third party)' },
    { value: 'accept', label: 'Accept (Acknowledge and proceed)' }
  ];

  const handleAddRisk = () => {
    if (description.trim() && action.trim()) {
      const exp = likelihood * impact;
      const newRisk = {
        id: `R${risks.length + 1}`,
        description: description.trim(),
        likelihood,
        impact,
        exposure: exp,
        strategy,
        action: action.trim()
      };
      setRisks([...risks, newRisk]);
      setDescription('');
      setAction('');
    }
  };

  const handleDeleteRisk = (id) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      identifiedRisks: risks,
      mitigationPlans: risks.map((r) => ({ riskId: r.id, action: r.action }))
    }, 'submitted');
    setSubmitting(false);
  };

  const getExposureBadge = (exposure) => {
    if (exposure >= 15) return { label: `High Risk (${exposure})`, variant: 'danger' };
    if (exposure >= 8) return { label: `Med Risk (${exposure})`, variant: 'warning' };
    return { label: `Low Risk (${exposure})`, variant: 'success' };
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={24} /> Software Project Risk Register
          </h2>
          <p className="text-sm text-slate-500">
            Identify potential threats, calculate their exposure matrix (Likelihood &times; Impact), and define mitigation actions.
          </p>
        </div>

        {/* Add Risk form */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl space-y-4 text-left">
          <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Register New Risk</h3>
          <Input
            label="Risk Description"
            placeholder="e.g. Server hosting provider fails to deliver SLA uptime."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Select
              label="Likelihood (1-5)"
              options={[1, 2, 3, 4, 5].map((v) => ({ value: String(v), label: String(v) }))}
              value={String(likelihood)}
              onChange={(e) => setLikelihood(Number(e.target.value))}
            />
            <Select
              label="Impact Severity (1-5)"
              options={[1, 2, 3, 4, 5].map((v) => ({ value: String(v), label: String(v) }))}
              value={String(impact)}
              onChange={(e) => setImpact(Number(e.target.value))}
            />
            <Select
              label="Mitigation Strategy"
              options={strategyOptions}
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            />
          </div>

          <Input
            label="Mitigation Action Plan"
            placeholder="e.g. Purchase secondary standby servers with automated DNS failover."
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />

          <Button onClick={handleAddRisk} variant="secondary" className="w-full text-xs">
            Add Risk to Register
          </Button>
        </div>

        {/* Risk Register Table */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 text-left">Current Risk Matrix</h3>
          <div className="space-y-3">
            {risks.map((risk) => {
              const badge = getExposureBadge(risk.exposure);
              return (
                <div key={risk.id} className="p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-indigo-650">{risk.id}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{risk.strategy}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{risk.description}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      <strong className="text-slate-700 dark:text-slate-350">Mitigation: </strong> {risk.action}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteRisk(risk.id)} className="text-red-500 hover:text-red-700 self-start sm:self-center">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {risks.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                Risk register is clean.
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Submitting register...' : 'Lock Register & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default RiskManagementActivity;
