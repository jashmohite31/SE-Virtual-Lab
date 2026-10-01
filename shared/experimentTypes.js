export const EXPERIMENT_TYPES = {
  SRS_GENERATOR: 'srs-generator',
  UML_LAB: 'uml-lab',
  WHITE_BOX_TESTING: 'white-box-testing',
  SCM_GIT_SIMULATOR: 'scm-git-simulator',
  RISK_MANAGEMENT: 'risk-management',
  PROJECT_SCHEDULING: 'project-scheduling'
};

export const EXPERIMENT_METADATA = [
  {
    slug: EXPERIMENT_TYPES.SRS_GENERATOR,
    title: 'Software Requirements Specification (SRS)',
    estimatedDuration: 45,
    objective: 'Learn the structure of Software Requirements Specification (SRS) documents based on IEEE 830 standards.',
    theory: 'An SRS is a formal document detailing what developers are to build. It contains Functional Requirements (FRs) and Non-Functional Requirements (NFRs) like performance, security, and usability. It establishes agreement between clients and developers.',
    procedure: '1. Select a software project archetype (e.g., E-commerce, Hospital Management, Online Banking).\n2. Drag, drop, and structure functional and non-functional requirements.\n3. Validate the consistency and completeness of requirements using the integrated system checks.\n4. Complete the assessment quiz and download the generated IEEE-compliant PDF SRS.'
  },
  {
    slug: EXPERIMENT_TYPES.UML_LAB,
    title: 'Unified Modelling Language (UML)',
    estimatedDuration: 60,
    objective: 'Design and validate Object-Oriented layouts using Use Case and Class Diagrams.',
    theory: 'Unified Modeling Language (UML) class diagrams show the static structure of a system, detailing classes, attributes, operations, and relationships (association, inheritance, aggregation, composition). Use Case diagrams map user roles (actors) to system features.',
    procedure: '1. Drag-and-drop classes and actors onto the canvas.\n2. Define attributes (fields), methods, and connections (generalization, composition, association).\n3. Validate structural consistency using the rule checker (e.g., check for disconnected nodes or circular inheritance).\n4. Export the UML diagram JSON and generate a laboratory report.'
  },
  {
    slug: EXPERIMENT_TYPES.WHITE_BOX_TESTING,
    title: 'Software Quality Assurance (SQA)',
    estimatedDuration: 45,
    objective: 'Create control flow graphs (CFG) and compute Cyclomatic Complexity of source code for quality assurance and testing.',
    theory: 'Software Quality Assurance involves rigorous testing methodologies. White-box testing examines internal code structure. A Control Flow Graph represents execution paths. Cyclomatic Complexity defines the minimum independent test paths for full coverage.',
    procedure: '1. Read the provided Javascript function code block.\n2. Map code statements to CFG nodes and add connection edges.\n3. Calculate the Cyclomatic Complexity using both mathematical formulas.\n4. Write a minimum set of test inputs to achieve 100% path coverage.\n5. Evaluate your path coverage score and complete the quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.SCM_GIT_SIMULATOR,
    title: 'Software Configuration Management (SCM)',
    estimatedDuration: 45,
    objective: 'Understand version control concepts including staging, committing, branching, and merging in SCM.',
    theory: 'Software Configuration Management (SCM) uses Git to track changes. Key concepts include Working Directory, Staging Area, Local Repository, commits, branching, and merging.',
    procedure: '1. Use the simulated terminal to run commands like `git add`, `git commit`, `git checkout`, `git merge`.\n2. Watch the real-time visual Git commit graph update dynamically.\n3. Create a branch, make conflicting edits, and resolve merge conflicts in the code editor window.\n4. Complete the exercise tasks and quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.RISK_MANAGEMENT,
    title: 'Risk Management',
    estimatedDuration: 30,
    objective: 'Identify, analyze, and mitigate software risks using qualitative assessment matrices.',
    theory: 'Risk management involves identifying potential threats, calculating risk exposure (Probability × Impact), planning mitigation strategy (Avoid, Mitigate, Transfer, Accept), and monitoring risks throughout the SDLC.',
    procedure: '1. Review a software project scenario containing hidden risks.\n2. Identify and register risks, rating their Likelihood and Impact on a 1-5 scale.\n3. Assign appropriate mitigation strategies for high-priority risks.\n4. Track how risk levels adjust after planning mitigations.\n5. Answer the validation quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.PROJECT_SCHEDULING,
    title: 'Project Management',
    estimatedDuration: 45,
    objective: 'Understand work breakdown structure (WBS), task dependencies, critical path, and Gantt chart project scheduling.',
    theory: 'Project management involves dividing projects into manageable tasks, estimating durations, identifying dependencies, and determining the critical path.',
    procedure: '1. Review the given task list and requirements.\n2. Define dependencies between tasks (e.g., Task B requires Task A to finish).\n3. Adjust start/end dates or durations to resolve resource over-allocations.\n4. Visualize the generated Gantt chart and identify the critical path.\n5. Answer the quiz to test scheduling principles.'
  }
];
