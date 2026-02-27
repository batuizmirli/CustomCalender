/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, X, ArrowRight, Calendar, Heart, Flag, Flashlight, Camera } from 'lucide-react';
import { CalendarPreview } from './CalendarPreview';

// --- Types ---

type Mode = 'year' | 'life';

interface Config {
  mode: Mode;
  width: number;
  height: number;
  fg: string;
  bg: string;
  year: number;
  birthday: string;
  lifeExp: number;
  showStats: boolean;
}

const DEFAULT_CONFIG: Config = {
  mode: 'year',
  width: 1290,
  height: 2796,
  fg: '#FFFFFF',
  bg: '#000000',
  year: new Date().getFullYear(),
  birthday: '2000-01-01',
  lifeExp: 80,
  showStats: false,
};

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '' 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'ghost'; 
  className?: string; 
}) => {
  const base = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Phone mockup - iPhone lock screen style
const PhonePreview = ({ 
  children,
  className = ''
}: { 
  width?: number; 
  height?: number; 
  children: ReactNode;
  className?: string;
}) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div 
      className={`relative bg-black rounded-[2rem] border-[3px] border-zinc-700/80 shadow-2xl overflow-hidden ${className}`}
      style={{ width: '100%', aspectRatio: '9 / 19.5' }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[6%] bg-black rounded-b-2xl z-30" />
      
      {/* Status bar */}
      <div className="absolute top-[1.5%] left-0 right-0 flex justify-between items-center px-[8%] text-[9px] text-white/70 font-medium z-20 pointer-events-none">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 rounded-sm border border-white/70 flex items-center px-[1px]">
            <div className="w-full h-1 rounded-sm bg-white/90" />
          </div>
        </div>
      </div>

      {/* Date + Time */}
      <div className="absolute top-[8%] left-0 right-0 text-center z-20 pointer-events-none">
        <div className="text-white/60 text-[8px] font-medium">{dateStr}</div>
        <div className="text-white text-xl font-semibold tracking-tight leading-tight">
          {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
      </div>

      {/* Calendar content area */}
      <div 
        className="absolute left-[5%] right-[5%] overflow-hidden"
        style={{ top: '22%', bottom: '14%' }}
      >
        {children}
      </div>

      {/* Flashlight + Camera */}
      <div className="absolute bottom-[6%] left-0 right-0 flex justify-between px-[15%] z-20 pointer-events-none">
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
          <Flashlight className="w-3 h-3 text-white/80" strokeWidth={1.5} />
        </div>
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
          <Camera className="w-3 h-3 text-white/80" strokeWidth={1.5} />
        </div>
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[35%] h-1 rounded-full bg-white/30 z-20 pointer-events-none" />
    </div>
  );
};

const Card = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  mode
}: { 
  title: string; 
  description: string; 
  icon: any; 
  onClick: () => void;
  mode: Mode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900/50 border border-white/10 rounded-3xl p-6 overflow-hidden hover:border-white/20 transition-colors duration-300 flex flex-col items-center text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-white/10 transition-colors">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 max-w-[200px] mx-auto">{description}</p>
      </div>

      <div className="mb-8 flex justify-center w-[140px] mx-auto">
        <PhonePreview className="w-full">
          <CalendarPreview
            mode={mode}
            fg="#FFFFFF"
            bg="#000000"
            year={new Date().getFullYear()}
            birthday="2000-01-01"
            lifeExp={80}
            showStats={false}
            width={600}
            height={1200}
          />
        </PhonePreview>
      </div>

      <Button onClick={onClick} className="w-full mt-auto relative z-10 group-hover:bg-white group-hover:text-black">
        Install <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </motion.div>
  );
};

