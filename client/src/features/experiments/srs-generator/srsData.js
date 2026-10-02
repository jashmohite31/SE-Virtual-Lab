export const SRS_EXPERIMENT_DATA = {
  aim: {
    title: 'Aim',
    content: 'To understand the concepts, structure, and development of a Software Requirements Specification (SRS) document, and to learn how to analyze, formalize, and validate functional and non-functional requirements from a problem statement according to the IEEE standard format.'
  },

  introduction: {
    title: 'Introduction',
    content: `The Software Requirements Specification (SRS) is a formal deliverable produced during the requirements engineering phase of the Software Development Life Cycle (SDLC). It bridges business requirements and system implementation, establishing a baseline contract between stakeholders, domain clients, and technical teams.

Until an SRS is documented and verified, downstream lifecycle phases—system architecture, database design, implementation, and test suite creation—cannot reliably start. A well-constructed SRS minimizes scope creep, prevents architectural rework, establishes criteria for acceptance testing, and serves as a reference for maintenance and contractual obligations.`
  },

  objective: {
    title: 'Objectives',
    subtitle: 'After completing this experiment, students will be able to:',
    points: [
      'Explain the purpose, role, and standard structure of an IEEE-compliant SRS document.',
      'Differentiate between user requirements, system requirements, functional requirements (FRs), and non-functional requirements (NFRs).',
      'Identify and eliminate requirement defects such as ambiguity, inconsistency, and incompleteness.',
      'Produce a complete SRS document'
    ]
  },

  theory: {
    title: 'Theory',
    definition: {
      heading: 'Definition and Purpose of an SRS',
      intro: 'According to IEEE standard terminology, an SRS is a complete description of the behavior of a system to be developed. It specifies:',
      specifies: [
        { label: 'What the system must do', detail: 'Interactions, workflows, calculations, and data processing.' },
        { label: 'Under what constraints it must operate', detail: 'Security protocols, response times, hardware dependencies, and memory limits.' },
        { label: 'What the system must not do', detail: 'Operational boundaries and error handling rules.' }
      ],
      closing: 'An SRS details what the target system should do without constraining how it will be designed internally (preserving implementation independence).'
    },
    characteristics: {
      heading: 'Core Characteristics of Quality Requirements',
      intro: 'To prevent project failure, every requirement documented in an SRS must exhibit key quality metrics:',
      items: [
        { name: 'Unambiguity', text: 'The statement has only one possible interpretation. Ambiguous terms (e.g., "fast response", "user-friendly", "high capacity") must be replaced with verifiable metrics (e.g., "response time under 1.5 seconds at 500 concurrent transactions").' },
        { name: 'Consistency', text: 'Requirements must not contradict each other. Conflicting rules (e.g., one section permitting guest checkout while another mandates multi-factor authentication) must be identified and reconciled.' },
        { name: 'Completeness', text: 'The specification must account for all valid inputs, invalid inputs, boundary values, error states, and expected outputs.' },
        { name: 'Verifiability (Testability)', text: 'A finite, cost-effective process or automated test case must be able to prove whether the final system satisfies the requirement.' },
        { name: 'Traceability', text: 'Each requirement must carry a unique identifier (e.g., FR-01, NFR-SEC-02) to track its lineage from customer request through design elements, code modules, and test cases.' }
      ]
    },
    reqClassification: {
      heading: 'User Requirements vs. System Requirements',
      userReqs: 'User Requirements: Abstract, natural-language statements outlining the operational goals and services the system provides for non-technical clients.',
      systemReqs: 'System Requirements: Precise technical specifications that define subsystem behaviours, interfaces, data formats, and logic for developers and QA engineers.',
      frHeading: 'Functional Requirements (FRs)',
      frText: 'Specify system reactions to inputs, data transformations, workflow steps, and expected outputs.',
      nfrHeading: 'Non-Functional Requirements (NFRs)',
      nfrText: 'Specify system qualities, environmental constraints, and performance limits. These are grouped into:',
      nfrGroups: [
        { name: 'Product Requirements', text: 'Performance thresholds, resource bounds, usability standards, and reliability criteria.' },
        { name: 'Organizational Requirements', text: 'Operational procedures, development standards, coding conventions, and delivery milestones.' },
        { name: 'External Requirements', text: 'Legislative compliance (e.g., GDPR), ethical guidelines, and third-party interface standards.' }
      ]
    },
    ieeeStructure: {
      heading: 'Standard IEEE 830 Structure',
      intro: 'The provided diagram outlines the standard IEEE 830 Format of an SRS (Software Requirements Specification), detailing its core sections and subsections:',
      sections: [
        {
          number: '1',
          title: 'Introduction',
          desc: 'The introductory section establishes the foundational context, baseline intent, and structural map of the entire SRS document.',
          subsections: [
            { id: '(i)', name: 'Purpose', text: 'Specifies the exact objectives and intended audience of the document (e.g., developers, testers, project managers, clients) and defines which version or release of the product is addressed.' },
            { id: '(ii)', name: 'Scope', text: 'Identifies the software product to be produced by name, explains what the application will and will not do, and outlines the operational goals, benefits, and business objectives.' },
            { id: '(iii)', name: 'Definition, Acronyms, and Abbreviations', text: 'Provides clear definitions of all technical terms, acronyms, and domain-specific vocabulary used throughout the document to prevent ambiguity and misinterpretation.' },
            { id: '(iv)', name: 'References', text: 'Lists all governing documentation, technical standards, project agreements, and external artifacts referenced within the specification (e.g., IEEE standards, user manuals, contract agreements).' },
            { id: '(v)', name: 'Overview', text: 'Explains the organization and layout of the rest of the SRS, guiding readers through the subsequent chapters.' }
          ]
        },
        {
          number: '2',
          title: 'The Overall Description',
          desc: 'This section describes the high-level operational environment, global context, and constraints governing the system without specifying detailed functional requirements.',
          subsections: [
            { id: '(i)', name: 'Product Perspective', text: 'Explains whether the system is self-contained or a component of a larger system. It outlines relationships with external software, hardware platforms, and operational architectures (often accompanied by a block diagram).' },
            { id: '(ii)', name: 'Product Function', text: 'Summarizes the major high-level functionalities the system performs (e.g., user account handling, transactional processing, report generation) in an organized, reader-friendly format.' },
            { id: '(iii)', name: 'User Characteristics', text: 'Defines the target end-user personas and profiles (e.g., system administrator, daily operator, casual user), detailing their technical background, operational responsibilities, and domain experience.' },
            { id: '(iv)', name: 'Constraint', text: 'Outlines limitations imposed on the design and implementation teams, such as compliance with regulatory policies, hardware limits, memory/storage ceilings, security protocols, or mandated development technologies.' },
            { id: '(v)', name: 'Assumption and Dependencies', text: 'Details factors that are assumed to be true for the system to perform as expected (e.g., operating system availability, continuous internet connectivity, specific third-party service availability).' },
            { id: '(vi)', name: 'Apportioning of Requirements', text: 'Identifies requirements that may be deferred or phased out to subsequent versions or future releases of the product due to budget, schedule, or technical constraints.' }
          ]
        },
        {
          number: '3',
          title: 'Specific Requirements',
          desc: 'This technical section serves as the direct reference for system design, coding, and verification. It provides detailed, testable specifications:',
          subsections: [
            {
              id: '(i)',
              name: 'Interfaces',
              text: 'Documents all logical and physical interface specifications:',
              interfaceDetails: [
                { label: 'User Interfaces (UI)', detail: 'Screen layouts, style rules, navigability, and accessibility parameters.' },
                { label: 'Hardware Interfaces', detail: 'Device interactions, protocols, communication ports, and peripherals.' },
                { label: 'Software Interfaces', detail: 'Integration with external platforms, commercial operating systems, third-party libraries, and APIs.' },
                { label: 'Communications Interfaces', detail: 'Networking protocols (e.g., HTTPS, TCP/IP, WebSockets), messaging formats, and transmission security.' }
              ]
            },
            { id: '(ii)', name: 'Database', text: 'Defines the logical database requirements, entity relationships, integrity constraints, data retention windows, indexing strategies, and security encryption policies.' },
            { id: '(iii)', name: 'Performance', text: 'Establishes quantifiable and verifiable operational metrics such as maximum allowable transaction response times, peak throughput (), and concurrent user capacity.' },
            {
              id: '(iv)',
              name: 'Software System Attributes',
              text: 'Details quality attributes and non-functional requirements (NFRs):',
              attributeDetails: [
                { label: 'Reliability', detail: 'Mean Time Between Failures (MTBF), fault-recovery mechanisms.' },
                { label: 'Availability', detail: 'Operational uptime percentages (e.g., 99.9% uptime).' },
                { label: 'Security', detail: 'Role-Based Access Control (RBAC), credential hashing, data-at-rest encryption.' },
                { label: 'Maintainability & Portability', detail: 'Ease of updating the system and executing across different OS environments.' }
              ]
            }
          ]
        },
        {
          number: '4',
          title: 'Change Management Process',
          desc: 'Specifies the governance model and operational protocol used to modify the requirements baseline. It defines how change requests are initiated, evaluated for impact, prioritized, and approved by the Change Control Board (CCB) to control scope creep.'
        },
        {
          number: '5',
          title: 'Document Approvals',
          desc: 'Acts as the formal sign-off page and contractual authorization for the project. It includes physical or cryptographic signatures, designated roles, and approval dates of authorized client representatives, project managers, and lead systems engineers, cementing the SRS as an agreed-upon baseline.'
        },
        {
          number: '6',
          title: 'Supporting Information',
          desc: 'Houses supplementary materials that support the primary requirements without overloading the core document. This includes sample input/output layouts, user interview transcripts, trace matrices, background data sheets, and supplementary design models.'
        }
      ]
    }
  },

  caseStudy: {
    title: 'Case Study: Library Management System (LMS)',
    problemDescription: {
      heading: '1. Problem Description',
      summary: 'A library manages a collection of reading materials and serves registered patrons. The facility currently relies on manual paper registers to record member accounts, catalog entries, daily book issues, return check-ins, and late fee calculations.',
      issuesIntro: 'This manual workflow causes several everyday operational problems:',
      issues: [
        'Physical ledgers and index cards make it difficult to locate items and track copy availability accurately.',
        'Busy check-in and check-out periods create counter delays due to manual page-by-page lookups.',
        'Calculating overdue penalties by hand leads to errors and missed payments.',
        'Borrowers cannot verify whether an item is on the shelf or checked out without visiting the circulation desk in person.',
        'Library staff lack a simple way to track unreturned materials or review general circulation activity.'
      ],
      solution: 'To fix these problems, the library requires an automated, web-based Library Management System (LMS) to streamline circulation tasks and provide an online self-service catalogue for readers.'
    },
    sop: {
      heading: '2. Statement of Purpose (SOP)',
      text: `The proposed Library Management System is a simple, web-based application designed to digitize and automate daily library operations for Librarians/Admins and Students/Users. It replaces manual paper registers with core features such as secure role-based login, book cataloguing, member management, catalog searching, issue/return processing, overdue fine calculation, and transaction history tracking. Operating smoothly on standard devices via modern web browsers and an internet connection, the system focuses strictly on physical book circulation through manual data entry, intentionally omitting complex hardware like RFID gates or automated barcode scanners while relying on password security and routine database backups for reliable daily use.`
    },
    srsDocument: {
      heading: '3. Software Requirements Specification (SRS) For Library Management System (LMS)',
      standard: 'Document Standard: IEEE Std 830-1998',
      sections: [
        {
          num: '1.',
          title: 'Introduction',
          details: [
            { heading: '1.1 Purpose', text: 'This document specifies the software requirements for a basic, easy-to-use web-based Library Management System (LMS). It serves as a clear guide for developers, project evaluators, and library staff to understand how the application operates, what tasks it performs, and how users interact with it.' },
            { heading: '1.2 Scope', text: 'The LMS automates everyday routine library activities, replacing slow and error-prone paper ledgers with an organized digital interface.\nKey Tasks: The application handles adding new books, updating book statuses, registering members, issuing books to readers, checking in returned books, and tracking late fee calculations.\nSystem Boundaries: The LMS focuses entirely on daily in-library counter operations and member book searches. It does not manage external bookstore purchases, publisher contracts, or inter-library book deliveries.' },
            { heading: '1.3 Definitions, Acronyms, and Abbreviations', text: 'LMS: Library Management System.\nPatron: Any registered student or reader permitted to borrow books from the collection.\nIssue: The process of lending out a library book to a registered member.\nReturn: The process of checking in a borrowed book back onto the library shelf.\nDue Date: The agreed deadline by which a borrowed book must be returned to the library.\nFine: A small fee charged to a borrower for every day a book is kept past its due date.' },
            { heading: '1.4 Overview', text: 'The document is structured into two main technical parts:\nSection 2: Covers the general context of the system, summary of user roles, operational limits, and basic setup assumptions.\nSection 3: Outlines the detailed functional needs, system interfaces, database requirements, and quality expectations.' }
          ]
        },
        {
          num: '2.',
          title: 'The Overall Description',
          details: [
            { heading: '2.1 Product Perspective', text: 'The LMS is an independent, centralized web application accessible through standard web browsers on library desktop computers, laptops, and tablets. The system uses a client-server structure where the frontend browser screens communicate directly with a central application server and database.' },
            { heading: '2.2 Product Function', text: 'Book Inventory: Add new titles, update existing book details, and remove lost or damaged copies.\nCatalog Search: Allow users to search the library collection by title, author, or subject without needing special assistance.\nMember Profiles: Register new library members, edit contact information, and review their current loans.\nCirculation Handling: Issue books to members, accept returns, and extend borrowing periods (renewals).\nLate Fee Calculation: Track return deadlines and compute fines automatically when items are returned late.\nDaily Activity Logs: Display simple summaries showing which books are currently out on loan and which members have overdue books.' },
            { heading: '2.3 User Characteristics', text: 'Patron (Reader): Everyday library visitors with basic computer skills. They use the system to look up books, see if a title is on the shelf, and check their own active loan deadlines.\nLibrarian (Counter Staff): Regular operators who spend their work hours issuing and receiving books, managing inventory, registering new readers, and collecting fines.\nAdministrator: Technical staff responsible for setting up user logins, adjusting borrowing policies, and ensuring regular database backups.' },
            { heading: '2.4 Constraint', text: 'The software must run smoothly in standard modern web browsers without requiring custom extensions or local software installations.\nThe interface must remain simple enough for readers of all ages to navigate easily.\nMember phone numbers, addresses, and login credentials must be kept confidential and safe from public view.' },
            { heading: '2.5 Assumption and Dependencies', text: 'The library has functional desktop computers at the circulation counter.\nA steady local network or internet connection is maintained during operating hours.\nThe system assumes standard barcode labels are pasted on books for fast scanning.' }
          ]
        },
        {
          num: '3.',
          title: 'Specific Requirements',
          interfaces: {
            user: 'A clean, uncluttered search page where readers can type a title or author name and view instant results.\nA dashboard for staff members containing large buttons and forms for issuing and returning books without unnecessary navigation.',
            hardware: 'Support for plug-and-play USB barcode scanners that read printed book and membership card barcodes directly into input fields.',
            software: 'A relational database engine to store all records, maintain tables, and ensure reliable data saving.\nA basic email gateway service to send automatic notices to members when books become overdue.',
            communication: 'Standard web protocols to connect user browser screens securely to the application server.'
          },
          databaseTables: [
            { name: 'Books Table', fields: 'Stores book ID, title, author, category, publication details, shelf location, and current availability status (available, issued, or reserved).' },
            { name: 'Members Table', fields: 'Stores member ID, full name, phone number, email address, registration date, and current account status.' },
            { name: 'Loans Table', fields: 'Records which book is issued to which member, the issue timestamp, the scheduled due date, and the actual return date.' },
            { name: 'Fines Table', fields: 'Tracks overdue penalty amounts, payment status, and collection timestamps.' }
          ],
          performance: [
            'Page Loading: Search results and book record pages should open without noticeable delay during standard daily use.',
            'Instant Record Updates: Saving a book issue or return must update the database immediately so a book cannot be issued twice by accident.',
            'Simultaneous Access: The system should easily handle multiple readers searching the catalog while staff work at the front desk.'
          ],
          functionalReqs: [
            { name: 'Book Search', desc: 'Allows any user to search the catalog using a book title, author name, or subject to check shelf availability and physical location.' },
            { name: 'User Login', desc: 'Verifies user credentials to ensure readers only see personal borrowing details, while staff have access to administrative desk tools.' },
            { name: 'Issue Book', desc: 'Enables staff to scan a member card and a book barcode to link the loan, set the due date, and mark the copy as unavailable.' },
            { name: 'Return Book', desc: 'Allows staff to scan a returned book, mark its status back to available, and clear the active loan from the member\'s account.' },
            { name: 'Fine Calculation', desc: 'Automatically calculates late penalties based on the number of days a book is overdue when it is returned.' },
            { name: 'Manage Books', desc: 'Lets staff add newly purchased titles, modify existing details like shelf numbers, and mark worn-out copies as removed.' },
            { name: 'Manage Members', desc: 'Allows staff to register new readers, edit member profiles, deactivate expired cards, and view personal borrowing histories.' },
            { name: 'Loan Renewal', desc: 'Allows a member or staff member to extend the due date of a currently borrowed book if no other reader has requested it.' },
            { name: 'Book Reservation', desc: 'Enables a reader to place a hold on a book that is currently checked out, notifying staff when the book arrives back at the desk.' },
            { name: 'Overdue Notifications', desc: 'Automatically creates a list of overdue books and sends reminder notices to members to return their items promptly.' }
          ],
          nonFunctionalReqs: [
            { cat: 'Response Time', desc: 'Keeps search lookups and form submissions prompt so counter queues remain short during busy library hours.' },
            { cat: 'Security', desc: 'Protects member account passwords and personal contact information using standard password hashing methods.' },
            { cat: 'Reliability', desc: 'Maintains stable system performance during open hours, ensuring no borrowing records are lost if an unexpected restart occurs.' },
            { cat: 'Usability', desc: 'Features simple layouts, large text, and clear buttons so new readers and staff can use the system without extensive training.' },
            { cat: 'Data Accuracy', desc: 'Ensures that once a book is issued, its status reflects immediately across all screens to prevent conflicting records.' },
            { cat: 'Maintainability', desc: 'Keeps software code and database tables neatly structured so future features can be added without rewriting the whole system.' }
          ]
        },
        {
          num: '4.',
          title: 'Change Management Process',
          steps: [
            'Request Submission: Any staff member or project developer submits a short note outlining a suggested change or feature addition.',
            'Review and Impact: The project lead checks the request to see how much work and time the proposed update would require.',
            'Approval and Application: Once approved, the changes are implemented in the software, tested, and documented in the updated project version.'
          ]
        }
      ]
    }
  },

  procedure: {
    title: 'Procedure',
    steps: [
      { step: 1, text: 'Analyze the given problem statement and identify domain boundaries and system constraints.' },
      { step: 2, text: 'Categorize user requirements into Functional Requirements (FRs) and Non-Functional Requirements (NFRs).' },
      { step: 3, text: 'Verify requirement statements against core quality characteristics: Unambiguity, Consistency, Completeness, Verifiability, and Traceability.' },
      { step: 4, text: 'Structure requirements into standard IEEE 830 format including Introduction, Overall Description, and Specific Requirements.' },
      { step: 5, text: 'Complete the Practice Quiz to assess understanding of SRS principles.' }
    ]
  }
};
