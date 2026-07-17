import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Calendar, AlertTriangle } from 'lucide-react';

export const ProjectSchedulingActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const defaultTasks = [
    { id: 'T1', name: 'Requirements Analysis', duration: 3, predecessor: '' },
    { id: 'T2', name: 'System Architecture Design', duration: 2, predecessor: 'T1' },
    { id: 'T3', name: 'Module Coding', duration: 4, predecessor: 'T2' },
    { id: 'T4', name: 'Integration & Testing', duration: 3, predecessor: 'T3' },
    { id: 'T5', name: 'User Training & Signoff', duration: 2, predecessor: 'T4' }
  ];

  const [tasks, setTasks] = useState(savedData.tasks || defaultTasks);
  const [criticalPath, setCriticalPath] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    calculateSchedule();
  }, [tasks]);

  const calculateSchedule = () => {
    let computed = [];
    const taskMap = {};

    tasks.forEach((t) => {
      taskMap[t.id] = { ...t, start: 1, end: t.duration };
    });

    // Solve start/end days based on dependency order
    for (let i = 0; i < tasks.length; i++) {
      tasks.forEach((t) => {
        if (t.predecessor && taskMap[t.predecessor]) {
          const pred = taskMap[t.predecessor];
          const newStart = pred.end + 1;
          const newEnd = newStart + t.duration - 1;
          taskMap[t.id].start = newStart;
          taskMap[t.id].end = newEnd;
        }
      });
    }

    // Since dependencies are linear in this sandbox, the critical path is all sequential tasks
    const path = tasks.map((t) => t.id);
    setCriticalPath(path);
  };

  const handlePredecessorChange = (id, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, predecessor: value } : t)));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      tasks,
      dependencies: tasks.map((t) => ({ from: t.predecessor, to: t.id })),
      criticalPath
    }, 'submitted');
    setSubmitting(false);
  };

  // Find max end day for grid layout columns
  const maxDays = tasks.reduce((max, t) => {
    const end = t.predecessor ? (tasks.find((p) => p.id === t.predecessor)?.duration || 0) + t.duration + 5 : t.duration + 5;
    return end > max ? end : max;
  }, 16) || 16;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">
            Project Task Planner
          </h2>
          <p className="text-sm text-slate-500">
            Modify task dependencies to structure the timeline. Critical path tasks are flagged in red.
          </p>
        </div>

        {/* Task List Form */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="text-left">
                <span className="font-bold text-xs text-indigo-600 block">{task.id}</span>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{task.name}</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Duration: <strong className="text-slate-800 dark:text-slate-200">{task.duration} days</strong>
              </div>
              <Select
                label="Predecessor Task"
                options={[
                  { value: '', label: 'None' },
                  ...tasks.filter((t) => t.id !== task.id).map((t) => ({ value: t.id, label: `${t.id} - ${t.name}` }))
                ]}
                value={task.predecessor}
                onChange={(e) => handlePredecessorChange(task.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Gantt Timeline visualizer */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar size={16} /> Gantt Schedule Visualization
          </h3>

          <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            {/* Header timeline ticks */}
            <div className="flex border-b text-[10px] font-mono font-bold bg-slate-50 dark:bg-slate-900/50">
              <div className="w-1/3 px-4 py-2 border-r">Task</div>
              <div className="flex-1 flex divide-x">
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div key={idx} className="flex-1 text-center py-2">Day {idx + 1}</div>
                ))}
              </div>
            </div>

            {/* Task Bar Rows */}
            <div className="divide-y text-xs">
              {tasks.map((task) => {
                // Find start & end offset
                let startDay = 1;
                if (task.predecessor) {
                  const pred = tasks.find((t) => t.id === task.predecessor);
                  if (pred) {
                    // Linear accumulation
                    let acc = 0;
                    let current = pred;
                    while (current) {
                      acc += current.duration;
                      current = tasks.find((t) => t.id === current.predecessor);
                    }
                    startDay = acc + 1;
                  }
                }
                const endDay = startDay + task.duration - 1;

                const leftOffset = ((startDay - 1) / 14) * 100;
                const widthPercent = (task.duration / 14) * 100;

                const isCritical = criticalPath.includes(task.id);

                return (
                  <div key={task.id} className="flex items-center min-h-[48px]">
                    <div className="w-1/3 px-4 font-semibold text-slate-800 dark:text-slate-200 border-r py-2">
                      {task.id}: {task.name}
                    </div>
                    <div className="flex-1 relative h-full py-2 bg-slate-50/10 dark:bg-slate-950/10">
                      <div
                        className={`absolute h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-all ${
                          isCritical
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/10'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-500/10'
                        }`}
                        style={{
                          left: `${leftOffset}%`,
                          width: `${widthPercent}%`,
                          minWidth: '20px'
                        }}
                      >
                        {task.duration}d
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Saving schedule...' : 'Lock Schedule & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default ProjectSchedulingActivity;
