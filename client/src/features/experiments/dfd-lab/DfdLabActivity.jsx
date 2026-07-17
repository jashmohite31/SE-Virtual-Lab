import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export const DfdLabActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [nodes, setNodes] = useState(savedData.nodes || [
    { id: 'n1', label: 'Customer', type: 'entity' },
    { id: 'n2', label: 'Verify Login Credentials', type: 'process' },
    { id: 'n3', label: 'Users DB', type: 'datastore' }
  ]);

  const [edges, setEdges] = useState(savedData.edges || [
    { id: 'e1', source: 'n1', target: 'n2', label: 'Login Details' },
    { id: 'e2', source: 'n2', target: 'n3', label: 'Query Credentials' }
  ]);

  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeType, setNodeType] = useState('process');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [flowLabel, setFlowLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddNode = () => {
    if (nodeLabel.trim()) {
      const newNode = {
        id: `n_${Date.now()}`,
        label: nodeLabel.trim(),
        type: nodeType
      };
      setNodes([...nodes, newNode]);
      setNodeLabel('');
    }
  };

  const handleAddEdge = () => {
    if (sourceNode && targetNode && sourceNode !== targetNode) {
      const newEdge = {
        id: `e_${Date.now()}`,
        source: sourceNode,
        target: targetNode,
        label: flowLabel.trim() || 'Data Flow'
      };
      setEdges([...edges, newEdge]);
      setSourceNode('');
      setTargetNode('');
      setFlowLabel('');
    }
  };

  const handleDeleteNode = (id) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.source !== id && e.target !== id));
  };

  const handleDeleteEdge = (id) => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      nodes,
      edges,
      level: 1
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200 font-serif">
            Data Flow Diagram (DFD) Lab
          </h2>
          <p className="text-sm text-slate-500">
            Design Level-1 DFD flows. Standard elements include processes, entities, and data stores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel controls */}
          <div className="space-y-6 border-r pr-6 text-left">
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Add Element</h3>
              <Input
                placeholder="e.g. Process Payments"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
              />
              <Select
                options={[
                  { value: 'process', label: 'Process (Circle)' },
                  { value: 'entity', label: 'External Entity (Rect)' },
                  { value: 'datastore', label: 'Data Store (Open Box)' }
                ]}
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
              />
              <Button onClick={handleAddNode} variant="secondary" className="w-full text-xs">
                Add DFD Element
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Add Data Flow</h3>
              <Select
                options={[
                  { value: '', label: 'Source element...' },
                  ...nodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
              />
              <Select
                options={[
                  { value: '', label: 'Target element...' },
                  ...nodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
              />
              <Input
                placeholder="e.g. Invoice Info"
                value={flowLabel}
                onChange={(e) => setFlowLabel(e.target.value)}
              />
              <Button onClick={handleAddEdge} variant="secondary" className="w-full text-xs">
                Connect Flow
              </Button>
            </div>
          </div>

          {/* Canvas column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider text-left">Canvas Flow Panel</h3>

            <div className="border rounded-xl min-h-[300px] bg-slate-50/50 dark:bg-slate-950/20 relative p-6 flex flex-wrap gap-6 items-start justify-center">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 w-44 text-left relative bg-white dark:bg-slate-900 border shadow-sm ${
                    node.type === 'process'
                      ? 'border-indigo-200 dark:border-indigo-900/30 rounded-full text-center flex flex-col justify-center min-h-[96px]'
                      : node.type === 'datastore'
                      ? 'border-l-4 border-r-0 border-t border-b border-slate-350 dark:border-slate-800 rounded-none'
                      : 'border-slate-200 dark:border-slate-800 rounded-lg'
                  }`}
                >
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="font-bold text-[9px] text-indigo-500 block uppercase">{node.type}</div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{node.label}</h4>
                </div>
              ))}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  DFD canvas is empty. Add processes and entities to begin.
                </div>
              )}
            </div>

            {/* Flows list */}
            {edges.length > 0 && (
              <div className="space-y-2 pt-2 text-left">
                <h4 className="font-bold text-xs text-slate-500">Data Flow Vectors</h4>
                <div className="flex flex-wrap gap-3">
                  {edges.map((edge) => {
                    const fromNode = nodes.find((n) => n.id === edge.source);
                    const toNode = nodes.find((n) => n.id === edge.target);
                    return (
                      <div key={edge.id} className="inline-flex items-center gap-2 p-2 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-[10px] font-semibold">
                        <span>{fromNode?.label}</span>
                        <ArrowRight size={10} className="text-indigo-500" />
                        <span className="text-slate-400 font-mono font-bold">{edge.label}</span>
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

export default DfdLabActivity;
