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
        questionText: 'Which IEEE standard provides guidelines for Software Requirements Specifications (SRS)?',
        options: ['IEEE 1012', 'IEEE 830', 'IEEE 829', 'IEEE 1058'],
        correctIndex: 1,
        explanation: 'IEEE 830 is the widely recognized standard that describes the structure, contents, and qualities of a good SRS.'
      },
      {
        questionText: 'What type of requirement is "The system must process payments securely within 2 seconds"?',
        options: ['Functional Requirement', 'Non-Functional Requirement', 'Business Requirement', 'User Requirement'],
        correctIndex: 1,
        explanation: 'Performance and security characteristics are non-functional requirements (NFRs) specifying how the system performs a function.'
      },
      {
        questionText: 'Which of the following is NOT a core component of an SRS?',
        options: ['Introduction', 'Functional Requirements', 'Source Code listing', 'External Interface requirements'],
        correctIndex: 2,
        explanation: 'An SRS specifies requirements, not implementation details like source code.'
      },
      {
        questionText: 'What is a "Functional Requirement"?',
        options: ['A statement detailing system performance', 'A statement describing what service or function the system must perform', 'A hardware requirement', 'A licensing condition'],
        correctIndex: 1,
        explanation: 'Functional requirements define the core functions, behaviors, and inputs/outputs of the system.'
      },
      {
        questionText: 'Why is ambiguity in an SRS dangerous?',
        options: ['It causes compiler errors', 'It leads to multiple interpretations and incorrect implementations', 'It increases database file sizes', 'It violates copyright laws'],
        correctIndex: 1,
        explanation: 'Ambiguous requirements cause developers and clients to have different expectations, leading to design defects and wasted work.'
      },
      {
        questionText: 'A requirement is "verifiable" if and only if:',
        options: ['The programmer understands it', 'There exists a finite cost-effective process to check that the software meets it', 'It is written in mathematical notation', 'The customer signs off on it'],
        correctIndex: 1,
        explanation: 'Verifiability means a test or inspection can prove whether the software complies with the requirement.'
      },
      {
        questionText: 'Non-Functional Requirements are also known as:',
        options: ['Code constructs', 'Quality Attributes', 'Use Cases', 'Actor lists'],
        correctIndex: 1,
        explanation: 'Non-Functional Requirements are also referred to as system quality attributes (usability, reliability, security, scalability).'
      },
      {
        questionText: 'Who are the primary readers of an SRS document?',
        options: ['Only the end-users', 'Only the database administrators', 'Customers, project managers, developers, and testers', 'Only executive sponsors'],
        correctIndex: 2,
        explanation: 'The SRS serves as a contract and guide for all key project stakeholders, including clients, managers, developers, and testers.'
      },
      {
        questionText: 'What is the purpose of the "Scope" section in an SRS?',
        options: ['To list variables and their data types', 'To establish the boundaries of the software product and what it will accomplish', 'To detail team salaries', 'To define physical database schemas'],
        correctIndex: 1,
        explanation: 'The scope details what is in-bounds and out-of-bounds for the project, aligning expectations.'
      },
      {
        questionText: 'Which of the following is an example of an external interface requirement?',
        options: ['Bcrypt hashing algorithm', 'User Interface guidelines and external hardware/software API integrations', 'Memory structure definitions', 'Local index optimizations'],
        correctIndex: 1,
        explanation: 'External interfaces define connections to users, external hardware, or external software systems and APIs.'
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
