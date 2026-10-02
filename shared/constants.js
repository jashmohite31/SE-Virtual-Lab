export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning'
};

export const SUBMISSION_STATUS = {
  IN_PROGRESS: 'in-progress',
  SUBMITTED: 'submitted'
};

export const DEFAULT_QUIZZES = {
  'process-models': {
    questions: [
      {
        questionText: 'Which process model is most suitable for a project with highly volatile and evolving requirements?',
        options: ['Waterfall Model', 'Agile Model', 'V-Model', 'Classical Waterfall'],
        correctIndex: 1,
        explanation: 'Agile models emphasize iterative development and are designed to accommodate frequently changing requirements.'
      },
      {
        questionText: 'What is the primary focus of the Spiral Model?',
        options: ['Documentation', 'Rapid Prototyping', 'Risk Assessment & Management', 'Linear Progression'],
        correctIndex: 2,
        explanation: 'The Spiral Model is a risk-driven process model that prioritizes systematic identification and resolution of project risks.'
      },
      {
        questionText: 'In a Waterfall model, when can testing begin?',
        options: ['From day one', 'After the implementation/coding phase completes', 'Concurrently with design', 'Only after deployment'],
        correctIndex: 1,
        explanation: 'The sequential nature of the Waterfall model means testing occurs only after coding is completed.'
      },
      {
        questionText: 'Which model is characterized by structured phases with verification and validation at each stage?',
        options: ['Spiral Model', 'Waterfall Model', 'V-Model', 'Prototype Model'],
        correctIndex: 2,
        explanation: 'The V-model is an extension of the waterfall model where development phases are mapped directly to corresponding testing/validation phases.'
      },
      {
        questionText: 'What is a significant disadvantage of the Spiral Model?',
        options: ['Cannot handle large systems', 'High cost and risk expertise requirements', 'Lacks flexibility', 'No customer involvement'],
        correctIndex: 1,
        explanation: 'The Spiral Model requires highly experienced risk assessment experts and can be very expensive, making it less suitable for small budgets.'
      },
      {
        questionText: 'What is a Sprint in Agile/Scrum development?',
        options: ['A race to finish the code', 'A fixed-duration iteration where a usable increment is created', 'The final testing phase', 'The customer review meeting'],
        correctIndex: 1,
        explanation: 'A sprint is a time-boxed event (usually 2-4 weeks) during which a Scrum team completes a set amount of work.'
      },
      {
        questionText: 'Which SDLC model is characterized as a sequential linear flow?',
        options: ['Agile', 'Spiral', 'Waterfall', 'RAD'],
        correctIndex: 2,
        explanation: 'Waterfall is a linear, sequential model where development flows downward through distinct phases.'
      },
      {
        questionText: 'In the Spiral Model, each loop or spiral represents:',
        options: ['A line of code', 'A software bug', 'A phase of the software process', 'A team member assignment'],
        correctIndex: 2,
        explanation: 'Each loop in the Spiral Model represents a complete development phase/iteration focusing on planning, risk analysis, engineering, and evaluation.'
      },
      {
        questionText: 'Which criteria is a primary driver for choosing Waterfall over Agile?',
        options: ['High risk factors', 'Requirements are fully known, stable, and unlikely to change', 'Frequent client availability', 'Need for rapid deployment'],
        correctIndex: 1,
        explanation: 'Waterfall works best when requirements are clear, stable, and fully defined upfront.'
      },
      {
        questionText: 'What does SDLC stand for?',
        options: ['System Design Logic Center', 'Software Development Life Cycle', 'Structured Data Life Cycle', 'Secure Development Loop Core'],
        correctIndex: 1,
        explanation: 'SDLC stands for Software Development Life Cycle.'
      }
    ]
  },
  'srs-generator': {
    questions: [
      {
        questionText: 'What is the primary objective of creating a Software Requirements Specification (SRS)?',
        options: [
          'To write production-ready code and database schema definitions.',
          'To establish a formal, unambiguous agreement between stakeholders and developers detailing what the system must do.',
          'To design the high-level graphical layout and marketing material.',
          'To define the post-launch software sales strategy.'
        ],
        correctIndex: 1,
        explanation: 'The SRS serves as the agreed baseline specification of system services and constraints between clients, architects, and QA teams.'
      },
      {
        questionText: 'Which section of the standard IEEE 830 SRS template contains the detailed list of functional and non-functional requirements?',
        options: [
          'Section 1: Introduction',
          'Section 2: Overall Description',
          'Section 3: Specific Requirements',
          'Section 4: Index and Appendices'
        ],
        correctIndex: 2,
        explanation: 'In the IEEE 830 format, Section 1 introduces the project, Section 2 provides high-level context, and Section 3 details all Specific Requirements (FRs, NFRs, interfaces).'
      },
      {
        questionText: 'Consider this requirement: "The Book Management System should process transactions quickly." Why does this statement fail standard software engineering criteria?',
        options: [
          'It is incomplete because it omits database engine details.',
          'It is ambiguous and untestable because "quickly" lacks a measurable quantitative threshold.',
          'It is inconsistent with software development standards.',
          'It is an organizational requirement rather than a software requirement.'
        ],
        correctIndex: 1,
        explanation: 'Requirements containing subjective adjectives like "quickly" cannot be verified by QA engineers without measurable metrics (such as maximum latency in seconds).'
      },
      {
        questionText: 'Which of the following is correctly classified as a Functional Requirement?',
        options: [
          'The system shall authenticate members with an email address and password before permitting book reservations.',
          'The system must be written in Node.js using an Express framework.',
          'The system shall remain available 99.95% of the time each calendar month.',
          'The user interface must be accessible across multiple screen resolutions.'
        ],
        correctIndex: 0,
        explanation: 'Verifying credentials before allowing a reservation specifies a system behavior, input condition, and workflow, making it a Functional Requirement.'
      },
      {
        questionText: '"The database shall encrypt stored patron personal data." This requirement is a:',
        options: [
          'Functional Requirement',
          'Non-Functional Requirement (Security)',
          'User Business Model',
          'Scope Exclusion'
        ],
        correctIndex: 1,
        explanation: 'Encrypting stored data defines a system security constraint and quality attribute, which is a Non-Functional Requirement.'
      },
      {
        questionText: 'According to requirements engineering principles, what is the primary distinction between "User Requirements" and "System Requirements"?',
        options: [
          'User requirements specify internal system architecture, while system requirements define the marketing strategy.',
          'User requirements are high-level statements written in natural language for clients, while system requirements provide detailed, technical specifications for developers.',
          'User requirements are optional guidelines, while system requirements represent legal contracts.',
          'User requirements focus exclusively on hardware constraints, while system requirements focus on user interface styling.'
        ],
        correctIndex: 1,
        explanation: 'User requirements are expressed in everyday natural language so that non-technical clients and domain stakeholders can verify what the system should do. System requirements define the precise functional, technical, and operational details needed by software architects, developers, and QA engineers for implementation and testing.'
      },
      {
        questionText: 'Which of the following describes the key characteristic of "completeness" in a Software Requirements Specification?',
        options: [
          'All requirements are written using strict mathematical notations and formal logic.',
          'The specification accounts for all valid user inputs, system responses, exception handling, and constraints without omitting necessary information.',
          'Every requirement statement is approved by external third-party regulatory bodies.',
          'The document contains full source code snippets and physical database table definitions.'
        ],
        correctIndex: 1,
        explanation: 'A requirement specification is considered complete when it describes everything the system should do, including normal operational flows, edge cases, error conditions, and negative outcomes, without leaving gaps for developers to guess.'
      },
      {
        questionText: 'Non-functional requirements that mandate compliance with ISO/IEC standards or organizational CMMI levels are classified as:',
        options: [
          'Product Requirements',
          'Organizational / External Requirements',
          'Interface Requirements',
          'Behavioural Requirements'
        ],
        correctIndex: 1,
        explanation: 'Rules originating from corporate policies, industry standards, or legal frameworks are classified as organizational or external non-functional requirements.'
      },
      {
        questionText: 'Why should an SRS describe system behaviour without specifying internal implementation details (e.g., specific class methods or internal variables)?',
        options: [
          'To prevent developers from writing automated unit tests.',
          'To preserve design independence, allowing engineers to choose the optimal architecture and technology stack to meet the requirements.',
          'Because clients are legally prohibited from reviewing technical details.',
          'To reduce the total page count of the SRS document.'
        ],
        correctIndex: 1,
        explanation: 'An SRS focuses on what the system must do rather than how to implement it, leaving design and algorithmic decisions to the architecture phase.'
      },
      {
        questionText: 'What role does requirement traceability play throughout the Software Development Life Cycle?',
        options: [
          'It ensures every requirement has a unique identifier that maps forward to design components, code modules, and test cases.',
          'It automatically generates user manuals from source code comments.',
          'It tracks employee hours for billing purposes.',
          'It monitors real-time CPU usage on production servers.'
        ],
        correctIndex: 0,
        explanation: 'Traceability links each unique requirement identifier (FR-01, NFR-01) through architectural components, source code, and validation test cases to prevent gaps and scope creep.'
      }
    ]
  },
  'project-scheduling': {
    questions: [
      {
        questionText: 'What does a Gantt chart display?',
        options: ['Database relationships', 'A project schedule representing tasks over time', 'Source code structures', 'Calculated cost effort values'],
        correctIndex: 1,
        explanation: 'A Gantt chart is a bar chart that illustrates a project schedule, showing start dates, end dates, and dependencies.'
      },
      {
        questionText: 'What is the "Critical Path" in project scheduling?',
        options: ['The path with the highest risks', 'The longest sequence of dependent tasks that determines the project duration', 'The easiest way to code the project', 'The sequence of tasks that cost the most money'],
        correctIndex: 1,
        explanation: 'The Critical Path is the sequence of dependent tasks that directly determines the minimum completion time of the project. Tasks on this path have zero slack/float.'
      },
      {
        questionText: 'What happens if a task on the critical path is delayed by 2 days?',
        options: ['Nothing, other tasks compensate', 'The entire project completion date is delayed by 2 days', 'The project costs 50% more', 'The project team is fired'],
        correctIndex: 1,
        explanation: 'Since critical path tasks have no float, any delay in them directly delays the overall project completion.'
      },
      {
        questionText: 'What does "Float" or "Slack" mean for a task?',
        options: ['The amount of money budgeted for that task', 'The amount of time a task can be delayed without delaying the project completion', 'The percentage of incomplete work', 'The team member assignment flexibility'],
        correctIndex: 1,
        explanation: 'Slack/Float is the window of flexibility a non-critical task has to start late or run slow without impacting the final project deadline.'
      },
      {
        questionText: 'In a Gantt chart, what does a Finish-to-Start (FS) dependency mean?',
        options: ['Task B cannot start until Task A finishes', 'Task B starts when Task A starts', 'Task B finishes when Task A finishes', 'Task B finishes when Task A starts'],
        correctIndex: 0,
        explanation: 'Finish-to-Start (FS) is the most common dependency type: Task A must finish before Task B can begin.'
      },
      {
        questionText: 'What is Work Breakdown Structure (WBS)?',
        options: ['A tool to report broken software', 'A hierarchical decomposition of the total scope of work to be carried out', 'A server configuration layout', 'An employee evaluation system'],
        correctIndex: 1,
        explanation: 'WBS is a key project deliverable that organizes the team\'s work into manageable, hierarchical sections.'
      },
      {
        questionText: 'Which of the following is a technique used to shorten project schedules by performing tasks in parallel?',
        options: ['Crashing', 'Fast-tracking', 'Resource leveling', 'Scope creep'],
        correctIndex: 1,
        explanation: 'Fast-tracking involves running phases or tasks in parallel that would normally be done sequentially.'
      },
      {
        questionText: 'What is "Resource Leveling"?',
        options: ['Firing unproductive team members', 'Resolving resource conflicts by adjusting task start/finish dates based on resource availability', 'Deleting non-essential tasks', 'Equalizing database loads'],
        correctIndex: 1,
        explanation: 'Resource leveling adjusts task dates to ensure team members are not over-allocated or assigned more work than they can handle.'
      },
      {
        questionText: 'A milestone in a Gantt chart represents:',
        options: ['A task with high cost', 'An event of zero duration that marks a significant achievement or phase completion', 'A task assigned to the lead developer', 'A code library repository'],
        correctIndex: 1,
        explanation: 'Milestones have zero duration and represent key reference checkpoints in a project timeline.'
      },
      {
        questionText: 'What scheduling tool uses circles/boxes (nodes) linked by arrows to show task sequencing?',
        options: ['Gantt Chart', 'Network Diagram (PERT/CPM)', 'Mind Map', 'Burndown Chart'],
        correctIndex: 1,
        explanation: 'Network diagrams (Program Evaluation Review Technique / Critical Path Method) show task sequencing and dependency paths geometrically.'
      }
    ]
  },
  'cost-estimation': {
    questions: [
      {
        questionText: 'What is the primary output variable calculated by the COCOMO model?',
        options: ['Lines of Code (LOC)', 'Effort in Person-Months (PM)', 'Database storage size', 'Number of bugs per KLOC'],
        correctIndex: 1,
        explanation: 'COCOMO models estimate the effort required to develop a software product, measured in Person-Months (PM).'
      },
      {
        questionText: 'Which COCOMO mode corresponds to small, simple software projects developed by experienced teams with stable requirements?',
        options: ['Organic Mode', 'Semidetached Mode', 'Embedded Mode', 'Hybrid Mode'],
        correctIndex: 0,
        explanation: 'Organic mode represents small projects with stable requirements and experienced staff. Semidetached is intermediate, and Embedded represents complex projects with tight constraints.'
      },
      {
        questionText: 'In COCOMO II, what do "Effort Multipliers" (Cost Drivers) represent?',
        options: ['Hourly wages of developers', 'Multipliers that adjust effort based on product, platform, personnel, and project attributes', 'Database server speeds', 'Marketing cost budgets'],
        correctIndex: 1,
        explanation: 'Effort Multipliers (such as required reliability, analyst capability, and tool usage) scale the base effort estimate upward or downward.'
      },
      {
        questionText: 'What does KLOC stand for?',
        options: ['Kilo Lines of Code (thousands of lines)', 'Key Logic Operations Count', 'Kernel Local Operator Command', 'Kilobyte Logic Optimization Criteria'],
        correctIndex: 0,
        explanation: 'KLOC stands for thousands of lines of source code, which serves as the primary size metric in COCOMO.'
      },
      {
        questionText: 'If a project is estimated at 24 Person-Months, and has an estimated development time of 12 months, what is the average staffing size?',
        options: ['24 staff members', '2 staff members', '12 staff members', '1.5 staff members'],
        correctIndex: 1,
        explanation: 'Average Staffing = Effort (PM) / Development Time (TDEV). Thus, 24 / 12 = 2 staff members.'
      },
      {
        questionText: 'Which COCOMO mode should be selected for an operating system project with extremely rigid hardware and operational constraints?',
        options: ['Organic', 'Semidetached', 'Embedded', 'Flexible'],
        correctIndex: 2,
        explanation: 'Embedded mode is appropriate for systems with tight constraints, high complexity, and rigid specifications (like OS or flight control software).'
      },
      {
        questionText: 'In the formula Effort = a × (KLOC)^b, if the exponent "b" is greater than 1, it implies:',
        options: ['Diseconomy of scale (larger size requires disproportionately more effort)', 'Economy of scale', 'Linear effort growth', 'Zero effort needed'],
        correctIndex: 0,
        explanation: 'An exponent b > 1 represents diseconomy of scale, which is typical for large software projects due to increased communication overhead.'
      },
      {
        questionText: 'Which of the following is NOT a cost driver in COCOMO?',
        options: ['Required Software Reliability (RELY)', 'Analyst Capability (ACAP)', 'Physical size of the developer office', 'Use of Software Tools (TOOL)'],
        correctIndex: 2,
        explanation: 'The physical size of the office does not directly influence COCOMO effort calculation.'
      },
      {
        questionText: 'Compared to Basic COCOMO, Intermediate COCOMO is more accurate because:',
        options: ['It uses compiler feedback', 'It applies 15 cost drivers (Effort Multipliers) to refine the estimate', 'It uses lines of comments instead of code', 'It ignores project complexity'],
        correctIndex: 1,
        explanation: 'Intermediate COCOMO applies cost drivers that account for product, hardware, personnel, and project attributes.'
      },
      {
        questionText: 'COCOMO calculations typically exclude:',
        options: ['Analysis and design effort', 'Coding and testing effort', 'Training, post-delivery maintenance, and support costs', 'Documentation effort'],
        correctIndex: 2,
        explanation: 'COCOMO estimates development effort from requirements to testing, but generally excludes post-deployment maintenance and operations.'
      }
    ]
  }
};

