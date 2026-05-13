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
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'dashboard' | 'consultas' | 'vacinas' | 'exames' | 'remedios' | 'unidades' | 'perfil';

interface HealthAction {
  id: View;
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
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  return (
    <div 
      className={`min-h-screen font-sans transition-all duration-300 ${highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}
      style={mainStyles}
    >
      {/* Top Bar */}
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
            <button onClick={() => setHighContrast(!highContrast)} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Alto Contraste">
              <Eye className="w-5 h-5" />
            </button>
            <button onClick={toggleFontSize} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Tamanho da Fonte">
              <Type className="w-5 h-5" />
            </button>
            <div className="relative p-2">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-[#0057B7]">3</span>
            </div>
          </div>
        </div>
      </header>

      {/* View Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'dashboard' && <DashboardView onNavigate={navigateTo} highContrast={highContrast} />}
            {currentView === 'consultas' && <ConsultasView highContrast={highContrast} />}
            {currentView === 'vacinas' && <VacinasView highContrast={highContrast} />}
            {currentView === 'exames' && <ExamesView highContrast={highContrast} />}
            {currentView === 'remedios' && <RemediosView highContrast={highContrast} />}
            {currentView === 'unidades' && <UnidadesView highContrast={highContrast} />}
            {currentView === 'perfil' && <PerfilView highContrast={highContrast} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className={`${highContrast ? 'bg-zinc-900 border-t border-white' : 'bg-white/80 backdrop-blur-xl border-t border-slate-200'} fixed bottom-0 left-0 right-0 p-3 pb-6 safe-area-bottom z-50`}>
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <NavButton active={currentView === 'dashboard'} onClick={() => navigateTo('dashboard')} icon={<Heart />} label="Início" highContrast={highContrast} />
          <NavButton active={currentView === 'unidades'} onClick={() => navigateTo('unidades')} icon={<MapPin />} label="Unidades" highContrast={highContrast} />
          
          <div className="-translate-y-8 flex flex-col items-center gap-1">
            <button className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl ${highContrast ? 'bg-white text-black' : 'bg-[#0057B7]'} hover:scale-105 transition-transform`}>
              <Plus className="w-8 h-8" />
            </button>
          </div>

          <NavButton active={currentView === 'exames'} onClick={() => navigateTo('exames')} icon={<FileText />} label="Histórico" highContrast={highContrast} />
          <NavButton active={currentView === 'perfil'} onClick={() => navigateTo('perfil')} icon={<User />} label="Perfil" highContrast={highContrast} />
        </div>
      </nav>

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
      <section className="mb-6">
        <div className={`p-6 rounded-3xl ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#0057B7] font-bold text-2xl border-4 border-white shadow-sm overflow-hidden">
              <img 
                src="https://picsum.photos/seed/user1/200/200" 
                alt="Perfil" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Olá, Ana Beatriz</h1>
              <div className="flex items-center gap-1 opacity-70 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('perfil')} className={`px-4 py-2 rounded-2xl text-sm font-semibold ${highContrast ? 'bg-white text-black' : 'bg-blue-50 text-blue-700'} hover:opacity-80 transition-opacity`}>
            Ver Perfil
          </button>
        </div>
      </section>

      {/* Digital SUS Card */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-3 px-2">Cartão Digital</h2>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className={`relative overflow-hidden rounded-[2.5rem] p-8 ${highContrast ? 'bg-zinc-900 border-2 border-white' : 'bg-gradient-to-br from-[#0057B7] to-[#00A5CF]'} text-white shadow-2xl`}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <Heart className="w-10 h-10 fill-white" />
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
                  <p className="text-lg font-mono font-medium">700 1234 5678 9012</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-70 block mb-1">Nascimento</label>
                  <p className="text-lg font-mono font-medium">18/04/1998</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold opacity-60">
              <span>Válido em todo território nacional</span>
              <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Gerar QR Code</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions Grid */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-3 px-2">Serviços</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(action.id)}
              className={`p-6 rounded-[2.5rem] flex flex-col items-start gap-4 transition-all ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm hover:shadow-md'}`}
            >
              <div className={`p-4 rounded-2xl ${highContrast ? 'bg-white text-black' : `${action.color} text-white`} shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-lg">{action.title}</span>
                {action.count && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${highContrast ? 'bg-white text-black' : 'bg-red-100 text-red-600'}`}>
                    {action.count}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-0">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-4 px-2">Dicas de Saúde</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <TipCard 
            icon={<Heart className="text-red-500" />} 
            title="Hidratação" 
            desc="Beber 2L de água por dia ajuda na renovação celular e imunidade." 
            highContrast={highContrast}
          />
          <TipCard 
            icon={<Calendar className="text-blue-500" />} 
            title="Rotina" 
            desc="Agende seu check-up semestral para prevenir doenças crônicas." 
            highContrast={highContrast}
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

      <div className="space-y-4">
        <SectionTitle label="Próximas Agendadas" />
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

        <SectionTitle label="Histórico de Consultas" />
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
      </div>
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicamentos</h1>
        <Plus className="w-6 h-6 opacity-40" />
      </div>

      <div className="space-y-6">
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
              <button className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest py-3 px-6 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                Encontrar Farmácia <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
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

function PerfilView({ highContrast }: { highContrast: boolean }) {
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
        <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-red-500">
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
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-all ${active ? (highContrast ? 'text-white' : 'text-[#0057B7]') : 'opacity-40'}`}
    >
      <div className={`p-1 rounded-xl ${active && !highContrast ? 'bg-blue-100/50' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <h2 className="text-[10px] uppercase tracking-widest font-bold opacity-50 px-2 mt-4">{label}</h2>;
}

function TipCard({ icon, title, desc, highContrast }: { icon: React.ReactNode, title: string, desc: string, highContrast: boolean }) {
  return (
    <div className={`flex-shrink-0 w-64 p-6 rounded-[2.5rem] flex flex-col items-start gap-3 transition-colors ${highContrast ? 'bg-zinc-800 border-2 border-white' : 'bg-white shadow-sm border border-slate-100'}`}>
       <div className={`p-3 rounded-2xl ${highContrast ? 'bg-white' : 'bg-slate-50 shadow-inner'}`}>
         {icon}
       </div>
       <div>
         <h3 className="font-bold text-lg mb-1 leading-tight">{title}</h3>
         <p className="text-xs opacity-60 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function InfoCard({ icon, title, subtitle, date, location, tag, tagColor, actionIcon, highContrast }: { icon: React.ReactNode, title: string, subtitle: string, date: string, location: string, tag: string, tagColor: string, actionIcon?: React.ReactNode, highContrast: boolean }) {
  return (
    <div className={`p-5 rounded-[2rem] flex items-center gap-4 transition-colors ${highContrast ? 'bg-zinc-900 border border-white' : 'bg-white shadow-sm border border-slate-100'}`}>
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
    </div>
  );
}

function ListItem({ title, desc, date, icon, highContrast, color }: { title: string, desc: string, date: string, icon: React.ReactNode, highContrast: boolean, color?: string }) {
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

function ProfileItem({ label, value, highContrast }: { label: string, value: string, highContrast: boolean }) {
  return (
    <div className={`p-4 rounded-2xl flex justify-between items-center ${highContrast ? 'bg-zinc-800 border border-white' : 'bg-white shadow-sm'}`}>
      <span className="text-xs opacity-50 font-bold uppercase tracking-widest">{label}</span>
      <span className="font-bold text-base">{value}</span>
    </div>
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
