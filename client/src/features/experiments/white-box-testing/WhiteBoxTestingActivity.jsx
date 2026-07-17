import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Bug, CheckCircle2 } from 'lucide-react';

export const WhiteBoxTestingActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const codeString = `function processOrder(amount, isMember) {
  let discount = 0;
  if (amount > 100) {      // Node 1 (Decision)
    if (isMember) {        // Node 2 (Decision)
      discount = 20;       // Node 3 (Action)
    } else {
      discount = 10;       // Node 4 (Action)
    }
  } else {
    discount = 0;          // Node 5 (Action)
  }
  return discount;         // Node 6 (Exit)
}`;

  const [nodes, setNodes] = useState(6);
  const [edges, setEdges] = useState(7);
  const [complexityInput, setComplexityInput] = useState('');
  const [testCases, setTestCases] = useState(savedData.pathsTested || [
    { a: 150, m: true, path: '1 -> 2 -> 3 -> 6', result: '20' }
  ]);
  const [amountInput, setAmountInput] = useState('');
  const [memberInput, setMemberInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddTestCase = () => {
    const amt = Number(amountInput);
    if (!amountInput) return;

    let path = '';
    let discount = 0;

    if (amt > 100) {
      if (memberInput) {
        path = '1 -> 2 -> 3 -> 6';
        discount = 20;
      } else {
        path = '1 -> 2 -> 4 -> 6';
        discount = 10;
      }
    } else {
      path = '1 -> 5 -> 6';
      discount = 0;
    }

    // Add if unique path
    if (!testCases.some((t) => t.path === path)) {
      setTestCases([...testCases, { a: amt, m: memberInput, path, result: String(discount) }]);
    }
    setAmountInput('');
    setMemberInput(false);
  };

  const handleClear = () => {
    setTestCases([]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const calculatedComplexity = edges - nodes + 2;
    const pathsCount = testCases.length;
    
    await onSave({
      nodes: Array.from({ length: nodes }).map((_, i) => ({ id: `n${i + 1}` })),
      edges: Array.from({ length: edges }).map((_, i) => ({ id: `e${i + 1}` })),
      complexity: calculatedComplexity,
      pathsTested: testCases,
      allPathsCovered: pathsCount >= 3 // Three unique paths cover the code block
    }, 'submitted');
    setSubmitting(false);
  };

  const uniquePathsCovered = testCases.length;
  const coveragePercent = Math.min(Math.round((uniquePathsCovered / 3) * 100), 100);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            Control Flow Graph & Path Coverage
          </h2>
          <p className="text-sm text-slate-500">
            Analyze execution branches. Calculate the Cyclomatic Complexity and write test scenarios to reach 100% path coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code panel */}
          <div className="space-y-4 text-left">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Source Code</h3>
            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-950">
              {codeString}
            </pre>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">CFG Nodes</span>
                <span className="text-sm font-extrabold">{nodes}</span>
              </div>
              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">CFG Edges</span>
                <span className="text-sm font-extrabold">{edges}</span>
              </div>
              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Complexity</span>
                <span className="text-sm font-extrabold text-indigo-650 dark:text-indigo-400">
                  {edges - nodes + 2}
                </span>
              </div>
            </div>
          </div>

          {/* Test Case executor */}
          <div className="space-y-6 text-left border-l lg:pl-6">
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Execute Test Scenarios</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Input Amount"
                  type="number"
                  placeholder="e.g. 150"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Member Status</span>
                  <label className="inline-flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={memberInput}
                      onChange={(e) => setMemberInput(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    Is Registered Member
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTestCase} variant="secondary" className="w-full text-xs">
                  Run Test Case
                </Button>
                <Button onClick={handleClear} variant="outline" className="text-xs">
                  Clear
                </Button>
              </div>
            </div>

            {/* Test Results */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Execution Path Log</h4>
                <Badge variant={coveragePercent === 100 ? 'success' : 'warning'}>
                  {coveragePercent}% Path Coverage
                </Badge>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto font-mono text-[10px]">
                {testCases.map((tc, idx) => (
                  <div key={idx} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <span className="font-bold text-indigo-500 block">Path: {tc.path}</span>
                      <span className="text-slate-500">Inputs: amount={tc.a}, member={String(tc.m)}</span>
                    </div>
                    <span className="font-bold text-green-600">Ret: {tc.result}</span>
                  </div>
                ))}
                {testCases.length === 0 && (
                  <div className="py-6 text-center text-slate-400 border border-dashed rounded-xl">
                    No paths tested yet. Execute inputs above to register coverage.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Test Results'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default WhiteBoxTestingActivity;
