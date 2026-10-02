import jsPDF from 'jspdf';

/**
 * LMS Case study reference preset according to the IEEE 830-1998 theory document
 */
export const LMS_CASE_STUDY_PRESET = {
  title: 'Library Management System (LMS)',
  sop: `The proposed Library Management System is a simple, web-based application designed to digitize and automate daily library operations for Librarians/Admins and Students/Users. It replaces manual paper registers with core features such as secure role-based login, book cataloguing, member management, catalog searching, issue/return processing, overdue fine calculation, and transaction history tracking. Operating smoothly on standard devices via modern web browsers and an internet connection, the system focuses strictly on physical book circulation through manual data entry, intentionally omitting complex hardware like RFID gates or automated barcode scanners while relying on password security and routine database backups for reliable daily use.`,
  scope: `The LMS automates everyday routine library activities, replacing slow and error-prone paper ledgers with an organized digital interface.\nKey Tasks: The application handles adding new books, updating book statuses, registering members, issuing books to readers, checking in returned books, and tracking late fee calculations.\nSystem Boundaries: The LMS focuses entirely on daily in-library counter operations and member book searches. It does not manage external bookstore purchases, publisher contracts, or inter-library book deliveries.`,
  functionalRequirements: [
    {
      id: 'FR-01',
      name: 'Book Search',
      desc: 'Allows any user to search the catalog using a book title, author name, or subject to check shelf availability and physical location.'
    },
    {
      id: 'FR-02',
      name: 'User Login',
      desc: 'Verifies user credentials to ensure readers only see personal borrowing details, while staff have access to administrative desk tools.'
    },
    {
      id: 'FR-03',
      name: 'Issue Book',
      desc: 'Enables staff to scan a member card and a book barcode to link the loan, set the due date, and mark the copy as unavailable.'
    },
    {
      id: 'FR-04',
      name: 'Return Book',
      desc: 'Allows staff to scan a returned book, mark its status back to available, and clear the active loan from the member\'s account.'
    },
    {
      id: 'FR-05',
      name: 'Fine Calculation',
      desc: 'Automatically calculates late penalties based on the number of days a book is overdue when it is returned.'
    },
    {
      id: 'FR-06',
      name: 'Manage Books',
      desc: 'Lets staff add newly purchased titles, modify existing details like shelf numbers, and mark worn-out copies as removed.'
    },
    {
      id: 'FR-07',
      name: 'Manage Members',
      desc: 'Allows staff to register new readers, edit member profiles, deactivate expired cards, and view personal borrowing histories.'
    },
    {
      id: 'FR-08',
      name: 'Loan Renewal',
      desc: 'Allows a member or staff member to extend the due date of a currently borrowed book if no other reader has requested it.'
    },
    {
      id: 'FR-09',
      name: 'Book Reservation',
      desc: 'Enables a reader to place a hold on a book that is currently checked out, notifying staff when the book arrives back at the desk.'
    },
    {
      id: 'FR-10',
      name: 'Overdue Notifications',
      desc: 'Automatically creates a list of overdue books and sends reminder notices to members to return their items promptly.'
    }
  ],
  nonFunctionalRequirements: [
    {
      id: 'NFR-01',
      category: 'Response Time & Performance',
      desc: 'Keeps search lookups and form submissions prompt (response within 1.5 seconds) so counter queues remain short during busy library hours.'
    },
    {
      id: 'NFR-02',
      category: 'Security & Access Control',
      desc: 'Protects member account passwords and personal contact information using standard password hashing methods (bcrypt) and role-based permissions.'
    },
    {
      id: 'NFR-03',
      category: 'Reliability & Availability',
      desc: 'Maintains stable system performance during open hours (99.9% uptime), ensuring no borrowing records are lost if an unexpected restart occurs.'
    },
    {
      id: 'NFR-04',
      category: 'Usability & Accessibility',
      desc: 'Features simple layouts, large text, and clear buttons so new readers and staff can use the system without extensive training.'
    },
    {
      id: 'NFR-05',
      category: 'Data Accuracy & Integrity',
      desc: 'Ensures that once a book is issued, its status reflects immediately across all screens to prevent conflicting records and duplicate checkouts.'
    },
    {
      id: 'NFR-06',
      category: 'Maintainability & Modularity',
      desc: 'Keeps software code and database tables neatly structured with modular components so future features can be added without rewriting the whole system.'
    }
  ],
  definitions: [
    { term: 'LMS', definition: 'Library Management System - The centralized web platform automating book circulation.' },
    { term: 'Patron', definition: 'Any registered student or reader permitted to borrow books from the collection.' },
    { term: 'Issue', definition: 'The process of lending out a library book to a registered member.' },
    { term: 'Return', definition: 'The process of checking in a borrowed book back onto the library shelf.' },
    { term: 'Due Date', definition: 'The agreed deadline by which a borrowed book must be returned to the library.' },
    { term: 'Fine', definition: 'A predetermined monetary fee charged to a borrower for each day a book remains overdue.' }
  ],
  databaseTables: [
    { name: 'Books Table', fields: 'Stores book ID, title, author, category, publication details, shelf location, and current availability status (available, issued, or reserved).' },
    { name: 'Members Table', fields: 'Stores member ID, full name, phone number, email address, registration date, and current account status.' },
    { name: 'Loans Table', fields: 'Records which book is issued to which member, the issue timestamp, the scheduled due date, and the actual return date.' },
    { name: 'Fines Table', fields: 'Tracks overdue penalty amounts, payment status, and collection timestamps.' }
  ]
};

