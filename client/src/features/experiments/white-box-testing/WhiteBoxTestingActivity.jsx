import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { SQA_EXPERIMENT_DATA } from './sqaData.js';
import { CheckCircle2, XCircle, Play, Trash2, ChevronDown, ChevronUp, Calculator, GitBranch, Table2, Zap, BookOpen, AlertTriangle } from 'lucide-react';

const PRESETS = SQA_EXPERIMENT_DATA.codePresets;
const DATA = SQA_EXPERIMENT_DATA;

/* ─── SVG CFG Renderer ───────────────────────────────────────────── */
const NODE_W = 110;
const NODE_H = 38;

function CFGCanvas({ preset, activePaths, animatedNodeId }) {
  const { cfg } = preset;
  const nodeMap = {};
  cfg.nodes.forEach((n) => { nodeMap[n.id] = n; });

  const activeNodeIds = new Set();
  const activeEdgePairs = new Set();
  activePaths.forEach((pathId) => {
    const path = preset.paths.find((p) => p.id === pathId);
    if (!path) return;
    const segs = path.label.split('->');
    segs.forEach((id) => activeNodeIds.add(id.trim()));
    for (let i = 0; i < segs.length - 1; i++) {
      activeEdgePairs.add(`${segs[i].trim()}-${segs[i + 1].trim()}`);
    }
  });

  const maxX = Math.max(...cfg.nodes.map((n) => n.x)) + NODE_W + 20;
  const maxY = Math.max(...cfg.nodes.map((n) => n.y)) + NODE_H + 20;

  return (
    <svg
      viewBox={`0 0 ${maxX} ${maxY}`}
      width="100%"
      style={{ maxHeight: 460, overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
        </marker>
        <marker id="arr-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" />
        </marker>
        <marker id="arr-dim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#cbd5e1" />
        </marker>
        <marker id="arr-anim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-anim">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {cfg.edges.map((edge, i) => {
        const fromNode = nodeMap[edge.from];
        const toNode = nodeMap[edge.to];
        if (!fromNode || !toNode) return null;

        const x1 = fromNode.x + NODE_W / 2;
        const y1 = fromNode.y + NODE_H;
        const x2 = toNode.x + NODE_W / 2;
        const y2 = toNode.y;

        const pairKey = `${edge.from}-${edge.to}`;
        const isActive = activeEdgePairs.has(pairKey);
        const hasActive = activePaths.length > 0;

        const dx = x2 - x1;
        const dy = y2 - y1;
        // back-edge: curve to the side
        const isBack = y2 <= y1;
        let pathD;
        if (isBack) {
          pathD = `M${x1},${y1} C${x1 + 60},${y1 + 30} ${x2 + 60},${y2 - 30} ${x2},${y2}`;
        } else {
          const cx1 = x1 + dx * 0.1;
          const cy1 = y1 + dy * 0.4;
          const cx2 = x2 - dx * 0.1;
          const cy2 = y2 - dy * 0.4;
          pathD = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
        }

        const midX = (x1 + x2) / 2 + (isBack ? 50 : 0);
        const midY = (y1 + y2) / 2;

        return (
          <g key={i}>
            <path
              d={pathD}
              fill="none"
              stroke={isActive ? '#22c55e' : hasActive ? '#e2e8f0' : '#6366f1'}
              strokeWidth={isActive ? 2.5 : 1.5}
              markerEnd={isActive ? 'url(#arr-active)' : hasActive ? 'url(#arr-dim)' : 'url(#arr)'}
              style={{ transition: 'stroke 0.3s' }}
            />
            {edge.label && (
              <text x={midX} y={midY - 5} textAnchor="middle" fontSize="10" fill={isActive ? '#16a34a' : '#94a3b8'} fontWeight="700">
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {cfg.nodes.map((node) => {
        const isActive = activeNodeIds.has(node.id);
        const isAnimated = animatedNodeId === node.id;
        const hasActive = activePaths.length > 0;
        const isDecision = node.decision;

        const fill = isAnimated
          ? '#f59e0b'
          : isActive
          ? (isDecision ? '#16a34a' : '#4f46e5')
          : hasActive
          ? '#f1f5f9'
          : (isDecision ? '#eef2ff' : '#f8fafc');

        const stroke = isAnimated
          ? '#d97706'
          : isActive
          ? (isDecision ? '#15803d' : '#4338ca')
          : hasActive
          ? '#e2e8f0'
          : (isDecision ? '#6366f1' : '#cbd5e1');

        const textColor = (isActive || isAnimated) ? '#fff' : hasActive ? '#cbd5e1' : '#1e293b';

        const lines = node.label.split('\\n');

        return (
          <g key={node.id} style={{ filter: isAnimated ? 'url(#glow-anim)' : isActive ? 'url(#glow)' : 'none', transition: 'all 0.3s' }}>
            {isDecision ? (
              <polygon
                points={`${node.x + NODE_W / 2},${node.y} ${node.x + NODE_W},${node.y + NODE_H / 2} ${node.x + NODE_W / 2},${node.y + NODE_H} ${node.x},${node.y + NODE_H / 2}`}
                fill={fill}
                stroke={stroke}
                strokeWidth={isAnimated ? 3 : isActive ? 2.5 : 1.5}
                style={{ transition: 'all 0.3s' }}
              />
            ) : (
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={fill}
                stroke={stroke}
                strokeWidth={isAnimated ? 3 : isActive ? 2.5 : 1.5}
                style={{ transition: 'all 0.3s' }}
              />
            )}
            {lines.map((line, li) => (
              <text
                key={li}
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 + (li - (lines.length - 1) / 2) * 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight={(isActive || isAnimated) ? '700' : '500'}
                fill={textColor}
                style={{ transition: 'all 0.3s', userSelect: 'none' }}
              >
                {line}
              </text>
            ))}
            <circle cx={node.x} cy={node.y} r={8} fill={isAnimated ? '#d97706' : isActive ? '#4f46e5' : '#e2e8f0'} />
            <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="800" fill={(isActive || isAnimated) ? '#fff' : '#64748b'}>
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Complexity Calculator ──────────────────────────────────────── */
function ComplexityCalculator() {
  const [vals, setVals] = useState({ edges: '', nodes: '', predicates: '', regions: '' });

  const set = (k, v) => setVals((prev) => ({ ...prev, [k]: v }));

  const E = parseInt(vals.edges) || 0;
  const N = parseInt(vals.nodes) || 0;
  const P = parseInt(vals.predicates) || 0;
  const R = parseInt(vals.regions) || 0;

  const f1 = E - N + 2;
  const f2 = P + 1;
  const f3 = R + 1;
  const allSame = E && N && (f1 === f2) && (f2 === f3);
  const hasInput = E > 0 || N > 0 || P > 0 || R > 0;

  const getRisk = (v) => {
    if (v <= 10) return { label: 'Low Risk', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (v <= 20) return { label: 'Moderate Risk', cls: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (v <= 50) return { label: 'High Risk', cls: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Untestable', cls: 'text-red-600 bg-red-50 border-red-200' };
  };

  const risk = f1 > 0 ? getRisk(f1) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'edges', label: 'Edges (E)', placeholder: 'e.g. 7' },
          { id: 'nodes', label: 'Nodes (N)', placeholder: 'e.g. 6' },
          { id: 'predicates', label: 'Predicates (P)', placeholder: 'e.g. 2' },
          { id: 'regions', label: 'Regions (R)', placeholder: 'e.g. 2' }
        ].map((f) => (
          <div key={f.id} className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{f.label}</label>
            <input
              type="number"
              min="0"
              placeholder={f.placeholder}
              value={vals[f.id]}
              onChange={(e) => set(f.id, e.target.value)}
              className="px-3 py-2 text-sm font-mono border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {hasInput && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'E – N + 2P', value: f1, formula: `${E} – ${N} + 2 = ${f1}` },
            { name: 'P + 1', value: f2, formula: `${P} + 1 = ${f2}` },
            { name: 'R + 1', value: f3, formula: `${R} + 1 = ${f3}` }
          ].map((r) => (
            <div key={r.name} className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">{r.name}</div>
              <div className="font-mono text-xs text-slate-500 mb-1">{r.formula}</div>
              <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">{r.value}</div>
            </div>
          ))}
        </div>
      )}

      {hasInput && risk && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${risk.cls}`}>
          <span className="text-sm font-bold">Cyclomatic Complexity: V(G) = {f1}</span>
          <span className="text-xs font-bold px-2 py-1 rounded-lg border border-current">{risk.label}</span>
        </div>
      )}

      {hasInput && E > 0 && N > 0 && !allSame && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle size={14} className="text-amber-500 shrink-0" />
          <span className="text-xs text-amber-700">Results from different formulas don't match — double-check your N, E, P, and R values.</span>
        </div>
      )}
    </div>
  );
}

/* ─── Theory Card (expandable) ───────────────────────────────────── */
function TheoryCard({ name, text, example, icon }) {
  const [open, setOpen] = useState(false);
  const iconMap = {
    clipboard: '📋',
    branch: '🔀',
    path: '🛤️',
    condition: '⚖️'
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{iconMap[icon] || '📌'}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{name}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Example</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">{example}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── White-Box vs Black-Box Table ───────────────────────────────── */
function ComparisonTable({ data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-indigo-50 dark:bg-indigo-950/40">
            {data.columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-bold uppercase tracking-widest text-xs ${
                  i === 0
                    ? 'text-slate-500 w-40'
                    : i === 1
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-t border-slate-100 dark:border-slate-800 ${
                ri % 2 === 0 ? 'bg-white dark:bg-slate-900/40' : 'bg-slate-50/60 dark:bg-slate-900/20'
              } hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors`}
            >
              <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">{row[0]}</td>
              <td className="px-4 py-2.5 text-indigo-700 dark:text-indigo-300">{row[1]}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── SQA SDLC Timeline ──────────────────────────────────────────── */
function SQATimeline({ steps }) {
  const iconMap = {
    requirements: '📝',
    design: '🏗️',
    coding: '💻',
    testing: '🧪',
    maintenance: '🔧'
  };
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-base shrink-0">
              {iconMap[step.icon] || '•'}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-indigo-100 dark:bg-indigo-900/40 my-1" />}
          </div>
          <div className="pb-5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{step.phase}</span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{step.activity}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Activity Component ────────────────────────────────────── */
export const WhiteBoxTestingActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};
  const [selectedPresetId, setSelectedPresetId] = useState(savedData.presetId || PRESETS[0].id);
  const [testedPathIds, setTestedPathIds] = useState(new Set(savedData.testedPathIds || []));
  const [log, setLog] = useState(savedData.log || []);
  const [submitting, setSubmitting] = useState(false);
  const [runningPath, setRunningPath] = useState(null);
  const [animatedNodeId, setAnimatedNodeId] = useState(null);
  const [animatingPathId, setAnimatingPathId] = useState(null);

  // Section toggles
  const [showCalc, setShowCalc] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  const coverageCount = testedPathIds.size;
  const totalPaths = preset.paths.length;
  const coveragePercent = Math.round((coverageCount / totalPaths) * 100);
  const allCovered = coverageCount >= totalPaths;

  /* Step-by-step path animation */
  const animatePath = async (path) => {
    if (animatingPathId) return;
    setAnimatingPathId(path.id);
    const segs = path.label.split('->').map((s) => s.trim());
    for (const nodeId of segs) {
      setAnimatedNodeId(nodeId);
      await new Promise((r) => setTimeout(r, 500));
    }
    setAnimatedNodeId(null);
    setAnimatingPathId(null);

    // Mark as tested after animation
    const newTested = new Set([...testedPathIds, path.id]);
    const newEntry = {
      presetId: preset.id,
      pathId: path.id,
      pathLabel: path.label,
      description: path.description,
      inputs: path.inputs,
      expected: path.expected
    };
    setTestedPathIds(newTested);
    setLog((prev) => [...prev, newEntry]);
  };

  const handleRunPath = async (path) => {
    if (testedPathIds.has(path.id)) return;
    setRunningPath(path.id);
    await new Promise((r) => setTimeout(r, 600));
    const newTested = new Set([...testedPathIds, path.id]);
    const newEntry = {
      presetId: preset.id,
      pathId: path.id,
      pathLabel: path.label,
      description: path.description,
      inputs: path.inputs,
      expected: path.expected
    };
    setTestedPathIds(newTested);
    setLog((prev) => [...prev, newEntry]);
    setRunningPath(null);
  };

  const handleClearPaths = () => {
    setTestedPathIds(new Set());
    setLog([]);
    setAnimatedNodeId(null);
    setAnimatingPathId(null);
  };

  const handlePresetChange = (id) => {
    setSelectedPresetId(id);
    setTestedPathIds(new Set());
    setLog([]);
    setAnimatedNodeId(null);
    setAnimatingPathId(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave(
      {
        presetId: preset.id,
        presetLabel: preset.label,
        nodes: preset.nodes,
        edges: preset.edges,
        predicateNodes: preset.predicateNodes,
        complexity: preset.complexity,
        testedPathIds: [...testedPathIds],
        log,
        allPathsCovered: allCovered
      },
      'submitted'
    );
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">

      {/* ── Interactive Theory Sections ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Coverage Types */}
        <button
          onClick={() => setShowCalc((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
            showCalc
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
          }`}
        >
          <Calculator size={15} />
          Complexity Calculator
        </button>
        <button
          onClick={() => setShowComparison((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
            showComparison
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
          }`}
        >
          <Table2 size={15} />
          WB vs BB Comparison
        </button>
        <button
          onClick={() => setShowTimeline((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
            showTimeline
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
          }`}
        >
          <GitBranch size={15} />
          SQA in SDLC
        </button>
      </div>

      {/* Coverage Types (expandable cards) */}
      <Card>
        <CardBody className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={15} className="text-indigo-500" />
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Coverage Types — Click to Expand</h3>
          </div>
          <div className="space-y-2">
            {DATA.theory.whiteBoxPoints.map((pt) => (
              <TheoryCard key={pt.name} {...pt} />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Complexity Calculator */}
      {showCalc && (
        <Card>
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator size={15} className="text-indigo-500" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Interactive Complexity Calculator</h3>
            </div>
            <p className="text-xs text-slate-400">{DATA.complexityCalculator.description}</p>
            <ComplexityCalculator />
          </CardBody>
        </Card>
      )}

      {/* WB vs BB Comparison */}
      {showComparison && (
        <Card>
          <CardBody className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Table2 size={15} className="text-indigo-500" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">{DATA.theory.comparisonTable.heading}</h3>
            </div>
            <ComparisonTable data={DATA.theory.comparisonTable} />
          </CardBody>
        </Card>
      )}

      {/* SQA SDLC Timeline */}
      {showTimeline && (
        <Card>
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch size={15} className="text-indigo-500" />
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">{DATA.theory.sqaProcessHeading}</h3>
            </div>
            <SQATimeline steps={DATA.theory.sqaProcessSteps} />
          </CardBody>
        </Card>
      )}

      {/* Header + Preset Selector */}
      <Card>
        <CardBody className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                CFG Builder & Path Coverage Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a code preset, inspect its Control Flow Graph, and run or animate all basis paths to achieve 100% coverage.
              </p>
            </div>
            <div className="relative shrink-0">
              <select
                value={selectedPresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Complexity Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Nodes (N)', value: preset.nodes, color: 'indigo' },
              { label: 'Edges (E)', value: preset.edges, color: 'violet' },
              { label: 'Predicates (P)', value: preset.predicateNodes, color: 'purple' },
              { label: 'Regions', value: preset.regions, color: 'blue' },
              { label: 'V(G) = CC', value: preset.complexity, color: 'emerald', highlight: true }
            ].map((m) => (
              <div
                key={m.label}
                className={`p-3 rounded-xl border text-center ${m.highlight ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">{m.label}</span>
                <span className={`text-xl font-extrabold ${m.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Formula Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { name: 'E – N + 2P', result: preset.edges - preset.nodes + 2 },
              { name: 'P + 1', result: preset.predicateNodes + 1 },
              { name: 'Regions + 1', result: preset.regions }
            ].map((f) => (
              <div key={f.name} className="flex items-center justify-between p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{f.name}</span>
                <Badge variant="primary" className="text-xs font-extrabold">= {f.result}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* CFG + Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual CFG */}
        <Card>
          <CardBody className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Control Flow Graph</h3>
              <div className="flex gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-indigo-100 border border-indigo-400"></span>Sequential</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rotate-45 bg-indigo-50 border border-indigo-500"></span>Decision</span>
                {animatedNodeId && <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-amber-400 border border-amber-500"></span>Animating</span>}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-3 overflow-x-auto">
              <CFGCanvas preset={preset} activePaths={[...testedPathIds]} animatedNodeId={animatedNodeId} />
            </div>
          </CardBody>
        </Card>

        {/* Source Code */}
        <Card>
          <CardBody className="p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Source Code</h3>
            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed border border-slate-950 min-h-[200px]">
              {preset.code}
            </pre>
          </CardBody>
        </Card>
      </div>

      {/* Basis Paths + Test Runner */}
      <Card>
        <CardBody className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Basis Paths — Test Runner</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Run each independent path — or use <strong>Animate</strong> to trace it step-by-step through the CFG.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={allCovered ? 'success' : 'warning'} className="text-xs">
                {coveragePercent}% Coverage
              </Badge>
              <button
                onClick={handleClearPaths}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Reset
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${allCovered ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${coveragePercent}%` }}
            />
          </div>

          <div className="space-y-2">
            {preset.paths.map((path) => {
              const tested = testedPathIds.has(path.id);
              const running = runningPath === path.id;
              const animating = animatingPathId === path.id;
              return (
                <div
                  key={path.id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border transition-all ${
                    tested
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                      : animating
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={tested ? 'success' : 'default'} className="text-[10px] font-mono">{path.id}</Badge>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{path.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{path.description}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(path.inputs).map(([k, v]) => (
                        <span key={k} className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-0.5 font-mono">
                          {k}={String(v)}
                        </span>
                      ))}
                      <span className="text-[10px] bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-md px-2 py-0.5 font-mono text-emerald-600">
                        → {String(path.expected)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex gap-2">
                    {tested ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={16} /> Covered
                      </span>
                    ) : (
                      <>
                        {/* Animate Button */}
                        <button
                          onClick={() => animatePath(path)}
                          disabled={!!animatingPathId}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {animating ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              Animating…
                            </span>
                          ) : (
                            <><Zap size={12} /> Animate</>
                          )}
                        </button>
                        {/* Run Button */}
                        <Button
                          onClick={() => handleRunPath(path)}
                          variant="secondary"
                          className="text-xs flex items-center gap-1.5"
                          disabled={running || !!animatingPathId}
                        >
                          {running ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                              Running…
                            </span>
                          ) : (
                            <><Play size={12} /> Run</>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {allCovered && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">100% Path Coverage Achieved!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">All {totalPaths} independent basis paths have been exercised. You can now submit your results.</p>
              </div>
            </div>
          )}

          {/* Execution Log */}
          {log.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Execution Log</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[10px]">
                {log.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 text-slate-100">
                    <span className="text-indigo-400 font-bold">{entry.pathLabel}</span>
                    <span className="text-slate-400">{entry.description}</span>
                    <span className="text-emerald-400 font-bold">→ {String(entry.expected)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Button
        onClick={handleSubmit}
        variant="primary"
        className="w-full mt-2"
        disabled={submitting || !allCovered}
      >
        {submitting
          ? 'Submitting…'
          : !allCovered
          ? `Achieve 100% Coverage First (${coveragePercent}% done)`
          : 'Submit SQA Results'}
      </Button>
    </div>
  );
};

export default WhiteBoxTestingActivity;