// Expose defaults for all 12. For space constraints, we will load others dynamically or seed via MongoDB.
// We make sure the exported default quizzes object contains a basic shell for the rest:
for (const slug of ['uml-lab', 'dfd-lab', 'activity-state-lab', 'risk-management', 'scm-git-simulator', 'white-box-testing', 'prototype-uat', 'agile-board']) {
  if (!DEFAULT_QUIZZES[slug]) {
    DEFAULT_QUIZZES[slug] = {
      questions: [
        {
          questionText: `What is the primary learning objective of the ${slug.replace('-', ' ')} experiment?`,
          options: ['To learn programming syntax', 'To understand key concepts and build structural representations', 'To configure local database environments', 'To host web servers'],
          correctIndex: 1,
          explanation: 'Each simulation is designed to build theoretical models, run interactive activities, and validate structural workflows.'
        },
        {
          questionText: 'How are laboratory reports generated in this virtual lab system?',
          options: ['Manually typed by students', 'Automatically using jsPDF + html2canvas from interactive workspace views', 'Sent via post office', 'They are not generated'],
          correctIndex: 1,
          explanation: 'Reports are dynamically compiled into PDFs directly from your workspace results.'
        },
        {
          questionText: 'What represents the passing criteria for the assessment quiz in each module?',
          options: ['10% score', '50% score', 'At least 60% score', 'Only 100% score'],
          correctIndex: 2,
          explanation: 'Students must answer at least 6 out of 10 questions correctly (60% or higher) to pass the quiz.'
        },
        {
          questionText: 'Which role in the system can view aggregated student completion rates and score metrics?',
          options: ['Students', 'Teachers and Admins', 'Anonymous guests', 'None of the above'],
          correctIndex: 1,
          explanation: 'Teachers and Admins have dashboards configured with reporting widgets to review student progress logs.'
        },
        {
          questionText: 'Which tool is utilized for node-based flowcharts and system diagrams in these labs?',
          options: ['Chart.js', 'React Flow', 'Framer Motion', 'Tailwind CSS'],
          correctIndex: 1,
          explanation: 'React Flow is the node-based rendering library used to construct and validate UML, DFD, and Activity/State diagrams.'
        }
      ]
    };
  }
}
