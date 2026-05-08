export type Language = 'pl' | 'en';

export const translations = {
  pl: {
    nav: {
      crm: 'Baza Relacji & CRM',
      calendar: 'Kalendarz Współpracy',
      aiSandbox: 'AI 200IQ Growth Strategist',
      pipeline: "Architektura Rozwoju",
      scripts: 'Propozycje Wartości',
      monetization: 'Monetyzacja & Wzrost',
      scalability: 'Skrzynka Narzędziowa'
    },
    common: {
      owner: 'Opiekun',
      seller: 'Doradca',
      guardian: 'Partner',
      nextContact: 'Zaplanowany kontakt',
      lastContact: 'Ostatni',
      save: 'Zapisz relację',
      generate: 'URUCHOM CO-PILOT WZROSTU'
    },
    crm: {
      addLead: 'Dodaj Partnera',
      title: 'Zarządzanie Relacją',
      desc: 'System budowania wartości we współpracy B2B i dowożenia realnych wyników dla klientów.',
      search: 'Szukaj...',
      noLeads: 'Brak partnerów w tym etapie',
      sendTo200IQ: 'Przejdź do strategii wzrostu',
      setContact: 'Planuj kontakt',
      basicData: 'Dane podstawowe',
      whatToDo: 'ZALECANY KROK',
      nextStep: 'KOLEJNY KROK',
      noNextStep: 'Brak kolejnego kroku',
      projectChecklist: 'Checklista rozwoju',
      projectSummaryEmpty: 'Podsumowanie Wzrostu (Brak)',
      generatePitchFirst: 'Najpierw uruchom CO-PILOT, aby system dopasował dowożące rozwiązania.',
      generatedStrategyAndArch: 'Wygenerowana Strategia Rozwoju',
      summaryMessageToClient: 'Propozycja Współpracy',
      generateSummaryBtn: 'Generuj propozycję',
      sendMsgBtn: 'Wyślij Wiadomość',
      sentSummaryHistory: 'Wysłano propozycję:\n\n',
      noFuncSelected: 'Nie wybrano modułów',
      dearClient: 'Szanowny Kliencie,',
      summaryIntro: 'Nawiązując do naszej rozmowy, przesyłam propozycję planu rozwoju i zwiększenia zysków dla',
      withRegards: 'Z wyrazami szacunku,',
      tabsHeaders: {
        allLeads: 'Wszyscy partnerzy',
        newDocs: 'Nowe dokumenty',
        toTransfer: 'Do wdrożenia',
      },
      unassigned: 'Nie przypisano',
      noHistory: 'Brak zapisanej historii.',
      pitchGenerated: 'Wygenerowano strategię.',
      classification: 'Priorytety Przedsiębiorstwa',
      generationError: 'Błąd generowania',
      table: {
        client: 'Partner',
        contact: 'Kontakt',
        region: 'Woj.',
        pipeline: 'Ścieżka Wzrostu',
        owner: 'Opiekun',
        nextContact: 'Kolejny Krok'
      },
      tabs: {
        diagnosis: 'POTENCJAŁ',
        solutions: 'ROZWIĄZANIA',
        pricing: 'INWESTYCJA & ROI',
        summary: 'PODSUMOWANIE'
      },
      roles: {
        title: 'Rola w procesie',
        firstCallerTitle: 'Doradca ds. Rozwoju',
        consultantTitle: 'Architekt Systemów Innowacji'
      },
      leadStatus: {
        new: 'NOWY PARTNER',
        triage: 'ZAINTERESOWANY',
        discovery: 'ANALIZA POTENCJAŁU',
        solution: 'PREZENTACJA WARTOŚCI',
        pitch: 'ZAKOŃCZENIE WDROŻENIA',
      },
      whatToDoOptions: {
        firma: 'Zaktualizuj Profil Klienta',
        skala: 'Oszacuj wartość dodaną (Przewidywany wzrost)',
        odsiew: 'Dopasuj model współpracy'
      },
      stages: {
        triage: 'OTWARCIE RELACJI',
        discovery: 'KROK 1: AUDYT WZROSTU',
        solution: 'KROK 2: PROJEKTOWANIE SYSTEMÓW',
        pitch: 'DECYZJA I START WSPÓŁPRACY'
      },
      questions: {
        industry: 'Branża klienta / W jakim elemencie najbardziej mu pomożemy urosnąć?',
        scale: 'Przewidywany Zysk netto klienta po wdrożeniu / Prognoza wzrostu',
        selectedSolutions: 'Najbardziej optymalne i celne pakiety dowożące wynik',
        autoPricing: 'Prognozowany Zysk / Szacowana Inwestycja:',
        roi: 'Przewidywany, transparentny ROI ze współpracy',
        investment: 'Jednorazowy Koszt Wdrożenia Infrastruktury:',
        savings: 'Przewidywany dodatkowy przychód i oszczędności roczne:',
        cost: 'Koszty pożywienia na środowiskach i integracji zewnętrznych (API):',
        pricingBase: 'Nasze wynagrodzenie wynika bezpośrednio ze skali przewidzianych zysków i dostarczanej jakości: ',
        includesMods: 'Zastosowane narzędzia optymalizacyjne wchodzące w zestaw: '
      },
      placeholders: {
        generateFirst: 'Kliknij GENERUJ, aby sztuczna inteligencja przeanalizowała zyski i zaproponowała usługi...',
        requires200IQ: 'Aktywuj Doradcę Wzrostu (CO-PILOT), by przeliczyć opłacalność rozwiązań...',
        generatePitchFirst: 'Najpierw skorzystaj z AI, by dopasować idealne kroki milowe dla biznesu klienta.',
        generatePricing: 'Uruchom AI (Panel Co-Pilot), aby zobaczyć model inwestycyjny korzystny dla partnera.',
        writeNoteFirst: 'Napisz notatkę po rozmowie z partnerem... (Enter = wyślij)'
      },
      history: 'Historia współpracy',
      writeNote: 'Dodaj notatkę lub podsumowanie ustaliń... (Enter = zapisz)',
      didntAnswer: 'Brak kontaktu - próba przełożona',
      challenges: 'Wyzwania infrastrukturalne i potencjał usprawnień:',
      selectedForExecution: 'Narzędzia i Systemy wybrane do dostarczenia zysków:',
      proposeMeeting: 'Gorąco proponuję krótkie, 15-minutowe spotkanie, byśmy mogli przejrzeć tę prognozę wspólnie.'
    },
    calendar: {
      title: 'Kalendarz Relacji Biznesowych',
      desc: 'Lista zadań wspierających sukces i zadowolenie przypisanych Ci Klientów.',
      noTasks: 'Aktualnie brak zadań w harmonogramie'
    },
    ai: {
      title: 'AI Growth Co-Pilot 200IQ',
      desc: 'Sztuczna inteligencja analizuje firmę partnera i tworzy błyskawiczną propozycję architektury rozwiązań, z jasnym zestawieniem zysków operacyjnych. Pokaż klientowi, co zyska, zdejmując z niego pożary analityczne inwestując dany kapitał.',
      embeddedLabel: 'Kalkulator Potencjału Współpracy',
      industry: 'SEKTOR GOSPODARKI',
      industryPlaceholder: 'Np. Sklep internetowy B2C, Dystrybucja B2B, Logistyka...',
      pain: 'OBSZAR WSPARCIA WZROSTU',
      painOptions: {
        loss: 'Optymalizacja działań powtarzalnych (uwolnienie dziesiątek godzin)',
        burn: 'Tworzenie stabilnego napływu nowych transakcji (skalowanie bazy B2B)',
        errors: 'Inteligentny CRM (minimalizacja problemów na linii zamówienie-klient)'
      },
      scale: 'CEL BIZNESOWY / OCZEKIWANY WZROST ZYSKU',
      scalePlaceholder: 'np. Wykreowanie dodatkowych 120k PLN mc poprzez skuteczne automatyzacje i lepszy lejek...',
      generateBtn: 'WYGENERUJ PLAN ZYSKÓW DLA KLIENTA',
      waitingParamsTitle: 'Oczekiwanie na parametry z biznesu...',
      waitingParamsDesc: 'Uzupełnij Sektor, Obszar Wsparcia lub Oczekiwany Wzrost podane przez Klienta po lewej stronie, aby system ustalił ramy zysku.',
      generating: 'Analizowanie potencjału i metryk finansowych...',
      generatingSub: 'Projektowanie dowożących rozwiązań nastawionych na wyższe ROI...',
      phase1: 'KROK 1: WIZJA, EDUKACJA I ROZPOZNANIE POTRZEB',
      phase2: 'KROK 2: ARCHITEKTURA TECHNOLOGICZNA / PLAN ZYSKÓW',
      phase3: 'KROK 3: PREZENTACJA WARTOŚCI (DZIELIMY SIĘ EKSPERTYZĄ)'
    },
    pitch: {
      tierReasoning: 'Merytoryczne Uzasadnienie Potencjału:',
      approachStrategy: 'STRATEGIA DORADCZA (Edukuj, wspieraj i rozwiązuj problemy - nie wciskaj):',
      costInterview: 'OBSZARY DO BADAŃ: WYZWANIA GOSPODARCZE',
      painInterview: 'OBSZARY DO BADAŃ: OPTYMALIZACJE WEWNĘTRZNE',
      brutalDiagnosis: 'RUCHY STRATEGICZNE I REALIA BRANŻY (Pokaż, gdzie tracą najwięcej na rynku)',
      salesSystems: 'Rozwiązania Pozyskiwania Klientów (Automatyzacja i Skupienie na Relacjach)',
      opsSystems: 'Rozwiązania Innowacyjne (Cyfryzacja operacyjna, Uwolnienie zespołów poprzez Roboty i AI)',
      deliverySystems: 'Rozwiązania Satysfakcji (Poprawa LTV, Upsell automatyczny, Onboarding klienta B2B)',
      roiAdvantage: 'WARTOŚĆ DODANA & BEZPOŚREDNI ZYSK ROI:',
      pipelineExecution: 'STRUKTURA EDUKACYJNA NA SPOTKANIE (Jak prowadzić i uczyć):',
      triage: 'Pierwszy Kontakt (Pozytywne otwarcie):',
      firstCall: 'Rozmowa Strategiczna (Wizja & Przyszłość):',
      secondCall: 'Architektura i Narzędzia (Prezentacja):',
    },
    pipeline: {
      title: "Architektura Sukcesu Biznesowego",
      subtitle: 'Trzy przejrzyste fazy wprowadzające klienta z chaosu w cyfrowe i opłacalne środowisko. Pełna edukacja i partnerstwo.',
      step: 'ETAP ZAAWANSOWANIA',
      businessGoal: 'CEL ETAPU WSPÓŁPRACY',
      breakthrough: 'REALNY REZULTAT WDROŻENIA DLA KONTRAHENTA',
      actions: 'WYKORZYSTANE NARZĘDZIA / TAKTYKI',
      showScenario: 'Pokaż Szablon Scenariusza Rozmowy',
      hideScenario: 'Ukryj Scenariusz',
      scenarioTitle: 'Schemat prowadzenia merytorycznego dialogu',
      tensionMessages: 'Wiadomości Przekładające Ekspertyzę',
      diagnosticQuestions: 'Pytania Prowokujące Klienta do Lepszego Rozeznania Potrzeb',
      breakthroughMoment: 'Osiągnięcie Przełomu - Uświadomienie Zmiany',
      nextStep: 'Finalny Rezultat Etapu'
    },
    scripts: {
      title: 'Skrypty Doradztwa Gospodarczego',
      subtitle: 'Nie zajmujemy się dzwonieniem dla dzwonienia. Jesteśmy architektami - zauważamy pożar, wnosimy ekspertyzę ratującą budżet operacyjny i od razu przystępujemy do implementacji zysków.'
    },
    monetization: {
      title: 'Zintegrowany Wzrost i Relacje Długoterminowe',
      subtitle: 'Ustalanie architektury opierającej się na wspólnym sukcesie, gdzie nasze zyski są pochodną zysków samego Klienta i jego spokoju.',
      retainerTitle: 'Umowa o Utrzymanie, Rozwój i SLA (Retainer):',
      lockInTitle: 'Wykazywanie Niezastąpionej Wartości (Bariera Wyjścia Zrozumiała Finansowo)',
      margin: 'Prognoza Wspólnej Marżowości (Zysk Twojej Agencji oraz Zysk Zleceniodawcy):',
      setupTime: 'Możliwe Dostępności Zasobów Wdrożeniowych (Czas Do Startu):'
    },
    scaling: {
      title: 'Logika Skalowania & Budowa Marki',
      subtitle: 'Wdrażanie nowoczesnych mechanizmów marketingowo-analitycznych oraz integracji systemowych, żeby zwielokrotnić moce przerobowe firmy bez dziesiątek nowych pracowników.',
      masterStrategy: 'Wizja Skalowania Rynkowego:',
      keyToScaling: 'Żelazna Logika dla Agencji',
      keyScalingDesc: 'Skuteczny marketing, świetne systemy CRM czy zapięcia (Make/Zapier) operują dokładnie tych samych problemach dla klienta hiszpańskiego czy polskiego - marnotrawstwo czasu równe marnotrawstwie pieniędzy. Ucząc organizacje B2B opierać swój rozwój na ROI i mierzalności uderzasz w najsilniejsze punkty biznesu. Konsekwentna edukacja w kanałach Inboundowych buduje lojalność jeszcze przed podpisaniem umowy. Twoim jedynym wąskim gardłem wtedy staje się poprawne dowiezienie (Delivery), ponieważ konwersje układają się same na bazie logiki finansowej, a nie chwytów psychologicznych.'
    }
  },
  en: {
    nav: {
      crm: 'Relationship Hub',
      calendar: 'Client Calendar',
      aiSandbox: 'Growth Co-Pilot Sandbox',
      pipeline: 'Success Architecture',
      scripts: 'Value Propositions',
      monetization: 'Growth & Scaling',
      scalability: 'Solutions Box'
    },
    common: {
      owner: 'Account Exec',
      seller: 'Growth Advisor',
      guardian: 'Partner',
      nextContact: 'Scheduled touchpoint',
      lastContact: 'Last interaction',
      save: 'Save connection',
      generate: 'RUN GROWTH CO-PILOT'
    },
    crm: {
      addLead: 'Add Partner',
      title: 'Partnership System',
      desc: 'Value-oriented system to grow client’s businesses consistently. Full partnership.',
      search: 'Search...',
      noLeads: 'No partners in this stage at the moment',
      sendTo200IQ: 'Run Growth Implementation',
      setContact: 'Plan touchpoint',
      basicData: 'The Basics',
      whatToDo: 'NEXT ACTION',
      nextStep: 'NEXT STEP',
      noNextStep: 'All clear',
      projectChecklist: 'Growth Checklist',
      projectSummaryEmpty: 'Growth Concept (Empty)',
      generatePitchFirst: 'Generate CO-PILOT first so it can match ROI-driving tools.',
      generatedStrategyAndArch: 'Dynamic Growth Strategy',
      summaryMessageToClient: 'Cooperation Proposal',
      generateSummaryBtn: 'Generate Proposal',
      sendMsgBtn: 'Send Message',
      sentSummaryHistory: 'Proposal Sent:\n\n',
      noFuncSelected: 'No modules selected',
      dearClient: 'Dear Partner,',
      summaryIntro: 'Building up on our session, please find a roadmap covering potential improvements and scaling avenues for',
      withRegards: 'Warm regards,',
      tabsHeaders: {
        allLeads: 'All partners',
        newDocs: 'New documents',
        toTransfer: 'Ready to onboard',
      },
      unassigned: 'Unassigned',
      noHistory: 'No relationship history recorded.',
      pitchGenerated: 'Strategy generated.',
      classification: 'Priorities',
      generationError: 'Generation error',
      table: {
        client: 'Partner',
        contact: 'Contact Point',
        region: 'State',
        pipeline: 'Success Journey',
        owner: 'Point of Contact',
        nextContact: 'Next Review'
      },
      tabs: {
        diagnosis: 'POTENTIAL',
        solutions: 'SOLUTIONS',
        pricing: 'INVESTMENT & ROI',
        summary: 'ROADMAP'
      },
      roles: {
        title: 'Responsibility',
        firstCallerTitle: 'Market Researcher',
        consultantTitle: 'Solutions Architect'
      },
      leadStatus: {
        new: 'NEW CONNECT',
        triage: 'INTERESTED',
        discovery: 'ANALYZING',
        solution: 'VALUE PROPOSAL',
        pitch: 'PROJECT KICKOFF',
      },
      whatToDoOptions: {
        firma: 'Update Partner Objectives',
        skala: 'Estimate Value Creation (Expected growth)',
        odsiew: 'Check mutual fit'
      },
      stages: {
        triage: 'RELATIONSHIP START',
        discovery: 'PHASE 1: GROWTH AUDIT',
        solution: 'PHASE 2: DESIGNING SYSTEMS',
        pitch: 'DECISION & START'
      },
      questions: {
        industry: 'Partner\'s Focus / What specific aspect are we elevating?',
        scale: 'Expected net profit increase post-implementation',
        selectedSolutions: 'High ROI modules identified',
        autoPricing: 'Profit Projection & Required Investment:',
        roi: 'Projected ROI from cooperation',
        investment: 'Investment Level:',
        savings: 'Estimated added yearly revenue:',
        cost: 'Deployment cost of systems/infrastructure:',
        pricingBase: 'Our commission relies heavily on your generated profits: ',
        includesMods: 'Employed Optimization Suites: '
      },
      placeholders: {
        generateFirst: 'Click GENERATE, to let the system analyze and recommend high ROI solutions...',
        requires200IQ: 'Launch Growth Advisor to calculate system feasibility...',
        generatePitchFirst: 'Engage AI to discover the most valuable project milestones.',
        generatePricing: 'Launch AI (Dashboard side) to model a profitable investment path for the partner.',
        writeNoteFirst: 'Summarize the partnership discussion... (Enter = save)'
      },
      history: 'Relationship Log',
      writeNote: 'Drop a note or an agreement summary... (Enter = save)',
      didntAnswer: 'Deferred to later',
      challenges: 'Process bottlenecks to resolve:',
      selectedForExecution: 'Selected suites to secure the results:',
      proposeMeeting: 'I suggest a quick intro meeting to discuss these profit projections.'
    },
    calendar: {
      title: 'Partner Care Calendar',
      desc: 'Task list prioritizing client satisfaction, relationship building, and successful deployments.',
      noTasks: 'No scheduled touchpoints right now'
    },
    ai: {
      title: 'AI 200IQ Growth Strategist',
      desc: 'Analyzes enterprise needs and architects custom solutions, outlining stark operational efficiency and immediate, trackable ROI.',
      embeddedLabel: 'Potential Research Panel',
      industry: 'MARKET SECTOR',
      industryPlaceholder: 'e.g., E-commerce B2C, Industrial B2B',
      pain: 'AREA OF OPTIMIZATION',
      painOptions: {
        loss: 'Automating tedious workflows (huge time savings)',
        burn: 'Predictable CRM / Sales pipeline (revenue growth)',
        errors: 'Intelligent AI-based CRM (eliminating process friction)'
      },
      scale: 'EXPECTED REVENUE MULTIPLIER / TARGET',
      scalePlaceholder: 'e.g., Push to 100k+ MRR via targeted Automation/Ads',
      generateBtn: 'GENERATE PARTNER PROFIT PLAN',
      waitingParamsTitle: 'Awaiting Business Parameters...',
      waitingParamsDesc: 'Fill in the Sector, Optimization Area, or Revenue Target on the left to allow the system to frame the ROI structure.',
      generating: 'Processing market metrics...',
      generatingSub: 'Connecting data streams, drafting ROI-centric solutions...',
      phase1: 'PHASE 1: VISION & NEEDS ASSESSMENT',
      phase2: 'PHASE 2: PROFIT DESIGN / ARCHITECTURE',
      phase3: 'PHASE 3: VALUE PRESENTATION (PARTNERSHIP ROADMAP)'
    },
    pitch: {
      tierReasoning: 'Scale Rationale:',
      approachStrategy: 'STRATEGY (Focus entirely on education, assistance, and actual value creation):',
      costInterview: 'EVALUATION: BUSINESS AMBITIONS',
      painInterview: 'EVALUATION: OPERATIONAL HURDLES',
      brutalDiagnosis: 'REAL GROWTH POTENTIAL WITHIN THE NICHE',
      salesSystems: 'Client Acquisition Streams (Lead Generation / Sales AI)',
      opsSystems: 'Efficiency Solutions (Robotic Process / Automations)',
      deliverySystems: 'LTV & Client Journey Upgrades',
      roiAdvantage: 'VALUE ADD & PROJECTED ROI (YR-1):',
      pipelineExecution: 'PROPOSAL APPROACH (Educational standpoint):',
      triage: 'Introduction:',
      firstCall: 'Audit Call:',
      secondCall: 'Solution Layout:',
    },
    pipeline: {
      title: 'Architecture of Success',
      subtitle: 'Phases onboarding a client into top-tier digital infrastructure. Focuses deeply on transparency and partnerships.',
      step: 'PHASE',
      businessGoal: 'MAIN OBJECTIVE',
      breakthrough: 'ACTUAL IMPLEMENTATION RESULT',
      actions: 'ACTIONS / TECH STACK',
      showScenario: 'Show Projected Outcome',
      hideScenario: 'Hide',
      scenarioTitle: 'Solution Framework (Recommendation)',
      tensionMessages: 'Motivation Driver (Building Excitement)',
      diagnosticQuestions: 'Trust-Building Core Questions (Uncovering the ROI)',
      breakthroughMoment: 'Selecting the Best Trajectory',
      nextStep: 'Project Activation'
    },
    scripts: {
      title: 'Value-Building Scripts',
      subtitle: 'Provide rock-solid systemic solutions instead of hollow promises. Be a leader by educating instead of pushing.'
    },
    monetization: {
      title: 'Long-Term Scaling Strategy',
      subtitle: 'Fostering a highly valuable, multi-year bond rooted in pushing client performance to new heights month-over-month.',
      retainerTitle: 'Mutual Commitment Phase (Retainer):',
      lockInTitle: 'Loyalty Foundation (Flawless Delivery)',
      margin: 'Win-Win Margin Projection:',
      setupTime: 'Est. Module Deployment:'
    },
    scaling: {
      title: 'Logical Expansion Stack',
      subtitle: 'Installing self-service mechanisms, Artificial Intelligence, Advertising, SEO, and robust backend integrations.',
      masterStrategy: 'Client Victory Strategy:',
      keyToScaling: 'Core Pillar of Modern Growth',
      keyScalingDesc: 'Regardless of the geopolitical location, businesses crave clarity and efficient scaling. We teach them through Educational Marketing, Content (SEO), precise PPC for fresh Leads, and smooth out their backend workflow utilizing tools like Make/Zapier/AI. Once we hand a client a fully automated workflow and a stream of qualified buyers, their MRR skyrockets. This makes continuing the partnership a completely logical, no-brainer step for them.'
    }
  }
};
