import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export const UmlLabActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [nodes, setNodes] = useState(savedData.nodes || [
    { id: 'n1', label: 'UserAccount', type: 'class', x: 50, y: 50, attributes: 'id, name, email', methods: 'login()' },
    { id: 'n2', label: 'AdminProfile', type: 'class', x: 300, y: 50, attributes: 'permissions', methods: 'auditLog()' }
  ]);
  
  const [edges, setEdges] = useState(savedData.edges || [
    { id: 'e1', source: 'n1', target: 'n2', relation: 'inheritance' }
  ]);

  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeType, setNodeType] = useState('class');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [relation, setRelation] = useState('association');
  const [submitting, setSubmitting] = useState(false);

  const handleAddNode = () => {
    if (nodeLabel.trim()) {
      const newNode = {
        id: `n_${Date.now()}`,
        label: nodeLabel.trim(),
        type: nodeType,
        attributes: nodeType === 'class' ? 'id, name' : '',
        methods: nodeType === 'class' ? 'save()' : ''
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
        relation
      };
      setEdges([...edges, newEdge]);
      setSourceNode('');
      setTargetNode('');
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
      diagramType: 'class'
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200 font-serif">
            UML Diagram Canvas
          </h2>
          <p className="text-sm text-slate-500">
            Define system layout nodes and configure relationships (association, inheritance, composition).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls column */}
          <div className="space-y-6 border-r pr-6 text-left">
            {/* Add Node form */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Add Component</h3>
              <Input
                placeholder="e.g. ShoppingCart"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
              />
              <Select
                options={[
                  { value: 'class', label: 'Class Box' },
                  { value: 'actor', label: 'Actor (Use Case)' },
                  { value: 'usecase', label: 'Use Case Oval' }
                ]}
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
              />
              <Button onClick={handleAddNode} variant="secondary" className="w-full text-xs">
                Add Element
              </Button>
            </div>

            {/* Add Connection form */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Connect Components</h3>
              <Select
                options={[
                  { value: '', label: 'From Component...' },
                  ...nodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
              />
              <Select
                options={[
                  { value: '', label: 'To Component...' },
                  ...nodes.map((n) => ({ value: n.id, label: n.label }))
                ]}
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
              />
              <Select
                options={[
                  { value: 'association', label: 'Association (Simple Link)' },
                  { value: 'inheritance', label: 'Generalization (Inheritance)' },
                  { value: 'composition', label: 'Composition (Filled Diamond)' }
                ]}
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
              <Button onClick={handleAddEdge} variant="secondary" className="w-full text-xs">
                Create Relationship
              </Button>
            </div>
          </div>

          {/* Canvas Preview column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider text-left">Canvas Preview</h3>
            
            <div className="border rounded-xl min-h-[300px] bg-slate-50/50 dark:bg-slate-950/20 relative p-6 flex flex-wrap gap-6 items-start justify-center">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border shadow-sm w-44 text-left relative bg-white dark:bg-slate-900 ${
                    node.type === 'actor'
                      ? 'border-yellow-200 dark:border-yellow-900/30'
                      : node.type === 'usecase'
                      ? 'border-pink-200 dark:border-pink-900/30 rounded-full text-center'
                      : 'border-indigo-200 dark:border-indigo-900/30'
                  }`}
                >
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="font-bold text-xs text-indigo-600 block">{node.type.toUpperCase()}</div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{node.label}</h4>
                  {node.type === 'class' && (
                    <div className="mt-2 pt-2 border-t text-[10px] text-slate-500 space-y-1 font-mono">
                      <div>Attr: {node.attributes || 'none'}</div>
                      <div>Ops: {node.methods || 'none'}</div>
                    </div>
                  )}
                </div>
              ))}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  Canvas is empty. Add elements in the left panel to begin.
                </div>
              )}
            </div>

            {/* List of active connections */}
            {edges.length > 0 && (
              <div className="space-y-2 pt-2 text-left">
                <h4 className="font-bold text-xs text-slate-500">Active Relationships</h4>
                <div className="flex flex-wrap gap-3">
                  {edges.map((edge) => {
                    const fromNode = nodes.find((n) => n.id === edge.source);
                    const toNode = nodes.find((n) => n.id === edge.target);
                    return (
                      <div key={edge.id} className="inline-flex items-center gap-2 p-2 border rounded-lg bg-slate-50 dark:bg-slate-900/50 text-[10px] font-semibold">
                        <span>{fromNode?.label}</span>
                        <ArrowRight size={10} className="text-indigo-500" />
                        <span className="text-slate-400 uppercase text-[9px]">{edge.relation}</span>
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

export default UmlLabActivity;
