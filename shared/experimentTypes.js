export const EXPERIMENT_TYPES = {
  PROCESS_MODELS: 'process-models',
  SRS_GENERATOR: 'srs-generator',
  PROJECT_SCHEDULING: 'project-scheduling',
  COST_ESTIMATION: 'cost-estimation',
  UML_LAB: 'uml-lab',
  DFD_LAB: 'dfd-lab',
  ACTIVITY_STATE_LAB: 'activity-state-lab',
  RISK_MANAGEMENT: 'risk-management',
  SCM_GIT_SIMULATOR: 'scm-git-simulator',
  WHITE_BOX_TESTING: 'white-box-testing',
  PROTOTYPE_UAT: 'prototype-uat',
  AGILE_BOARD: 'agile-board'
};

export const EXPERIMENT_METADATA = [
  {
    slug: EXPERIMENT_TYPES.PROCESS_MODELS,
    title: 'Process Models',
    estimatedDuration: 30,
    objective: 'Understand and evaluate different Software Development Life Cycle (SDLC) models (Waterfall, Spiral, Agile/Scrum) based on project parameters.',
    theory: 'SDLC models provide structured frameworks for software development. Waterfall is sequential, Spiral focuses on risk analysis, and Agile emphasizes iterative and incremental development. Choosing the correct model depends on project clarity, risk profile, size, and flexibility requirements.',
    procedure: '1. Read the scenario details.\n2. Evaluate criteria: requirements clarity, risk factor, budget constraint, team expertise.\n3. Run simulations for Waterfall, Spiral, and Agile paths.\n4. Review the timeline, cost, and quality outputs of each model simulation.\n5. Answer the assessment questions to unlock the certificate.'
  },
  {
    slug: EXPERIMENT_TYPES.SRS_GENERATOR,
    title: 'SRS Generator',
    estimatedDuration: 45,
    objective: 'Learn the structure of Software Requirements Specification (SRS) documents based on IEEE 830 standards.',
    theory: 'An SRS is a formal document detailing what developers are to build. It contains Functional Requirements (FRs) and Non-Functional Requirements (NFRs) like performance, security, and usability. It establishes agreement between clients and developers.',
    procedure: '1. Select a software project archetype (e.g., E-commerce, Hospital Management, Online Banking).\n2. Drag, drop, and structure functional and non-functional requirements.\n3. Validate the consistency and completeness of requirements using the integrated system checks.\n4. Complete the quiz and download the generated IEEE-compliant PDF SRS.'
  },
  {
    slug: EXPERIMENT_TYPES.PROJECT_SCHEDULING,
    title: 'Project Scheduling (Gantt)',
    estimatedDuration: 45,
    objective: 'Understand work breakdown structure (WBS), task dependencies, and Gantt charts.',
    theory: 'Project scheduling involves dividing the project into manageable tasks, estimating durations, identifying dependencies, and determining the critical path. The critical path represents the longest sequence of dependent tasks that determines the shortest project completion time.',
    procedure: '1. Review the given task list and requirements.\n2. Define dependencies between tasks (e.g., Task B requires Task A to finish).\n3. Adjust start/end dates or durations to resolve resource over-allocations.\n4. Visualize the generated Gantt chart and identify the critical path.\n5. Answer the quiz to test scheduling principles.'
  },
  {
    slug: EXPERIMENT_TYPES.COST_ESTIMATION,
    title: 'Cost Estimation (COCOMO)',
    estimatedDuration: 30,
    objective: 'Apply the Constructive Cost Model (COCOMO) to estimate project effort, schedule, and staffing.',
    theory: 'COCOMO is an algorithmic model that estimates effort based on Lines of Code (LOC) or Kilo Lines of Code (KLOC). COCOMO II incorporates scale drivers (e.g., architecture resolution, process maturity) and effort multipliers (e.g., product reliability, programmer capability) to compute total Person-Months (PM).',
    procedure: '1. Select the project mode (Organic, Semidetached, Embedded).\n2. Use sliders to input estimated Lines of Code (LOC).\n3. Set scale factors and effort multipliers based on the project scenario.\n4. Analyze the calculated outputs (Effort in Person-Months, Development Time, Average Staffing).\n5. Complete the interactive exercise and quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.UML_LAB,
    title: 'UML Lab',
    estimatedDuration: 60,
    objective: 'Design and validate Object-Oriented layouts using Use Case and Class Diagrams.',
    theory: 'Unified Modeling Language (UML) class diagrams show the static structure of a system, detailing classes, attributes, operations, and relationships (association, inheritance, aggregation, composition). Use Case diagrams map user roles (actors) to system features.',
    procedure: '1. Drag-and-drop classes and actors onto the canvas.\n2. Define attributes (fields), methods, and connections (generalization, composition, association).\n3. Validate structural consistency using the rule checker (e.g., check for disconnected nodes or circular inheritance).\n4. Export the UML diagram JSON and generate a laboratory report.'
  },
  {
    slug: EXPERIMENT_TYPES.DFD_LAB,
    title: 'Data Flow Diagram (DFD) Lab',
    estimatedDuration: 50,
    objective: 'Model system data flows using Context diagrams (Level-0) and Level-1 DFDs.',
    theory: 'DFDs model how data flows through a system. Components include External Entities (sources/sinks of data), Processes (data transformers), Data Stores (files/databases), and Data Flows (directed arrows showing data transit). Level-0 (Context Diagram) shows the system as a single process.',
    procedure: '1. Model a Level-0 Context DFD by dragging entities and a central system process.\n2. Explode the context diagram into a Level-1 DFD showing internal subprocesses and data stores.\n3. Validate the structural balance rules (data conservation: inputs must yield outputs).\n4. Run the data trace simulation to test flow routing.'
  },
  {
    slug: EXPERIMENT_TYPES.ACTIVITY_STATE_LAB,
    title: 'Activity & State Lab',
    estimatedDuration: 45,
    objective: 'Model dynamic system behavior using Activity and State Machine diagrams.',
    theory: 'Activity diagrams represent the procedural flow of control (decisions, forks, joins). State Machine diagrams represent how an object changes state in response to events (states, transitions, guard conditions).',
    procedure: '1. Create an Activity Diagram for a user workflow (e.g., user checkout with payment approval).\n2. Create a State Diagram representing the lifecycle of an order (Created, Paid, Shipped, Cancelled).\n3. Simulate state transitions by triggering events on the active canvas.\n4. Complete the review assessment.'
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
    slug: EXPERIMENT_TYPES.SCM_GIT_SIMULATOR,
    title: 'SCM Git Simulator',
    estimatedDuration: 45,
    objective: 'Understand version control concepts including staging, committing, branching, and merging.',
    theory: 'Software Configuration Management (SCM) uses Git to track changes. Key concepts include Working Directory, Staging Area, Local Repository, commits (nodes in a Directed Acyclic Graph), branching (pointers to commits), and merging (fast-forward vs. 3-way merge conflict resolution).',
    procedure: '1. Use the simulated terminal to run commands like `git add`, `git commit`, `git checkout`, `git merge`.\n2. Watch the real-time visual Git commit graph update dynamically.\n3. Create a branch, make conflicting edits, and resolve merge conflicts in the code editor window.\n4. Complete the exercise tasks and quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.WHITE_BOX_TESTING,
    title: 'White-Box Testing',
    estimatedDuration: 45,
    objective: 'Create control flow graphs (CFG) and compute Cyclomatic Complexity of source code.',
    theory: 'White-box testing examines the internal structure of code. A Control Flow Graph represents all execution paths. Cyclomatic Complexity (V(G) = E - N + 2P or number of decision nodes + 1) defines the minimum number of independent test paths required for complete coverage.',
    procedure: '1. Read the provided Javascript function code block.\n2. Map code statements to CFG nodes and add connection edges.\n3. Calculate the Cyclomatic Complexity using both mathematical formulas.\n4. Write a minimum set of test inputs to achieve 100% path coverage.\n5. Evaluate your path coverage score and complete the quiz.'
  },
  {
    slug: EXPERIMENT_TYPES.PROTOTYPE_UAT,
    title: 'Prototype & UAT Lab',
    estimatedDuration: 60,
    objective: 'Build interface wireframes and validate workflows via User Acceptance Testing.',
    theory: 'Prototyping helps gather early stakeholder feedback. User Acceptance Testing (UAT) verifies if the system satisfies user requirements (scenarios and acceptance criteria).',
    procedure: '1. Assemble a simple interactive UI mockup (e.g., login + profile view) using drag-and-drop wireframe components.\n2. Connect components with interactive triggers (e.g., clicking login button navigates to dashboard).\n3. Run a UAT simulator where a virtual client interacts with the UI based on specific criteria.\n4. Review and log feedback comments from the virtual client evaluation.'
  },
  {
    slug: EXPERIMENT_TYPES.AGILE_BOARD,
    title: 'Agile Kanban Board',
    estimatedDuration: 30,
    objective: 'Learn Scrum and Kanban methodologies, workflow states, and burndown tracking.',
    theory: 'Agile methods utilize Kanban or Scrum boards to manage task progress through columns (To Do, In Progress, In Review, Done). Work-in-Progress (WIP) limits restrict the maximum amount of work in active states to prevent bottlenecks.',
    procedure: '1. Review the sprint backlog of user stories.\n2. Move tasks across the columns while respecting defined WIP limits.\n3. Allocate resources and run day-by-day sprint steps.\n4. Analyze the generated Burndown Chart showing planned vs. actual progress velocity.\n5. Complete the assessment quiz.'
  }
];
