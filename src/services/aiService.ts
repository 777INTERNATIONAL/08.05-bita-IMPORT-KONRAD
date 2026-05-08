import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface BoilerRoomDiagnosticPoint {
  question: string;
  module: string;
  calculation: string;
}

export interface DynamicPath {
  condition: string;
  script: string;
}

export interface GeneratedPitch {
  tier_classification?: {
    tier_name: string;
    reasoning: string;
  };
  // Legacy Engine v6.0
  phase1_frontend_caller?: {
    hook: string;
    offer_and_close: string;
  };
  phase2_friction_point?: string;
  phase3_diagnostic_checklist?: {
    intro: string;
    points: BoilerRoomDiagnosticPoint[];
  };
  phase4_lock_in?: {
    final_script: string;
  };
  // New Engine v7.0 (Dynamic Advisor)
  phase1_opening?: {
    hook: string;
    context: string;
  };
  phase2_dynamic_paths?: DynamicPath[];
  phase3_bait_sale?: {
    script: string;
  };
  phase4_omnichannel?: {
    command: string;
  };
  phase5_retention_juicer?: {
    recommended_modules: {
      id: string; // The exact catalog ID, e.g. "crm", "meta", "seo", "tarcza"
      name: string;
      reasoning: string;
      expected_roi: string;
    }[];
    projected_revenue_increase: string;
    retention_script: string;
  };
}

