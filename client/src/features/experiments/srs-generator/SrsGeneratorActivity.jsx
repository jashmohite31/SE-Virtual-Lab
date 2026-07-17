import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Plus, Trash2 } from 'lucide-react';

export const SrsGeneratorActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};
  const [archetype, setArchetype] = useState(savedData.selectedArchetype || 'e-commerce');
  const [title, setTitle] = useState(savedData.title || 'SRS Document');
  const [scope, setScope] = useState(savedData.scope || '');
  const [frList, setFrList] = useState(savedData.functionalRequirements || [
    'User must be able to add products to the shopping cart.',
    'System must secure user password hashes using bcrypt.'
  ]);
  const [nfrList, setNfrList] = useState(savedData.nonFunctionalRequirements || [
    'The system checkout page must load within 1.5 seconds under full load.',
    'All transaction channels must verify SSL certificate signatures.'
  ]);
  const [newFr, setNewFr] = useState('');
  const [newNfr, setNewNfr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const archetypeOptions = [
    { value: 'e-commerce', label: 'E-Commerce Marketplace' },
    { value: 'hospital', label: 'Hospital Patient System' },
    { value: 'banking', label: 'Online Banking Platform' }
  ];

  const handleAddFR = () => {
    if (newFr.trim()) {
      setFrList([...frList, newFr.trim()]);
      setNewFr('');
    }
  };

  const handleAddNFR = () => {
    if (newNfr.trim()) {
      setNfrList([...nfrList, newNfr.trim()]);
      setNewNfr('');
    }
  };

  const handleDeleteFR = (idx) => {
    setFrList(frList.filter((_, i) => i !== idx));
  };

  const handleDeleteNFR = (idx) => {
    setNfrList(nfrList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      selectedArchetype: archetype,
      title,
      scope,
      functionalRequirements: frList,
      nonFunctionalRequirements: nfrList,
      interfaces: ['User Web Interface', 'Payment API Gateways']
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Project Archetype"
            options={archetypeOptions}
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
          />
          <Input
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">
            Project Scope & Objective
          </label>
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Describe the target scope, audience, and system purpose..."
            rows="3"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Functional Requirements */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Functional Requirements (FR)
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. System must send verification code on registration."
              value={newFr}
              onChange={(e) => setNewFr(e.target.value)}
            />
            <Button onClick={handleAddFR} variant="secondary" className="flex items-center justify-center p-2.5">
              <Plus size={18} />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {frList.map((fr, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-xs">
                <span>FR-{idx + 1}: {fr}</span>
                <button onClick={() => handleDeleteFR(idx)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Functional Requirements */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Non-Functional Requirements (NFR)
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. System database must maintain 99.9% availability."
              value={newNfr}
              onChange={(e) => setNewNfr(e.target.value)}
            />
            <Button onClick={handleAddNFR} variant="secondary" className="flex items-center justify-center p-2.5">
              <Plus size={18} />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {nfrList.map((nfr, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-xs">
                <span>NFR-{idx + 1}: {nfr}</span>
                <button onClick={() => handleDeleteNFR(idx)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Creating document...' : 'Generate SRS Document'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default SrsGeneratorActivity;