/**
 * Builds a complete IEEE Std 830-1998 compliant document structure
 * from user inputs (Project Title, SOP, FRs, NFRs)
 */
export const buildIeeeSrsDocument = (formData) => {
  const title = (formData.title || '').trim() || 'Software Project System';
  const sop = (formData.sop || '').trim() || 'Statement of Purpose describing system objectives and operational context.';
  
  // Format FRs
  const frs = (formData.functionalRequirements || []).map((fr, idx) => {
    if (typeof fr === 'string') {
      return {
        id: `FR-${String(idx + 1).padStart(2, '0')}`,
        name: `Functional Requirement ${idx + 1}`,
        desc: fr
      };
    }
    return {
      id: fr.id || `FR-${String(idx + 1).padStart(2, '0')}`,
      name: fr.name || `Requirement ${idx + 1}`,
      desc: fr.desc || fr.name || ''
    };
  });

  // Format NFRs
  const nfrs = (formData.nonFunctionalRequirements || []).map((nfr, idx) => {
    if (typeof nfr === 'string') {
      return {
        id: `NFR-${String(idx + 1).padStart(2, '0')}`,
        category: 'General Quality Attribute',
        desc: nfr
      };
    }
    return {
      id: nfr.id || `NFR-${String(idx + 1).padStart(2, '0')}`,
      category: nfr.category || 'Quality Attribute',
      desc: nfr.desc || ''
    };
  });

  // Fallback or custom definitions
  const definitions = formData.definitions?.length > 0 ? formData.definitions : [
    { term: 'SRS', definition: 'Software Requirements Specification - Formal specification adhering to IEEE Std 830-1998.' },
    { term: 'FR', definition: 'Functional Requirement - Details specific system behaviors, actions, workflows, and calculations.' },
    { term: 'NFR', definition: 'Non-Functional Requirement - Details system quality metrics, constraints, and performance thresholds.' },
    { term: 'RBAC', definition: 'Role-Based Access Control - User authentication and authorization security protocol.' },
    { term: 'RDBMS', definition: 'Relational Database Management System - Persistent storage engine.' }
  ];

  // Fallback or custom database tables
  const databaseTables = formData.databaseTables?.length > 0 ? formData.databaseTables : [
    { name: 'Users Table', fields: 'Stores user ID, credentials, role (Admin/Staff/Client), profile details, and account status.' },
    { name: 'Core Entity Table', fields: `Stores primary business entity records, metadata, categorization, and activity status for ${title}.` },
    { name: 'Transactions / Operations Table', fields: 'Maintains records of user transactions, timestamps, operational parameters, and history.' },
    { name: 'Audit & Logs Table', fields: 'Maintains security access logs, modification history, and system audit trails.' }
  ];

  const scopeText = formData.scope || (
    `The ${title} is engineered to replace manual and disjointed workflows with a unified, digital web-based platform.\n` +
    `Key Tasks: The application delivers end-to-end management including secure authentication, entity record handling, real-time transaction processing, and automated reporting.\n` +
    `System Boundaries: The system provides direct user and administrative interaction via modern web interfaces. External legacy systems and out-of-scope manual processes are strictly bounded.`
  );

  return {
    metadata: {
      standard: 'IEEE Std 830-1998',
      documentTitle: `Software Requirements Specification (SRS) for ${title}`,
      projectTitle: title,
      version: '1.0 Baseline Draft',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      organization: 'Software Engineering Virtual Laboratory'
    },
    sections: {
      introduction: {
        num: '1.',
        title: 'Introduction',
        subsections: [
          {
            num: '1.1',
            title: 'Purpose',
            content: `This document specifies the software requirements for ${title}. It serves as a clear and authoritative guide for developers, evaluators, project managers, and stakeholders to understand how the application operates, what tasks it performs, and how users interact with it in accordance with IEEE Std 830-1998.`
          },
          {
            num: '1.2',
            title: 'Scope',
            content: scopeText
          },
          {
            num: '1.3',
            title: 'Definitions, Acronyms, and Abbreviations',
            items: definitions
          },
          {
            num: '1.4',
            title: 'Overview',
            content: `The document is structured into two main technical parts:\nSection 2 (Overall Description) covers the general context of the system, summary of user roles, operational limits, and basic setup assumptions.\nSection 3 (Specific Requirements) outlines the detailed functional needs, system interfaces, database requirements, and quality expectations.`
          }
        ]
      },
      overallDescription: {
        num: '2.',
        title: 'The Overall Description',
        subsections: [
          {
            num: '2.1',
            title: 'Product Perspective',
            content: `The ${title} is an independent, centralized web application accessible through standard web browsers on client desktop computers, laptops, and tablets. The system utilizes a modern client-server architecture where responsive frontend browser screens communicate directly with a central application server and relational database.`
          },
          {
            num: '2.2',
            title: 'Product Function',
            content: `The core functions performed by ${title} include:\n` +
              frs.map((f, i) => `• ${f.name}: ${f.desc}`).join('\n')
          },
          {
            num: '2.3',
            title: 'User Characteristics',
            content: `• Regular End-Users: Everyday visitors and clients with standard computer skills who utilize the self-service and search features.\n• Operational Staff: Daily operators responsible for routine transactions, record validation, and customer servicing.\n• System Administrator: Technical administrators responsible for user provisioning, access control policies, system audits, and database backups.`
          },
          {
            num: '2.4',
            title: 'Constraints',
            content: `• The software must execute reliably across standard modern web browsers (Chrome, Firefox, Edge, Safari) without requiring third-party plugins.\n• The user interface must remain intuitive and accessible to ensure low operational overhead.\n• User passwords and sensitive personal information must remain encrypted in accordance with data privacy standards.`
          },
          {
            num: '2.5',
            title: 'Assumptions and Dependencies',
            content: `• End-user workstations and client devices maintain stable network connectivity during operational hours.\n• Relational database service and host servers maintain continuous availability.\n• Client workstations run standard web browsers with JavaScript enabled.`
          }
        ]
      },
      specificRequirements: {
        num: '3.',
        title: 'Specific Requirements',
        interfaces: {
          num: '3.1',
          title: 'Interfaces',
          user: 'A clean, uncluttered responsive user interface allowing intuitive navigation, instant search lookup, and straightforward form submissions.',
          hardware: 'Standard client computing devices (desktops, laptops, tablets) and standard input peripherals (keyboards, pointing devices, barcode/document scanners where applicable).',
          software: 'A relational database engine (e.g., PostgreSQL, MySQL, MongoDB) for atomic transactions, and standard HTTP/JSON REST APIs for client-server communication.',
          communication: 'Encrypted communication over HTTPS/TLS protocols safeguarding data transmission between browser clients and application servers.'
        },
        database: {
          num: '3.2',
          title: 'Database Requirements',
          tables: databaseTables
        },
        performance: {
          num: '3.3',
          title: 'Performance Requirements',
          items: [
            'Page Loading: Core search views and record pages must render within 1.5 seconds under normal operational loads.',
            'Atomic Record Updates: Transaction records and data modifications must persist immediately to prevent concurrency discrepancies.',
            'Simultaneous Access: The system architecture must accommodate concurrent users without data corruption or latency degradation.'
          ]
        },
        functionalReqs: {
          num: '3.4.1',
          title: 'Functional Requirements',
          items: frs
        },
        nonFunctionalReqs: {
          num: '3.4.2',
          title: 'Non-Functional Requirements',
          items: nfrs
        }
      },
      changeManagement: {
        num: '4.',
        title: 'Change Management Process',
        content: `• Request Submission: Any stakeholder or project team member submits a formal change request outlining the proposed modification or feature enhancement.\n• Review and Impact Analysis: The project lead and technical architects review the proposal to evaluate implementation cost, timeline impact, and architectural dependencies.\n• Approval and Baseline Release: Upon Change Control Board (CCB) approval, updates are scheduled, implemented in a dedicated branch, thoroughly validated against acceptance tests, and incorporated into the revised SRS baseline.`
      },
      approvals: {
        num: '5.',
        title: 'Document Approvals & Baseline Sign-Off',
        roles: [
          { role: 'Lead System Engineer', name: 'Software Engineering Lab Lead', status: 'Approved', date: new Date().toLocaleDateString() },
          { role: 'Project Evaluator / Instructor', name: 'Faculty Evaluator', status: 'Verified', date: new Date().toLocaleDateString() },
          { role: 'Student / Author', name: formData.studentName || 'Student Engineer', status: 'Submitted', date: new Date().toLocaleDateString() }
        ]
      }
    }
  };
};