const Modal = ({ 
  isOpen, 
  onClose, 
  config, 
  setConfig 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  config: Config; 
  setConfig: (c: Config) => void; 
}) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams();
    params.set('mode', config.mode);
    params.set('width', config.width.toString());
    params.set('height', config.height.toString());
    params.set('fg', config.fg.replace('#', ''));
    params.set('bg', config.bg.replace('#', ''));
    if (config.mode === 'year') {
      params.set('year', config.year.toString());
    } else {
      params.set('birthday', config.birthday);
      params.set('lifeExpectancyYears', config.lifeExp.toString());
      params.set('showStats', config.showStats ? '1' : '0');
    }
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setUrl(`${baseUrl}/api/wallpaper?${params.toString()}`);
  }, [config, isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-5xl h-[90vh] max-h-[800px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto relative">
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Configuration */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Configure {config.mode === 'year' ? 'Year' : 'Life'} Calendar</h2>
                  <p className="text-zinc-400 text-sm">Customize your wallpaper settings below.</p>
                </div>

                <div className="space-y-6">
                  {/* Mode Specific Inputs */}
                  {config.mode === 'year' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Year</label>
                      <input
                        type="number"
                        value={config.year}
                        onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Birthday</label>
                        <input
                          type="date"
                          value={config.birthday}
                          onChange={(e) => setConfig({ ...config, birthday: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Life Expectancy (Years)</label>
                        <input
                          type="number"
                          value={config.lifeExp}
                          onChange={(e) => setConfig({ ...config, lifeExp: parseInt(e.target.value) || 80 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="showStats"
                          checked={config.showStats}
                          onChange={(e) => setConfig({ ...config, showStats: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-white/20 focus:ring-offset-0"
                        />
                        <label htmlFor="showStats" className="text-sm text-zinc-300">Show percentage text</label>
                      </div>
                    </>
                  )}

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Foreground</label>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <input
                          type="color"
                          value={config.fg}
                          onChange={(e) => setConfig({ ...config, fg: e.target.value })}
                          className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
                        />
                        <span className="text-sm font-mono text-zinc-400 uppercase">{config.fg}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Background</label>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <input
                          type="color"
                          value={config.bg}
                          onChange={(e) => setConfig({ ...config, bg: e.target.value })}
                          className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
                        />
                        <span className="text-sm font-mono text-zinc-400 uppercase">{config.bg}</span>
                      </div>
                    </div>
                  </div>

                  {/* Device Preset */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Device Preset</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all appearance-none"
                      value={`${config.width}x${config.height}`}
                      onChange={(e) => {
                        const [w, h] = e.target.value.split('x').map(Number);
                        setConfig({ ...config, width: w, height: h });
                      }}
                    >
                      <option value="1290x2796">iPhone 14/15/16 Pro Max</option>
                      <option value="1179x2556">iPhone 14/15/16 Pro</option>
                      <option value="1170x2532">iPhone 13/14</option>
                      <option value="1125x2436">iPhone X/XS/11 Pro</option>
                    </select>
                  </div>

                  {/* Link Section */}
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-white mb-3">Installation Link</h3>
                    <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={url} 
                        className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400 truncate focus:outline-none"
                      />
                      <Button variant="secondary" onClick={handleCopy} className="whitespace-nowrap">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
                      Copy this URL into iOS Shortcuts using the "Get Contents of URL" action, followed by "Set Wallpaper".
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="w-full md:w-1/2 bg-[#050505] relative flex items-center justify-center p-6 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
                <div className="relative z-10 w-[220px] md:w-[250px]">
                  <PhonePreview>
                    <CalendarPreview
                      mode={config.mode}
                      fg={config.fg}
                      bg={config.bg}
                      year={config.year}
                      birthday={config.birthday}
                      lifeExp={config.lifeExp}
                      showStats={config.showStats}
                      width={config.width}
                      height={config.height}
                    />
                  </PhonePreview>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const openModal = (mode: Mode) => {
    setConfig({ ...DEFAULT_CONFIG, mode });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-30 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-sm font-medium tracking-tight text-white">The Life Calendar</div>
          <div className="text-xs text-zinc-500">v1.0</div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Minimalist wallpapers for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">mindful living.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Visualize your life progress or year at a glance. <br />
            Updated automatically on your lock screen via iOS Shortcuts.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Card 
            title="Life Calendar" 
            description="Visualize your life in weeks. A powerful reminder to make every week count."
            icon={Heart}
            onClick={() => openModal('life')}
            mode="life"
          />
          <Card 
            title="Year Calendar" 
            description="Track the current year's progress. Stay focused on your annual goals."
            icon={Calendar}
            onClick={() => openModal('year')}
            mode="year"
          />
          {/* Placeholder for Goal Calendar to match the "3 card" aesthetic request if needed, 
              but sticking to 2 for now as per original spec, or could add a "Coming Soon" card */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             className="group relative bg-zinc-900/20 border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col items-center text-center justify-center min-h-[400px] md:col-span-2 lg:col-span-1 opacity-50 hover:opacity-100 transition-opacity"
          >
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Flag className="w-6 h-6 text-zinc-500" />
             </div>
             <h3 className="text-xl font-semibold text-zinc-500 mb-2">Goal Calendar</h3>
             <p className="text-sm text-zinc-600">Coming soon</p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-zinc-600 text-sm">
          Designed for focus. Built with Next.js & Satori.
        </p>
      </footer>

      {/* Configuration Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        config={config} 
        setConfig={setConfig} 
      />

    </div>
  );
}

