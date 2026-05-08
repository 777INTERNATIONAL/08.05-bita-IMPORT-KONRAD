import React, { useState, useEffect } from 'react';
import { getPipelineData } from './data/pipelineData';
import { useLanguageStore } from './store/languageStore';
import { translations } from './translations';
import { cn } from './lib/utils';
import { 
  Building2, Users, FileBarChart, CheckCircle2, AlertCircle, 
  ChevronRight, BrainCircuit, Rocket, ShieldAlert, BadgeDollarSign, 
  Globe2, Lock, ArrowRight, Zap, Target, Loader2, Sparkles, LayoutDashboard,
  Calendar as CalendarIcon, Mail, Send, Focus, Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSalesStrategy, type GeneratedPitch } from './services/aiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Lead, PipelineStage, LeadHistoryItem } from './types';
import { getMockLeads } from './data/mockLeads';

export const getStages = (lang: 'pl' | 'en'): { id: PipelineStage; label: string; color: string }[] => [
  { id: 'Triage / Purgatory', label: 'Triage / Purgatory', color: 'border-slate-500/50 text-slate-400' },
  { id: 'The Bleeding (Diagnoza)', label: lang === 'pl' ? 'Rozmowa 1: The Bleeding' : 'Call 1: The Bleeding', color: 'border-red-500/50 text-red-400' },
  { id: 'The Blueprint (Architektura)', label: lang === 'pl' ? 'Rozmowa 2: The Blueprint' : 'Call 2: The Blueprint', color: 'border-blue-500/50 text-blue-400' },
  { id: 'The Execution (Decyzja)', label: lang === 'pl' ? 'The Execution: Pitch i Decyzja' : 'The Execution: Pitch & Close', color: 'border-emerald-500/50 text-emerald-400' }
];

const getMockedROIChartData = (tierName: string, lang: 'pl' | 'en') => {
  let cost = 10000; // Default
  if (tierName.includes('2.5k') || tierName.includes('Starter')) cost = 8000;
  if (tierName.includes('15k') || tierName.includes('Operational')) cost = 35000;
  if (tierName.includes('100k') || tierName.includes('Enterprise')) cost = 150000;

  const yearStr = lang === 'pl' ? 'Rok' : 'Year';
  return [
    { name: `${yearStr} 1`, Inwestycja: cost, Oszczędności: cost * 2.5 },
    { name: `${yearStr} 2`, Inwestycja: cost * 0.15, Oszczędności: cost * 3.5 },
    { name: `${yearStr} 3`, Inwestycja: cost * 0.15, Oszczędności: cost * 5 },
  ];
};

