import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Cpu, Calculator } from 'lucide-react';

export const CostEstimationActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [mode, setMode] = useState(savedData.mode || 'organic');
  const [loc, setLoc] = useState(savedData.loc || 10000); // Lines of Code
  const [analystCapability, setAnalystCapability] = useState(1.0); // EM multiplier
  const [reliability, setReliability] = useState(1.0); // EM multiplier
  const [results, setResults] = useState({ effort: 0, time: 0, staff: 0 });
  const [submitting, setSubmitting] = useState(false);

  const modeOptions = [
    { value: 'organic', label: 'Organic (Simple, small team, stable specs)' },
    { value: 'semidetached', label: 'Semidetached (Medium size, mixed experience)' },
    { value: 'embedded', label: 'Embedded (Complex, rigid constraints, tight coupling)' }
  ];

  const emOptions = [
    { value: '0.75', label: 'Very High Capability (0.75)' },
    { value: '1.00', label: 'Nominal (1.00)' },
    { value: '1.40', label: 'Very Low Capability (1.40)' }
  ];

  const relOptions = [
    { value: '0.75', label: 'Very Low Reliability Requirement (0.75)' },
    { value: '1.00', label: 'Nominal (1.00)' },
    { value: '1.40', label: 'Critical Life-Support Reliability (1.40)' }
  ];

  useEffect(() => {
    calculateCocomo();
  }, [mode, loc, analystCapability, reliability]);

  const calculateCocomo = () => {
    const kloc = loc / 1000;
    
    // COCOMO I base parameters
    const params = {
      organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
      semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    }[mode];

    // Effort = a * (KLOC ^ b) * EMs
    const baseEffort = params.a * Math.pow(kloc, params.b);
    const totalEffort = baseEffort * analystCapability * reliability;

    // Time = c * (Effort ^ d)
    const time = params.c * Math.pow(totalEffort, params.d);
    const staff = totalEffort / time;

    setResults({
      effort: parseFloat(totalEffort.toFixed(2)),
      time: parseFloat(time.toFixed(2)),
      staff: parseFloat(staff.toFixed(1))
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      mode,
      loc,
      effortMultipliers: { analystCapability, reliability },
      calculatedEffort: results.effort,
      calculatedTime: results.time,
      calculatedStaff: results.staff
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            COCOMO Software Cost Estimation
          </h2>
          <p className="text-sm text-slate-500">
            Adjust Lines of Code and effort multipliers to calculate estimated effort and staff metrics.
          </p>
        </div>

        {/* Input variables */}
        <div className="space-y-4">
          <Select
            label="COCOMO Mode"
            options={modeOptions}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-350">
              Estimated Lines of Code (LOC): <strong className="text-indigo-600">{loc.toLocaleString()} lines</strong>
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={loc}
              onChange={(e) => setLoc(Number(e.target.value))}
              className="w-full h-2 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <Select
              label="Analyst Capability Multiplier"
              options={emOptions}
              value={String(analystCapability)}
              onChange={(e) => setAnalystCapability(Number(e.target.value))}
            />
            <Select
              label="System Reliability Requirement"
              options={relOptions}
              value={String(reliability)}
              onChange={(e) => setReliability(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Output metrics display */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calculator size={16} /> Estimated Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border text-center bg-slate-50 dark:bg-slate-900/50 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Effort Required</span>
              <span className="text-xl font-extrabold text-indigo-650 dark:text-indigo-400">{results.effort}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Person-Months (PM)</span>
            </div>
            <div className="p-4 rounded-xl border text-center bg-slate-50 dark:bg-slate-900/50 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Development Time</span>
              <span className="text-xl font-extrabold text-indigo-650 dark:text-indigo-400">{results.time}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Months (TDEV)</span>
            </div>
            <div className="p-4 rounded-xl border text-center bg-slate-50 dark:bg-slate-900/50 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Average Staffing</span>
              <span className="text-xl font-extrabold text-indigo-650 dark:text-indigo-400">{results.staff}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Full-Time Personnel</span>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Calculating...' : 'Lock Estimate & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default CostEstimationActivity;