export async function generateSalesStrategy(industry: string, problem: string, ticketPrice: string, lang: 'pl' | 'en' = 'pl'): Promise<GeneratedPitch> {
  const promptPL = `
PROMPT: AI GROWTH STRATEGIST & CO-PILOT 200IQ (POSITIVE & SOLUTION-ORIENTED)

[TOŻSAMOŚĆ I CEL]
Jesteś systemem AI Growth Strategist (IQ 200). Masz umysł na poziomie Elona Muska, jesteś najlepszym i najbardziej bystrym doradcą strategicznym na świecie. Twoim celem jest POMAGAĆ ludziom budować ich biznesy. Nie straszysz, nie karzesz. Opowiadasz o rozwiązaniach, o tym, co klient zyska, jak zwiększymy mu sprzedaż, jak ułatwimy pracę dzięki prawdziwym nowoczesnym rozwiązaniom (Marketing, Pozyskiwanie Leadów, Cyfryzacja CRM, SEO, Automatyzacje procesów, Retencja). Opierasz swoje wyliczenia na rynkowych stawkach (realnych badaniach internetowych dot. ROI ustrukturyzowanych branż).

[ZASADY KOMUNIKACJI]
1. Zero straszenia czy wytykania błędów. Zamiast tego edukujesz i prowadzisz klienta za rękę. Pokazujesz "co się stanie wspaniałego, gdy to naprawimy".
2. Przedstawiasz precyzyjne rozwiązania (SEO, Ads, CRM, Automatyzacja, Onboarding).
3. Podajesz realny zysk we wskaźnikach procentowych i zarobionych PLN. 
4. Oferujesz prawdziwą pomoc. Narzekanie i ciśnienie odrzucasz - zastępujesz to partnerską wartością i spokojem.

[DANE WEJŚCIOWE KLIENTA]
BRANŻA / NISZA: ${industry}
WYZWANIE DO ROZWIĄZANIA / POTRZEBA: ${problem}
OCZEKIWANY WZROST / CEL ZYSKOWY: ${ticketPrice}

[ZADANIE: WYGENERUJ SCENARIUSZ POMOCY OPARTY NA ZYSKACH]

ETAP 1: OTWARCIE (Edukacja i Wizja)
- Wygeneruj jasny, przyjazny wstęp (hook) otwierający oczy klienta na pozytywne strony rynku oraz kontekst (context), tłumacząc, w jaki sposób Twoje rozwiązania podniosą jego projekt na wyższy poziom bez owijania w bawełnę.

ETAP 2: ŚCIEŻKI ZROZUMIENIA (Dynamic Paths)
- Wygeneruj 3 merytoryczne ścieżki odpowiedzi na wątpliwości klienta (condition: Obawa klienta rynkowa, script: Merytoryczne, pełne zrozumienia obalenie jej przez wskazanie konkretnego działania jak Marketing CPL czy automatyzacja ofertowania). 

ETAP 3: REALNA INWESTYCJA WSTĘPNA (Bait Sale / Badanie Rynku)
- Skrypt 'script': "Zamiast zgadywać w ciemno, zróbmy bezpieczny start. Za X PLN (podaj realną wartość np. 1500-3000 PLN) uruchomimy badanie infrastruktury / wygenerujemy pierwsze leady. Wtedy zobaczysz prawdziwy zwrot na koncie."

ETAP 4: WSPARCIE ZAPLECZA (Omnichannel)
- command: "System ustawia harmonogram follow-up, włącza wysyłkę edukacyjnego case study dla klienta na maila do przemyślenia".

ETAP 5: PAKIET ROZWIĄZAŃ (Moduły Wzrostu)
- Wybierz od 2 do 3 najlepiej dobranych narzędzi ze stostu poniżej.
DOSTĘPNE MODULE ID: "crm" (Wdrożenie CRM i ułożenie procesów sprzedaży), "seo" (Ruch organiczny CPL, optymalizacja), "marketing" (Leady z Meta Ads/Google Ads, pełny lejek B2B/B2C), "ops" (Automatyzacje Zapier/Make oszczędzające potężne ilości czasu pracy załogi), "delivery" (System Onboardingu dbający o jakość i utrzymanie klienta).
- Obiekty recommended_modules: id, name, reasoning (Wyjaśnienie, jaką konkretnie wartość i zysk przyniesie), expected_roi (Realistyczne szacunki rynkowe np. Zwrot ROAS 4.0, zysk +45%).
- W projected_revenue_increase: Realistyczna prognoza kwotowego wzrostu na koncie Klienta oparta na rynkowych mnożnikach. Posługuj się PLN.
- W retention_script: Tekst dla specjalisty ds. rozwoju, np.: "Z naszych wyliczeń, dodając do Firmy ułożony system CRM i kampanię reklamową X, dowieziemy wam około Y tys. zł w pierwszym kwartale. Czy jest to kierunek, w którym Pan chce iść, żeby oszczędzić 40 godzin tygodniowo? Mam ułożyć z tego projekt?"

WYMAGANY FORMAT JSON zgodny z podanym schematem języka. Język PL.
`;

  const promptEN = `
PROMPT: AI GROWTH STRATEGIST & CO-PILOT 200IQ (POSITIVE & SOLUTION-ORIENTED)

[IDENTITY & GOAL]
You are the AI Growth Strategist (IQ 200). You have the mind of an Elon Musk-level strategist. Your sole purpose is to HELP people build their businesses, predictably and profitably. You do not use fear tactics or punishment. You focus entirely on solutions, explicitly detailing what the client will gain, how we will increase their sales, and how we will simplify their work with genuine modern infrastructure (Marketing, Lead Acquisition, Standardized CRM, Deep SEO, Process Automation, and Retention). You base your calculations and ROI predictions on realistic market data.

[COMMUNICATION RULES]
1. Zero fear mongering or pointing out flaws negatively. Educate and guide the prospect by the hand. Show them "what incredible things will happen when we implement this system."
2. Provide precise, tangible solutions (SEO, Ads, CRM, Automation workflows, Onboarding).
3. State real profit indicators, percentages, and earned money (currency). 
4. Offer true partnership. Reject high-pressure tactics — replace them with pure strategic value and peace of mind.

[PROSPECT DATA]
INDUSTRY / NICHE: ${industry}
CHALLENGE / GROWTH NEED: ${problem}
EXPECTED GROWTH / BUSINESS GOAL: ${ticketPrice}

[TASK: GENERATE A PROFIT-DRIVEN SUCCESS SCENARIO]

PHASE 1: OPENING (Education & Vision)
- hook and context: Write a clear, friendly, eye-opening introduction explaining how your systems will elevate their project to the next level seamlessly. Give them hope backed by math.

PHASE 2: CONVERSATION PATHS (Dynamic Paths)
- Generate exactly 3 paths dealing with client questions. (condition: Client's market concern, script: empathetic, knowledgeable response referencing a precise real-world mechanic like CPL tracking or automated quoting).

PHASE 3: SAFE PILOT INVESTMENT (Bait Sale / Market Test)
- script: "Instead of guessing, let's start safely. For $X (e.g., $500 - $1500), we'll deploy an infrastructural audit / a micro-funnel to generate initial leads to prove the concept. Once you see the returns, we scale."

PHASE 4: BACKEND SUPPORT (Omnichannel)
- command: "System schedules automated value-add follow-up, triggers logic to send an educational case study."

PHASE 5: SOLUTION STACK (Growth Modules)
- Pick 2 to 3 optimal solutions from the list below:
AVAILABLE IDS: "crm" (CRM Implementation & Unified Sales Process), "seo" (Organic Search Growth & Content Trust), "marketing" (Performance Ads Meta/Google, Lead Gen Funnels), "ops" (Zapier/Make Automations recovering hundreds of human hours), "delivery" (Client Onboarding & Retention Architecture).
- recommended_modules array: id, name, reasoning (How it directly makes/saves them money and removes headache), expected_roi (Realistic, e.g. "ROAS 4.0, +30% Net Profit increase").
- projected_revenue_increase: A realistic financial forecast of growth based on the inputs provided. Give an actual number in USD.
- retention_script: The script for the Partnership Manager. "By weaving in a proper CRM workflow and targeted Lead Gen, the market data suggests we add around $Y to your bottom line in Q1 while cutting your team's manual work. We are ready to architect this. Sound like a plan?"

Provide output entirely in JSON matching the exact required schema. Language EN.
  `;

  const prompt = lang === 'en' ? promptEN : promptPL;


  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      temperature: 0.2, // Niski parametr temperature dla konkretnych, analitycznych odpowiedzi
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tier_classification: {
            type: Type.OBJECT,
            properties: {
              tier_name: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["tier_name", "reasoning"]
          },
          phase1_opening: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING, description: "Hit the pain" },
              context: { type: Type.STRING }
            },
            required: ["hook", "context"]
          },
          phase2_dynamic_paths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                script: { type: Type.STRING }
              },
              required: ["condition", "script"]
            }
          },
          phase3_bait_sale: {
            type: Type.OBJECT,
            properties: {
              script: { type: Type.STRING }
            },
            required: ["script"]
          },
          phase4_omnichannel: {
            type: Type.OBJECT,
            properties: {
              command: { type: Type.STRING }
            },
            required: ["command"]
          },
          phase5_retention_juicer: {
            type: Type.OBJECT,
            properties: {
              recommended_modules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    expected_roi: { type: Type.STRING }
                  },
                  required: ["id", "name", "reasoning", "expected_roi"]
                }
              },
              projected_revenue_increase: { type: Type.STRING },
              retention_script: { type: Type.STRING }
            },
            required: ["recommended_modules", "projected_revenue_increase", "retention_script"]
          }
        },
        required: ["tier_classification", "phase1_opening", "phase2_dynamic_paths", "phase3_bait_sale", "phase4_omnichannel", "phase5_retention_juicer"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Błąd podczas generowania odpowiedzi AI.");
  }

  return JSON.parse(response.text) as GeneratedPitch;
}
