import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { ArrowLeft, ArrowRight, KanbanSquare, CheckSquare } from 'lucide-react';

export const AgileBoardActivity = ({ submission, onSave }) => {
  const savedData = submission?.data || {};

  const defaultTasks = [
    { id: 'usr-1', title: 'User authentication using JWT tokens.', column: 'todo', weight: 3 },
    { id: 'usr-2', title: 'Build interactive Class Diagrams canvas.', column: 'inprogress', weight: 5 },
    { id: 'usr-3', title: 'Write unit tests for COCOMO calculator module.', column: 'backlog', weight: 2 },
    { id: 'usr-4', title: 'Generate lab report PDF downloading scripts.', column: 'done', weight: 3 }
  ];

  const [tasks, setTasks] = useState(savedData.tasks || defaultTasks);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'border-slate-350' },
    { id: 'todo', title: 'To Do', color: 'border-indigo-400' },
    { id: 'inprogress', title: 'In Progress', color: 'border-yellow-450' },
    { id: 'done', title: 'Done', color: 'border-green-450' }
  ];

  const moveTask = (taskId, direction) => {
    const colOrder = ['backlog', 'todo', 'inprogress', 'done'];
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const currentIdx = colOrder.indexOf(t.column);
          const nextIdx = currentIdx + direction;
          if (nextIdx >= 0 && nextIdx < colOrder.length) {
            return { ...t, column: colOrder[nextIdx] };
          }
        }
        return t;
      })
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSave({
      columns: {
        backlog: tasks.filter((t) => t.column === 'backlog'),
        todo: tasks.filter((t) => t.column === 'todo'),
        inprogress: tasks.filter((t) => t.column === 'inprogress'),
        done: tasks.filter((t) => t.column === 'done')
      },
      tasks,
      burndownData: [
        { day: 1, remaining: 13 },
        { day: 2, remaining: 10 },
        { day: 3, remaining: 5 },
        { day: 4, remaining: 0 }
      ],
      dayCount: 4
    }, 'submitted');
    setSubmitting(false);
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2 text-left">
          <h2 className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <KanbanSquare className="text-indigo-600" size={24} /> Interactive Agile Board
          </h2>
          <p className="text-sm text-slate-500">
            Organize the sprint backlog items. Use the directional buttons to progress tasks through columns.
          </p>
        </div>

        {/* Board layout columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.column === col.id);
            return (
              <div key={col.id} className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-650 flex items-center gap-1.5">
                    {col.title}
                  </h3>
                  <Badge variant="info">{colTasks.length}</Badge>
                </div>

                <div className={`p-4 rounded-2xl border-t-4 border bg-slate-50 dark:bg-slate-905/30 min-h-[300px] space-y-3 flex flex-col justify-start ${col.color}`}>
                  {colTasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-xl bg-white dark:bg-slate-900 shadow-sm text-left text-xs font-semibold space-y-3 group hover:shadow transition-shadow">
                      <div>
                        <span className="font-bold text-[9px] text-indigo-500 block uppercase">{task.id}</span>
                        <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">{task.title}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t text-[10px]">
                        <span className="text-slate-400 font-bold">SP: {task.weight}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => moveTask(task.id, -1)}
                            disabled={col.id === 'backlog'}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                          >
                            <ArrowLeft size={12} />
                          </button>
                          <button
                            onClick={() => moveTask(task.id, 1)}
                            disabled={col.id === 'done'}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                          >
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-[10px] text-slate-400 py-12">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={handleSubmit} variant="primary" className="w-full mt-4" disabled={submitting}>
          {submitting ? 'Locking board...' : 'Complete Sprint & Submit'}
        </Button>
      </CardBody>
    </Card>
  );
};

export default AgileBoardActivity;
