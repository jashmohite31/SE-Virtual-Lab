import mongoose from 'mongoose';

const baseSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  experiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true },
  slug: { type: String, required: true },
  status: { type: String, enum: ['in-progress', 'submitted'], default: 'in-progress' },
  completedAt: Date
}, { timestamps: true, discriminatorKey: 'experimentType' });

baseSubmissionSchema.index({ user: 1, experiment: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', baseSubmissionSchema);

// Register Discriminators
export const ProcessModelsSubmission = Submission.discriminator('process-models', new mongoose.Schema({
  data: {
    selectedModel: { type: String, required: true },
    simulationTimeline: { type: Array, default: [] },
    calculatedMetrics: { type: mongoose.Schema.Types.Mixed, default: {} }
  }
}));

export const SrsGeneratorSubmission = Submission.discriminator('srs-generator', new mongoose.Schema({
  data: {
    selectedArchetype: { type: String, required: true },
    functionalRequirements: { type: Array, default: [] },
    nonFunctionalRequirements: { type: Array, default: [] },
    title: { type: String, default: '' },
    scope: { type: String, default: '' },
    interfaces: { type: Array, default: [] }
  }
}));

export const ProjectSchedulingSubmission = Submission.discriminator('project-scheduling', new mongoose.Schema({
  data: {
    tasks: { type: Array, default: [] },
    dependencies: { type: Array, default: [] },
    criticalPath: { type: Array, default: [] }
  }
}));

export const CostEstimationSubmission = Submission.discriminator('cost-estimation', new mongoose.Schema({
  data: {
    mode: { type: String, required: true },
    loc: { type: Number, required: true },
    scaleFactors: { type: mongoose.Schema.Types.Mixed, default: {} },
    effortMultipliers: { type: mongoose.Schema.Types.Mixed, default: {} },
    calculatedEffort: { type: Number, default: 0 },
    calculatedTime: { type: Number, default: 0 },
    calculatedStaff: { type: Number, default: 0 }
  }
}));

export const UmlLabSubmission = Submission.discriminator('uml-lab', new mongoose.Schema({
  data: {
    nodes: { type: Array, default: [] },
    edges: { type: Array, default: [] },
    diagramType: { type: String, enum: ['use-case', 'class'], default: 'class' }
  }
}));

export const DfdLabSubmission = Submission.discriminator('dfd-lab', new mongoose.Schema({
  data: {
    nodes: { type: Array, default: [] },
    edges: { type: Array, default: [] },
    level: { type: Number, default: 0 }
  }
}));

export const ActivityStateLabSubmission = Submission.discriminator('activity-state-lab', new mongoose.Schema({
  data: {
    activityNodes: { type: Array, default: [] },
    activityEdges: { type: Array, default: [] },
    stateNodes: { type: Array, default: [] },
    stateEdges: { type: Array, default: [] }
  }
}));

export const RiskManagementSubmission = Submission.discriminator('risk-management', new mongoose.Schema({
  data: {
    identifiedRisks: { type: Array, default: [] },
    mitigationPlans: { type: Array, default: [] }
  }
}));

export const ScmGitSimulatorSubmission = Submission.discriminator('scm-git-simulator', new mongoose.Schema({
  data: {
    commandsHistory: { type: Array, default: [] },
    branches: { type: Array, default: [] },
    currentBranch: { type: String, default: 'main' },
    commitGraph: { type: mongoose.Schema.Types.Mixed, default: {} },
    editorContent: { type: String, default: '' }
  }
}));

export const WhiteBoxTestingSubmission = Submission.discriminator('white-box-testing', new mongoose.Schema({
  data: {
    nodes: { type: Array, default: [] },
    edges: { type: Array, default: [] },
    complexity: { type: Number, default: 0 },
    pathsTested: { type: Array, default: [] },
    allPathsCovered: { type: Boolean, default: false }
  }
}));

export const PrototypeUatSubmission = Submission.discriminator('prototype-uat', new mongoose.Schema({
  data: {
    components: { type: Array, default: [] },
    connections: { type: Array, default: [] },
    uatResults: { type: mongoose.Schema.Types.Mixed, default: {} }
  }
}));

export const AgileBoardSubmission = Submission.discriminator('agile-board', new mongoose.Schema({
  data: {
    columns: { type: mongoose.Schema.Types.Mixed, default: {} },
    burndownData: { type: Array, default: [] },
    dayCount: { type: Number, default: 0 }
  }
}));
