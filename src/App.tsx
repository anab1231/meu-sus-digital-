import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Syringe, 
  Pill, 
  User, 
  Bell, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Search,
  Settings,
  Menu,
  X,
  Accessibility,
  Eye,
  Type,
  ChevronLeft,
  Filter,
  Download,
  Info,
  Clock,
  ExternalLink,
  Phone,
  Droplets,
  Zap,
  Sun,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'landing' | 'dashboard' | 'consultas' | 'vacinas' | 'exames' | 'remedios' | 'unidades' | 'perfil' | 'search' | 'notificacoes' | 'hidratacao' | 'sono' | 'movimentacao';

interface HealthAction {
  id: Exclude<View, 'landing' | 'search' | 'notificacoes'>;
  title: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface Activity {
  id: string;
  type: 'appointment' | 'vaccine' | 'exam';
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed';
}

// --- App Component ---
export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  const toggleFontSize = () => setFontSize(prev => (prev >= 1.4 ? 1 : prev + 0.2));

  const mainStyles = {
    fontSize: `${fontSize}rem`,
    filter: highContrast ? 'contrast(1.2) brightness(1.1)' : 'none',
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const showNav = currentView !== 'landing';

  return (
    <div 
      className={`min-h-screen font-sans transition-all duration-500 ease-in-out ${highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}
      style={mainStyles}
    >
      {/* Top Bar */}
      {showNav && (
        <header className={`${highContrast ? 'bg-zinc-900 border-b border-white' : 'bg-[#0057B7]'} text-white p-4 shadow-lg sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView === 'dashboard' ? (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            ) : (
                <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none uppercase tracking-tight">Saúde +</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">Digital</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setHighContrast(!highContrast)} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Alto Contraste">
              <Eye className="w-5 h-5" />
            </button>
            <button onClick={toggleFontSize} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Tamanho da Fonte">
              <Type className="w-5 h-5" />
            </button>
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('notificacoes')}
              className="relative p-2 cursor-pointer"
            >
              <Bell className="w-6 h-6" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-[#0057B7]"
              >
                3
              </motion.span>
            </motion.div>
          </div>
        </div>
      </header>
      )}

      {/* View Content */}
      <main className={`max-w-4xl mx-auto ${showNav ? 'px-4 py-6 pb-32' : 'p-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: showNav ? 10 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: showNav ? -10 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={showNav ? '' : 'h-screen'}
          >
            {currentView === 'landing' && <LandingView onComplete={() => navigateTo('dashboard')} highContrast={highContrast} />}
            {currentView === 'dashboard' && <DashboardView onNavigate={navigateTo} highContrast={highContrast} />}
            {currentView === 'consultas' && <ConsultasView highContrast={highContrast} />}
            {currentView === 'vacinas' && <VacinasView highContrast={highContrast} />}
            {currentView === 'exames' && <ExamesView highContrast={highContrast} />}
            {currentView === 'remedios' && <RemediosView highContrast={highContrast} />}
            {currentView === 'unidades' && <UnidadesView highContrast={highContrast} />}
            {currentView === 'search' && <SearchView highContrast={highContrast} onNavigate={navigateTo} />}
            {currentView === 'notificacoes' && <NotificacoesView highContrast={highContrast} onNavigate={navigateTo} />}
            {currentView === 'hidratacao' && <HidratacaoView highContrast={highContrast} />}
            {currentView === 'sono' && <SonoView highContrast={highContrast} />}
            {currentView === 'movimentacao' && <MovimentacaoView highContrast={highContrast} />}
            {currentView === 'perfil' && <PerfilView highContrast={highContrast} onLogout={() => navigateTo('landing')} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className={`${highContrast ? 'bg-zinc-900 border-t border-white' : 'bg-white/80 backdrop-blur-xl border-t border-slate-200'} fixed bottom-0 left-0 right-0 p-3 pb-6 safe-area-bottom z-50`}>
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <NavButton active={currentView === 'dashboard'} onClick={() => navigateTo('dashboard')} icon={<Heart />} label="Início" highContrast={highContrast} />
          <NavButton active={currentView === 'unidades'} onClick={() => navigateTo('unidades')} icon={<MapPin />} label="Unidades" highContrast={highContrast} />
          
          <div className="-translate-y-8 flex flex-col items-center gap-1">
            <button 
              onClick={() => navigateTo('search')}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl ${currentView === 'search' ? (highContrast ? 'bg-zinc-700' : 'bg-blue-800') : (highContrast ? 'bg-white text-black' : 'bg-[#0057B7]')} hover:scale-105 transition-transform`}
            >
              <Search className="w-8 h-8" />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-tight ${currentView === 'search' ? (highContrast ? 'text-white' : 'text-[#0057B7]') : 'opacity-40'}`}>Busca</span>
          </div>

          <NavButton active={currentView === 'exames'} onClick={() => navigateTo('exames')} icon={<FileText />} label="Histórico" highContrast={highContrast} />
          <NavButton active={currentView === 'perfil'} onClick={() => navigateTo('perfil')} icon={<User />} label="Perfil" highContrast={highContrast} />
        </div>
      </nav>
      )}

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MenuDrawer 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={navigateTo} 
            highContrast={highContrast} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Views ---

function DashboardView({ onNavigate, highContrast }: { onNavigate: (v: View) => void, highContrast: boolean }) {
  const actions: HealthAction[] = [
    { id: 'consultas', title: 'Consultas', icon: <Calendar className="w-8 h-8" />, color: 'bg-blue-600', count: 2 },
    { id: 'vacinas', title: 'Vacinas', icon: <Syringe className="w-8 h-8" />, color: 'bg-green-600', count: 1 },
    { id: 'exames', title: 'Exames', icon: <FileText className="w-8 h-8" />, color: 'bg-purple-600' },
    { id: 'remedios', title: 'Remédios', icon: <Pill className="w-8 h-8" />, color: 'bg-orange-600' },
  ];

  return (
    <>
      {/* User Welcome Card */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <div className={`p-6 rounded-3xl ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#0057B7] font-bold text-2xl border-4 border-white shadow-sm overflow-hidden cursor-pointer"
            >
              <img 
                src="https://picsum.photos/seed/user1/200/200" 
                alt="Perfil" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold leading-tight"
              >
                Olá, Ana Beatriz
              </motion.h1>
              <div className="flex items-center gap-1 opacity-70 text-sm mt-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('perfil')} 
            className={`px-4 py-2 rounded-2xl text-sm font-semibold ${highContrast ? 'bg-white text-black' : 'bg-blue-50 text-blue-700'} hover:bg-blue-100 transition-colors shadow-sm`}
          >
            Ver Perfil
          </motion.button>
        </div>
      </motion.section>

      {/* Digital SUS Card */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-3 px-2">Cartão Digital</h2>
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          whileHover={{ scale: 1.02, rotateY: 5 }}
          className={`relative overflow-hidden rounded-[2.5rem] p-8 ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-gradient-to-br from-[#0057B7] to-[#00A5CF]'} text-white shadow-2xl cursor-pointer perspective-1000`}
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Heart className="w-10 h-10 fill-white" />
              </motion.div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Logo_do_SUS.svg/1024px-Logo_do_SUS.svg.png" alt="SUS" className="h-8 brightness-0 invert opacity-80" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-70 block mb-1">Nome Completo</label>
                <p className="text-2xl font-bold tracking-tight">ANA BEATRIZ OLIVEIRA</p>
              </div>
              <div className="flex gap-10">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-70 block mb-1">CNS</label>
                  <p className="text-lg font-mono font-medium tracking-wider">700 1234 5678 9012</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-70 block mb-1">Nascimento</label>
                  <p className="text-lg font-mono font-medium tracking-wider">18/04/1998</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold opacity-60">
              <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Válido em todo território nacional</span>
              <motion.span 
                whileHover={{ x: 5 }}
                className="flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Gerar QR Code
              </motion.span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions Grid */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-3 px-2">Serviços</h2>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 gap-4"
        >
          {actions.map((action) => (
            <motion.button
              key={action.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(action.id)}
              className={`p-6 rounded-[2.5rem] flex flex-col items-start gap-4 transition-all ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm'}`}
            >
              <div className={`p-4 rounded-2xl ${highContrast ? 'bg-white text-black' : `${action.color} text-white`} shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-lg">{action.title}</span>
                {action.count && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${highContrast ? 'bg-white text-black' : 'bg-red-100 text-red-600'}`}
                  >
                    {action.count}
                  </motion.span>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Tips */}
      <section className="mb-0">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-4 px-2 tracking-tighter">Rotina & Hidratação</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <TipCard 
            icon={<Droplets className="text-blue-500" />} 
            title="Hidratação 2:1" 
            desc="Tente alternar 2 copos de água para cada 1 de café ou suco para manter o corpo equilibrado." 
            highContrast={highContrast}
            onClick={() => onNavigate('hidratacao')}
          />
          <TipCard 
            icon={<Clock className="text-orange-500" />} 
            title="Rotina de Sono" 
            desc="Desligue telas 30 min antes de dormir. O sono profundo regenera o sistema imunológico." 
            highContrast={highContrast}
            onClick={() => onNavigate('sono')}
          />
          <TipCard 
            icon={<Zap className="text-yellow-500" />} 
            title="Sua Movimentação" 
            desc="Caminhadas de 10 min após as refeições reduzem picos de glicose drasticamente." 
            highContrast={highContrast}
            onClick={() => onNavigate('movimentacao')}
          />
        </div>
      </section>
    </>
  );
}

function ConsultasView({ highContrast }: { highContrast: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas Consultas</h1>
        <button className={`p-3 rounded-2xl ${highContrast ? 'bg-white text-black' : 'bg-[#0057B7] text-white'} shadow-lg`}>
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="space-y-4"
      >
        <SectionTitle label="Próximas Agendadas" />
        <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
          <InfoCard 
            icon={<Calendar className="text-blue-600" />}
            title="Clínico Geral"
            subtitle="Dr. Marcos Silva"
            date="25 Out, 14:00"
            location="UBS Vila Maria - Guichê 04"
            tag="Pendente"
            tagColor="bg-blue-100 text-blue-700"
            highContrast={highContrast}
          />
        </motion.div>
        <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
          <InfoCard 
            icon={<Calendar className="text-blue-600" />}
            title="Odontologia"
            subtitle="Dra. Helena Costa"
            date="12 Nov, 09:30"
            location="UBS Vila Maria - Sala 02"
            tag="Confirmado"
            tagColor="bg-green-100 text-green-700"
            highContrast={highContrast}
          />
        </motion.div>

        <SectionTitle label="Histórico de Consultas" />
        <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
          <InfoCard 
            icon={<Calendar className="text-slate-400" />}
            title="Ginecologia"
            subtitle="Dra. Aline Souza"
            date="15 Ago, 10:00"
            location="Centro de Saúde da Mulher"
            tag="Realizada"
            tagColor="bg-slate-100 text-slate-600"
            highContrast={highContrast}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function VacinasView({ highContrast }: { highContrast: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carteira de Vacinação</h1>
        <Download className="w-6 h-6 opacity-40" />
      </div>

      <div className={`p-6 rounded-[2rem] ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-green-600 text-white'} flex items-center justify-between shadow-xl`}>
        <div className="flex items-center gap-4">
          <Syringe className="w-10 h-10" />
          <div>
            <h3 className="font-bold text-lg">Esquema em Dia</h3>
            <p className="text-xs opacity-70">Última dose: Influenza (12 Ago)</p>
          </div>
        </div>
        <Plus className="w-6 h-6" />
      </div>

      <div className="space-y-4">
        <SectionTitle label="Doses Aplicadas" />
        <ListItem 
          title="COVID-19 (Pfizer)" 
          desc="4ª Dose Aplicada" 
          date="20 Jan 2024" 
          icon={<Syringe className="text-green-500" />}
          highContrast={highContrast}
        />
        <ListItem 
          title="Influenza" 
          desc="Dose Anual 2024" 
          date="12 Ago 2024" 
          icon={<Syringe className="text-green-500" />}
          highContrast={highContrast}
        />
        <ListItem 
          title="Febe Amarela" 
          desc="Dose Única" 
          date="05 Set 2018" 
          icon={<Syringe className="text-green-500" />}
          highContrast={highContrast}
        />

        <SectionTitle label="Próximas Doses" />
        <div className={`p-5 rounded-3xl ${highContrast ? 'bg-zinc-800 border border-white' : 'bg-orange-50 border border-orange-100'} flex items-center gap-4`}>
          <Clock className="w-6 h-6 text-orange-500" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-orange-900">DT (Dupla Adulta)</h4>
            <p className="text-xs text-orange-700">Previsão: Dezembro 2024</p>
          </div>
          <Info className="w-5 h-5 text-orange-400" />
        </div>
      </div>
    </div>
  );
}

function ExamesView({ highContrast }: { highContrast: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Exames</h1>
        <Search className="w-6 h-6 opacity-40" />
      </div>

      <div className="space-y-4 text-sm">
        <SectionTitle label="Resultados Recentes" />
        <InfoCard 
          icon={<FileText className="text-purple-600" />}
          title="Hemograma Completo"
          subtitle="Solicitado por Dr. Marcos"
          date="05 Ago, 2024"
          location="Lab Central Municipal"
          tag="Disponível"
          tagColor="bg-green-100 text-green-700"
          actionIcon={<Download className="w-5 h-5" />}
          highContrast={highContrast}
        />
        <InfoCard 
          icon={<FileText className="text-purple-600" />}
          title="Ultrassonografia Abdominal"
          subtitle="Solicitado por Dra. Aline"
          date="10 Ago, 2024"
          location="Centro de Imagem SP"
          tag="Em Análise"
          tagColor="bg-orange-100 text-orange-700"
          highContrast={highContrast}
        />
      </div>
    </div>
  );
}

function RemediosView({ highContrast }: { highContrast: boolean }) {
  const [activeTab, setActiveTab] = useState<'meus' | 'mapa'>('meus');

  const nearbyPharmacies = [
    { name: 'Farmácia do Povo', dist: '300m', address: 'Av. Paulista, 1200', open: true },
    { name: 'Drogaria SUS São Paulo', dist: '800m', address: 'Rua Augusta, 450', open: true },
    { name: 'Farma Rede Popular', dist: '1.2km', address: 'Al. Santos, 10', open: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicamentos</h1>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('meus')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'meus' ? (highContrast ? 'bg-white text-black' : 'bg-white shadow-sm text-blue-600') : 'opacity-40'}`}
          >
            Meus Remédios
          </button>
          <button 
            onClick={() => setActiveTab('mapa')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'mapa' ? (highContrast ? 'bg-white text-black' : 'bg-white shadow-sm text-blue-600') : 'opacity-40'}`}
          >
            Farmácias
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'meus' ? (
          <motion.div
            key="meus"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div>
              <SectionTitle label="Uso Contínuo" />
              <div className="space-y-3 mt-3">
                <ListItem 
                  title="Lisinopril 10mg" 
                  desc="1 comprimido às 08:00" 
                  date="Receita vence em 30 dias" 
                  color="text-orange-600"
                  icon={<Clock className="text-blue-500" />}
                  highContrast={highContrast}
                />
                <ListItem 
                  title="Metformina 500mg" 
                  desc="2 comprimidos após o jantar" 
                  date="Receita vence em 45 dias" 
                  icon={<Clock className="text-blue-500" />}
                  highContrast={highContrast}
                />
              </div>
            </div>

            <div className={`p-6 rounded-[2rem] ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-[#0057B7] text-white'} shadow-lg`}>
              <div className="flex gap-4 items-start">
                <Info className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Farmácia Popular</h3>
                  <p className="text-sm opacity-80 mt-1">Seus medicamentos de uso contínuo podem ser retirados gratuitamente nas farmácias parceiras.</p>
                  <button 
                    onClick={() => setActiveTab('mapa')}
                    className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest py-3 px-6 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Encontrar Farmácia <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mapa"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Mock Map Area */}
            <div className={`relative h-64 rounded-[2.5rem] overflow-hidden shadow-inner ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-slate-200'}`}>
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover opacity-50 grayscale" 
                alt="Mapa"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* User location dot */}
                 <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-ping absolute"></div>
                 <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10"></div>
                 
                 {/* Pharmacy pins */}
                 <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-20 left-40 flex flex-col items-center">
                    <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"><Pill className="w-4 h-4" /></div>
                    <div className="w-1 h-2 bg-red-600"></div>
                 </motion.div>

                 <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute bottom-20 right-30 flex flex-col items-center">
                    <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"><Pill className="w-4 h-4" /></div>
                    <div className="w-1 h-2 bg-red-600"></div>
                 </motion.div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 shadow-lg text-slate-900">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600"><MapPin className="w-5 h-5" /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase opacity-50">Localização Atual</p>
                  <p className="text-xs font-bold truncate">Av. Paulista, São Paulo - SP</p>
                </div>
                <Search className="w-4 h-4 opacity-40" />
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle label="Farmácias de Plantão Próximas" />
              <div className="space-y-3">
                {nearbyPharmacies.map((farma, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm border border-transparent hover:border-blue-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${highContrast ? 'bg-white text-black' : 'bg-orange-50 text-orange-600'}`}>
                      <Pill className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{farma.name}</h4>
                        <span className="text-[10px] font-bold opacity-40">{farma.dist}</span>
                      </div>
                      <p className="text-xs opacity-50">{farma.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${farma.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-[10px] font-bold ${farma.open ? 'text-green-600' : 'text-red-600'}`}>
                          {farma.open ? 'ABERTO' : 'FECHADO'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-20" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnidadesView({ highContrast }: { highContrast: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Unidades de Saúde</h1>
        <p className="text-sm opacity-60">Próximas a São Paulo, SP</p>
      </div>

      <div className={`flex items-center gap-3 p-4 rounded-2xl ${highContrast ? 'bg-zinc-800 border border-white' : 'bg-slate-100'}`}>
        <Search className="w-5 h-5 opacity-40" />
        <input type="text" placeholder="Buscar por bairro ou nome..." className="bg-transparent border-none outline-none text-sm w-full" />
        <Filter className="w-5 h-5 opacity-40" />
      </div>

      <div className="space-y-4">
        <InfoCard 
          icon={<MapPin className="text-[#0057B7]" />}
          title="UBS Vila Maria"
          subtitle="Distância: 1.2 km"
          date="Aberto até 19:00"
          location="Rua das Macieiras, 145"
          tag="Atendimento Normal"
          tagColor="bg-green-100 text-green-700"
          actionIcon={<Phone className="w-5 h-5" />}
          highContrast={highContrast}
        />
        <InfoCard 
          icon={<MapPin className="text-[#0057B7]" />}
          title="Hospital Municipal Tatuapé"
          subtitle="Distância: 3.5 km"
          date="Aberto 24h"
          location="Av. Celso Garcia, 4815"
          tag="Urgência Médica"
          tagColor="bg-red-100 text-red-700"
          actionIcon={<Phone className="w-5 h-5" />}
          highContrast={highContrast}
        />
      </div>

      <div className={`h-48 rounded-[2rem] overflow-hidden relative shadow-lg ${highContrast ? 'border-2 border-white' : ''}`}>
        <img 
          src="https://images.unsplash.com/photo-1524666041070-9d87656c25bb?w=800&auto=format&fit=crop&q=60" 
          alt="Mapa" 
          className="w-full h-full object-cover grayscale opacity-30" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[#0057B7]/10">
          <div className="bg-white p-3 rounded-full shadow-2xl animate-bounce">
            <MapPin className="w-8 h-8 text-[#0057B7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfilView({ highContrast, onLogout }: { highContrast: boolean, onLogout: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <img src="https://picsum.photos/seed/user1/400/400" alt="Ana Beatriz" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <button className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg ${highContrast ? 'bg-white text-black' : 'bg-[#0057B7] text-white'}`}>
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold leading-tight">Ana Beatriz Oliveira</h2>
          <p className="text-sm opacity-60">ana.beatriz.98@email.com</p>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle label="Minhas Informações" />
        <ProfileItem label="CPF" value="123.***.***-45" highContrast={highContrast} />
        <ProfileItem label="Tipo Sanguíneo" value="O+ (Positivo)" highContrast={highContrast} />
        <ProfileItem label="Alergias" value="Penicilina" highContrast={highContrast} />
        <ProfileItem label="Telefone" value="(11) 98765-4321" highContrast={highContrast} />
      </div>

      <div className={`p-6 rounded-[2rem] ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-white shadow-sm border border-slate-100'}`}>
        <h3 className="font-bold mb-4 opacity-50 text-[10px] uppercase tracking-widest">Segurança</h3>
        <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
          <span className="font-semibold">Alterar Senha</span>
          <ChevronRight className="w-5 h-5 opacity-30" />
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-red-500"
        >
          <span className="font-bold">Sair da Conta</span>
          <X className="w-5 h-5 opacity-30" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function NavButton({ active, onClick, icon, label, highContrast }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, highContrast: boolean }) {
  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center gap-1 p-2 transition-all relative ${active ? (highContrast ? 'text-white' : 'text-[#0057B7]') : 'opacity-40'}`}
    >
      <motion.div 
        initial={false}
        animate={active ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
        className={`p-1 rounded-xl transition-colors ${active && !highContrast ? 'bg-blue-100/50' : ''}`}
      >
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </motion.div>
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 w-1 h-1 bg-current rounded-full"
        />
      )}
    </motion.button>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <h2 className="text-[10px] uppercase tracking-widest font-bold opacity-50 px-2 mt-4">{label}</h2>;
}

function TipCard({ icon, title, desc, highContrast, onClick }: { icon: React.ReactNode, title: string, desc: string, highContrast: boolean, onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className={`flex-shrink-0 w-64 p-6 rounded-[2.5rem] flex flex-col items-start gap-3 transition-colors cursor-pointer ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm border border-slate-100'}`}
    >
       <div className={`p-3 rounded-2xl ${highContrast ? 'bg-white' : 'bg-slate-50 shadow-inner'}`}>
         {icon}
       </div>
       <div>
         <h3 className="font-bold text-lg mb-1 leading-tight">{title}</h3>
         <p className="text-xs opacity-60 leading-relaxed">{desc}</p>
       </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, subtitle, date, location, tag, tagColor, actionIcon, highContrast }: { icon: React.ReactNode, title: string, subtitle: string, date: string, location: string, tag: string, tagColor: string, actionIcon?: React.ReactNode, highContrast: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 rounded-[2rem] flex items-center gap-4 transition-all cursor-pointer ${highContrast ? 'bg-zinc-900 border border-white' : 'bg-white shadow-sm border border-slate-100 hover:border-blue-200'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${highContrast ? 'bg-white text-black' : 'bg-slate-50'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base leading-tight truncate">{title}</h3>
        <p className="text-xs opacity-60 mt-0.5 truncate">{subtitle}</p>
        <div className="flex items-center gap-3 text-[10px] font-medium opacity-40 mt-1.5 uppercase tracking-wide">
          <span>{date}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="truncate">{location}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${highContrast ? 'bg-white text-black' : tagColor}`}>
          {tag}
        </span>
        {actionIcon && <div className="opacity-40">{actionIcon}</div>}
      </div>
    </motion.div>
  );
}

function ListItem({ title, desc, date, icon, highContrast, color }: { title: string, desc: string, date: string, icon: React.ReactNode, highContrast: boolean, color?: string, key?: React.Key }) {
  return (
    <div className={`p-5 rounded-3xl flex items-center gap-4 ${highContrast ? 'bg-zinc-900 border border-white' : 'bg-white shadow-sm'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${highContrast ? 'bg-white text-black' : 'bg-slate-50'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-bold text-sm ${color || ''}`}>{title}</h4>
        <p className="text-xs opacity-60">{desc}</p>
      </div>
      <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{date}</div>
    </div>
  );
}

function NotificacoesView({ highContrast, onNavigate }: { highContrast: boolean, onNavigate: (view: View) => void }) {
  const notifications = [
    { id: 1, type: 'atrasada', title: 'Check-up Odonto', desc: 'Sua limpeza semestral está atrasada há 15 dias.', date: 'Atrasado', icon: <Calendar className="text-red-500" />, target: 'consultas' as View },
    { id: 2, type: 'proxima', title: 'Vacina Influenza', desc: 'Dose única disponível na UBS Vila Maria.', date: 'Amanhã, 08:00', icon: <Syringe className="text-blue-500" />, target: 'vacinas' as View },
    { id: 3, type: 'proxima', title: 'Clínico Geral', desc: 'Agendamento com Dr. Marcos Silva.', date: '25 Out, 14:00', icon: <Clock className="text-blue-500" />, target: 'consultas' as View },
    { id: 4, type: 'feita', title: 'Hemograma Completo', desc: 'Resultado já disponível para visualização.', date: 'Ontem', icon: <FileText className="text-green-500" />, target: 'exames' as View },
    { id: 5, type: 'feita', title: 'Vacina COVID-19', desc: '4ª dose aplicada com sucesso.', date: '12 Set', icon: <CheckCircle className="text-slate-400" />, target: 'vacinas' as View },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Central de Avisos</h1>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${highContrast ? 'bg-white text-black' : 'bg-red-100 text-red-600'}`}>
          3 Pendentes
        </div>
      </div>

      <div className="space-y-4">
        {['atrasada', 'proxima', 'feita'].map((type) => {
          const filtered = notifications.filter(n => n.type === type);
          if (filtered.length === 0) return null;

          return (
            <div key={type} className="space-y-3">
              <h2 className="text-[10px] uppercase font-bold opacity-40 tracking-widest px-2">
                {type === 'atrasada' ? 'Atenção / Atuando' : type === 'proxima' ? 'Próximos Compromissos' : 'Histórico Recente'}
              </h2>
              <div className="space-y-2">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => onNavigate(item.target as View)}
                    className={`p-4 rounded-3xl flex items-center gap-4 transition-all cursor-pointer ${
                      highContrast ? 'bg-zinc-900 border border-white' : 
                      item.type === 'atrasada' ? 'bg-red-50 border border-red-100' : 'bg-white shadow-sm border border-slate-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highContrast ? 'bg-white text-black' : 'bg-slate-50'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold ${item.type === 'atrasada' ? 'text-red-700' : ''}`}>{item.title}</h3>
                        <span className={`text-[10px] font-bold ${item.type === 'atrasada' ? 'text-red-600' : 'opacity-40'}`}>{item.date}</span>
                      </div>
                      <p className="text-xs opacity-60 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-[2.5rem] bg-slate-100/50 border-2 border-dashed border-slate-200 text-center">
        <p className="text-xs font-medium opacity-50 italic">Suas notificações são atualizadas automaticamente com base na sua rede de atendimento.</p>
      </div>
    </div>
  );
}

function ProfileItem({ label, value, highContrast }: { label: string, value: string, highContrast: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all ${highContrast ? 'bg-zinc-800 border border-white' : 'bg-white shadow-sm border border-transparent hover:border-blue-100'}`}
    >
      <span className="text-xs opacity-50 font-bold uppercase tracking-widest">{label}</span>
      <span className="font-bold text-base">{value}</span>
    </motion.div>
  );
}

function MenuDrawer({ onClose, onNavigate, highContrast }: { onClose: () => void, onNavigate: (view: View) => void, highContrast: boolean }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
      />
      <motion.div 
        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 bottom-0 w-80 z-[70] p-6 shadow-2xl flex flex-col ${highContrast ? 'bg-zinc-900 text-white' : 'bg-white'}`}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-600 text-white">
                <Heart className="w-6 h-6" />
             </div>
             <span className="font-bold text-xl uppercase tracking-tighter">Saúde +</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <MenuLink icon={<Heart />} label="Início" onClick={() => onNavigate('dashboard')} highContrast={highContrast} />
          <MenuLink icon={<User />} label="Meu Perfil" onClick={() => onNavigate('perfil')} highContrast={highContrast} />
          
          <div className="h-4" />
          <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest px-3 mb-2">Serviços</p>
          <MenuLink icon={<Calendar />} label="Consultas" onClick={() => onNavigate('consultas')} highContrast={highContrast} />
          <MenuLink icon={<Syringe />} label="Vacinas" onClick={() => onNavigate('vacinas')} highContrast={highContrast} />
          <MenuLink icon={<FileText />} label="Exames" onClick={() => onNavigate('exames')} highContrast={highContrast} />
          <MenuLink icon={<Pill />} label="Remédios" onClick={() => onNavigate('remedios')} highContrast={highContrast} />
          
          <div className="h-4" />
          <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest px-3 mb-2">Geral</p>
          <MenuLink icon={<MapPin />} label="Unidades" onClick={() => onNavigate('unidades')} highContrast={highContrast} />
          <MenuLink icon={<Accessibility />} label="Acessibilidade" onClick={() => onNavigate('perfil')} highContrast={highContrast} />
        </div>

        <div className={`mt-6 p-4 rounded-3xl text-center text-xs font-bold uppercase tracking-widest ${highContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-400'}`}>
          Versão 3.0.0
        </div>
      </motion.div>
    </>
  );
}

function LandingView({ onComplete, highContrast }: { onComplete: () => void, highContrast: boolean }) {
  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-b from-[#0057B7] to-[#00A5CF] text-white'}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12"
      >
        <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
          <Heart className="w-16 h-16 fill-white drop-shadow-lg" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 border-4 border-white/30 rounded-[2.5rem]" 
          />
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black uppercase tracking-tighter mb-2"
        >
          Bem-vindo ao <br />
          Saúde + <span className="opacity-70 font-light">Digital</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm font-medium tracking-widest uppercase"
        >
          O SUS na Palma da sua Mão
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs space-y-4"
      >
        <button 
          onClick={onComplete}
          className={`w-full py-5 rounded-3xl font-bold text-lg shadow-xl transition-all active:scale-95 ${highContrast ? 'bg-white text-black' : 'bg-white text-[#0057B7] hover:bg-white/90'}`}
        >
          Começar Agora
        </button>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">
          Versão 3.0.0 • Ministério da Saúde
        </p>
      </motion.div>
      
      <div className="mt-20 flex gap-4 opacity-30">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Logo_do_SUS.svg/1024px-Logo_do_SUS.svg.png" className="h-6 brightness-0 invert" alt="SUS" />
        <div className="w-px h-6 bg-white" />
        <span className="text-xs font-bold self-center">Brasil</span>
      </div>
    </div>
  );
}

function MenuLink({ icon, label, onClick, highContrast }: { icon: React.ReactNode, label: string, onClick: () => void, highContrast: boolean }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors font-bold text-base group ${highContrast ? 'hover:bg-white hover:text-black' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-700'}`}>
      <span className="opacity-50 group-hover:opacity-100 transition-opacity">
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </span>
      {label}
    </button>
  );
}

function SearchView({ highContrast, onNavigate }: { highContrast: boolean, onNavigate: (view: View) => void }) {
  const [query, setQuery] = useState('');
  
  const suggestions = [
    { title: 'Agendar Consulta', category: 'Serviços', icon: <Calendar />, target: 'consultas' as View },
    { title: 'Resultado de Exames', category: 'Saúde', icon: <FileText />, target: 'exames' as View },
    { title: 'Minhas Vacinas', category: 'Prevenção', icon: <Syringe />, target: 'vacinas' as View },
    { title: 'Farmácia Popular', category: 'Medicamentos', icon: <Pill />, target: 'remedios' as View },
    { title: 'UBS mais próxima', category: 'Localização', icon: <MapPin />, target: 'unidades' as View },
  ];

  const filtered = suggestions.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 min-h-[60vh]">
      <div className="space-y-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter">O que você procura?</h1>
        <div className={`relative flex items-center p-4 rounded-3xl transition-all border-2 ${highContrast ? 'bg-zinc-900 border-white focus-within:bg-zinc-800' : 'bg-white border-transparent shadow-sm focus-within:shadow-xl focus-within:border-blue-500'}`}>
          <Search className={`w-6 h-6 mr-3 ${highContrast ? 'text-white' : 'text-blue-600'}`} />
          <input 
            autoFocus
            type="text" 
            placeholder="Ex: Consultas, Vacinas, Remédios..."
            className="bg-transparent border-none outline-none w-full font-bold text-lg placeholder:opacity-30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 opacity-40" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-40 px-2 italic">
          {query ? 'Resultados da busca' : 'Sugestões para você'}
        </h2>
        
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onNavigate(item.target)}
                className={`w-full p-6 rounded-[2rem] flex items-center justify-between group transition-all ${highContrast ? 'hover:bg-white hover:text-black border border-white/20' : 'bg-white hover:bg-blue-50 shadow-sm border border-transparent hover:border-blue-200'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${highContrast ? 'bg-zinc-800 text-white group-hover:bg-black group-hover:text-white' : 'bg-slate-50 text-blue-600 group-hover:bg-white'}`}>
                    {React.cloneElement(item.icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest leading-none mb-1">{item.category}</p>
                    <h3 className="font-bold text-lg leading-none">{item.title}</h3>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))
          ) : (
            <div className="py-20 text-center opacity-40">
              <p className="font-bold">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-sm">Tente termos mais genéricos como "médico" ou "exame"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HidratacaoView({ highContrast }: { highContrast: boolean }) {
  const activities = [
    { title: 'Água Cristalina', amount: '500ml', time: '10:30', icon: <Droplets className="text-blue-500" /> },
    { title: 'Garrafa Academia', amount: '750ml', time: '08:15', icon: <Droplets className="text-blue-400" /> },
    { title: 'Copo Café da Manhã', amount: '250ml', time: '07:30', icon: <Droplets className="text-blue-300" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Hidratação</h1>
        <Plus className="w-6 h-6 opacity-40" />
      </div>

      <div className={`p-8 rounded-[2.5rem] text-center ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-blue-50 text-blue-900'}`}>
        <div className="relative inline-block mb-4">
           <Droplets className="w-16 h-16 text-blue-600" />
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute inset-0 bg-blue-200 rounded-full -z-10 blur-xl"
           />
        </div>
        <h2 className="text-4xl font-black">1.5 <span className="text-xl opacity-50">/ 2.5L</span></h2>
        <p className="text-xs uppercase font-bold tracking-widest mt-2 opacity-60">Consumo de Hoje</p>
        
        <div className="mt-8 h-2 bg-blue-200 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '60%' }}
             className="h-full bg-blue-600"
           />
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle label="Últimos Registros" />
        <div className="space-y-3">
          {activities.map((item, idx) => (
            <ListItem 
              key={idx}
              title={item.title}
              desc={item.amount}
              date={item.time}
              icon={item.icon}
              highContrast={highContrast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SonoView({ highContrast }: { highContrast: boolean }) {
  const history = [
    { title: 'Sono Profundo', duration: '7h 15m', quality: 'Excelente', date: 'Hoje', icon: <Moon className="text-indigo-500" /> },
    { title: 'Noite Agitada', duration: '5h 40m', quality: 'Regular', date: 'Ontem', icon: <Moon className="text-indigo-400" /> },
    { title: 'Sono Restaurador', duration: '8h 05m', quality: 'Ótimo', date: '11 Mai', icon: <Moon className="text-indigo-300" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Rotina de Sono</h1>
        <Sun className="w-6 h-6 opacity-40 text-orange-400" />
      </div>

      <div className={`p-8 rounded-[2.5rem] flex items-center justify-between ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-indigo-900 text-white shadow-2xl'}`}>
        <div>
          <h2 className="text-4xl font-black leading-none">07<span className="text-xl opacity-50 font-light">h</span> 15<span className="text-xl opacity-50 font-light">m</span></h2>
          <p className="text-xs uppercase font-bold tracking-widest mt-2 opacity-60">Média desta semana</p>
        </div>
        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
           <Moon className="w-10 h-10 text-indigo-200" />
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle label="Histórico Recente" />
        <div className="space-y-3">
          {history.map((item, idx) => (
            <ListItem 
              key={idx}
              title={item.title}
              desc={item.quality}
              date={item.duration}
              icon={item.icon}
              highContrast={highContrast}
              color={item.quality === 'Excelente' ? 'text-green-500' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovimentacaoView({ highContrast }: { highContrast: boolean }) {
  const activities = [
    { title: 'Caminhada Tarde', steps: '4.200 passos', time: '17:30', icon: <Zap className="text-yellow-500" /> },
    { title: 'Ida ao Mercado', steps: '1.500 passos', time: '11:00', icon: <Zap className="text-yellow-400" /> },
    { title: 'Rotina Manhã', steps: '2.100 passos', time: '07:45', icon: <Zap className="text-yellow-300" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Movimentação</h1>
        <Settings className="w-6 h-6 opacity-40" />
      </div>

      <div className={`p-8 rounded-[2.5rem] text-center ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-yellow-50 text-yellow-900 border border-yellow-100'}`}>
        <div className="flex justify-around items-end gap-2 px-4 mb-4">
          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
            <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               className={`w-3 rounded-full ${i === 3 ? 'bg-yellow-500 shadow-lg shadow-yellow-200' : 'bg-yellow-200'}`}
               style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <h2 className="text-4xl font-black">7.800 <span className="text-xl opacity-50">/ 10k</span></h2>
        <p className="text-xs uppercase font-bold tracking-widest mt-2 opacity-60">Passos Hoje</p>
      </div>

      <div className="space-y-4">
        <SectionTitle label="Atividades Realizadas" />
        <div className="space-y-3">
          {activities.map((item, idx) => (
            <ListItem 
              key={idx}
              title={item.title}
              desc={item.steps}
              date={item.time}
              icon={item.icon}
              highContrast={highContrast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Moon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