export default function App() {
  const { lang, toggleLang } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'crm' | 'calendar' | 'pipeline' | 'scripts' | 'monetization' | 'scaling' | 'ai'>('crm');
  const [leads, setLeads] = useState<Lead[]>(getMockLeads(lang));
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  
  const [dialerState, setDialerState] = useState<{ isOpen: boolean, status: 'idle' | 'calling' | 'connected' | 'wrapup', phoneNumber: string, callDuration: number, isMuted: boolean }>({
    isOpen: false,
    status: 'idle',
    phoneNumber: '',
    callDuration: 0,
    isMuted: false
  });

  const t = translations[lang];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (dialerState.status === 'connected') {
      interval = setInterval(() => {
        setDialerState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dialerState.status]);

  const initiateCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    
    // Skopiuj numer do schowka dla doradcy, by mógł wcisnąć CTRL+V w razie gdyby automatyczne okno się nie otworzyło
    navigator.clipboard.writeText(cleanPhone).catch(err => console.log('Brak uprawnień do schowka', err));

    // Wywołaj domyślny program systemowy do dzwonienia, co wymusi odpalenie aplikacji Zadarma Desktop:
    const a = document.createElement('a');
    a.href = `tel:${cleanPhone}`; // 'tel:' jest standardem obsługiwanym przez 99% klientów desktopowych.
    a.click();

    // Pokazanie panelu wewnątrz CRM-a (Mock) do śledzenia czasu
    setDialerState({
      isOpen: true,
      status: 'calling',
      phoneNumber: phone,
      callDuration: 0,
      isMuted: false
    });
    setTimeout(() => {
       setDialerState(prev => (prev.status === 'calling' ? { ...prev, status: 'connected' } : prev));
    }, 2500);
  };

  useEffect(() => {
    setLeads(getMockLeads(lang));
  }, [lang]);

  const findNextCall = () => {
    const nextLead = leads.find(l => l.id !== activeLeadId && (l.status === 'ZALEGŁY' || l.status === 'OVERDUE' || l.status === 'DZIŚ' || l.status === 'TODAY'));
    if (nextLead) {
      setActiveLeadId(nextLead.id);
      initiateCall(nextLead.phone);
    } else {
      alert("Brak kolejnych leadów do obdzwonienia!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans selection:bg-emerald-500/30">
      <ZadarmaDialer 
         state={dialerState} 
         onClose={() => setDialerState(prev => ({...prev, isOpen: false, status: 'idle', callDuration: 0}))} 
         onMute={() => setDialerState(prev => ({...prev, isMuted: !prev.isMuted}))}
         onHangup={() => {
            // Przejście do podsumowania zamiast natychmiastowego zapisu
            setDialerState(prev => ({...prev, status: 'wrapup'}));
         }}
         onSaveWrapup={(note, outcome) => {
            if (activeLeadId) {
               setLeads(leads.map(l => l.id === activeLeadId ? {
                  ...l, 
                  history: [{ 
                     id: `tc-${Date.now()}`, 
                     date: new Date().toLocaleString(), 
                     type: 'note', 
                     content: `Zakończono połączenie (${dialerState.callDuration}s).\nStatus: ${outcome}\nNotatka: ${note}`, 
                     author: l.owner 
                  }, ...l.history]
               } : l));
            }
            setDialerState(prev => ({...prev, status: 'idle', callDuration: 0, phoneNumber: ''}));
         }}
         onNextCall={findNextCall}
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800 bg-[#0A0A0A]/80 backdrop-blur-md z-40 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-widest uppercase truncate">Apex Architect_</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <Globe2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-300 uppercase">{lang}</span>
          </button>
          <div className="text-[10px] md:text-xs font-mono text-slate-500 truncate hidden sm:block">
            SYSTEM.AURA // B2B MASTER PIPELINE v.3.0
          </div>
        </div>
      </header>

      <div className="pt-16 flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-[#0c0c0c] flex flex-col p-4 gap-2 hidden md:flex">
          <div className="mb-4 mt-2">
            <h2 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2">Komponenty Systemu</h2>
          </div>
          <NavButton 
            active={activeTab === 'crm'} 
            onClick={() => { setActiveTab('crm'); setActiveLeadId(null); }}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={t.nav.crm} 
          />
          <NavButton 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')}
            icon={<CalendarIcon className="w-4 h-4" />}
            label={t.nav.calendar} 
          />
          <NavButton 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')}
            icon={<BrainCircuit className="w-4 h-4" />}
            label={t.nav.aiSandbox} 
          />
          <NavButton 
            active={activeTab === 'pipeline'} 
            onClick={() => setActiveTab('pipeline')}
            icon={<Target className="w-4 h-4" />}
            label={t.nav.pipeline} 
          />
          <NavButton 
            active={activeTab === 'scripts'} 
            onClick={() => setActiveTab('scripts')}
            icon={<ShieldAlert className="w-4 h-4" />}
            label={t.nav.scripts} 
          />
          <NavButton 
            active={activeTab === 'monetization'} 
            onClick={() => setActiveTab('monetization')}
            icon={<BadgeDollarSign className="w-4 h-4" />}
            label={t.nav.monetization} 
          />
          <NavButton 
            active={activeTab === 'scaling'} 
            onClick={() => setActiveTab('scaling')}
            icon={<Globe2 className="w-4 h-4" />}
            label={t.nav.scalability} 
          />
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-slate-800 bg-[#0c0c0c] z-40 flex justify-around items-center px-2">
           <button onClick={() => { setActiveTab('crm'); setActiveLeadId(null); }} className={cn("p-2 rounded-lg", activeTab === 'crm' ? "text-emerald-400" : "text-slate-500")}>
             <LayoutDashboard className="w-6 h-6" />
           </button>
           <button onClick={() => setActiveTab('calendar')} className={cn("p-2 rounded-lg", activeTab === 'calendar' ? "text-emerald-400" : "text-slate-500")}>
             <CalendarIcon className="w-6 h-6" />
           </button>
           <button onClick={() => setActiveTab('ai')} className={cn("p-2 rounded-lg relative", activeTab === 'ai' ? "text-emerald-400" : "text-slate-500")}>
             <BrainCircuit className="w-6 h-6" />
             {activeTab === 'ai' && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
           </button>
           <button onClick={() => setActiveTab('pipeline')} className={cn("p-2 rounded-lg", activeTab === 'pipeline' ? "text-emerald-400" : "text-slate-500")}>
             <Target className="w-6 h-6" />
           </button>
           <button onClick={() => setActiveTab('scripts')} className={cn("p-2 rounded-lg", activeTab === 'scripts' ? "text-emerald-400" : "text-slate-500")}>
             <ShieldAlert className="w-6 h-6" />
           </button>
           <button onClick={() => setActiveTab('monetization')} className={cn("p-2 rounded-lg", activeTab === 'monetization' ? "text-emerald-400" : "text-slate-500")}>
             <BadgeDollarSign className="w-6 h-6" />
           </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'crm' && (
              <motion.div key="crm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                {activeLeadId ? (
                  <LeadDetailView 
                    lead={leads.find(l => l.id === activeLeadId)!} 
                    onBack={() => setActiveLeadId(null)}
                    onUpdate={(updated) => setLeads(leads.map(l => l.id === updated.id ? updated : l))}
                    initiateCall={initiateCall}
                  />
                ) : (
                  <CRMDashboard 
                    leads={leads} 
                    onOpenLead={setActiveLeadId} 
                    onAddLead={() => {
                        const newId = `lead-${Date.now()}`;
                        setLeads([{
                          id: newId,
                          name: "Nowy Klient",
                          companyName: "Firma (Do uzupełnienia)",
                          email: "email@przyklad.pl",
                          phone: "+48 000 000 000",
                          province: "Nieokreślone",
                          industry: "Brak",
                          problem: "",
                          scale: "",
                          stage: "Badanie potrzeb",
                          status: "NOWY",
                          owner: "TY",
                          nextContact: "Brak",
                          lastContact: "Nigdy",
                          history: []
                        }, ...leads]);
                        setActiveLeadId(newId);
                    }}
                  />
                )}
              </motion.div>
            )}
            {activeTab === 'calendar' && <CalendarView leads={leads} onOpenLead={(id) => { setActiveTab('crm'); setActiveLeadId(id); }} />}
            {activeTab === 'ai' && (
              <AIPitchCopilot 
                leads={leads}
                onAssignToLead={(leadId, pitch) => {
                  setLeads(prev => prev.map(l => l.id === leadId ? {
                    ...l, 
                    pitch,
                    history: [{
                      id: `h-${Date.now()}`,
                      date: new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                      type: 'note',
                      content: `Wygenerowano Skrypt APEX DYNAMIC CO-PILOT przypisany z poziomu Sandboxa.\nKlasyfikacja: ${pitch.tier_classification?.tier_name}`,
                      author: 'AI Sandbox'
                    }, ...l.history]
                  } : l));
                  alert(lang === 'pl' ? 'Przypisano strategię do klienta.' : 'Strategy assigned to lead.');
                }}
              />
            )}
            {activeTab === 'pipeline' && <PipelineView key="pipeline" />}
            {activeTab === 'scripts' && <ScriptsView key="scripts" />}
            {activeTab === 'monetization' && <MonetizationView key="monetization" />}
            {activeTab === 'scaling' && <ScalingView key="scaling" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left relative",
        active 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
      )}
    >
      {active && label.includes('AI') && (
        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-pulse" />
      )}
      {icon}
      {label}
    </button>
  )
}

function CalendarView({ leads, onOpenLead }: { leads: Lead[], onOpenLead: (id: string) => void }) {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const upcomingLeads = leads
    .filter(l => l.nextContact && l.nextContact !== 'Brak')
    .sort((a, b) => {
       const dateA = a.nextContact; // Very naive sort for format '24 kwi 08:00', but sufficient for demo
       const dateB = b.nextContact;
       return dateA.localeCompare(dateB);
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <CalendarIcon className="text-emerald-500" /> 
          {t.calendar.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.calendar.desc}</p>
      </div>

      <div className="grid gap-4">
        {upcomingLeads.length === 0 ? (
          <div className="text-center p-8 bg-slate-900/50 border border-slate-800 rounded-xl">
             <CalendarIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-400">{t.calendar.noTasks}</h3>
          </div>
        ) : (
          upcomingLeads.map(lead => (
            <div key={lead.id} onClick={() => onOpenLead(lead.id)} className="bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-colors group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-700 group-hover:border-emerald-500/30">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{lead.nextContact.split(' ')[1]}</span>
                    <span className="text-sm font-bold text-white">{lead.nextContact.split(' ')[0]}</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{lead.name}</h3>
                   <div className="text-sm text-slate-500 font-mono flex items-center gap-2">
                      <span>{lead.companyName}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-emerald-500/70">{lead.nextContact.split(' ').slice(2).join(' ')}</span>
                   </div>
                 </div>
              </div>
              <div className="text-right">
                <span className={cn("text-[10px] px-2 py-1 rounded font-bold uppercase inline-block mb-1", lead.status === 'ZALEGŁY' || lead.status === 'OVERDUE' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400')}>{lead.status}</span>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{lead.stage}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function AIPitchCopilot({ 
  initialIndustry = '', 
  initialProblem = '', 
  initialScale = '',
  onSaveConfig,
  embedded = false,
  leads = [],
  onAssignToLead
}: { 
  initialIndustry?: string, 
  initialProblem?: string, 
  initialScale?: string,
  onSaveConfig?: (pitch: GeneratedPitch, industry: string, problem: string, scale: string) => void,
  embedded?: boolean,
  leads?: Lead[],
  onAssignToLead?: (leadId: string, pitch: GeneratedPitch) => void
}) {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [industry, setIndustry] = useState(initialIndustry);
  const [problem, setProblem] = useState(initialProblem);
  const [scale, setScale] = useState(initialScale);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pitch, setPitch] = useState<GeneratedPitch | null>(null);
  const [selectedAssignLead, setSelectedAssignLead] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !problem || !scale) {
      setError("Wypełnij wszystkie pola, aby AI mogło wygenerować zabójczo skuteczny profil.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await generateSalesStrategy(industry, problem, scale, lang);
      setPitch(result);
      if (onSaveConfig) {
        onSaveConfig(result, industry, problem, scale);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd podczas łączenia z systemem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("max-w-5xl mx-auto space-y-8", embedded ? "" : "pt-0")}
    >
      <div className={cn("border-b border-slate-800 pb-4 flex items-start justify-between", embedded ? "mt-4" : "")}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="text-emerald-500" /> 
            {t.ai.title} {embedded && <span className="text-sm font-normal text-blue-400 bg-blue-500/10 px-2 py-1 rounded ml-3 border border-blue-500/20">{t.ai.embeddedLabel}</span>}
          </h1>
          <p className="text-slate-400 text-sm">{t.ai.desc}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-4 space-y-6 bg-[#121212] border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-sm uppercase tracking-widest font-bold text-slate-500 border-b border-slate-800 pb-2 mb-4">
            Parametry Celu (Lead)
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">1. {t.ai.industry}</label>
              <input 
                type="text" 
                placeholder={t.ai.industryPlaceholder} 
                className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-700"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">2. {t.ai.pain}</label>
              <textarea 
                placeholder={t.ai.painOptions.errors} 
                className="w-full h-24 bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-700 resize-none"
                value={problem}
                onChange={e => setProblem(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">3. {t.ai.scale}</label>
              <input 
                type="text" 
                placeholder={t.ai.scalePlaceholder} 
                className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-700"
                value={scale}
                onChange={e => setScale(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-sm py-4 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {t.ai.generateBtn}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          {!pitch && !loading && (
            <div className="h-full min-h-[400px] border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-[#121212]/50">
              <BrainCircuit className="w-16 h-16 text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-500 mb-2">{t.ai.waitingParamsTitle}</h3>
              <p className="text-slate-600 max-w-md">
                {t.ai.waitingParamsDesc}
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] border border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[shimmer_2s_linear_infinite]" />
               <BrainCircuit className="w-16 h-16 text-emerald-500 mb-4 animate-pulse relative z-10" />
               <h3 className="text-xl font-bold text-emerald-500 mb-2 relative z-10">{t.ai.generating}</h3>
            </div>
          )}

          {pitch && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <GeneratedPitchDisplay pitch={pitch} />
              
              {!embedded && leads?.length > 0 && onAssignToLead && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Przypisz strategię do Leada (Opcjonalnie)</label>
                    <select 
                      className="w-full bg-[#0A0A0A] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
                      value={selectedAssignLead}
                      onChange={e => setSelectedAssignLead(e.target.value)}
                    >
                      <option value="">Wybierz Leada...</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.companyName})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={!selectedAssignLead}
                    onClick={() => {
                       if(selectedAssignLead) {
                         onAssignToLead(selectedAssignLead, pitch);
                         setSelectedAssignLead('');
                       }
                    }}
                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg uppercase tracking-wider text-xs whitespace-nowrap mt-4 sm:mt-0"
                  >
                    Przypisz i Zapisz
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

function GeneratedPitchDisplay({ pitch, onChecklistSave }: { pitch: GeneratedPitch, onChecklistSave?: (selectedModules: string[]) => void }) {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  // Jeśli pitch ma strukturę najnowszego v7.0 (Dynamic Advisor)
  if (pitch.phase1_opening) {
    return (
      <div className="space-y-6 text-left">
        {/* ETAP 1 */}
        <div className="bg-[#121212] border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="bg-blue-950/40 border-b border-blue-500/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-wider">ETAP 1: Otwarcie (Ekspert)</h3>
            </div>
            {pitch.tier_classification && (
               <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold text-blue-400 uppercase tracking-widest text-center sm:text-right" title={pitch.tier_classification.tier_name}>
                 {pitch.tier_classification.tier_name}
               </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <h4 className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Kontekst dla doradcy</h4>
            <div className="text-xs sm:text-sm text-slate-400 bg-[#0A0A0A] p-4 rounded-xl border border-slate-800 leading-relaxed">
              {pitch.phase1_opening.context}
            </div>
            
            <h4 className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest mt-6 mb-2">Hook wejściowy</h4>
            <div className="text-sm sm:text-base text-slate-200 font-medium italic border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-500/5 rounded-r-xl">
              "{pitch.phase1_opening.hook}"
            </div>
          </div>
        </div>

        {/* ETAP 2 */}
        <div className="bg-[#121212] border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <div className="bg-purple-950/40 border-b border-purple-500/20 p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center shrink-0">
              <Focus className="w-5 h-5" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-wider">ETAP 2: Dynamiczne Ścieżki</h3>
          </div>
          <div className="p-4 sm:p-6">
             <div className="space-y-4 sm:space-y-6">
                {pitch.phase2_dynamic_paths?.map((path, idx) => (
                   <div key={idx} className="bg-[#0A0A0A] border border-slate-800 rounded-xl overflow-hidden">
                      <div className="bg-slate-900/50 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2">
                         <span className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase whitespace-nowrap">JEŚLI KLIENT MÓWI:</span>
                         <span className="text-xs sm:text-sm font-medium text-slate-300">{path.condition}</span>
                      </div>
                      <div className="p-4 bg-purple-500/5">
                         <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic border-l-2 border-purple-500/50 pl-3">
                           "{path.script}"
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* ETAP 3 */}
        <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="bg-emerald-950/40 border-b border-emerald-500/20 p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-wider">ETAP 3: SPRZEDAŻ WĘDKI (900 PLN)</h3>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-slate-200 font-medium italic border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-500/5 rounded-r-xl leading-relaxed">
              "{pitch.phase3_bait_sale?.script}"
            </p>
          </div>
        </div>

        {/* ETAP 4 */}
        <div className="bg-[#121212] border border-amber-500/30 rounded-2xl overflow-hidden">
          <div className="bg-amber-950/40 border-b border-amber-500/20 p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-wider">ETAP 4: OMNICHANNEL</h3>
          </div>
          <div className="p-4 sm:p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <div className="bg-[#0A0A0A]/90 backdrop-blur border border-slate-800 p-4 rounded-xl font-mono text-[10px] sm:text-sm">
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                   <ChevronRight className="w-4 h-4 shrink-0" />
                   <span className="font-bold">SYSTEM.AUTO_EXECUTE()</span>
                </div>
                <p className="text-slate-300 pl-4 sm:pl-6 border-l border-slate-800 ml-2 leading-relaxed">
                   {pitch.phase4_omnichannel?.command}
                </p>
                {onChecklistSave && (
                   <button 
                     onClick={() => {
                        onChecklistSave(["Wdrożenie platformy operacyjnej", "Bramka Weryfikacyjna Biznesowa"]);
                     }}
                     className="mt-6 ml-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                   >
                     KLIKNIJ: ZAMKNIJ DEAL I WYKONAJ ZADANIE
                   </button>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Wsteczna kompatybilność dla wersji v6.0
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);

  const togglePoint = (index: number) => {
    setSelectedPoints(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const calculateTotal = () => {
    return selectedPoints.reduce((acc, curr) => acc + (curr + 1) * 7500, 0); 
  };

  const handleSaveChecklistLegacy = () => {
    if (onChecklistSave && pitch.phase3_diagnostic_checklist?.points) {
      const selectedModules = selectedPoints.map(i => pitch.phase3_diagnostic_checklist?.points[i].module || '');
      onChecklistSave(selectedModules);
    }
  };

  if (!pitch.phase1_frontend_caller) {
    return <div className="text-slate-400 p-4 bg-slate-800/30 rounded-xl">Legacy Pitch Format detected. Please regenerate the strategy to use Boiler Room Engine v7.0.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 text-purple-500 rounded flex items-center justify-center"><BrainCircuit className="w-4 h-4" /></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">FAZA 1 & 2: Front-End & Limit Giełdy</h3>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold text-purple-400 uppercase tracking-widest text-right max-w-[200px] truncate" title={pitch.tier_classification?.tier_name}>
            {pitch.tier_classification?.tier_name}
          </div>
        </div>
        <div className="p-6 space-y-6">
          {pitch.tier_classification && (
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2">Klasyfikacja Koszyka Giełdy</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{pitch.tier_classification.reasoning}</p>
            </div>
          )}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Hak Uderzeniowy (The Bleeding)</h4>
            <p className="text-slate-300 font-medium italic border-l-2 border-emerald-500 pl-4 py-1 mb-4">"{pitch.phase1_frontend_caller.hook}"</p>
            
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Bramka i Lock-in (900 PLN)</h4>
            <p className="text-slate-300 font-medium italic border-l-2 border-blue-500 pl-4 py-1 mb-4">"{pitch.phase1_frontend_caller.offer_and_close}"</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h5 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Wyczerpanie Limitu (Friction Point)</h5>
            <p className="text-sm text-red-100">{pitch.phase2_friction_point}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-emerald-500/40 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 p-4 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 text-black rounded flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">FAZA 3: Giełda Zablokowanych Programów</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-slate-300 italic border-l-2 border-emerald-500/50 pl-4 py-1">"{pitch.phase3_diagnostic_checklist?.intro}"</p>
          
          <div className="space-y-4">
            {pitch.phase3_diagnostic_checklist?.points?.map((point, index) => (
              <div 
                key={index} 
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all",
                  selectedPoints.includes(index) 
                    ? "bg-emerald-900/20 border-emerald-500" 
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-500"
                )}
                onClick={() => togglePoint(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                    selectedPoints.includes(index) ? "bg-emerald-500 text-black" : "border border-slate-500 text-transparent"
                  )}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 w-full">
                    <p className="text-sm text-slate-300 font-medium">{point.question}</p>
                    <div className="flex items-center gap-2 bg-[#0A0A0A] border border-slate-700 w-fit px-3 py-1.5 rounded-lg my-2">
                       <Zap className="w-3 h-3 text-yellow-500" />
                       <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">{point.module}</span>
                    </div>
                    <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 py-1">
                       {point.calculation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPoints.length > 0 && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Wartość Wybranych Modułów z Giełdy</p>
                <p className="text-2xl font-black text-emerald-400">~{calculateTotal().toLocaleString()} PLN</p>
              </div>
              <button 
                onClick={handleSaveChecklistLegacy}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" />
                Dodaj Moduły do Profilu
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#121212] border border-blue-500/30 rounded-2xl overflow-hidden">
        <div className="bg-blue-950/20 border-b border-blue-500/20 p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/20 text-blue-500 rounded flex items-center justify-center"><Focus className="w-4 h-4" /></div>
          <h3 className="text-lg font-bold text-blue-400 uppercase tracking-wider">FAZA 4: Egzekucja (Finalizacja Koszyka)</h3>
        </div>
        <div className="p-6">
          <p className="text-slate-300 font-medium italic leading-relaxed">"{pitch.phase4_lock_in?.final_script}"</p>
        </div>
      </div>
    </div>
  );
}

function ZadarmaDialer({ state, onClose, onMute, onHangup, onNextCall, onSaveWrapup }: { state: any, onClose: any, onMute: any, onHangup: any, onNextCall: any, onSaveWrapup: (note: string, outcome: string) => void }) {
  const [wrapNote, setWrapNote] = useState('');
  const [wrapOutcome, setWrapOutcome] = useState('NA');

  if (!state.isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const outcomes = [
    { id: 'NA', label: 'Brakodpowiedzi (NA)' },
    { id: 'ZAJĘTE', label: 'Zajęte' },
    { id: 'FOLLOW UP', label: 'Follow up' },
    { id: 'PRZEKAŻ DO RETENCJI', label: 'Przekaż do retencji' },
    { id: 'UMÓWIONO', label: 'Umówiono spotkanie' },
    { id: 'INNE', label: 'Inne' }
  ];

  if (state.status === 'wrapup') {
    return (
      <div className="fixed bottom-6 right-6 w-80 bg-[#0A0A0A] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-xl z-50 flex flex-col overflow-hidden">
        <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             <div className="flex flex-col">
               <span className="font-bold text-xs uppercase text-slate-200 tracking-widest">WRAP-UP (PODSUMOWANIE)</span>
               <span className="text-[9px] text-emerald-500/70 font-mono">Czas: {formatTime(state.callDuration)}</span>
             </div>
           </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status rozmowy</label>
            <select 
              value={wrapOutcome} 
              onChange={e => setWrapOutcome(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-slate-700 rounded text-sm text-white p-2 outline-none focus:border-emerald-500 transition-colors"
            >
              {outcomes.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notatka</label>
            <textarea 
              value={wrapNote}
              onChange={e => setWrapNote(e.target.value)}
              placeholder="Czego dotyczyła rozmowa?"
              className="w-full h-24 bg-[#0A0A0A] border border-slate-700 rounded text-sm text-slate-300 p-2 outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-slate-600"
            ></textarea>
          </div>
          <button 
            onClick={() => {
              onSaveWrapup(wrapNote, wrapOutcome);
              setWrapNote('');
              setWrapOutcome('NA');
            }}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Zapisz podsumowanie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[#0A0A0A] border border-slate-700 shadow-2xl rounded-xl z-50 flex flex-col overflow-hidden">
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
         <div className="flex items-center gap-2">
           <Phone className="w-4 h-4 text-emerald-500" />
           <div className="flex flex-col">
             <span className="font-bold text-xs uppercase text-slate-200 tracking-widest">DIALER (ZADARMA APP)</span>
             <span className="text-[9px] text-emerald-500/70 font-mono">APP OTWARTA ZEWNĘTRZNIE</span>
           </div>
         </div>
         {state.status === 'idle' && (
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
         )}
      </div>
      
      <div className="p-6 flex flex-col items-center border-b border-slate-800 relative overflow-hidden">
         {state.status === 'calling' && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse transition-opacity duration-1000"></div>}
         
         <div className="w-16 h-16 rounded-full bg-slate-800 mb-4 flex items-center justify-center relative z-10 shadow-lg">
            {state.status === 'connected' ? <Volume2 className="w-8 h-8 text-emerald-400 animate-pulse" /> : <Users className="w-8 h-8 text-slate-500" />}
         </div>
         <div className="text-xl font-mono text-white mb-1 font-bold relative z-10">{state.phoneNumber || "Brak numeru"}</div>
         
         <div className="h-4 flex items-center relative z-10">
           {state.status === 'idle' && <span className="text-xs text-slate-500 uppercase tracking-widest">WebRTC Gotowy</span>}
           {state.status === 'calling' && <span className="text-xs text-amber-500 animate-pulse uppercase tracking-widest">Nawiązywanie połączenia...</span>}
           {state.status === 'connected' && <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span className="text-xs text-emerald-400 font-mono font-bold tracking-widest">{formatTime(state.callDuration)}</span></div>}
         </div>
      </div>

      <div className="p-4 bg-slate-900/50 flex justify-center gap-4">
         <button onClick={onMute} disabled={state.status === 'idle'} className={cn("p-4 rounded-full transition-colors", state.status === 'idle' ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-600' : state.isMuted ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 hover:bg-slate-700 text-emerald-400")}>
            {state.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
         </button>
         
         {state.status === 'idle' ? (
           <button className="p-4 rounded-full bg-slate-800 text-slate-600 cursor-not-allowed transition-colors title='Wybierz numer z profilu leada'">
              <Phone className="w-5 h-5" />
           </button>
         ) : (
           <button onClick={onHangup} className="p-4 rounded-full bg-red-500 hover:bg-red-400 text-black transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <PhoneOff className="w-5 h-5" />
           </button>
         )}
      </div>

      <div className="p-3 bg-[#0A0A0A] border-t border-slate-800">
         <button onClick={onNextCall} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 flex justify-center items-center gap-2 transition-colors">
            Następny z kolejki (Zadzwoń) <ArrowRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}

function CRMDashboard({ leads, onOpenLead, onAddLead }: { leads: Lead[], onOpenLead: (id: string) => void, onAddLead: () => void }) {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A]">
      <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><LayoutDashboard className="text-emerald-500" /> {t.crm.title}</h1>
          <p className="text-slate-400 text-sm">{t.crm.desc}</p>
        </div>
        <button onClick={onAddLead} className="bg-white text-black hover:bg-slate-200 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-md">
          + {t.crm.addLead}
        </button>
      </div>

      <div className="flex gap-4 mb-4 text-xs font-medium border-b border-slate-800 tracking-wider">
        <button className="bg-slate-900 border-t border-r border-l border-slate-800 text-white px-4 py-2 rounded-t-md font-bold">{t.crm.tabsHeaders.allLeads} <span className="text-slate-500 ml-1">{leads.length}</span></button>
        <button className="text-slate-400 hover:text-white px-4 py-2">{t.crm.tabsHeaders.newDocs} <span className="text-slate-600 ml-1">0</span></button>
        <button className="text-slate-400 hover:text-white px-4 py-2">{t.crm.tabsHeaders.toTransfer} <span className="text-slate-600 ml-1">0</span></button>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50">
               <th className="font-medium p-3 w-8"></th>
               <th className="font-medium p-3">{t.crm.table.client}</th>
               <th className="font-medium p-3">{t.crm.table.contact}</th>
               <th className="font-medium p-3">{t.crm.table.region}</th>
               <th className="font-medium p-3">{t.crm.table.pipeline}</th>
               <th className="font-medium p-3">{t.crm.table.owner}</th>
               <th className="font-medium p-3">{t.crm.table.nextContact}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {leads.map(lead => (
               <tr 
                 key={lead.id} 
                 onClick={() => onOpenLead(lead.id)}
                 className="hover:bg-slate-800/20 cursor-pointer group transition-colors"
               >
                 <td className="p-3"><div className="w-4 h-4 border border-slate-700 rounded-sm"></div></td>
                 <td className="p-3">
                   <div className="font-bold text-slate-200 group-hover:text-emerald-400 flex items-center gap-2">
                     {lead.name} {lead.pitch && <Sparkles className="w-3 h-3 text-emerald-500" />}
                   </div>
                   <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{lead.companyName}</div>
                   <div className="flex gap-2 mt-2">
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", lead.status === 'ZALEGŁY' || lead.status === 'OVERDUE' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400')}>{lead.status}</span>
                   </div>
                 </td>
                 <td className="p-3">
                   <div className="text-slate-300 font-mono text-xs">{lead.phone}</div>
                   <div className="text-slate-500 text-xs mt-1">{lead.email}</div>
                 </td>
                 <td className="p-3 text-slate-400 text-xs text-transform-capitalize">{lead.province}</td>
                 <td className="p-3">
                   <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded px-2 py-1 text-[10px] font-bold uppercase inline-block">
                     {lead.stage}
                   </div>
                 </td>
                 <td className="p-3 text-slate-400 text-xs uppercase font-bold tracking-widest">{lead.owner}</td>
                 <td className="p-3">
                   <div className={cn("text-xs font-bold", lead.status === 'ZALEGŁY' || lead.status === 'OVERDUE' ? 'text-red-400' : 'text-slate-300')}>{lead.nextContact}</div>
                   <div className="text-[10px] text-slate-600 mt-1 uppercase">D K KW</div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadDetailView({ lead, onBack, onUpdate, initiateCall }: { lead: Lead, onBack: () => void, onUpdate: (l: Lead) => void, initiateCall: (phone: string) => void }) {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeChecklistTab, setActiveChecklistTab] = useState('diagnoza');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contactDate, setContactDate] = useState('');
  const [showSandbox, setShowSandbox] = useState(false);

  const handleChecklistSave = (selectedModules: string[]) => {
    const historyItem: LeadHistoryItem = {
      id: `h-${Date.now()}`,
      date: new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: 'note',
      content: `Zalogowano na Giełdzie i dodano zablokowane moduły do profilu:\n- ${selectedModules.join('\n- ')}`,
      author: 'Trener / System AI'
    };
    onUpdate({ 
      ...lead, 
      selectedSolutions: Array.from(new Set([...lead.selectedSolutions, ...selectedModules])),
      history: [historyItem, ...lead.history] 
    });
  };

  const generatePitch = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateSalesStrategy(lead.industry, lead.problem, lead.scale, lang);
      const historyItem: LeadHistoryItem = {
        id: `h-${Date.now()}`,
        date: new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'note',
        content: `Uruchomiono System APEX DYNAMIC CO-PILOT.\nKlasyfikacja: ${result.tier_classification?.tier_name}`,
        author: 'System AI'
      };
      onUpdate({ ...lead, pitch: result, history: [historyItem, ...lead.history] });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.crm.generationError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
             <div className="flex flex-col gap-1 mb-2">
               <input 
                 type="text" 
                 value={lead.name}
                 onChange={e => onUpdate({...lead, name: e.target.value})}
                 className="text-2xl font-bold bg-transparent text-white border-b border-transparent focus:border-slate-500 focus:outline-none"
               />
               <input 
                 type="text" 
                 value={lead.companyName}
                 onChange={e => onUpdate({...lead, companyName: e.target.value})}
                 className="text-sm font-bold bg-transparent text-slate-400 uppercase tracking-widest border-b border-transparent focus:border-slate-500 focus:outline-none"
               />
             </div>
             <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-block", lead.status === 'ZALEGŁY' || lead.status === 'OVERDUE' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400')}>{lead.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => {
             setShowSandbox(true);
             setTimeout(() => {
               document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' });
             }, 100);
           }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-md flex items-center gap-2">
             <Target className="w-4 h-4 text-purple-400"/> {t.crm.sendTo200IQ}
           </button>
          <div className="relative">
            <button onClick={() => setShowContactPicker(!showContactPicker)} className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-white text-xs font-bold rounded-md flex items-center gap-2">
               <CalendarIcon className="w-4 h-4"/> {t.crm.setContact}
            </button>
            {showContactPicker && (
               <div className="absolute right-0 mt-2 bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-xl z-50 flex gap-2">
                  <input type="datetime-local" value={contactDate} onChange={e => setContactDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded px-3 py-2 cursor-pointer focus:outline-none" />
                  <button onClick={() => {
                      if (!contactDate) return;
                      const formatted = new Date(contactDate).toLocaleString('pl-PL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
                      onUpdate({ 
                        ...lead, 
                        nextContact: formatted, 
                        history: [{ id: `h-${Date.now()}`, date: new Date().toLocaleString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), type: 'note', content: `Ustawiono kolejny kontakt na: ${formatted}`, author: lead.owner }, ...lead.history]
                      });
                      setShowContactPicker(false);
                  }} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-[10px] px-3 py-2 rounded">Zapisz</button>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
           {/* Basic Info */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">{t.crm.basicData}</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-sm text-slate-300">
                    <button 
                       onClick={() => initiateCall(lead.phone)}
                       className="text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded transition-colors"
                       title="Zadzwoń przez aplikację zewnętrzną (Zadarma). Numer zostanie też skopiowany!"
                    >
                       <PhoneCall className="w-3.5 h-3.5" />
                    </button>
                    <input type="text" className="bg-transparent text-slate-300 border-b border-transparent focus:border-slate-500 focus:outline-none w-full" value={lead.phone} onChange={e => onUpdate({...lead, phone: e.target.value})} />
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-slate-500">✉️</span> 
                    <input type="text" className="bg-transparent text-slate-300 border-b border-transparent focus:border-slate-500 focus:outline-none w-full" value={lead.email} onChange={e => onUpdate({...lead, email: e.target.value})} />
                 </div>
                 <div className="pt-3 border-t border-slate-800 space-y-2 mt-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-500">{t.common.nextContact}:</span> <span className="text-red-400 font-bold">{lead.nextContact}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-500">{t.common.lastContact}:</span> <span className="text-slate-300">{lead.lastContact.split(',')[0]}</span></div>
                 </div>
              </div>
           </div>

           {/* Roles */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">{t.crm.roles.title}</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1C</div>
                    <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">{t.crm.roles.firstCallerTitle}</div>
                       <div className="text-sm font-bold mt-1 text-slate-300">{lead.owner}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">K</div>
                    <div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">{t.crm.roles.consultantTitle}</div>
                       <div className="text-sm font-bold mt-1 text-slate-300">{lead.consultant || t.crm.unassigned}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
           
           {/* What to do next */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                 <h3 className="text-sm font-bold text-yellow-500 mb-3 uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {t.crm.whatToDo}</h3>
                 <ul className="space-y-2 text-sm text-yellow-200/80">
                    <li className="flex items-start gap-2"><div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] font-bold text-yellow-500 mt-0.5">1</div> {t.crm.whatToDoOptions.firma}</li>
                    <li className="flex items-start gap-2"><div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] font-bold text-yellow-500 mt-0.5">2</div> {t.crm.whatToDoOptions.skala}</li>
                    <li className="flex items-start gap-2"><div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] font-bold text-yellow-500 mt-0.5">3</div> {t.crm.whatToDoOptions.odsiew}</li>
                 </ul>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                 <h3 className="text-sm text-slate-500 mb-3 uppercase tracking-widest font-bold">{t.crm.nextStep}</h3>
                 <div className="text-sm text-slate-400 italic">{t.crm.noNextStep}</div>
              </div>
           </div>

           {/* Progress / Pipeline stages */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
                {getStages(lang).map((s, idx) => {
                  const isActive = s.id === lead.stage;
                  const isPast = getStages(lang).findIndex(st => st.id === lead.stage) > idx;
                  return (
                    <div key={s.id} className="relative flex flex-col items-center gap-2 cursor-pointer group" onClick={() => onUpdate({ ...lead, stage: s.id })}>
                       <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-[#0A0A0A] transition-colors", 
                          isActive ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                          isPast ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700")}>
                          {idx + 1}
                       </div>
                       <span className={cn("text-[10px] font-bold uppercase tracking-widest absolute -bottom-6 w-32 text-center", isActive ? "text-blue-400" : "text-slate-500")}>{s.label}</span>
                    </div>
                  )
                })}
             </div>
           </div>

           {/* Checklist Tab */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-base font-bold text-white">{t.crm.projectChecklist}</h3>
                 <button onClick={() => {
                    const message = `Zapisano stan checklisty projektowej APEX:\n- Pitch / Skrypt: ${lead.pitch ? 'Wygenerowany i aktywny' : 'Brak'}\n- Wybrane Moduły (Sokowirówka): ${lead.selectedSolutions.length > 0 ? lead.selectedSolutions.join(', ') : 'Brak'}\n- Diagnoza / Notatki klienta: Zaktualizowane`;
                    onUpdate({
                       ...lead,
                       history: [{ id: `sv-${Date.now()}`, date: new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), type: 'note', content: message, author: lead.owner }, ...lead.history]
                    });
                 }} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.common.save}
                 </button>
              </div>

              {!lead.pitch ? (
                <div className="mb-6 bg-slate-800/30 border border-slate-800 rounded-lg p-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-slate-400">{t.crm.projectSummaryEmpty}</span>
                     <button onClick={generatePitch} disabled={loading} className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-1 rounded uppercase tracking-widest font-bold hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2">
                       {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <BrainCircuit className="w-3 h-3" />} {t.common.generate}
                     </button>
                   </div>
                   {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
                   <textarea className="w-full bg-[#0A0A0A] border border-slate-800 rounded p-3 text-sm text-slate-300 min-h-[80px] focus:outline-none focus:border-slate-600" placeholder={t.crm.placeholders.generateFirst} readOnly></textarea>
                </div>
              ) : (
                <div className="mb-6">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-slate-400">{t.crm.generatedStrategyAndArch}</span>
                   </div>
                   <div className="bg-[#0A0A0A] border border-emerald-500/30 rounded-lg p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                     <GeneratedPitchDisplay pitch={lead.pitch} onChecklistSave={handleChecklistSave} />
                   </div>
                </div>
              )}

              <div className="flex gap-2 border-b border-slate-800 mb-6">
                 {[
                   { id: 'diagnoza', label: t.crm.tabs.diagnosis },
                   { id: 'rozwiązania', label: 'SOKOWIRÓWKA (PLATFORMA)' },
                   { id: 'podsumowanie', label: t.crm.tabs.summary }
                 ].map(tab => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveChecklistTab(tab.id)}
                      className={cn("px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors", activeChecklistTab === tab.id ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-300")}
                    >
                      {tab.label}
                    </button>
                 ))}
              </div>

              {activeChecklistTab === 'podsumowanie' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{t.crm.summaryMessageToClient}</h4>
                    {!lead.emailDraft && lead.pitch && (
                      <button onClick={() => {
                         const draft = `${t.crm.dearClient}

${t.crm.summaryIntro} ${lead.companyName}.

${t.crm.challenges}
${lead.problem}

Oto moduły, które wspólnie zatwierdziliśmy jako niezbędne do powstrzymania rosnących strat:
${lead.selectedSolutions.length > 0 ? lead.selectedSolutions.map(s => `- ${s}`).join('\n') : t.crm.noFuncSelected}

${t.crm.proposeMeeting}

${t.crm.withRegards}
${lead.owner}`;
                         onUpdate({...lead, emailDraft: draft});
                      }} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 transition-colors"><Mail className="w-3 h-3"/> {t.crm.generateSummaryBtn}</button>
                    )}
                  </div>
                  {lead.emailDraft !== undefined && lead.emailDraft !== '' ? (
                    <div className="space-y-3">
                      <textarea 
                        value={lead.emailDraft}
                        onChange={e => onUpdate({...lead, emailDraft: e.target.value})}
                        className="w-full h-64 bg-[#0A0A0A] border border-slate-800 rounded p-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 custom-scrollbar"
                      />
                      <button onClick={() => {
                         onUpdate({
                           ...lead, 
                           emailDraft: '', 
                           history: [{ id: `e-${Date.now()}`, date: new Date().toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), type: 'email', content: `${t.crm.sentSummaryHistory}${lead.emailDraft}`, author: lead.owner }, ...lead.history]
                         });
                      }} className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 w-fit">
                         <Send className="w-3 h-3"/> {t.crm.sendMsgBtn}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">{t.crm.placeholders.requires200IQ}</p>
                  )}
                </div>
              )}

              {activeChecklistTab === 'rozwiązania' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                       <Zap className="w-5 h-5 text-emerald-400" />
                       APEX SOKOWIRÓWKA (Giełda Rozwiązań)
                    </h4>
                    <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full uppercase tracking-widest">
                       Retencja: Tryb wyciskania
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-400">
                    Na żywo zaznaczaj usługi z klientem i dynamicznie dostosowuj ich wycenę na podstawie jego budżetu/potencjału utraconych zysków z wczorajszej diagnozy.
                  </p>

                  <DynamicCatalog lead={lead} onUpdate={onUpdate} />

                </div>
              )}

              {activeChecklistTab === 'diagnoza' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.crm.questions.industry}</label>
                    <textarea 
                      value={lead.problem} 
                      onChange={e => onUpdate({...lead, problem: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-slate-800 rounded p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Najdroższa usługa klienta / Cennik Głównego Produktu</label>
                    <textarea 
                      value={lead.scale} 
                      onChange={e => onUpdate({...lead, scale: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-slate-800 rounded p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 min-h-[80px]"
                    />
                  </div>
                </div>
              )}
           </div>

           {/* History */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-base font-bold text-white">{t.crm.history} ({lead.history.length})</h3>
              </div>

              <div className="mb-6 flex gap-3 border border-slate-800 bg-[#0A0A0A] p-3 rounded-lg focus-within:border-emerald-500 transition-colors">
                <input 
                   type="text" 
                   id="new-note-input"
                   placeholder={t.crm.placeholders.writeNoteFirst}
                   className="flex-1 bg-transparent text-sm text-slate-300 focus:outline-none"
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                         const val = e.currentTarget.value.trim();
                         e.currentTarget.value = '';
                         onUpdate({
                           ...lead,
                           history: [
                             {
                                id: `h-${Date.now()}`,
                                date: new Date().toLocaleString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                                type: 'note',
                                content: val,
                                author: lead.owner
                             },
                             ...lead.history
                           ]
                         });
                      }
                   }}
                />
                <button className="text-slate-500 hover:text-emerald-400 p-1">
                  <span className="text-xl">➔</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {lead.history.map((item, idx) => (
                  <div key={item.id} className="border border-slate-800 rounded p-4 relative pl-12 bg-[#0A0A0A]">
                     <div className="absolute left-4 top-4 text-slate-500">
                        {item.type === 'call' ? '📞' : '📝'}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">
                        <span>{item.date}</span>
                        <span className="bg-slate-800 px-1 rounded text-slate-300">{item.author}</span>
                     </div>
                     <div className="text-sm text-slate-300 mb-3">{item.content}</div>
                     {item.nextContact && (
                       <div className="bg-blue-500/10 text-blue-400 text-xs px-3 py-2 rounded-md font-medium border border-blue-500/20 inline-block">
                         → {t.crm.table.nextContact}: {item.nextContact}
                       </div>
                     )}
                  </div>
                ))}
                {lead.history.length === 0 && (
                   <div className="text-center p-8 border border-dashed border-slate-800 rounded text-slate-500 text-sm">Brak zapisanej historii.</div>
                )}
              </div>
           </div>
        </div>
      </div>
      {showSandbox && (
        <div id="sandbox-section" className="pt-8 border-t border-slate-800 mt-8">
           <AIPitchCopilot 
             embedded={true}
             initialIndustry={lead.industry}
             initialProblem={lead.problem}
             initialScale={lead.scale}
             onSaveConfig={(pitch, industry, problem, scale) => {
               const historyItem: LeadHistoryItem = {
                 id: `h-${Date.now()}`,
                 date: new Date().toLocaleString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                 type: 'note',
                 content: `Wygenerowano APEX DYNAMIC CO-PILOT (Sandbox v7.0).\nKlasyfikacja: ${pitch.tier_classification?.tier_name}`,
                 author: 'AI Copilot Sandbox'
               };
               onUpdate({
                 ...lead, 
                 industry, 
                 problem, 
                 scale, 
                 pitch,
                 selectedSolutions: [],
                 history: [historyItem, ...lead.history]
               });
               setActiveChecklistTab('rozwiązania');
             }}
           />
        </div>
      )}
    </div>
  );
}

// Reszta widoków pozostaje bez zmian
function PipelineView() {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const pipelineData = getPipelineData(lang);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">{t.pipeline.title}</h1>
        <p className="text-slate-400 text-sm">{t.pipeline.subtitle}</p>
      </div>

      <div className="grid gap-6">
        {pipelineData.stages.map((stage: any, idx) => (
          <div key={stage.id} className="group transition-all">
            <div className={cn(
              "bg-[#121212] border border-slate-800 rounded-xl p-6 relative overflow-hidden group-hover:border-slate-600 transition-colors",
              expandedScenario === stage.id ? "rounded-b-none border-b-emerald-500/50" : ""
            )}>
              
              {/* Index Background */}
              <div className="absolute -top-6 -right-4 text-[120px] font-black text-white/[0.02] pointer-events-none user-select-none">
                0{idx + 1}
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono text-emerald-500 font-bold tracking-widest uppercase mb-1 block">{t.pipeline.step} {idx + 1}</span>
                        <h3 className="text-xl font-bold text-white leading-tight">{stage.name}</h3>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t.pipeline.breakthrough}</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-100">{stage.breakthrough}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase mb-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        {t.pipeline.businessGoal}
                      </h4>
                      <p className="text-slate-400 text-sm">{stage.goal}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      <div className="flex-1">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase mb-2">
                          <Rocket className="w-4 h-4 text-orange-400" />
                          {t.pipeline.actions}
                        </h4>
                        <ul className="space-y-2">
                          {stage.actions.map((act: string, i: number) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                               <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                               <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {stage.detailedScenario && (
                        <button 
                          onClick={() => setExpandedScenario(expandedScenario === stage.id ? null : stage.id)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                            expandedScenario === stage.id 
                              ? "bg-emerald-500 text-black" 
                              : "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                          )}
                        >
                          <BrainCircuit className="w-4 h-4" />
                          {expandedScenario === stage.id ? t.pipeline.hideScenario : t.pipeline.showScenario}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scenario Panel */}
            <AnimatePresence>
              {expandedScenario === stage.id && stage.detailedScenario && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-900/50 border-x border-b border-slate-700 rounded-b-xl p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {stage.detailedScenario.title || t.pipeline.scenarioTitle}
                          </h4>
                          <p className="text-slate-300 text-sm font-medium leading-relaxed bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10">
                            {stage.detailedScenario.intro}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-3 h-3" />
                            {t.pipeline.tensionMessages}
                          </h4>
                          {stage.detailedScenario.messages?.map((msg: string, i: number) => (
                            <div key={i} className="bg-black/40 border border-slate-800 p-4 rounded-xl">
                              <p className="text-slate-400 text-sm italic">"{msg}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-blue-400 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            {t.pipeline.diagnosticQuestions}
                          </h4>
                          <div className="grid gap-3">
                            {stage.detailedScenario.questions?.map((q: string, i: number) => (
                              <div key={i} className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl flex gap-3">
                                <span className="font-mono text-emerald-500 font-bold">{i+1}.</span>
                                <p className="text-white text-sm font-medium leading-normal">{q}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl relative overflow-hidden">
                          <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 text-purple-500/10" />
                          <h4 className="text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-3 h-3" />
                            {t.pipeline.breakthroughMoment}
                          </h4>
                          <p className="text-purple-100 text-sm relative z-10">{stage.detailedScenario.breakthroughMoment}</p>
                        </div>

                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          <h4 className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest mb-1 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.pipeline.nextStep}
                          </h4>
                          <p className="text-emerald-100 text-sm">{stage.detailedScenario.closing}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ScriptsView() {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const pipelineData = getPipelineData(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">{t.scripts.title}</h1>
        <p className="text-slate-400 text-sm">{t.scripts.subtitle}</p>
      </div>

      <div className="space-y-8">
        {pipelineData.scripts.map((scriptGroup, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              {scriptGroup.category}
            </h3>
            <div className="grid gap-3">
              {scriptGroup.phrases.map((phrase, pIdx) => (
                <div key={pIdx} className="bg-[#121212] border-l-2 border-slate-700 hover:border-emerald-500 p-4 rounded-r-xl transition-all">
                  <p className="text-slate-300 text-[15px] leading-relaxed font-medium">"{phrase}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MonetizationView() {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const pipelineData = getPipelineData(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">{t.monetization.title}</h1>
        <p className="text-slate-400 text-sm">{t.monetization.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pipelineData.monetization.tiers.map((tier, idx) => (
          <div key={idx} className={cn("rounded-2xl border p-6 flex flex-col relative overflow-hidden", tier.color.split(' ')[0], "bg-[#121212]")}>
            <div className={cn("absolute top-0 left-0 right-0 h-1", tier.color.split(' ')[0].replace('border-', 'bg-'))} />
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{tier.target}</span>
              <h3 className={cn("text-xl font-bold mt-1", tier.color.split(' ')[1])}>{tier.name}</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Zakres</span>
                <p className="text-sm text-slate-300 mt-1">{tier.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500 uppercase font-bold">{t.monetization.margin}</span>
                <p className="text-sm text-slate-300 mt-1">{tier.margin}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs text-emerald-500/80 uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {t.monetization.retainerTitle}
                </span>
                <p className="text-sm font-semibold text-white mt-1">{tier.retainer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
        <BrainCircuit className="w-6 h-6 text-purple-500" />
        {t.monetization.lockInTitle}
      </h2>
      <div className="grid gap-4">
        {pipelineData.monetization.lock_in.map((lock, idx) => (
          <div key={idx} className="bg-gradient-to-r from-[#121212] to-[#0A0A0A] border border-slate-800 rounded-xl p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 font-mono font-bold flex items-center justify-center text-slate-400 shrink-0">
              {idx + 1}
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">{lock.title}</h4>
              <p className="text-sm text-slate-400">{lock.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const CATALOG_CATEGORIES = [
  {
    id: 'infrastruktura',
    name: 'Infrastruktura & Systemy',
    items: [
      { id: 'tarcza', name: 'Cyfrowa Tarcza / Audyt Zero-Trust', basePrice: 900, type: 'one-time' },
      { id: 'crm', name: 'Wdrożenie CRM & Marketing Automation', basePrice: 5000, type: 'one-time' },
      { id: 'b2b_lp', name: 'Lejek i Landing Page B2B', basePrice: 4500, type: 'one-time' },
    ]
  },
  {
    id: 'ruch',
    name: 'Skalowanie Ruchu (Traffic)',
    items: [
      { id: 'seo', name: 'Architektura SEO B2B/B2C', basePrice: 4000, type: 'mrr' },
      { id: 'meta', name: 'Prowadzenie Meta Ads (Lead Gen)', basePrice: 3500, type: 'mrr' },
      { id: 'google', name: 'Prowadzenie Google Ads', basePrice: 3500, type: 'mrr' },
    ]
  },
  {
    id: 'retencja',
    name: 'Boiler Room (Sprzedaż)',
    items: [
      { id: 'dialer', name: 'Setup Call Center + Power Dialer', basePrice: 5000, type: 'one-time' },
      { id: 'scripts', name: 'Skrypty 200 IQ (Zbijanie Obiekcji)', basePrice: 6000, type: 'one-time' },
      { id: 'training', name: 'Szkoła Retencji 200 IQ (Wyciskarka)', basePrice: 15000, type: 'one-time' }
    ]
  }
];

function DynamicCatalog({ lead, onUpdate }: { lead: Lead, onUpdate: (lead: Lead) => void }) {
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

  const isSelected = (name: string) => lead.selectedSolutions.some(s => s.startsWith(name));

  const toggleItem = (item: any) => {
    const price = customPrices[item.id] || item.basePrice;
    const formattedStr = `${item.name} (${price} PLN${item.type === 'mrr' ? '/mc' : ''})`;

    if (isSelected(item.name)) {
      const newSelected = lead.selectedSolutions.filter(s => !s.startsWith(item.name));
      onUpdate({...lead, selectedSolutions: newSelected});
    } else {
      onUpdate({...lead, selectedSolutions: [...lead.selectedSolutions, formattedStr]});
    }
  };

  const updatePrice = (item: any, newPriceStr: string) => {
    const newPrice = parseInt(newPriceStr.replace(/\D/g, ''), 10) || 0;
    setCustomPrices(prev => ({...prev, [item.id]: newPrice}));
    
    if (isSelected(item.name)) {
      const formattedStr = `${item.name} (${newPrice} PLN${item.type === 'mrr' ? '/mc' : ''})`;
      const newSelected = lead.selectedSolutions.map(s => s.startsWith(item.name) ? formattedStr : s);
      onUpdate({...lead, selectedSolutions: newSelected});
    }
  };

  const calculateTotal = () => {
    let oneTime = 0;
    let mrr = 0;
    lead.selectedSolutions.forEach(s => {
       const match = s.match(/\((\d+)\sPLN(?:\/(\w+))?\)/);
       if (match) {
         const price = parseInt(match[1], 10);
         const isMrr = match[2] === 'mc';
         if (isMrr) mrr += price;
         else oneTime += price;
       }
    });
    return { oneTime, mrr };
  };

  const { oneTime, mrr } = calculateTotal();
  const aiJuicer = lead.pitch?.phase5_retention_juicer;

  return (
    <div className="space-y-6">
       {/* SEKCJA AI: SOKOWIRÓWKA */}
       {aiJuicer && (
         <div className="bg-[#121212] border border-amber-500/40 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.1)]">
           <div className="bg-amber-950/40 border-b border-amber-500/20 p-4">
             <h5 className="font-bold text-amber-400 uppercase tracking-widest text-sm flex items-center gap-2">
               <BrainCircuit className="w-4 h-4" />
               Rekomendacja Systemowa (AI)
             </h5>
           </div>
           <div className="p-4 space-y-4">
             <div className="bg-[#0A0A0A] p-4 rounded-lg border border-slate-800">
               <p className="text-sm text-slate-300 italic border-l-2 border-amber-500/50 pl-3 leading-relaxed">
                 "{aiJuicer.retention_script}"
               </p>
             </div>
             
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
               <div>
                 <h6 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Potencjalny wzrost przychodów</h6>
                 <div className="text-xl font-black text-emerald-400 font-mono">
                   {aiJuicer.projected_revenue_increase}
                 </div>
               </div>
               <button 
                 onClick={() => {
                   const aiModules = aiJuicer.recommended_modules.map(mod => {
                     const catalogItem = CATALOG_CATEGORIES.flatMap(c => c.items).find(i => i.id === mod.id);
                     if (catalogItem) {
                       const price = customPrices[catalogItem.id] || catalogItem.basePrice;
                       return `${catalogItem.name} (${price} PLN${catalogItem.type === 'mrr' ? '/mc' : ''})`;
                     }
                     return null;
                   }).filter(Boolean) as string[];
                   
                   // Dopiszemy brakujące lub podmienimy
                   const unique = new Set([...lead.selectedSolutions, ...aiModules]);
                   onUpdate({...lead, selectedSolutions: Array.from(unique)});
                 }}
                 className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-transform active:scale-95"
               >
                 AKTYWUJ W KOSZYKU
               </button>
             </div>
           </div>
         </div>
       )}

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* KATEGORIE */}
         <div className="col-span-1 xl:col-span-2 space-y-6">
           {CATALOG_CATEGORIES.map(category => (
             <div key={category.id} className="bg-[#0A0A0A] border border-slate-800 rounded-xl overflow-hidden">
               <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
                 <h5 className="font-bold text-slate-300 uppercase tracking-wider text-xs">{category.name}</h5>
               </div>
               <div className="p-2 space-y-2">
                 {category.items.map(item => {
                   const selected = isSelected(item.name);
                   const currentPrice = customPrices[item.id] || item.basePrice;
                   const aiRecommends = aiJuicer?.recommended_modules.find(m => m.id === item.id);
                   
                   return (
                     <div key={item.id} className={cn(
                       "flex flex-col p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden",
                       selected ? "bg-emerald-500/10 border-emerald-500" : "bg-[#121212] border-slate-800 hover:border-slate-600",
                       aiRecommends && !selected && "border-amber-500/50"
                     )} onClick={() => toggleItem(item)}>
                        
                        {aiRecommends && (
                           <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                             AI REKOMENDUJE
                           </div>
                        )}

                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                         <div className="flex items-center gap-3">
                           <div className={cn(
                             "flex items-center justify-center w-5 h-5 rounded border shrink-0 transition-colors",
                             selected ? "bg-emerald-500 border-emerald-500 text-black" : "border-slate-600",
                             aiRecommends && !selected && "border-amber-500/50 text-amber-500/30"
                           )}>
                             {selected && <CheckCircle2 className="w-3 h-3" />}
                             {!selected && aiRecommends && <Focus className="w-3 h-3" />}
                           </div>
                           <div>
                              <span className="text-sm font-medium text-slate-200">{item.name}</span>
                              {aiRecommends && (
                                <div className="mt-1 text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded w-fit italic">
                                  {aiRecommends.reasoning}
                                </div>
                              )}
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-2 pl-8 sm:pl-0 mt-2 sm:mt-0" onClick={e => e.stopPropagation()}>
                           <div className="relative">
                             <input 
                                type="text" 
                                value={currentPrice}
                                onChange={(e) => updatePrice(item, e.target.value)}
                                className="w-24 bg-black border border-slate-700 text-right pr-6 pl-2 py-1 text-sm font-mono rounded text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors"
                             />
                             <span className="absolute right-2 top-1 text-xs text-slate-500 pointer-events-none">PLN</span>
                           </div>
                           {item.type === 'mrr' && <span className="text-xs text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded">MRR</span>}
                           {item.type === 'one-time' && <span className="text-xs text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded">ONCE</span>}
                         </div>
                       </div>
                     </div>
                   )
                 })}
               </div>
             </div>
           ))}
         </div>

         {/* PODSUMOWANIE KOSZYKA */}
         <div className="col-span-1">
            <div className="sticky top-4 bg-[#121212] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
               <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                 <h5 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                   <Target className="w-4 h-4 text-emerald-400" />
                   Checkout Giełdy
                 </h5>
               </div>
               
               <div className="p-4 space-y-4">
                 {lead.selectedSolutions.length === 0 ? (
                   <div className="text-slate-500 text-xs italic text-center py-8">
                     Zaznacz moduły z lewej aby złożyć pakiet.
                   </div>
                 ) : (
                   <ul className="space-y-3">
                     {lead.selectedSolutions.map((sol, idx) => (
                       <li key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/50 pb-2">
                         <span className="text-slate-300 pr-4">{sol.split(' (')[0]}</span>
                         <span className="text-emerald-400 font-mono font-bold whitespace-nowrap">
                           {sol.split('(')[1]?.replace(')', '')}
                         </span>
                       </li>
                     ))}
                   </ul>
                 )}

                 <div className="pt-4 border-t border-slate-800 space-y-2">
                   <div className="flex justify-between items-baseline">
                     <span className="text-xs text-slate-400 uppercase tracking-wider">Setup / Aktywacja:</span>
                     <span className="text-xl font-bold text-white font-mono">{oneTime.toLocaleString()} PLN</span>
                   </div>
                   <div className="flex justify-between items-baseline">
                     <span className="text-xs text-slate-400 uppercase tracking-wider">Cyklicznie (MRR):</span>
                     <span className="text-lg font-bold text-emerald-400 font-mono">+{mrr.toLocaleString()} PLN/mc</span>
                   </div>
                 </div>

                 {lead.selectedSolutions.length > 0 && (
                   <button 
                     onClick={() => {
                        const message = `Wygenerowano Checkout na kwotę: Setup ${oneTime} PLN, MRR ${mrr} PLN/mc. Client gotowy do faktury.`;
                        onUpdate({
                          ...lead,
                          history: [{ id: `o-${Date.now()}`, date: new Date().toLocaleString(), type: 'note', content: message, author: 'APEX Retencja' }, ...lead.history]
                        });
                        alert("Podsumowanie dodane do historii Leada! (w produkcji: uderzenie w API fakturowni/stripe)");
                     }}
                     className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                   >
                     Zablokuj Deal & Wyślij Payment
                   </button>
                 )}
               </div>
            </div>
         </div>
       </div>
    </div>
  );
}

function ScalingView() {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const pipelineData = getPipelineData(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">{t.scaling.title}</h1>
        <p className="text-slate-400 text-sm">{t.scaling.subtitle}</p>
      </div>

      <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe2 className="w-48 h-48 text-emerald-500" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-6">{t.scaling.masterStrategy} {pipelineData.scalability.approach}</h3>
        
        <div className="space-y-6 relative z-10">
          {pipelineData.scalability.points.map((point, idx) => {
            const [bold, ...rest] = point.split(':');
            return (
              <div key={idx} className="flex gap-4 items-start">
                <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  <span className="font-bold text-white">{bold}:</span>
                  {rest.join(':')}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-black/50 border border-slate-800 border-l-4 border-l-purple-500 p-5 rounded-lg">
          <h4 className="font-bold text-pepper-50 text-white flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-purple-400" />
            {t.scaling.keyToScaling}
          </h4>
          <p className="text-sm text-slate-400">
            {t.scaling.keyScalingDesc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
