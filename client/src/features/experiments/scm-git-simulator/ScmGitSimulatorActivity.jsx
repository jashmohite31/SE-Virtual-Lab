import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Terminal, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';

export const ScmGitSimulatorActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const [command, setCommand] = useState('');
  const [history, setHistory] = useState(savedData.commandsHistory || [
    'System initialized. Type a Git command to begin.',
    'Available commands: git status, git add, git commit -m "msg", git branch <name>, git checkout <name>'
  ]);
  const [unstaged, setUnstaged] = useState(['index.html', 'styles.css']);
  const [staged, setStaged] = useState([]);
  const [commits, setCommits] = useState(savedData.commits || [
    { hash: 'a1b2c3d', message: 'Initial commit', branch: 'main', parent: null }
  ]);
  const [branches, setBranches] = useState(savedData.branches || ['main']);
  const [currentBranch, setCurrentBranch] = useState(savedData.currentBranch || 'main');
  const [submitting, setSubmitting] = useState(false);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    const newHistory = [...history, `$ ${cmd}`];

    if (cmd === 'git status') {
      newHistory.push(`On branch ${currentBranch}`);
      if (unstaged.length === 0 && staged.length === 0) {
        newHistory.push('nothing to commit, working tree clean');
      } else {
        if (staged.length > 0) {
          newHistory.push(`Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tnew file:   ${staged.join('\n\tnew file:   ')}`);
        }
        if (unstaged.length > 0) {
          newHistory.push(`Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\tmodified:   ${unstaged.join('\n\tmodified:   ')}`);
        }
      }
    } else if (cmd.startsWith('git add ')) {
      const target = cmd.replace('git add ', '').trim();
      if (target === '.' || target === '*') {
        setStaged([...staged, ...unstaged]);
        setUnstaged([]);
        newHistory.push(`staged ${unstaged.length} files`);
      } else if (unstaged.includes(target)) {
        setStaged([...staged, target]);
        setUnstaged(unstaged.filter((f) => f !== target));
        newHistory.push(`staged file: ${target}`);
      } else {
        newHistory.push(`fatal: pathspec '${target}' did not match any files`);
      }
    } else if (cmd.startsWith('git commit ')) {
      const match = cmd.match(/git commit -m "([^"]+)"/);
      if (match) {
        const msg = match[1];
        if (staged.length === 0) {
          newHistory.push('On branch ' + currentBranch + '\nnothing added to commit but untracked files present (use "git add" to track)');
        } else {
          const hash = Math.random().toString(16).substring(2, 9);
          const lastCommit = commits[commits.length - 1];
          const newCommit = {
            hash,
            message: msg,
            branch: currentBranch,
            parent: lastCommit ? lastCommit.hash : null
          };
          setCommits([...commits, newCommit]);
          setStaged([]);
          newHistory.push(`[${currentBranch} ${hash}] ${msg}\n ${staged.length} files changed`);
        }
      } else {
        newHistory.push('error: commit message must be specified via -m "message"');
      }
    } else if (cmd.startsWith('git branch ')) {
      const branchName = cmd.replace('git branch ', '').trim();
      if (branches.includes(branchName)) {
        newHistory.push(`fatal: A branch named '${branchName}' already exists.`);
      } else {
        setBranches([...branches, branchName]);
        newHistory.push(`Created branch: ${branchName}`);
      }
    } else if (cmd.startsWith('git checkout ')) {
      const targetBranch = cmd.replace('git checkout ', '').trim();
      if (branches.includes(targetBranch)) {
        setCurrentBranch(targetBranch);
        newHistory.push(`Switched to branch '${targetBranch}'`);
      } else {
        newHistory.push(`error: pathspec '${targetBranch}' did not match any branch`);
      }
    } else {
      newHistory.push(`bash: ${cmd}: command not found. (Use git add, git commit, git branch, git checkout, git status)`);
    }

    setHistory(newHistory);
    setCommand('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      commandsHistory: history,
      branches,
      currentBranch,
      commitGraph: commits,
      editorContent: 'git-simulator-locked'
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            Git Simulator Laboratory
          </h2>
          <p className="text-sm text-slate-500">
            Stage changes, commit edits, structure branches, and view the Git DAG commit graph.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 bg-slate-900 text-green-400 font-mono text-xs rounded-xl h-80 overflow-y-auto space-y-2 border border-slate-950 text-left">
              {history.map((log, idx) => (
                <div key={idx} className="white-space-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3 text-slate-400 font-mono text-xs font-bold">$</span>
                <input
                  type="text"
                  placeholder="e.g. git add index.html"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button type="submit" variant="primary" className="text-xs">
                Run Command
              </Button>
            </form>
          </div>

          {/* SCM Visuals Sidebar */}
          <div className="space-y-6 text-left">
            {/* Git Status Card */}
            <Card>
              <CardBody className="p-4 space-y-3 text-xs">
                <h3 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-250">
                  <GitBranch size={16} /> Work Tree Status
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-slate-450 block uppercase text-[9px] mb-1">Staging Area</span>
                    {staged.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-green-500 font-semibold font-mono">
                        <CheckCircle size={12} /> {f}
                      </div>
                    ))}
                    {staged.length === 0 && <span className="text-slate-400 font-medium">none</span>}
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block uppercase text-[9px] mb-1">Modified / Unstaged</span>
                    {unstaged.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-red-500 font-semibold font-mono">
                        <AlertCircle size={12} /> {f}
                      </div>
                    ))}
                    {unstaged.length === 0 && <span className="text-slate-400 font-medium">none</span>}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Commit Log Card */}
            <Card>
              <CardBody className="p-4 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 dark:text-slate-250">Commit Log (DAG)</h3>
                <div className="space-y-2 max-h-36 overflow-y-auto font-mono">
                  {commits.map((c) => (
                    <div key={c.hash} className="p-2 border rounded bg-slate-50 dark:bg-slate-950/20 text-[10px]">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-indigo-500">{c.hash}</span>
                        <Badge variant="info">{c.branch}</Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-350">{c.message}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Complete Git Simulation'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default ScmGitSimulatorActivity;
