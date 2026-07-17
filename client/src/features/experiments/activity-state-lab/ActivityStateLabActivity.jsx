import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export const ActivityStateLabActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [actNodes, setActNodes] = useState(savedData.activityNodes || [
    { id: 'a1', label: 'Start', type: 'initial' },
    { id: 'a2', label: 'Submit Cart', type: 'action' },
    { id: 'a3', label: 'Payment Passed?', type: 'decision' },
    { id: 'a4', label: 'Success End', type: 'final' }
  ]);

  const [actEdges, setActEdges] = useState(savedData.activityEdges || [
    { id: 'ae1', source: 'a1', target: 'a2', guard: '' },
    { id: 'ae2', source: 'a2', target: 'a3', guard: '' },
    { id: 'ae3', source: 'a3', target: 'a4', guard: 'Yes' }
  ]);

  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeType, setNodeType] = useState('action');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [guardText, setGuardText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddNode = () => {
    if (nodeLabel.trim() || nodeType === 'initial' || nodeType === 'final') {
      const newNode = {
        id: `a_${Date.now()}`,
        label: nodeType === 'initial' ? 'Start' : nodeType === 'final' ? 'End' : nodeLabel.trim(),
        type: nodeType
      };
      setActNodes([...actNodes, newNode]);
      setNodeLabel('');
    }
  };

  const handleAddEdge = () => {
    if (sourceNode && targetNode && sourceNode !== targetNode) {
      const newEdge = {
        id: `ae_${Date.now()}`,
        source: sourceNode,
        target: targetNode,
        guard: guardText.trim()
      };
      setActEdges([...actEdges, newEdge]);
      setSourceNode('');
      setTargetNode('');
      setGuardText('');
    }
  };

  const handleDeleteNode = (id) => {
    setActNodes(actNodes.filter((n) => n.id !== id));
    setActEdges(actEdges.filter((e) => e.source !== id && e.target !== id));
  };

  const handleDeleteEdge = (id) => {
    setActEdges(actEdges.filter((e) => e.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      activityNodes: actNodes,
      activityEdges: actEdges,
      stateNodes: [],
      stateEdges: []
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200 font-serif">
            Activity & State Lab
          </h2>
          <p className="text-sm text-slate-500">
            Define process flowchart sequences. Connect actions with guard choices (e.g. Yes/No decisions).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6 border-r pr-6 text-left">
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Add Element</h3>
              <Input
                placeholder="e.g. Process Payment"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
              />
              <Select
                options={[
                  { value: 'action', label: 'Action Node (Box)' },
                  { value: 'decision', label: 'Decision Node (Diamond)' },
                  { value: 'initial', label: 'Initial Node (Start Circle)' },
                  { value: 'final', label: 'Final Node (End Circle)' }
                ]}
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
              />
              <Button onClick={handleAddNode} variant="secondary" className="w-full text-xs">
                Add Node
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Add Transition</h3>
              <Select
                options={[
                  { value: '', label: 'Source node...' },
                  ...actNodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
              />
              <Select
                options={[
                  { value: '', label: 'Target node...' },
                  ...actNodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
              />
              <Input
                placeholder="e.g. Yes (guard condition)"
                value={guardText}
                onChange={(e) => setGuardText(e.target.value)}
              />
              <Button onClick={handleAddEdge} variant="secondary" className="w-full text-xs">
                Connect Nodes
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider text-left">Flowchart Diagram</h3>

            <div className="border rounded-xl min-h-[300px] bg-slate-50/50 dark:bg-slate-950/20 relative p-6 flex flex-wrap gap-6 items-start justify-center">
              {actNodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 w-40 text-left relative bg-white dark:bg-slate-900 border shadow-sm ${
                    node.type === 'initial'
                      ? 'border-green-400 bg-green-50/20 dark:bg-green-950/20 rounded-full text-center flex items-center justify-center h-12 w-12 min-h-0'
                      : node.type === 'final'
                      ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20 rounded-full text-center flex items-center justify-center h-12 w-12 min-h-0'
                      : node.type === 'decision'
                      ? 'border-yellow-300 dark:border-yellow-900/30 transform rotate-45 flex items-center justify-center text-center h-20 w-20 min-h-0'
                      : 'border-indigo-200 dark:border-indigo-900/30 rounded-lg'
                  }`}
                >
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="absolute top-1 right-1 text-slate-400 hover:text-red-500 z-10"
                  >
                    <Trash2 size={10} />
                  </button>
                  <div className={node.type === 'decision' ? 'transform -rotate-45' : ''}>
                    <div className="font-bold text-[8px] text-indigo-500 block uppercase">{node.type}</div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{node.label}</h4>
                  </div>
                </div>
              ))}
              {actNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  Canvas flowchart is empty. Populate nodes to build.
                </div>
              )}
            </div>

            {/* Transitions list */}
            {actEdges.length > 0 && (
              <div className="space-y-2 pt-2 text-left">
                <h4 className="font-bold text-xs text-slate-500">Node Connections</h4>
                <div className="flex flex-wrap gap-3">
                  {actEdges.map((edge) => {
                    const fromNode = actNodes.find((n) => n.id === edge.source);
                    const toNode = actNodes.find((n) => n.id === edge.target);
                    return (
                      <div key={edge.id} className="inline-flex items-center gap-2 p-2 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-[10px] font-semibold">
                        <span>{fromNode?.label}</span>
                        <ArrowRight size={10} className="text-indigo-500" />
                        {edge.guard && <span className="text-slate-400 font-bold border-b border-indigo-200">[{edge.guard}]</span>}
                        <ArrowRight size={10} className="text-indigo-500" />
                        <span>{toNode?.label}</span>
                        <button onClick={() => handleDeleteEdge(edge.id)} className="text-slate-400 hover:text-red-500 ml-1">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Locking canvas...' : 'Lock Diagram & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default ActivityStateLabActivity;
