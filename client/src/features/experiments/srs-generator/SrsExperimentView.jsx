import React from 'react';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { QuizEngine } from '../../../shared/components/quiz/QuizEngine.jsx';
import SrsGeneratorActivity from './SrsGeneratorActivity.jsx';
import { SRS_EXPERIMENT_DATA } from './srsData.js';
import { CheckCircle2, Info, Laptop, FileText, Target, BookOpen, Layers, ShieldCheck, Database } from 'lucide-react';

export const SrsExperimentView = ({ activeTab, submission, onSave, slug }) => {
  const { aim, introduction, objective, theory, caseStudy, procedure } = SRS_EXPERIMENT_DATA;

  switch (activeTab) {
    case 'aim':
      return (
        <Card className="border-l-4 border-l-indigo-600 shadow-sm">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
              <Target size={20} />
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{aim.title}</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal bg-indigo-50/60 dark:bg-indigo-950/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              {aim.content}
            </p>
          </CardBody>
        </Card>
      );

    case 'introduction':
      return (
        <Card className="shadow-sm">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b pb-3">
              <BookOpen size={20} className="text-indigo-600" />
              <h3 className="font-extrabold text-lg font-serif">{introduction.title}</h3>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3 pt-1">
              {introduction.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardBody>
        </Card>
      );

    case 'objective':
      return (
        <Card className="shadow-sm">
          <CardBody className="p-6 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-serif">
                {objective.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{objective.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-1">
              {objective.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="mt-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      );

    case 'theory':
      return (
        <div className="space-y-6">
          {/* Definition and Purpose */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-serif border-b pb-3">
                {theory.definition.heading}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {theory.definition.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {theory.definition.specifies.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50/80 dark:bg-slate-900/50 space-y-1.5">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block">
                      {item.label}:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
                {theory.definition.closing}
              </div>
            </CardBody>
          </Card>

          {/* Core Characteristics */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-serif border-b pb-3">
                {theory.characteristics.heading}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {theory.characteristics.intro}
              </p>
              <div className="space-y-3">
                {theory.characteristics.items.map((char, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                    <span className="font-bold text-xs text-indigo-650 dark:text-indigo-400 block uppercase tracking-wider">
                      {char.name}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {char.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Requirement Classification */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-5">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-serif border-b pb-3">
                {theory.reqClassification.heading}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs block">User Requirements</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{theory.reqClassification.userReqs.replace('User Requirements: ', '')}</p>
                </div>
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs block">System Requirements</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{theory.reqClassification.systemReqs.replace('System Requirements: ', '')}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-1">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                    {theory.reqClassification.frHeading}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {theory.reqClassification.frText}
                  </p>
                </div>

                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/40 space-y-3">
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      {theory.reqClassification.nfrHeading}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {theory.reqClassification.nfrText}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {theory.reqClassification.nfrGroups.map((grp, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-900 border rounded-lg space-y-1">
                        <Badge variant="indigo" className="text-[10px]">{grp.name}</Badge>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{grp.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* IEEE 830 Structure */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-5">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-serif">
                  {theory.ieeeStructure.heading}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{theory.ieeeStructure.intro}</p>
              </div>

              <div className="space-y-4">
                {theory.ieeeStructure.sections.map((sec) => (
                  <div key={sec.number} className="p-4 border rounded-xl bg-slate-50/70 dark:bg-slate-900/40 space-y-3">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white font-extrabold text-xs rounded">
                        Section {sec.number}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {sec.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {sec.desc}
                    </p>

                    {sec.subsections && (
                      <div className="space-y-2.5 pt-1">
                        {sec.subsections.map((sub, sIdx) => (
                          <div key={sIdx} className="p-3 bg-white dark:bg-slate-900 border rounded-lg space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-indigo-650 dark:text-indigo-400 font-mono">
                                {sub.id} {sub.name}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{sub.text}</p>

                            {sub.interfaceDetails && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {sub.interfaceDetails.map((inf, iIdx) => (
                                  <div key={iIdx} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border text-[11px]">
                                    <strong className="text-indigo-600 dark:text-indigo-400 block">{inf.label}:</strong>
                                    <span className="text-slate-600 dark:text-slate-300">{inf.detail}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {sub.attributeDetails && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {sub.attributeDetails.map((att, aIdx) => (
                                  <div key={aIdx} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border text-[11px]">
                                    <strong className="text-emerald-600 dark:text-emerald-400 block">{att.label}:</strong>
                                    <span className="text-slate-600 dark:text-slate-300">{att.detail}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      );

    case 'srs-generator':
      return (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Laptop size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-100">SRS Generator Subsection</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Interactive requirement specification environment.
                </p>
              </div>
            </div>
            <Badge variant="indigo" className="text-xs">Interactive Tool</Badge>
          </div>
          <SrsGeneratorActivity submission={submission} onSave={onSave} />
        </div>
      );

    case 'case-study':
      return (
        <div className="space-y-6">
          {/* Case Study Title & Problem Description */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-serif">
                  {caseStudy.title}
                </h3>
                <Badge variant="indigo">Case Study</Badge>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {caseStudy.problemDescription.heading}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {caseStudy.problemDescription.summary}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {caseStudy.problemDescription.issuesIntro}
                </p>
                <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/30 rounded-xl space-y-1.5">
                  <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-700 dark:text-slate-300">
                    {caseStudy.problemDescription.issues.map((issue, idx) => (
                      <li key={idx} className="leading-relaxed">{issue}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/30 leading-relaxed">
                  {caseStudy.problemDescription.solution}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Statement of Purpose */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-3">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 font-serif">
                {caseStudy.sop.heading}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {caseStudy.sop.text}
              </p>
            </CardBody>
          </Card>

          {/* SRS Document Specification */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-6">
              <div className="border-b pb-3">
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 font-serif">
                  {caseStudy.srsDocument.heading}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{caseStudy.srsDocument.standard}</p>
              </div>

              {caseStudy.srsDocument.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-4 pt-2 border-b pb-6 last:border-b-0">
                  <h5 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {sec.num} {sec.title}
                  </h5>

                  {sec.details && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {sec.details.map((d, dIdx) => (
                        <div key={dIdx} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border space-y-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{d.heading}</span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{d.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.interfaces && (
                    <div className="space-y-3 pt-2">
                      <h6 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        3.1 Interfaces
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 space-y-1">
                          <strong className="text-indigo-600 dark:text-indigo-400 block">3.1.1 User Interfaces</strong>
                          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{sec.interfaces.user}</p>
                        </div>
                        <div className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 space-y-1">
                          <strong className="text-indigo-600 dark:text-indigo-400 block">3.1.2 Hardware Interfaces</strong>
                          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{sec.interfaces.hardware}</p>
                        </div>
                        <div className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 space-y-1">
                          <strong className="text-indigo-600 dark:text-indigo-400 block">3.1.3 Software Interfaces</strong>
                          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{sec.interfaces.software}</p>
                        </div>
                        <div className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 space-y-1">
                          <strong className="text-indigo-600 dark:text-indigo-400 block">3.1.4 Communications Interfaces</strong>
                          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">{sec.interfaces.communication}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {sec.databaseTables && (
                    <div className="space-y-3 pt-2">
                      <h6 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        3.2 Database
                      </h6>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-800">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold">Database Entity</th>
                              <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold">Schema Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sec.databaseTables.map((tbl, tIdx) => (
                              <tr key={tIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{tbl.name}</td>
                                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">{tbl.fields}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {sec.performance && (
                    <div className="space-y-3 pt-2">
                      <h6 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        3.3 Performance
                      </h6>
                      <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-700 dark:text-slate-300">
                        {sec.performance.map((perf, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">{perf}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sec.functionalReqs && (
                    <div className="space-y-3 pt-2">
                      <h6 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        3.4 Software System Attributes - Functional Requirements
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {sec.functionalReqs.map((fr, frIdx) => (
                          <div key={frIdx} className="p-3 border rounded-xl bg-slate-50/70 dark:bg-slate-900/40 space-y-1">
                            <strong className="text-indigo-600 dark:text-indigo-400 block">{fr.name}:</strong>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{fr.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sec.nonFunctionalReqs && (
                    <div className="space-y-3 pt-2">
                      <h6 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        3.4.2 Non-Functional Requirements
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        {sec.nonFunctionalReqs.map((nfr, nIdx) => (
                          <div key={nIdx} className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 space-y-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{nfr.cat}:</span>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{nfr.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sec.steps && (
                    <div className="space-y-2 pt-2">
                      <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {sec.steps.map((st, stIdx) => (
                          <p key={stIdx} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border leading-relaxed">
                            {st}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      );

    case 'procedure':
      return (
        <Card className="shadow-sm">
          <CardBody className="p-6 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-serif">
                {procedure.title}
              </h3>
            </div>
            <div className="space-y-3 pt-1">
              {procedure.steps.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs shrink-0">
                    {item.step}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      );

    case 'quiz':
      return (
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="mb-4 pb-3 border-b">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Practice Quiz</h3>
              <p className="text-xs text-slate-500">10 questions with 4 choices each.</p>
            </div>
            <QuizEngine experimentSlug={slug} />
          </CardBody>
        </Card>
      );

    default:
      return null;
  }
};

export default SrsExperimentView;
