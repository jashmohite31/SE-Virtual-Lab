import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card, CardBody } from '../../../shared/components/ui/Card.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import {
  buildIeeeSrsDocument,
  downloadIeeeSrsPdf,
  LMS_CASE_STUDY_PRESET
} from './srsPdfGenerator.js';
import {
  FileText,
  Download,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Shield,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const ARCHETYPE_PRESETS = {
  lms: LMS_CASE_STUDY_PRESET,
  ecommerce: {
    title: 'E-Commerce Marketplace Platform',
    sop: 'The proposed E-Commerce Marketplace is a full-featured web and mobile platform enabling registered vendors to list retail merchandise and retail consumers to discover, purchase, and review products. The application automates inventory synchronisation, cart management, encrypted payment processing, order dispatch tracking, and user feedback collection, providing high-speed and secure transactions across modern web browsers.',
    scope: 'The system encompasses customer account provisioning, product browsing, dynamic inventory status, payment gateway integration, order status workflows, and seller analytics. External physical warehouse robotics and freight vehicle tracking are excluded from the core boundary.',
    functionalRequirements: [
      { id: 'FR-01', name: 'Product Discovery', desc: 'Allows customers to search products by keyword, category filter, price range, and customer review rating.' },
      { id: 'FR-02', name: 'Cart Management', desc: 'Enables users to add items, modify quantities, view dynamic cart subtotals, and persist items across sessions.' },
      { id: 'FR-03', name: 'Secure Checkout & Payment', desc: 'Integrates third-party payment gateways for PCI-DSS compliant credit card, UPI, and net banking transactions.' },
      { id: 'FR-04', name: 'Order Tracking', desc: 'Provides real-time milestone updates (Processing, Dispatched, Out for Delivery, Delivered) with tracking numbers.' },
      { id: 'FR-05', name: 'Seller Inventory Portal', desc: 'Allows verified merchants to upload product media, modify price tiers, and receive low-inventory alerts.' }
    ],
    nonFunctionalRequirements: [
      { id: 'NFR-01', category: 'Performance', desc: 'Catalog search queries must return results within 800 milliseconds under a concurrent load of 1,000 requests.' },
      { id: 'NFR-02', category: 'Security', desc: 'All checkout transactions and session cookies must be encrypted over TLS 1.3 with SHA-256 signatures.' },
      { id: 'NFR-03', category: 'Availability', desc: 'The storefront platform must maintain 99.95% monthly operational uptime excluding planned maintenance.' },
      { id: 'NFR-04', category: 'Usability', desc: 'The checkout flow must require no more than 3 distinct navigational steps from cart to order confirmation.' }
    ]
  },
  hospital: {
    title: 'Hospital Patient & Clinical Management System (HMS)',
    sop: 'The Hospital Management System is a clinical web application designed to digitize healthcare workflows for doctors, nurses, administrative registrars, and outpatient clients. The system handles electronic patient intake, doctor appointment scheduling, digital medical record (EHR) archiving, pharmacy prescription routing, and diagnostic lab report dissemination, ensuring strict compliance with healthcare confidentiality standards.',
    scope: 'Encompasses outpatient/inpatient registration, appointment booking, physician examination logs, lab request tracking, and billing. Medical hardware telemetry and ICU ventilator integration are handled by separate specialized medical equipment networks.',
    functionalRequirements: [
      { id: 'FR-01', name: 'Patient Intake', desc: 'Registers patient demographics, emergency contacts, medical history, and assigned universal health ID.' },
      { id: 'FR-02', name: 'Doctor Consultation Scheduling', desc: 'Allows patients and desk staff to book, reschedule, or cancel physician appointments based on real-time availability.' },
      { id: 'FR-03', name: 'Electronic Health Records (EHR)', desc: 'Provides authorized physicians with digital chart entry for diagnosis notes, vitals, and treatment plans.' },
      { id: 'FR-04', name: 'Pharmacy Prescription Dispensing', desc: 'Electronically routes prescriptions to the in-house pharmacy, verifying medication stock and dosage guidelines.' },
      { id: 'FR-05', name: 'Diagnostic Lab Reports', desc: 'Enables pathologists to upload validated test results accessible directly by the consulting physician and patient.' }
    ],
    nonFunctionalRequirements: [
      { id: 'NFR-01', category: 'Security & HIPAA', desc: 'Patient clinical data must be encrypted with AES-256 at rest and accessed strictly via role-based access control.' },
      { id: 'NFR-02', category: 'Reliability', desc: 'System failover must occur within 30 seconds with zero corruption of ongoing clinical admissions data.' },
      { id: 'NFR-03', category: 'Performance', desc: 'Patient record search by universal identifier must display clinical summaries within 1 second.' },
      { id: 'NFR-04', category: 'Maintainability', desc: 'Audit trails must log every record view, modification, and export event for a minimum mandatory retention of 7 years.' }
    ]
  }
};

const NFR_CATEGORIES = [
  'Response Time & Performance',
  'Security & Access Control',
  'Reliability & Availability',
  'Usability & Accessibility',
  'Data Accuracy & Integrity',
  'Maintainability & Portability'
];

export const SrsGeneratorActivity = ({ submission, onSave, onSrsDownloaded, isDownloaded }) => {
  const { user } = useAuth();
  const savedData = submission?.data || {};

  // Form State initialized from saved submission or LMS default preset
  const [title, setTitle] = useState(savedData.title || LMS_CASE_STUDY_PRESET.title);
  const [sop, setSop] = useState(savedData.sop || LMS_CASE_STUDY_PRESET.sop);
  const [frList, setFrList] = useState(savedData.functionalRequirements || LMS_CASE_STUDY_PRESET.functionalRequirements);
  const [nfrList, setNfrList] = useState(savedData.nonFunctionalRequirements || LMS_CASE_STUDY_PRESET.nonFunctionalRequirements);

  // New item inputs
  const [newFrName, setNewFrName] = useState('');
  const [newFrDesc, setNewFrDesc] = useState('');
  const [newNfrCategory, setNewNfrCategory] = useState(NFR_CATEGORIES[0]);
  const [newNfrDesc, setNewNfrDesc] = useState('');

  // UI state
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Build the compiled IEEE SRS document structure
  const compiledDoc = buildIeeeSrsDocument({
    title,
    sop,
    functionalRequirements: frList,
    nonFunctionalRequirements: nfrList,
    studentName: user?.name || 'Student Engineer'
  });

  // Handler: Load Preset
  const handleLoadPreset = (key) => {
    const preset = ARCHETYPE_PRESETS[key] || LMS_CASE_STUDY_PRESET;
    setTitle(preset.title);
    setSop(preset.sop);
    setFrList(preset.functionalRequirements);
    setNfrList(preset.nonFunctionalRequirements);
  };

  // Handler: Clear / Reset to Blank
  const handleClear = () => {
    setTitle('');
    setSop('');
    setFrList([]);
    setNfrList([]);
  };

  // Handler: Add Functional Requirement
  const handleAddFR = (e) => {
    e?.preventDefault();
    if (!newFrName.trim()) return;

    const nextId = `FR-${String(frList.length + 1).padStart(2, '0')}`;
    const newEntry = {
      id: nextId,
      name: newFrName.trim(),
      desc: newFrDesc.trim() || newFrName.trim()
    };

    setFrList([...frList, newEntry]);
    setNewFrName('');
    setNewFrDesc('');
  };

  // Handler: Delete FR
  const handleDeleteFR = (idx) => {
    const updated = frList.filter((_, i) => i !== idx).map((item, i) => ({
      ...item,
      id: `FR-${String(i + 1).padStart(2, '0')}`
    }));
    setFrList(updated);
  };

  // Handler: Add Non-Functional Requirement
  const handleAddNFR = (e) => {
    e?.preventDefault();
    if (!newNfrDesc.trim()) return;

    const nextId = `NFR-${String(nfrList.length + 1).padStart(2, '0')}`;
    const newEntry = {
      id: nextId,
      category: newNfrCategory,
      desc: newNfrDesc.trim()
    };

    setNfrList([...nfrList, newEntry]);
    setNewNfrDesc('');
  };

  // Handler: Delete NFR
  const handleDeleteNFR = (idx) => {
    const updated = nfrList.filter((_, i) => i !== idx).map((item, i) => ({
      ...item,
      id: `NFR-${String(i + 1).padStart(2, '0')}`
    }));
    setNfrList(updated);
  };

  // Handler: Download PDF
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      downloadIeeeSrsPdf(compiledDoc);
      if (onSrsDownloaded) {
        onSrsDownloaded();
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handler: Save Work
  const handleSaveProgress = async (status = 'in-progress') => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave({
        title,
        sop,
        functionalRequirements: frList,
        nonFunctionalRequirements: nfrList,
        generatedAt: new Date().toISOString()
      }, status);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Navigation & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Sliders size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                IEEE Std 830-1998 SRS Studio
              </h2>
              <Badge variant="indigo" className="text-[10px] font-mono">IEEE 830</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify project parameters to generate a formal, verifiable IEEE SRS document and downloadable PDF.
            </p>
          </div>
        </div>

        {/* View Switcher & PDF Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText size={14} /> Requirements Input
            </button>
            <button
              onClick={() => {
                setViewMode('preview');
                handleSaveProgress('in-progress');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Eye size={14} /> IEEE Document Preview
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isDownloaded ? (
              <Badge variant="success" className="flex items-center gap-1 text-[11px] font-semibold py-1">
                <CheckCircle2 size={12} /> Downloaded & Completed
              </Badge>
            ) : (
              <Badge variant="warning" className="flex items-center gap-1 text-[11px] font-semibold py-1">
                <Download size={12} /> Download required (100%)
              </Badge>
            )}

            <Button
              onClick={handleDownloadPdf}
              variant="primary"
              disabled={isDownloading || !title.trim()}
              className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap shadow-sm"
            >
              <Download size={14} />
              {isDownloading ? 'Generating PDF...' : isDownloaded ? 'Re-download SRS PDF' : 'Download SRS PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: REQUIREMENTS INPUT EDITOR */}
      {/* ========================================================================= */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200 font-semibold">
              <Sparkles size={16} className="text-indigo-600" />
              <span>Reference Case Study:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset('lms')}
                className="px-3 py-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <BookOpen size={13} /> Load LMS Case Study (Theory Doc)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('ecommerce')}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-all"
              >
                E-Commerce
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('hospital')}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-all"
              >
                Hospital HMS
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all flex items-center gap-1 ml-1"
              >
                <RefreshCw size={12} /> Clear Blank
              </button>
            </div>
          </div>

          {/* Core Input 1: Title & SOP */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-5">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-serif">
                  1. Project Identification & Statement of Purpose (SOP)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define the product title and operational purpose to establish Section 1 (Introduction) and Section 2 (Overall Description).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Library Management System (LMS)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Statement of Purpose (SOP) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {sop.length} characters
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    value={sop}
                    onChange={(e) => setSop(e.target.value)}
                    placeholder="Describe the system problem context, target users (e.g. Readers, Librarians), core objectives, operational workflow, and technology constraints..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed font-sans transition-all"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tip: The SOP informs Section 1.1 (Purpose), 1.2 (Scope), and 2.1 (Product Perspective) in the IEEE 830 specification.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Core Input 2: Functional Requirements (FR) */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-serif">
                      2. Functional Requirements (FR)
                    </h3>
                    <Badge variant="indigo" className="text-xs font-mono">{frList.length} Defined</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Describe precise operations, transformations, workflows, and system reactions (Section 3.4.1).
                  </p>
                </div>
              </div>

              {/* Add FR Form */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 block uppercase tracking-wider">
                  Add Functional Requirement
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <Input
                      placeholder="Feature Name (e.g. Book Search)"
                      value={newFrName}
                      onChange={(e) => setNewFrName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Specification (e.g. Allows users to query titles by author/subject...)"
                      value={newFrDesc}
                      onChange={(e) => setNewFrDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddFR();
                      }}
                      className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFR}
                      variant="primary"
                      className="flex items-center gap-1 text-xs shrink-0 font-bold"
                    >
                      <Plus size={14} /> Add FR
                    </Button>
                  </div>
                </div>
              </div>

              {/* FR List */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {frList.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl">
                    No Functional Requirements added yet. Use the form above or click "Load LMS Case Study".
                  </div>
                ) : (
                  frList.map((fr, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded text-[11px] shrink-0 mt-0.5">
                          {fr.id}
                        </span>
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200 font-bold block mb-0.5">
                            {fr.name}
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {fr.desc}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFR(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                        title="Delete Requirement"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Core Input 3: Non-Functional Requirements (NFR) */}
          <Card className="shadow-sm">
            <CardBody className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-serif">
                      3. Non-Functional Requirements (NFR)
                    </h3>
                    <Badge variant="success" className="text-xs font-mono">{nfrList.length} Defined</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Define quality metrics, measurable performance thresholds, security criteria, and uptime (Section 3.4.2).
                  </p>
                </div>
              </div>

              {/* Add NFR Form */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                  Add Non-Functional Requirement
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <select
                      value={newNfrCategory}
                      onChange={(e) => setNewNfrCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {NFR_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Measurable specification (e.g. System queries respond within 1.5 seconds...)"
                      value={newNfrDesc}
                      onChange={(e) => setNewNfrDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNFR();
                      }}
                      className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddNFR}
                      variant="success"
                      className="flex items-center gap-1 text-xs shrink-0 font-bold"
                    >
                      <Plus size={14} /> Add NFR
                    </Button>
                  </div>
                </div>
              </div>

              {/* NFR List */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {nfrList.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl">
                    No Non-Functional Requirements added yet. Use the form above or click "Load LMS Case Study".
                  </div>
                ) : (
                  nfrList.map((nfr, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] shrink-0 mt-0.5">
                          {nfr.id}
                        </span>
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-300 font-bold block mb-0.5">
                            {nfr.category}
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {nfr.desc}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNFR(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                        title="Delete Requirement"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>
                {frList.length} Functional &amp; {nfrList.length} Non-Functional specifications ready
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isSaving}
                onClick={() => handleSaveProgress('in-progress')}
                className="text-xs"
              >
                {isSaving ? 'Saving Draft...' : saveSuccess ? 'Saved!' : 'Save Progress Draft'}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setViewMode('preview');
                  handleSaveProgress('in-progress');
                }}
                className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 shadow-md shadow-indigo-600/20"
              >
                <span>Generate IEEE 830 Specification</span>
                <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: IEEE 830 SPECIFICATION LIVE DOCUMENT PREVIEW & PDF DOWNLOAD */}
      {/* ========================================================================= */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-indigo-950 dark:text-indigo-200">
              <Button
                variant="secondary"
                onClick={() => setViewMode('editor')}
                className="flex items-center gap-1.5 text-xs py-1.5"
              >
                <ArrowLeft size={14} /> Back to Editor
              </Button>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="font-semibold hidden sm:inline">
                Viewing formal IEEE Std 830-1998 generated document
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => handleSaveProgress('submitted')}
                disabled={isSaving}
                className="text-xs py-1.5"
              >
                {isSaving ? 'Submitting...' : saveSuccess ? 'Work Submitted!' : 'Submit Lab Activity'}
              </Button>
              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2 text-xs font-bold py-1.5 px-4 shadow-sm"
              >
                <Download size={14} />
                {isDownloading ? 'Generating PDF...' : 'Download SRS PDF Document'}
              </Button>
            </div>
          </div>

          {/* Academic Document Paper Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-6 sm:p-10 space-y-8 font-serif max-w-4xl mx-auto">
            {/* Document Cover / Title Header */}
            <div className="border-b-2 border-slate-800 dark:border-slate-200 pb-6 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-indigo-600 text-white font-mono font-bold text-[11px] rounded tracking-widest uppercase">
                  {compiledDoc.metadata.standard}
                </span>
                <span className="text-xs text-slate-500 font-sans">
                  Status: <strong className="text-emerald-600">{compiledDoc.metadata.version}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                {compiledDoc.metadata.documentTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans pt-1">
                <span>Date: <strong>{compiledDoc.metadata.date}</strong></span>
                <span>•</span>
                <span>Organization: <strong>{compiledDoc.metadata.organization}</strong></span>
              </div>
            </div>

            {/* SECTION 1: INTRODUCTION */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded">
                  1.0
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                  Introduction
                </h2>
              </div>

              {compiledDoc.sections.introduction.subsections.map((sub, idx) => (
                <div key={idx} className="space-y-2 pl-2">
                  <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                    {sub.num} {sub.title}
                  </h3>
                  {sub.content && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      {sub.content}
                    </p>
                  )}
                  {sub.items && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-sans text-xs">
                      {sub.items.map((term, tIdx) => (
                        <div key={tIdx} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-800">
                          <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                            {term.term}
                          </strong>
                          <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {term.definition}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* SECTION 2: THE OVERALL DESCRIPTION */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded">
                  2.0
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                  The Overall Description
                </h2>
              </div>

              {compiledDoc.sections.overallDescription.subsections.map((sub, idx) => (
                <div key={idx} className="space-y-2 pl-2">
                  <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                    {sub.num} {sub.title}
                  </h3>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {sub.content}
                  </div>
                </div>
              ))}
            </section>

            {/* SECTION 3: SPECIFIC REQUIREMENTS */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded">
                  3.0
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                  Specific Requirements
                </h2>
              </div>

              {/* 3.1 Interfaces */}
              <div className="space-y-3 pl-2">
                <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                  3.1 External Interfaces
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <strong className="text-indigo-650 dark:text-indigo-400 block">3.1.1 User Interfaces (UI)</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{compiledDoc.sections.specificRequirements.interfaces.user}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <strong className="text-indigo-650 dark:text-indigo-400 block">3.1.2 Hardware Interfaces</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{compiledDoc.sections.specificRequirements.interfaces.hardware}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <strong className="text-indigo-650 dark:text-indigo-400 block">3.1.3 Software Interfaces</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{compiledDoc.sections.specificRequirements.interfaces.software}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <strong className="text-indigo-650 dark:text-indigo-400 block">3.1.4 Communications Interfaces</strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{compiledDoc.sections.specificRequirements.interfaces.communication}</p>
                  </div>
                </div>
              </div>

              {/* 3.2 Database */}
              <div className="space-y-3 pl-2">
                <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                  3.2 Database Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                  {compiledDoc.sections.specificRequirements.database.tables.map((tbl, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                      <strong className="text-slate-800 dark:text-slate-200 block font-mono">
                        {tbl.name}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tbl.fields}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3.3 Performance Requirements */}
              <div className="space-y-3 pl-2">
                <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                  3.3 Performance Requirements
                </h3>
                <div className="space-y-2 font-sans text-xs">
                  {compiledDoc.sections.specificRequirements.performance.items.map((perf, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                      {perf}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3.4.1 Functional Requirements Table */}
              <div className="space-y-3 pl-2 font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-sans">
                    3.4.1 Functional Requirements (FR) Specification Table
                  </h3>
                  <Badge variant="indigo" className="text-xs font-mono">{frList.length} FRs</Badge>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-indigo-50 dark:bg-indigo-950/60 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-2.5 px-4 w-20">Req ID</th>
                        <th className="py-2.5 px-4 w-44">Function / Feature</th>
                        <th className="py-2.5 px-4">Requirement Specification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {compiledDoc.sections.specificRequirements.functionalReqs.items.map((fr, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-650 dark:text-indigo-400">
                            {fr.id}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {fr.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {fr.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3.4.2 Non-Functional Requirements Table */}
              <div className="space-y-3 pl-2 font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-sans">
                    3.4.2 Non-Functional Requirements (NFR) Quality Matrix
                  </h3>
                  <Badge variant="success" className="text-xs font-mono">{nfrList.length} NFRs</Badge>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 dark:bg-emerald-950/60 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-2.5 px-4 w-24">NFR ID</th>
                        <th className="py-2.5 px-4 w-48">Quality Attribute</th>
                        <th className="py-2.5 px-4">Measurable Specification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {compiledDoc.sections.specificRequirements.nonFunctionalReqs.items.map((nfr, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {nfr.id}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {nfr.category}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {nfr.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 4: CHANGE MANAGEMENT */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded">
                  4.0
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                  Change Management Process
                </h2>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {compiledDoc.sections.changeManagement.content}
              </div>
            </section>

            {/* SECTION 5: APPROVALS & SIGN-OFF */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded">
                  5.0
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                  Document Approvals &amp; Verification Baseline
                </h2>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl font-sans">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Role</th>
                      <th className="py-2.5 px-4">Name / Stakeholder</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {compiledDoc.sections.approvals.roles.map((r, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{r.role}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.name}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{r.status}</td>
                        <td className="py-3 px-4 text-slate-500">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Document Bottom Download Prompt */}
            <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <span className="text-xs text-slate-500">
                End of Specification Document • IEEE Std 830-1998 Compliant
              </span>
              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 shadow-md"
              >
                <Download size={15} />
                {isDownloading ? 'Generating PDF...' : 'Download Official IEEE SRS (PDF)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SrsGeneratorActivity;
