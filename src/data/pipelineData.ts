export const getPipelineData = (lang: 'pl' | 'en') => {
  if (lang === 'en') {
    return {
      stages: [
        {
          id: "triage",
          name: "Triage / Purgatory",
          goal: "Sifting out weak leads (<2.5k, no decision-making power) asynchronously to protect the sales rep's time.",
          actions: [
            "Analysis of form data (Lead Magnet: 'Loss Diagnosis')",
            "Requirement to provide a budget range in the form.",
            "Automatic qualification or email rejection."
          ],
          breakthrough: "Only clients who can afford the cheapest package and have verified pain make it to the calendar.",
          detailedScenario: {
            title: "Async Triage Strategy",
            intro: "Goal: Total filtration. Start by being unavailable. Let them qualify themselves to US.",
            messages: [
              "Standard: 'We are currently at capacity for this quarter. To even consider a diagnostic call, please provide the hard data regarding your current overhead.'",
              "Framing: 'We don't do 'discoveries'. We do audits. If your process isn't losing at least $5k/mo, our fees won't make sense for you.'"
            ],
            questions: [
              "Budget: 'What is the maximum investment you've allocated to stop this specific leakage?'",
              "Decision: 'Who else besides you is losing sleep over this metric and has the authority to sign the fix?'",
              "Urgency: 'Why haven't you fixed this in the last 6 months?'"
            ],
            breakthroughMoment: "When the client fills out the 10-field form with precise data, effectively begging for a 15-minute slot.",
            closing: "Outcome: Automatic email with a booking link sent ONLY to qualified IDs."
          }
        },
        {
          id: "discovery",
          name: "Call 1: The Bleeding (Diagnosis)",
          goal: "Diagnosing the 'bleeding neck', quantifying financial losses, and taking full control.",
          actions: [
            "Setting a time frame (15-20 min max).",
            "Attacking the core problem reported from the Lead Magnet.",
            "Monetizing the problem (calculating how much they lose right here, right now)."
          ],
          breakthrough: "The client admits out loud: 'Yes, we are burning $X thousand a month in this process and we need to stop it immediately.'",
          detailedScenario: {
            title: "The '200 IQ' Diagnostic Call",
            intro: "Goal: Total frame control. Start by telling them why you MIGHT NOT work with them.",
            messages: [
              "Tension: 'I see your report. If your numbers are correct, you are currently losing $X every single month. In half a year, that's almost a quarter-million. Most businesses I talk to think this is just 'cost of doing business'. They are wrong. It's a choice.'",
              "Authority: 'Before we go deep into your CRM chaos: I only work with companies that are ready to treat their software as a profit center, not a cost center. If we aren't a fit, I'll tell you in 5 minutes.'"
            ],
            questions: [
              "Critical Process: 'Can you walk me through exactly how process X looks today—the one that generates your biggest operational costs? Who touches the data first?'",
              "ROI Visualization: 'If I could automate Y tomorrow and eliminate those 40 manual hours per week, what would be the estimated impact on your quarterly revenue if those people focused on delivery instead?'",
              "Current System Failure: 'What are the three biggest pains you have with your current CRM that keep you up at night, knowing data is slipping through the cracks?'",
              "Blockage Identification: 'Besides the current technology, what exactly is stopping you from hitting target X right now?'"
            ],
            breakthroughMoment: "When the seller stops talking and the client starts doing the math out loud. The pivot from 'How much does it cost?' to 'How much am I losing by NOT having this?'",
            closing: "Outcome: Schedule Call 2 (The Blueprint) ONLY if the pain is > $10k/mo. 'I have enough data to design the architecture. Let's meet on Thursday to see the map of the fix.'"
          }
        },
        {
          id: "solution_fit",
          name: "Call 2: The Blueprint (Architecture)",
          goal: "Showing the bridge between chaos and perfection. You don't sell code, you sell scalability.",
          actions: [
            "Presentation of mockups/flowcharts without technical API details.",
            "Visualizing ROI: 'You invest X, you save 10X annually'.",
            "Testing commitment (mini-closes during the presentation)."
          ],
          breakthrough: "The client asks: 'How quickly can we launch this?' before you even mention the price.",
          detailedScenario: {
            title: "Blueprint Presentation",
            intro: "Goal: Visualizing the 'Before vs After'. The client must see their chaos turned into a machine.",
            messages: [
              "Vision: 'This isn't a CRM. It's your company's nervous system. Notice how information flows from the lead to the warehouse without a single human touch point.'",
              "Efficiency: 'We are deleting 80% of your manual tasks here. That team of 4? They are now your high-level strategy group.'"
            ],
            questions: [
              "Buy-in: 'Does this specific architecture solve the bottleneck we discussed last Tuesday, or did I miss something?'",
              "Scalability: 'If we deploy this, and your lead volume triples next month, what breaks? Exactly. With this system - nothing.'",
              "Ownership: 'Who from your team will be the primary operator of this dashboard?'"
            ],
            breakthroughMoment: "Client starts correcting the flowchart, effectively 'building' the system with you. They have already emotionally bought it.",
            closing: "Outcome: Confirming the solution fits 100%. Moving to pricing execution."
          }
        },
        {
          id: "pitch",
          name: "The Execution (Pitch and Decision)",
          goal: "Polarization: Wire transfer/signature vs. a hard NO. No 'I need to think about it' zone.",
          actions: [
            "Presenting 2 choices (always anchoring with a higher offer).",
            "Sending the contract during the video call (DocuSign/PandaDoc).",
            "Handling objections on the spot. No begging follow-ups."
          ],
          breakthrough: "Acceptance of conditions and upfront deposit (50%).",
          detailedScenario: {
            title: "The Execution Frame",
            intro: "Goal: High tension close. Binary choice. We don't chase, we attract.",
            messages: [
              "Polarization: 'At this point, you have two choices. You keep doing what you're doing and lose another $60k this quarter. Or you sign this, and we start the fix on Monday. Which one is it?'",
              "Value Anchor: 'We aren't the cheapest. But we are the only ones who guarantee this ROI in the contract. Do you want a cheap mistake or an expensive success?'"
            ],
            questions: [
              "Choice: 'Do you want the Operational Core for the whole company, or just the Starter Patch for the sales team?'",
              "Stagnation: 'What happens to your business in 3 months if we DON'T do this today?'"
            ],
            breakthroughMoment: "The silence after the price. The person who speaks first loses the frame. Wait for the 'Let's do it.'",
            closing: "Outcome: Deposit paid. Project launched."
          }
        }
      ],
      scripts: [
        {
          category: "Redirection and Control (At the start)",
          phrases: [
            "Before we begin: I have 3 precise questions regarding your loss report. If I can't close this gap with technology, I will tell you in the first minute. Let's respect our time. Agreed?",
            "Today I don't want to sell you anything, I want to see if your business is even suitable for this automation. Tell me about..."
          ]
        },
        {
          category: "Quantification and Pain (The Bleeding)",
          phrases: [
            "I see that manual processing of these orders... What exactly breaks in the team when the load suddenly jumps by 50%?",
            "You employ 3 people to copy data from excel to ERP. Each costs $8k per month with overheads. You are burning $24k a month on work that a script handles in 0.2 seconds. Why do you voluntarily pay this chaos tax?",
            "How many more months do you intend to finance this inefficiency from your own margin before you do something about it?"
          ]
        },
        {
          category: "Closing and Presentation (Bypass Objections)",
          phrases: [
            "Looking at this flowchart - if we deploy exactly this module by mid-month, does the problem of burning leads in Spain disappear 100%?",
            "You have two paths. Either you do it with us with an SLA guarantee, or you look for cheaper freelancers and we return to this conversation in half a year with a messed up codebase. What do you prefer?",
            "This solution costs $45,000. Do we lock in developers for this sprint, or do we leave it?"
          ]
        }
      ],
      monetization: {
        tiers: [
          {
            name: "Starter / Patch [$2.5k - $10k]",
            target: "Micro / Process Chaos",
            desc: "No-Code/Low-Code automations (Make, Zapier, Airtable), simple integrations connecting existing CRM to e.g., Facebook Ads.",
            margin: "High. Setup takes 1-2 days. Zero custom backend code.",
            retainer: "Maintenance: $500-$1000/mo for 'keeping the API from breaking'.",
            color: "border-blue-500 text-blue-500 bg-blue-500/10"
          },
          {
            name: "Operational Core [$15k - $50k]",
            target: "SMB (Rapid Growth)",
            desc: "Custom internal apps, automation scripts, dedicated AI agents, and deep ERP <-> Shop/CRM integrations.",
            margin: "Very good. 2-4 weeks of work.",
            retainer: "SLA and expansion: $1500 - $3000/mo. Billed by hour pool or fixed SLA.",
            color: "border-emerald-500 text-emerald-500 bg-emerald-500/10"
          },
          {
            name: "Enterprise Core [$100k - $200k+]",
            target: "Corporations / Large E-com",
            desc: "End-to-End backend, custom systems for pricing/logistics, custom trained AI models for customer service, cloud infra.",
            margin: "Scalable, requires PM management. Tranche payments.",
            retainer: "Infra + Retainer $5k - $15k+/mo. Sometimes % of generated savings (Success fee).",
            color: "border-purple-500 text-purple-500 bg-purple-500/10"
          }
        ],
        lock_in: [
          {
            title: "Technological Context (Ecosystem Trap)",
            description: "The client doesn't buy code, they buy a working ecosystem. All automation is hosted on our infrastructure. Leaving = pulling the plug (operational paralysis)."
          },
          {
            title: "Natural Upsell (Trojan Horse)",
            description: "You start with sales integration. When it works perfectly, you turn on a logistics KPI dashboard and say: 'Sales are growing great, but I see a bottleneck in the warehouse. Let's do the same thing here'."
          },
          {
            title: "AI Dependency",
            description: "AI Agents improve based on the database history we deployed. No external person has this historical context. Cutting off means the agent returns to IQ 0."
          }
        ]
      },
      scalability: {
        approach: "Single Architecture, Multi-localization",
        points: [
          "1. Same engine, different mask: Technical architecture (Database, API, CRM Pipeline, Webhooks) is built only once. We clone Make/Zapier schematics.",
          "2. Localized Triage: Only FB Ads, Landing Page, and qualification forms are natively translated (PL/EN/ES).",
          "3. Local-Native Sales Reps: The final link. They have EXACTLY the same script schema implemented, adapted only culturally to impose frames.",
          "4. Central repository: Knowledge documentation in the company wiki (documenting every pain point regardless of location to deploy the same modules cross-border)."
        ]
      }
    };
  }
  
  return {
    stages: [
      {
        id: "triage",
        name: "Triage / Purgatory",
        goal: "Odsianie słabych leadów (<2.5k, bez decyzyjności) asynchronicznie, ochrona czasu handlowca.",
        actions: [
          "Analiza danych z formularza (Lead Magnet: 'Diagnoza strat')",
          "Wymóg podania przedziału budżetowego w formularzu.",
          "Automatyczna kwalifikacja lub odrzucenie mailowe."
        ],
        breakthrough: "Wpadniecie na kalendarz TYLKO klientów, których stać na najtańszy pakiet i mają zweryfikowany ból.",
        detailedScenario: {
          title: "Asynchroniczny Triage",
          intro: "Cel biznesowy: Filtracja. Nie rozmawiamy z każdym. Klient musi dowieść, że zasługuje na nasz czas.",
          messages: [
            "Napięcie: 'Aktualnie mamy pełne obłożenie na ten kwartał. Abyśmy mogli rozważyć audyt diagnostyczny, muszę otrzymać twarde dane o Waszych stratach operacyjnych.'",
            "Rama: 'Nie robimy luźnych pogadanek. Jeśli Wasz błąd procesowy nie kosztuje min. 5k miesięcznie, nasz setup się Wam po prostu nie zwróci.'"
          ],
          questions: [
            "Budżet: 'Jaki jest maksymalny budżet, który zadeklarowaliście na zatrzymanie tego wycieku gotówki?'",
            "Decyzja: 'Kto oprócz Pana traci przez to pieniądze i ma uprawnienia do zatwierdzenia naprawy w 48h?'",
            "Zaległość: 'Dlaczego ten problem nie został rozwiązany przez ostatnie pół roku?'"
          ],
          breakthroughMoment: "Moment, w którym klient wypełnia 10-polowy formularz z precyzyjnymi kwotami, czując wdzięczność za 15 minut rozmowy.",
          closing: "Wynik: Link do kalendarza wysłany TYLKO do osób o zweryfikowanym bólu."
        }
      },
      {
        id: "discovery",
        name: "Rozmowa 1: The Bleeding (Diagnoza)",
        goal: "Zdiagnozowanie 'krwawiącej szyi', kwantyfikacja strat finansowych i przejęcie pełnej kontroli.",
        actions: [
          "Zbudowanie ramy czasowej (15-20 min max).",
          "Atak na core problemu raportowanego z Lead Magnetu.",
          "Monetyzacja problemu (obliczenie ile tracą tu i teraz)."
        ],
        breakthrough: "Klient głośno przyznaje: 'Tak, palimy w tym procesie X tysięcy miesięcznie i musimy to zatrzymać natychmiast.'",
        detailedScenario: {
          title: "Scenariusz Rozmowy Diagnostycznej '200 IQ'",
          intro: "Cel biznesowy: Przejęcie ramy i pokazanie, że to My wybieramy klienta. Budujemy napięcie poprzez obnażenie strat.",
          messages: [
            "Napięcie: 'Przeanalizowałem Wasz raport. Jeśli te liczby są prawdziwe, to w tej chwili tracicie [Kwota] każdego miesiąca. W skali półrocza to ćwierć miliona wyrzucone przez okno.'",
            "Autorytet: 'Pracuję tylko z firmami, które traktują technologię jako centrum zysku. Jeśli uznam, że nie jesteśmy w stanie tego naprawić automatyzacją, powiem to wprost.'"
          ],
          questions: [
            "Proces: 'Jak obecnie wygląda proces X? Kto pierwszy dotyka tych danych manualnie?'",
            "ROI: 'Gdyby zespół odzyskał 40h tygodniowo dzięki automatyzacji Y, ile dodatkowych sprzedaży byliby w stanie dowieźć w tym czasie?'",
            "Blokady: 'Co realnie powstrzymuje Was przed wdrożeniem tego systemu tydzień temu?'"
          ],
          breakthroughMoment: "Moment, w którym klient zamiast pytać o cenę, zaczyna liczyć straty na głos i dopytywać o wolne terminy.",
          closing: "Zakończenie: Umówienie Etapu 2 (The Blueprint) tylko dla realnie 'krwawiących'."
        }
      },
      {
        id: "solution_fit",
        name: "Rozmowa 2: The Blueprint (Architektura)",
        goal: "Pokazanie mostu między chaosem a perfekcją. Nie sprzedajesz kodu, sprzedajesz skalowalność.",
        actions: [
          "Prezentacja makiet/schematu blokowego (Flowchart) bez detali technicznych API.",
          "Wizualizacja ROI: 'Inwestujesz X, oszczędzasz 10X rocznie'.",
          "Testowanie zaangażowania (mini-zamknięcia podczas prezentacji)."
        ],
        breakthrough: "Klient zadaje pytanie: 'Jak szybko możemy to odpalić?', zanim ty podasz cenę.",
        detailedScenario: {
          title: "Prezentacja Architektury",
          intro: "Cel biznesowy: Budowa pewności. Klient ma POCZUĆ, że chaos właśnie znika.",
          messages: [
            "Wizja: 'To nie jest CRM. To układ nerwowy Waszej firmy. Informacja płynie od leada do magazynu bez dotyku człowieka.'",
            "Skala: 'Usuwamy 80% manualnych zadań. Ten 4-osobowy zespół? Od poniedziałku zajmuje się strategią, nie wklejaniem danych.'"
          ],
          questions: [
            "Potwierdzenie: 'Czy ta architektura domyka wąskie gardło o którym mówiliśmy, czy coś pominąłem?'",
            "Skalowalność: 'Jeśli Wasz ruch skoczy o 300% w przyszłym miesiącu, co tu pęknie? Dokładnie – nic.'",
            "Operacyjność: 'Kto z Pana zespołu będzie głównym operatorem tego dashboardu?'"
          ],
          breakthroughMoment: "Klient zaczyna poprawiać flowchart, wchodząc w rolę współtwórcy systemu. Emocjonalnie już u nas kupił.",
          closing: "Zakończenie: Potwierdzenie dopasowania 100%. Przejście do formalności."
        }
      },
      {
        id: "pitch",
        name: "The Execution (Pitch i Decyzja)",
        goal: "Polaryzacja: Przelew/podpis vs twarde NIE. Brak strefy 'muszę przemyśleć'.",
        actions: [
          "Przedstawienie 2 opcji wyboru (zawsze kotwiczenie wyższą ofertą).",
          "Wysłanie kontraktu na spotkaniu wideo (DocuSign/PandaDoc).",
          "Zbijanie obiekcji 'tu i teraz'. Brak follow-upów błagalnych."
        ],
        breakthrough: "Akceptacja warunków i wpłata zaliczki (50% upfront).",
        detailedScenario: {
          title: "Finalna Egzekucja",
          intro: "Cel biznesowy: Domknięcie. Skrócenie cyklu decyzyjnego do zera.",
          messages: [
            "Polaryzacja: 'Mamy dwie opcje. Robimy to co dotychczas i tracimy kolejne 60k w tym kwartale, albo podpisujemy to teraz i w poniedziałek zaczynamy naprawę. Co wybierasz?'",
            "Wartość: 'Nie jesteśmy najtańsi. Ale jako jedyni gwarantujemy ten zwrot w kontrakcie. Chcesz tani błąd czy drogą wygraną?'"
          ],
          questions: [
            "Wybór: 'Decydujecie się na Operational Core dla całej firmy, czy tylko na Starter Patch dla handlowców?'",
            "Stagnacja: 'Co stanie się z Waszym biznesem za 3 miesiące, jeśli DZISIAJ nie podejmiemy tej decyzji?'"
          ],
          breakthroughMoment: "Cisza po podaniu ceny. Kto pierwszy się odezwie – przegrywa ramę. Czekaj na 'Dobra, robimy to'.",
          closing: "Wynik: Zaliczka opłacona. Start projektu."
        }
      }
    ],
    scripts: [
      {
        category: "Przekierowanie i Kontrola (Na start)",
        phrases: [
          "Zanim zaczniemy: mam 3 precyzyjne pytania do Waszego raportu strat. Jeśli nie będę w stanie zamknąć tej dziury technologią, powiem to w pierwszej minucie. Szanujmy swój czas. Zgoda?",
          "Dzisiaj nie chcę Ci niczego sprzedawać, chcę sprawdzić, czy Wasz biznes w ogóle nadaje się do tej automatyzacji. Opowiedz mi o..."
        ]
      },
      {
        category: "Kwantyfikacja i Ból (The Bleeding)",
        phrases: [
          "Jak obecnie wygląda proces X, który generuje u Was największe koszty operacyjne? Kto pierwszy dotyka tych danych?",
          "Widzę, że ręczne procesowanie tych zamówień. Co dokładnie pęka w zespole, gdy obciążenie nagle rośnie o 50%?",
          "Gdyby udało się zautomatyzować Y i wyeliminować te 40 roboczogodzin tygodniowo, jaki byłby szacowany wpływ na Wasz przychód kwartalny, gdyby ten zespół skupił się wyłącznie na sprzedaży?",
          "Zatrudniacie 3 osoby do przepisywania danych z excela do ERP. Każda kosztuje z narzutami 8k zł. Palicie 24k miesięcznie na pracy, którą skrypt ogarnia w 0.2 sekundy. Dlaczego dobrowolnie płacicie ten podatek od chaosu?",
          "Jakie są największe bolączki związane z obecnym systemem CRM, które sprawiają, że boicie się o jakość danych?",
          "Co powstrzymuje Pana/Panią przed osiągnięciem celu X w tym kwartale?",
          "Ile jeszcze miesięcy zamierzacie finansować tę nieefektywność z własnej marży, zanim coś z tym zrobicie?"
        ]
      },
      {
        category: "Zamykanie i Prezentacja (Bypass obiekcji)",
        phrases: [
          "Patrząc na ten schemat – czy jeśli wdrożymy dokładnie ten moduł do połowy miesiąca, problem przepalania leadów w Hiszpanii znika w 100%?",
          "Macie dwie drogi. Albo robicie to z nami z gwarancją SLA, albo szukacie tańszych freelancerów i wracamy do tej rozmowy za pół roku z rozgrzebanym kodem. Co wolicie?",
          "To rozwiązanie kosztuje 45 000 zł. Blokujemy developerów na ten sprint, czy zostawiamy temat?"
        ]
      }
    ],
    monetization: {
      tiers: [
        {
          name: "Starter / Patch [2.5k - 10k PLN]",
          target: "Mikro / Chaos Proc.",
          desc: "Automatyzacje No-Code/Low-Code (Make, Zapier, Airtable), proste integracje spajające istniejący CRM np. do Facebook Ads.",
          margin: "Wysoka. Setup zajmuje 1-2 dni. Zero własnego kodu backendowego.",
          retainer: "Maintenance: 500-1000 PLN/msc za 'pilnowanie by API się nie rozpięło'.",
          color: "border-blue-500 text-blue-500 bg-blue-500/10"
        },
        {
          name: "Operational Core [15k - 50k PLN]",
          target: "MŚP (Szybki wzrost)",
          desc: "Customowe aplikacje wewn., skrypty automatyzujące, dedykowani agenci AI i głębokie integracje ERP <-> Sklep/CRM.",
          margin: "Bardzo dobra. 2-4 tygodnie pracy.",
          retainer: "SLA i rozbudowa: 1500 - 3000 PLN/msc. Rozliczane pulą godzin lub fix SLA.",
          color: "border-emerald-500 text-emerald-500 bg-emerald-500/10"
        },
        {
          name: "Enterprise Core [100k - 200k+ PLN]",
          target: "Korporacje / Duży E-commerce",
          desc: "End-to-End backend, własne systemy do pricingu/logistyki, własne trenowane modele AI dla customer service, chmura.",
          margin: "Skalowalna, wymaga zarządzania PM. Płatności w transzach.",
          retainer: "Infrastruktura + Retainer 5k - 15k+ PLN/msc. Czasami model % od wygenerowanych oszczędności (Success fee).",
          color: "border-purple-500 text-purple-500 bg-purple-500/10"
        }
      ],
      lock_in: [
        {
          title: "Kontekst Technologiczny (Ecosystem Trap)",
          description: "Klient nie kupuje kodu, kupuje działający ekosystem. Cała automatyzacja jest hostowana na naszej infrastrukturze (AWS/GCP lub na naszym firmowym Make.com). Odejście = wyłączenie wtyczki (paraliż operacyjny)."
        },
        {
          title: "Naturalny Upsell (Koń Trojański)",
          description: "Zaczynasz od integracji sprzedaży. Kiedy działa idealnie, odpalasz im dashboard z KPI logistyki i mówisz: 'Sprzedaż wam rośnie świetnie, ale widzę wąskie gardło na magazynie. Zróbmy z tym to samo co ze sprzedażą'."
        },
        {
          title: "AI Dependency",
          description: "Agenci AI ulepszają się na podstawie historii bazy danych wdrożonej przez nas. Nikt z zewnątrz nie ma tego kontekstu historycznego. Odcięcie to powrót agenta do punktu IQ 0."
        }
      ]
    },
    scalability: {
      approach: "Single Architecture, Multi-localization",
      points: [
        "1. Silnik ten sam, inna maska: Architektura techniczna (Baza, API, Pipeline CRM, Webhooki) powstaje tylko raz. Klonujemy schematy Make/Zapier.",
        "2. Zlokalizowany Triage: Tylko reklamy FB, Landing Page i formularze kwalifikacyjne są natywnie przetłumaczone (PL/EN/ES).",
        "3. Handlowcy Local-Native: Ostatnie ogniwo. Mają zaimplementowany DOKŁADNIE ten sam schemat skryptowy dostosowany tylko kulturowo do narzucania ram.",
        "4. Centralne repozytorium: Dokumentacja wiedzy w firmowym wiki (dokumentowanie każdego pain pointu niezależnie od lokalizacji, by wdrażać te same moduły cross-border)."
      ]
    }
  };
};