/**
 * Generates and downloads a clean, multi-page, vector IEEE Std 830-1998 PDF
 */
export const downloadIeeeSrsPdf = (docData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      pdf.addPage();
      y = margin + 10; // Extra room for running header on subsequent pages
      return true;
    }
    return false;
  };

  // ----------------------------------------------------
  // COVER / TITLE BLOCK
  // ----------------------------------------------------
  pdf.setDrawColor(79, 70, 229); // Indigo 600
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(79, 70, 229);
  pdf.text('IEEE STD 830-1998 SPECIFICATION', margin + 6, y + 8);

  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42); // Slate 900
  pdf.text(docData.metadata.documentTitle, margin + 6, y + 18, { maxWidth: contentWidth - 12 });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 116, 139); // Slate 500
  pdf.text(
    `Document Version: ${docData.metadata.version}  |  Generated: ${docData.metadata.date}  |  Virtual Lab Record`,
    margin + 6,
    y + 32
  );

  y += 46;

  // Helper for section header
  const renderSectionHeader = (number, title) => {
    checkPageBreak(16);
    pdf.setFillColor(241, 245, 249);
    pdf.rect(margin, y, contentWidth, 7, 'F');
    pdf.setDrawColor(79, 70, 229);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, margin, y + 7);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${number} ${title}`, margin + 3, y + 5);
    y += 11;
  };

  // Helper for subsection header
  const renderSubsectionHeader = (num, title) => {
    checkPageBreak(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(79, 70, 229);
    pdf.text(`${num} ${title}`, margin, y + 4);
    y += 6.5;
  };

  // Helper for paragraph
  const renderParagraph = (text, indent = 0) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    const splitText = pdf.splitTextToSize(text, contentWidth - indent);
    const needed = (splitText.length * 4.2) + 2;
    checkPageBreak(needed);
    pdf.text(splitText, margin + indent, y + 3.5);
    y += needed;
  };

  // ----------------------------------------------------
  // SECTION 1: INTRODUCTION
  // ----------------------------------------------------
  const sec1 = docData.sections.introduction;
  renderSectionHeader(sec1.num, sec1.title);

  sec1.subsections.forEach(sub => {
    renderSubsectionHeader(sub.num, sub.title);
    if (sub.content) {
      renderParagraph(sub.content, 2);
    }
    if (sub.items && sub.items.length > 0) {
      sub.items.forEach(item => {
        checkPageBreak(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(30, 41, 59);
        pdf.text(`• ${item.term}:`, margin + 2, y + 3.5);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(71, 85, 105);
        const descLines = pdf.splitTextToSize(item.definition, contentWidth - 30);
        pdf.text(descLines, margin + 28, y + 3.5);
        y += (descLines.length * 4.2) + 2;
      });
      y += 2;
    }
  });

  // ----------------------------------------------------
  // SECTION 2: OVERALL DESCRIPTION
  // ----------------------------------------------------
  const sec2 = docData.sections.overallDescription;
  renderSectionHeader(sec2.num, sec2.title);

  sec2.subsections.forEach(sub => {
    renderSubsectionHeader(sub.num, sub.title);
    renderParagraph(sub.content, 2);
  });

  // ----------------------------------------------------
  // SECTION 3: SPECIFIC REQUIREMENTS
  // ----------------------------------------------------
  const sec3 = docData.sections.specificRequirements;
  renderSectionHeader(sec3.num, sec3.title);

  // 3.1 Interfaces
  renderSubsectionHeader(sec3.interfaces.num, sec3.interfaces.title);
  renderParagraph(`User Interfaces (UI): ${sec3.interfaces.user}`, 2);
  renderParagraph(`Hardware Interfaces: ${sec3.interfaces.hardware}`, 2);
  renderParagraph(`Software Interfaces: ${sec3.interfaces.software}`, 2);
  renderParagraph(`Communications Interfaces: ${sec3.interfaces.communication}`, 2);

  // 3.2 Database
  renderSubsectionHeader(sec3.database.num, sec3.database.title);
  sec3.database.tables.forEach(table => {
    checkPageBreak(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`• ${table.name}:`, margin + 2, y + 3.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    const tableLines = pdf.splitTextToSize(table.fields, contentWidth - 35);
    pdf.text(tableLines, margin + 35, y + 3.5);
    y += (tableLines.length * 4.2) + 2;
  });

  // 3.3 Performance
  renderSubsectionHeader(sec3.performance.num, sec3.performance.title);
  sec3.performance.items.forEach(perf => {
    renderParagraph(`• ${perf}`, 2);
  });

  // 3.4.1 Functional Requirements Table
  renderSubsectionHeader(sec3.functionalReqs.num, sec3.functionalReqs.title);
  checkPageBreak(12);
  
  // Table Header
  pdf.setFillColor(224, 231, 255); // Indigo 100
  pdf.rect(margin, y, contentWidth, 6, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(30, 41, 59);
  pdf.text('REQ ID', margin + 3, y + 4.2);
  pdf.text('FUNCTION / FEATURE', margin + 25, y + 4.2);
  pdf.text('REQUIREMENT SPECIFICATION (IEEE COMPLIANT)', margin + 70, y + 4.2);
  y += 7;

  sec3.functionalReqs.items.forEach((fr, idx) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const splitDesc = pdf.splitTextToSize(fr.desc, contentWidth - 73);
    const rowHeight = Math.max(7, (splitDesc.length * 3.8) + 3);
    checkPageBreak(rowHeight);

    if (idx % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(margin, y, contentWidth, rowHeight, 'D');

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(79, 70, 229);
    pdf.text(fr.id, margin + 3, y + 4.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(pdf.splitTextToSize(fr.name, 42), margin + 25, y + 4.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text(splitDesc, margin + 70, y + 4.5);

    y += rowHeight;
  });
  y += 4;

  // 3.4.2 Non-Functional Requirements Table
  renderSubsectionHeader(sec3.nonFunctionalReqs.num, sec3.nonFunctionalReqs.title);
  checkPageBreak(12);

  // Table Header
  pdf.setFillColor(220, 252, 231); // Emerald 100
  pdf.rect(margin, y, contentWidth, 6, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(20, 83, 45);
  pdf.text('NFR ID', margin + 3, y + 4.2);
  pdf.text('QUALITY ATTRIBUTE', margin + 25, y + 4.2);
  pdf.text('MEASURABLE SPECIFICATION & THRESHOLD', margin + 70, y + 4.2);
  y += 7;

  sec3.nonFunctionalReqs.items.forEach((nfr, idx) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const splitDesc = pdf.splitTextToSize(nfr.desc, contentWidth - 73);
    const rowHeight = Math.max(7, (splitDesc.length * 3.8) + 3);
    checkPageBreak(rowHeight);

    if (idx % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, contentWidth, rowHeight, 'F');
    }
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(margin, y, contentWidth, rowHeight, 'D');

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(5, 150, 105); // Emerald 600
    pdf.text(nfr.id, margin + 3, y + 4.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(pdf.splitTextToSize(nfr.category, 42), margin + 25, y + 4.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text(splitDesc, margin + 70, y + 4.5);

    y += rowHeight;
  });
  y += 4;

  // ----------------------------------------------------
  // SECTION 4: CHANGE MANAGEMENT
  // ----------------------------------------------------
  const sec4 = docData.sections.changeManagement;
  renderSectionHeader(sec4.num, sec4.title);
  renderParagraph(sec4.content, 2);

  // ----------------------------------------------------
  // SECTION 5: APPROVALS & SIGN-OFF
  // ----------------------------------------------------
  const sec5 = docData.sections.approvals;
  renderSectionHeader(sec5.num, sec5.title);

  checkPageBreak(25);
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, y, contentWidth, 6, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(30, 41, 59);
  pdf.text('ROLE', margin + 3, y + 4.2);
  pdf.text('NAME / STAKEHOLDER', margin + 55, y + 4.2);
  pdf.text('STATUS', margin + 115, y + 4.2);
  pdf.text('DATE', margin + 145, y + 4.2);
  y += 6;

  sec5.roles.forEach((sign, idx) => {
    checkPageBreak(7);
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(margin, y, contentWidth, 7, 'D');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);
    pdf.text(sign.role, margin + 3, y + 4.5);

    pdf.setFont('helvetica', 'normal');
    pdf.text(sign.name, margin + 55, y + 4.5);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(16, 185, 129);
    pdf.text(sign.status, margin + 115, y + 4.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(sign.date, margin + 145, y + 4.5);
    y += 7;
  });

  // ----------------------------------------------------
  // PASS 2: HEADERS AND FOOTERS ON ALL PAGES
  // ----------------------------------------------------
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    // Running Header (Pages > 1)
    if (i > 1) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184); // Slate 400
      pdf.text(
        `${docData.metadata.projectTitle}  —  IEEE Std 830-1998 Software Requirements Specification`,
        margin,
        10
      );
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(margin, 12, pageWidth - margin, 12);
    }

    // Running Footer
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      'Software Engineering Virtual Laboratory  |  Academic Laboratory Deliverable',
      margin,
      pageHeight - 7
    );
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  // Trigger download
  const cleanTitle = (docData.metadata.projectTitle || 'SRS')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  pdf.save(`${cleanTitle}-IEEE-830-SRS.pdf`);
};
