export const SQA_EXPERIMENT_DATA = {
  aim: {
    title: 'Aim',
    content:
      'To understand the principles of Software Quality Assurance (SQA) through white-box testing techniques. Students will construct Control Flow Graphs (CFG) from source code, compute Cyclomatic Complexity using three different methods, derive independent basis paths, and design minimum test cases to achieve 100% path coverage.'
  },

  introduction: {
    title: 'Introduction',
    content: `Software Quality Assurance (SQA) is a systematic process that ensures software products and processes conform to defined requirements and standards throughout the Software Development Life Cycle (SDLC). It encompasses the set of activities that provide confidence that software processes are being followed and that the resulting software product meets its quality objectives.

White-box testing, also known as structural or glass-box testing, is a core SQA technique in which the tester has full knowledge of the internal code structure, logic, and data paths. Unlike black-box testing which only validates externally visible behavior, white-box testing validates internal program flow, branch coverage, and logical conditions.

The Control Flow Graph (CFG) is the fundamental tool used in white-box testing. It is a directed graph representation of a program where nodes represent atomic statements or decisions, and directed edges represent the possible flow of execution between those statements. By analyzing the CFG, testers can systematically derive paths through the code that must be exercised.

Cyclomatic Complexity, introduced by Thomas J. McCabe in 1976, provides a quantitative measure of the logical complexity of a program. It directly determines the minimum number of independent paths that must be tested to guarantee full logical coverage of the source code. A higher Cyclomatic Complexity value indicates more complex code that requires more test cases and is statistically more likely to contain defects.`
  },

  objective: {
    title: 'Objectives',
    subtitle: 'After completing this experiment, students will be able to:',
    points: [
      'Explain the purpose and scope of Software Quality Assurance in the SDLC.',
      'Differentiate between white-box testing and black-box testing methodologies.',
      'Construct a Control Flow Graph (CFG) from a given JavaScript or pseudocode function.',
      'Identify nodes (statements/decisions) and edges (execution paths) in a CFG.',
      'Compute Cyclomatic Complexity using all three standard formulas: E - N + 2P, P + 1, and Region counting.',
      'Derive the minimum set of independent basis paths required for complete path coverage.',
      'Design targeted test cases corresponding to each independent path.',
      'Generate a structured SQA laboratory report documenting CFG analysis and test results.'
    ]
  },

  theory: {
    whiteBoxHeading: 'White-Box Testing',
    whiteBoxIntro:
      'White-box testing is a verification technique in which the internal logic, structure, and implementation of the software under test are fully visible and accessible to the tester. It is performed primarily during unit testing and integration testing phases.',
    whiteBoxPoints: [
      {
        name: 'Statement Coverage',
        text: 'Ensures that every executable statement in the source code is executed at least once during the test run. It is the most basic coverage criterion.',
        example: 'For a function with 10 statements, statement coverage requires test inputs that cause all 10 lines to execute at least once. If an if-block has 3 statements in the true branch, at least one test must satisfy the condition.',
        icon: 'clipboard'
      },
      {
        name: 'Branch (Decision) Coverage',
        text: 'Ensures that every decision point (if/else, switch/case, loop conditions) takes both the TRUE and FALSE outcomes at least once.',
        example: 'For if (x > 0) { ... } else { ... }, you need at least 2 test cases: one where x > 0 (TRUE branch) and one where x <= 0 (FALSE branch). Branch coverage subsumes statement coverage.',
        icon: 'branch'
      },
      {
        name: 'Path Coverage',
        text: 'The strongest criterion - ensures that every possible execution path through the program is exercised at least once. Cyclomatic Complexity determines the minimum number of paths needed.',
        example: 'A function with 2 nested if-statements can have up to 4 paths (TT, TF, FT, FF). Path coverage requires test cases that exercise all 4 combinations, making it the most thorough coverage type.',
        icon: 'path'
      },
      {
        name: 'Condition Coverage',
        text: 'Requires that every Boolean sub-expression within a compound condition is evaluated to both TRUE and FALSE independently.',
        example: 'For if (a && b), condition coverage requires: test1 where a=T, b=T; test2 where a=T, b=F; test3 where a=F, b=T - ensuring both "a" and "b" individually evaluate to TRUE and FALSE.',
        icon: 'condition'
      }
    ],

    cfgHeading: 'Control Flow Graph (CFG)',
    cfgIntro:
      'A Control Flow Graph is a directed graph G = (N, E) where:',
    cfgPoints: [
      { label: 'N (Nodes)', detail: 'Represent atomic computational statements, entry points, exit points, or decision points in the code.' },
      { label: 'E (Edges)', detail: 'Represent possible transitions between nodes - i.e., the possible execution paths the program can take.' },
      { label: 'Entry Node', detail: 'The unique start node from which all paths originate (typically the function entry).' },
      { label: 'Exit Node', detail: 'The unique end node at which all paths terminate (typically the return statement).' }
    ],
    cfgConstruction: [
      'Each sequential statement block maps to a single node.',
      'An IF decision creates a node with two outgoing edges: one for TRUE, one for FALSE.',
      'A WHILE / FOR loop creates a back-edge (loop-back) from the end of the loop body to the condition node.',
      'All paths converge back before the exit node.'
    ],
    cfgTip: 'Tip: Group consecutive sequential statements (no branching) into a single node to keep the CFG compact and readable.',

    complexityHeading: 'Cyclomatic Complexity (CC)',
    complexityIntro:
      "Cyclomatic Complexity (V(G)) is a software metric that provides a quantitative measure of the number of linearly independent paths through a program's source code. It was introduced by Thomas J. McCabe (1976).",
    formulas: [
      {
        name: 'Formula 1 - Graph Edges & Nodes',
        formula: 'V(G) = E - N + 2P',
        description: 'Where E = number of edges, N = number of nodes, P = number of connected components (typically 1 for a single function).',
        example: 'A CFG with E=7 edges, N=6 nodes, P=1: V(G) = 7 - 6 + 2(1) = 3'
      },
      {
        name: 'Formula 2 - Predicate Nodes',
        formula: 'V(G) = P + 1',
        description: 'Where P = number of predicate (decision) nodes in the CFG. A predicate node is any node with more than one outgoing edge.',
        example: 'A function with 2 if-statements has P=2 predicate nodes: V(G) = 2 + 1 = 3'
      },
      {
        name: 'Formula 3 - Region Counting',
        formula: 'V(G) = Number of enclosed regions + 1',
        description: 'Count the enclosed areas (regions) formed by the CFG when drawn as a planar graph, then add 1 for the outer infinite region.',
        example: 'A CFG with 2 enclosed regions: V(G) = 2 + 1 = 3. All three formulas must yield the same result.'
      }
    ],
    complexityScale: [
      { range: '1 - 10', risk: 'Low Risk', color: 'emerald', description: 'Simple, well-structured code. Minimal testing effort required.' },
      { range: '11 - 20', risk: 'Moderate Risk', color: 'amber', description: 'More complex code. Careful testing needed.' },
      { range: '21 - 50', risk: 'High Risk', color: 'orange', description: 'Very complex code. Strong defect risk. Requires extensive testing.' },
      { range: '> 50', risk: 'Untestable', color: 'red', description: 'Extremely complex. Must be decomposed before testing.' }
    ],

    basisPathHeading: 'Basis Path Testing',
    basisPathIntro:
      'Basis path testing is a white-box technique that uses the Cyclomatic Complexity value to determine the minimum number of independent paths that together exercise every logical condition in the program at least once.',
    basisPathSteps: [
      'Draw the Control Flow Graph from the source code.',
      'Calculate the Cyclomatic Complexity V(G) using any of the three formulas.',
      'Use V(G) as the exact count of independent basis paths to identify.',
      'Design one test case per basis path, ensuring each path executes at least once.',
      'Verify that executing all test cases achieves 100% path coverage.'
    ],

    comparisonTable: {
      heading: 'White-Box vs Black-Box Testing',
      columns: ['Aspect', 'White-Box Testing', 'Black-Box Testing'],
      rows: [
        ['Knowledge Required', 'Full access to source code and internal logic', 'No knowledge of internal implementation'],
        ['Also Known As', 'Structural / Glass-box / Clear-box testing', 'Functional / Behavioral / Opaque-box testing'],
        ['Basis of Testing', 'Internal code paths, branches, and statements', 'Software requirements and specifications'],
        ['Who Performs It', 'Developers or trained testers with code access', 'QA testers, end-users, or domain experts'],
        ['Test Design', 'Derived from CFG, control flow, and data flow', 'Derived from use cases, equivalence classes, boundary values'],
        ['Coverage Criterion', 'Statement, Branch, Path, Condition coverage', 'Functional requirements coverage'],
        ['Defect Discovery', 'Logic errors, unreachable code, hidden paths', 'Missing features, incorrect outputs, UI defects'],
        ['Testing Phase', 'Unit testing, Integration testing', 'System testing, Acceptance testing'],
        ['Advantages', 'Thorough logic coverage, finds hidden bugs', 'Tests from user perspective, no code access needed'],
        ['Disadvantages', 'Time-consuming, requires code expertise', 'May miss internal logic errors, incomplete coverage']
      ]
    },

    sqaProcessHeading: 'SQA in the Software Development Life Cycle',
    sqaProcessSteps: [
      {
        phase: 'Requirements',
        activity: 'SQA Review',
        description: 'Review requirements for completeness, consistency, and testability. Identify ambiguous or conflicting requirements early.',
        icon: 'requirements'
      },
      {
        phase: 'Design',
        activity: 'Design Inspection',
        description: 'Conduct design walkthroughs to verify that architecture satisfies requirements and adheres to design standards.',
        icon: 'design'
      },
      {
        phase: 'Coding',
        activity: 'Code Review & Static Analysis',
        description: 'Perform code reviews, pair programming, and static analysis. White-box testing techniques are applied here.',
        icon: 'coding'
      },
      {
        phase: 'Testing',
        activity: 'Dynamic Testing',
        description: 'Execute test cases (white-box and black-box), measure coverage metrics, and track defect density.',
        icon: 'testing'
      },
      {
        phase: 'Maintenance',
        activity: 'Regression Testing',
        description: 'Re-execute basis path test cases after changes to ensure no regressions. Update CFG if code structure changes.',
        icon: 'maintenance'
      }
    ]
  },

  procedure: {
    title: 'Lab Instructions & Guidelines',
    steps: [
      'Navigate to the Simulation Activity tab and select a code preset from the dropdown menu.',
      'Carefully read the JavaScript function and identify all sequential statements and decision points.',
      'Map each atomic block to a CFG node number. Decision nodes will have two outgoing edges (true/false).',
      'Count total Nodes (N) and Edges (E) in your CFG.',
      'Compute Cyclomatic Complexity using all three formulas and confirm they produce the same result.',
      'Identify all independent basis paths (the number equals Cyclomatic Complexity).',
      'In the Test Runner section, click "Animate Path" to trace each path step-by-step through the CFG.',
      'Achieve 100% path coverage by ensuring all basis paths have been exercised.',
      'Use the Complexity Calculator to practice computing V(G) for custom CFGs.',
      'Complete the Practice Quiz to validate your understanding of SQA concepts.',
      'Download the compiled PDF Lab Report from the Lab Report tab.'
    ]
  },

  complexityCalculator: {
    heading: 'Interactive Complexity Calculator',
    description: 'Enter your CFG metrics below to compute Cyclomatic Complexity using all three formulas and get an instant risk assessment.',
    fields: [
      { id: 'edges', label: 'Edges (E)', placeholder: 'e.g. 7', min: 1 },
      { id: 'nodes', label: 'Nodes (N)', placeholder: 'e.g. 6', min: 1 },
      { id: 'predicates', label: 'Predicate Nodes (P)', placeholder: 'e.g. 2', min: 0 },
      { id: 'regions', label: 'Enclosed Regions (R)', placeholder: 'e.g. 2', min: 0 }
    ]
  },

  codePresets: [
    {
      id: 'processOrder',
      label: 'processOrder() - E-Commerce Discount',
      nodes: 6,
      edges: 7,
      predicateNodes: 2,
      regions: 3,
      complexity: 3,
      totalPaths: 3,
      code: `function processOrder(amount, isMember) {
  let discount = 0;
  if (amount > 100) {        // Node 2 - Decision
    if (isMember) {          // Node 3 - Decision
      discount = 20;         // Node 4 - Action
    } else {
      discount = 10;         // Node 5 - Action
    }
  } else {
    discount = 0;            // Node 6 - Action (else)
  }
  return discount;           // Node 7 - Exit
}`,
      cfg: {
        nodes: [
          { id: '1', label: 'Entry\\nlet discount=0', x: 220, y: 20 },
          { id: '2', label: 'amount > 100?', x: 220, y: 110, decision: true },
          { id: '3', label: 'isMember?', x: 120, y: 200, decision: true },
          { id: '4', label: 'discount = 20', x: 60, y: 290 },
          { id: '5', label: 'discount = 10', x: 180, y: 290 },
          { id: '6', label: 'discount = 0', x: 340, y: 200 },
          { id: '7', label: 'return discount\\n(Exit)', x: 220, y: 380 }
        ],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3', label: 'T' },
          { from: '2', to: '6', label: 'F' },
          { from: '3', to: '4', label: 'T' },
          { from: '3', to: '5', label: 'F' },
          { from: '4', to: '7' },
          { from: '5', to: '7' },
          { from: '6', to: '7' }
        ]
      },
      paths: [
        { id: 'P1', label: '1->2->3->4->7', description: 'amount > 100 AND isMember = true', inputs: { amount: 150, isMember: true }, expected: 20 },
        { id: 'P2', label: '1->2->3->5->7', description: 'amount > 100 AND isMember = false', inputs: { amount: 150, isMember: false }, expected: 10 },
        { id: 'P3', label: '1->2->6->7', description: 'amount <= 100', inputs: { amount: 80, isMember: false }, expected: 0 }
      ]
    },
    {
      id: 'classifyScore',
      label: 'classifyScore() - Grade Classifier',
      nodes: 7,
      edges: 9,
      predicateNodes: 3,
      regions: 4,
      complexity: 4,
      totalPaths: 4,
      code: `function classifyScore(score) {
  let grade;
  if (score >= 90) {          // Node 2 - Decision
    grade = 'A';              // Node 3
  } else if (score >= 75) {   // Node 4 - Decision
    grade = 'B';              // Node 5
  } else if (score >= 60) {   // Node 6 - Decision
    grade = 'C';              // Node 7
  } else {
    grade = 'F';              // Node 8
  }
  return grade;               // Node 9 - Exit
}`,
      cfg: {
        nodes: [
          { id: '1', label: 'Entry', x: 220, y: 20 },
          { id: '2', label: 'score >= 90?', x: 220, y: 100, decision: true },
          { id: '3', label: "grade = 'A'", x: 60, y: 180 },
          { id: '4', label: 'score >= 75?', x: 320, y: 180, decision: true },
          { id: '5', label: "grade = 'B'", x: 220, y: 260 },
          { id: '6', label: 'score >= 60?', x: 400, y: 260, decision: true },
          { id: '7', label: "grade = 'C'", x: 320, y: 340 },
          { id: '8', label: "grade = 'F'", x: 480, y: 340 },
          { id: '9', label: 'return grade\\n(Exit)', x: 220, y: 420 }
        ],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3', label: 'T' },
          { from: '2', to: '4', label: 'F' },
          { from: '3', to: '9' },
          { from: '4', to: '5', label: 'T' },
          { from: '4', to: '6', label: 'F' },
          { from: '5', to: '9' },
          { from: '6', to: '7', label: 'T' },
          { from: '6', to: '8', label: 'F' },
          { from: '7', to: '9' },
          { from: '8', to: '9' }
        ]
      },
      paths: [
        { id: 'P1', label: '1->2->3->9', description: 'score >= 90 -> Grade A', inputs: { score: 95 }, expected: 'A' },
        { id: 'P2', label: '1->2->4->5->9', description: '75 <= score < 90 -> Grade B', inputs: { score: 80 }, expected: 'B' },
        { id: 'P3', label: '1->2->4->6->7->9', description: '60 <= score < 75 -> Grade C', inputs: { score: 65 }, expected: 'C' },
        { id: 'P4', label: '1->2->4->6->8->9', description: 'score < 60 -> Grade F', inputs: { score: 45 }, expected: 'F' }
      ]
    },
    {
      id: 'computeTax',
      label: 'computeTax() - Tax Calculator',
      nodes: 8,
      edges: 10,
      predicateNodes: 3,
      regions: 4,
      complexity: 4,
      totalPaths: 4,
      code: `function computeTax(income, isResident) {
  let tax = 0;
  if (isResident) {            // Node 2 - Decision
    if (income > 500000) {     // Node 3 - Decision
      tax = income * 0.30;     // Node 4
    } else {
      tax = income * 0.15;     // Node 5
    }
  } else {
    if (income > 200000) {     // Node 6 - Decision
      tax = income * 0.25;     // Node 7
    } else {
      tax = income * 0.10;     // Node 8
    }
  }
  return tax;                  // Node 9 - Exit
}`,
      cfg: {
        nodes: [
          { id: '1', label: 'Entry\\ntax = 0', x: 220, y: 20 },
          { id: '2', label: 'isResident?', x: 220, y: 100, decision: true },
          { id: '3', label: 'income > 500000?', x: 80, y: 190, decision: true },
          { id: '4', label: 'tax = income * 0.30', x: 20, y: 280 },
          { id: '5', label: 'tax = income * 0.15', x: 140, y: 280 },
          { id: '6', label: 'income > 200000?', x: 360, y: 190, decision: true },
          { id: '7', label: 'tax = income * 0.25', x: 300, y: 280 },
          { id: '8', label: 'tax = income * 0.10', x: 420, y: 280 },
          { id: '9', label: 'return tax\\n(Exit)', x: 220, y: 370 }
        ],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3', label: 'T' },
          { from: '2', to: '6', label: 'F' },
          { from: '3', to: '4', label: 'T' },
          { from: '3', to: '5', label: 'F' },
          { from: '4', to: '9' },
          { from: '5', to: '9' },
          { from: '6', to: '7', label: 'T' },
          { from: '6', to: '8', label: 'F' },
          { from: '7', to: '9' },
          { from: '8', to: '9' }
        ]
      },
      paths: [
        { id: 'P1', label: '1->2->3->4->9', description: 'Resident AND income > 500000 -> 30% tax', inputs: { income: 600000, isResident: true }, expected: 180000 },
        { id: 'P2', label: '1->2->3->5->9', description: 'Resident AND income <= 500000 -> 15% tax', inputs: { income: 300000, isResident: true }, expected: 45000 },
        { id: 'P3', label: '1->2->6->7->9', description: 'Non-resident AND income > 200000 -> 25% tax', inputs: { income: 400000, isResident: false }, expected: 100000 },
        { id: 'P4', label: '1->2->6->8->9', description: 'Non-resident AND income <= 200000 -> 10% tax', inputs: { income: 100000, isResident: false }, expected: 10000 }
      ]
    },
    {
      id: 'sumPositive',
      label: 'sumPositive() - Loop-Based Sum',
      nodes: 5,
      edges: 7,
      predicateNodes: 2,
      regions: 3,
      complexity: 3,
      totalPaths: 3,
      code: `function sumPositive(numbers) {
  let sum = 0;
  let i = 0;
  while (i < numbers.length) {  // Node 2 - Loop Decision
    if (numbers[i] > 0) {       // Node 3 - Inner Decision
      sum += numbers[i];        // Node 4 - Action
    }
    i++;                        // Node 5 - Increment
  }
  return sum;                   // Node 6 - Exit
}`,
      cfg: {
        nodes: [
          { id: '1', label: 'Entry\\nsum=0, i=0', x: 200, y: 20 },
          { id: '2', label: 'i < numbers\\n.length?', x: 200, y: 110, decision: true },
          { id: '3', label: 'numbers[i]\\n> 0?', x: 100, y: 210, decision: true },
          { id: '4', label: 'sum +=\\nnumbers[i]', x: 60, y: 310 },
          { id: '5', label: 'i++', x: 140, y: 390 },
          { id: '6', label: 'return sum\\n(Exit)', x: 330, y: 210 }
        ],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3', label: 'T' },
          { from: '2', to: '6', label: 'F' },
          { from: '3', to: '4', label: 'T' },
          { from: '3', to: '5', label: 'F' },
          { from: '4', to: '5' },
          { from: '5', to: '2', label: 'back' }
        ]
      },
      paths: [
        { id: 'P1', label: '1->2->6', description: 'Empty array - loop never executes', inputs: { numbers: [] }, expected: 0 },
        { id: 'P2', label: '1->2->3->4->5->2->6', description: 'Array with positive numbers', inputs: { numbers: [5, 3] }, expected: 8 },
        { id: 'P3', label: '1->2->3->5->2->6', description: 'Array with only non-positive numbers', inputs: { numbers: [-2, -5] }, expected: 0 }
      ]
    },
    {
      id: 'getDayType',
      label: 'getDayType() - Switch-Case Day Classifier',
      nodes: 7,
      edges: 10,
      predicateNodes: 3,
      regions: 4,
      complexity: 4,
      totalPaths: 4,
      code: `function getDayType(day) {
  let type;
  switch (day) {
    case 'Saturday':          // Node 2 - Decision
    case 'Sunday':
      type = 'Weekend';       // Node 3
      break;
    case 'Monday':            // Node 4 - Decision
    case 'Friday':
      type = 'Near-Weekend';  // Node 5
      break;
    default:                  // Node 6
      type = 'Weekday';       // Node 7
  }
  return type;                // Node 8 - Exit
}`,
      cfg: {
        nodes: [
          { id: '1', label: 'Entry', x: 220, y: 20 },
          { id: '2', label: 'Sat or Sun?', x: 220, y: 110, decision: true },
          { id: '3', label: "type='Weekend'", x: 80, y: 210 },
          { id: '4', label: 'Mon or Fri?', x: 310, y: 110, decision: true },
          { id: '5', label: "type='Near-Weekend'", x: 310, y: 210 },
          { id: '6', label: "type='Weekday'", x: 420, y: 210 },
          { id: '7', label: 'return type\\n(Exit)', x: 220, y: 320 }
        ],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3', label: 'T' },
          { from: '2', to: '4', label: 'F' },
          { from: '3', to: '7' },
          { from: '4', to: '5', label: 'T' },
          { from: '4', to: '6', label: 'F' },
          { from: '5', to: '7' },
          { from: '6', to: '7' }
        ]
      },
      paths: [
        { id: 'P1', label: '1->2->3->7', description: "day = 'Saturday' or 'Sunday' -> Weekend", inputs: { day: 'Saturday' }, expected: 'Weekend' },
        { id: 'P2', label: '1->2->4->5->7', description: "day = 'Monday' or 'Friday' -> Near-Weekend", inputs: { day: 'Friday' }, expected: 'Near-Weekend' },
        { id: 'P3', label: '1->2->4->6->7', description: 'Any other day -> Weekday', inputs: { day: 'Wednesday' }, expected: 'Weekday' },
        { id: 'P4', label: '1->2->4->6->7', description: "day = 'Tuesday' -> Weekday (default path)", inputs: { day: 'Tuesday' }, expected: 'Weekday' }
      ]
    }
  ]
};
