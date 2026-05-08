import { Lead } from '../types';

export const getMockLeads = (lang: 'pl' | 'en'): Lead[] => {
  if (lang === 'en') {
    return [
      {
        id: "lead-1",
        name: "Chris Radzymiński",
        companyName: "LogisTeam Inc",
        email: "sem.education@gmail.com",
        phone: "+48 502 567 100",
        province: "Mazowieckie",
        industry: "Education / Logistics",
        problem: "We lose 4 hours a day manually re-typing waybills between the WMS and the courier system.",
        scale: "25 employees, losses around $4k/month",
        stage: "Triage / Purgatory",
        status: "OVERDUE",
        owner: "MACIEJ",
        consultant: "MACIEJ",
        nextContact: "Apr 24, 08:00 AM",
        lastContact: "Apr 23 2026, 12:18 PM",
        history: [
          { id: "h1", date: "Apr 23 2026, 12:18 PM", type: "note", content: "texted to call at 11am", author: "MACIEJ", nextContact: "Apr 24 2026, 08:00 AM" },
          { id: "h2", date: "Apr 21 2026, 03:56 PM", type: "call", content: "No answer", author: "MACIEJ", nextContact: "Apr 22 2026, 09:00 AM" }
        ],
        selectedSolutions: []
      },
      {
        id: "lead-2",
        name: "Simon Szyca",
        companyName: "E-Commercy Ltd",
        email: "sz.szyca@gmail.com",
        phone: "+48 535 808 911",
        province: "Pomorskie",
        industry: "E-commerce",
        problem: "No integration between our Shopify store and the ERP.",
        scale: "Losing roughly $10k/month",
        stage: "The Bleeding (Diagnoza)",
        status: "FOR SALES",
        owner: "KONRAD",
        consultant: "KONRAD",
        nextContact: "Apr 24, 11:40 AM",
        lastContact: "Apr 20 2026, 10:00 AM",
        history: [
          { id: "h3", date: "Apr 20 2026, 10:00 AM", type: "call", content: "Interested in deployment", author: "KONRAD", nextContact: "Apr 24 2026, 11:40 AM" }
        ],
        selectedSolutions: []
      },
      {
        id: "lead-3",
        name: "Ursula Puczkowska",
        companyName: "Build-Pro Investments",
        email: "puczkowskaula@gmail.com",
        phone: "+48 797 788 029",
        province: "Mazowieckie",
        industry: "Real Estate",
        problem: "Total mess in communication with subcontractors.",
        scale: "4 large investments, $4k/month in lost time",
        stage: "The Blueprint (Architektura)",
        status: "OVERDUE",
        owner: "AREK",
        consultant: "AREK",
        nextContact: "Apr 24, 08:10 AM",
        lastContact: "Apr 18 2026, 02:00 PM",
        history: [],
        selectedSolutions: []
      }
    ];
  }

  return [
    {
      id: "lead-1",
      name: "Krzysztof Radzymiński",
      companyName: "LogisTeam PL",
      email: "sem.edukacja@gmail.com",
      phone: "+48 502 567 100",
      province: "Mazowieckie",
      industry: "Edukacja / Logistyka",
      problem: "Tracimy dziennie 4 godziny na przepisywanie listów przewozowych między systemem WMS a systemem kurierskim.",
      scale: "25 pracowników, koszty 15k PLN/msc",
      stage: "Triage / Purgatory",
      status: "ZALEGŁY",
      owner: "MACIEJ",
      consultant: "MACIEJ",
      nextContact: "24 kwi 08:00",
      lastContact: "23 kwi 2026, 12:18",
      history: [
        { id: "h1", date: "23 kwi 2026, 12:18", type: "note", content: "napisal sms zeby o 11 dzwonic", author: "MACIEJ", nextContact: "24 kwi 2026, 08:00" },
        { id: "h2", date: "21 kwi 2026, 15:56", type: "call", content: "Nie odebrał", author: "MACIEJ", nextContact: "22 kwi 2026, 09:00" }
      ],
      selectedSolutions: []
    },
    {
      id: "lead-2",
      name: "Szymon Szyca",
      companyName: "E-Commercy SA",
      email: "sz.szyca@gmail.com",
      phone: "+48 535 808 911",
      province: "Pomorskie",
      industry: "E-commerce",
      problem: "Brak spięcia pomiędzy sklepem na Shoper, a ERP.",
      scale: "Starty rzędu 40k PLN/msc",
      stage: "The Bleeding (Diagnoza)",
      status: "DO SPRZEDAŻY",
      owner: "KONRAD",
      consultant: "KONRAD",
      nextContact: "24 kwi 11:40",
      lastContact: "20 kwi 2026, 10:00",
      history: [
        { id: "h3", date: "20 kwi 2026, 10:00", type: "call", content: "Zainteresowany wdrożeniem", author: "KONRAD", nextContact: "24 kwi 2026, 11:40" }
      ],
      selectedSolutions: []
    },
    {
      id: "lead-3",
      name: "Urszula Puczkowska",
      companyName: "Bud-Pro Inwestycje",
      email: "puczkowskaula@gmail.com",
      phone: "+48 797 788 029",
      province: "Mazowieckie",
      industry: "Nieruchomości",
      problem: "Bałagan w komunikacji z podwykonawcami.",
      scale: "4 duże inwestycje, 15k PLN/msc strat czasu",
      stage: "The Blueprint (Architektura)",
      status: "ZALEGŁY",
      owner: "AREK",
      consultant: "AREK",
      nextContact: "24 kwi 08:10",
      lastContact: "18 kwi 2026, 14:00",
      history: [],
      selectedSolutions: []
    }
  ];
};
