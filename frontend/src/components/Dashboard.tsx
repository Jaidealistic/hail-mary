// import React, { useEffect, useState } from 'react';
// import { getStars, getLightCurve, detectAnomalies } from '../api';
// import { LightCurveGraph } from './LightCurveGraph';
// import { Satellite, AlertTriangle, Activity } from 'lucide-react';
// import clsx from 'clsx';

// export const Dashboard: React.FC = () => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [stars, setStars] = useState<any[]>([]);
//     const [selectedStar, setSelectedStar] = useState<string | null>(null);
//     const [lightcurve, setLightcurve] = useState<{times: number[], fluxes: number[]} | null>(null);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [anomalies, setAnomalies] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [scanning, setScanning] = useState(false);

//     useEffect(() => {
//         getStars().then(data => {
//             setStars(data);
//             if (data.length > 0) setSelectedStar(data[0].star_id);
//         }).catch(err => console.error(err));
//     }, []);

//     useEffect(() => {
//         if (!selectedStar) return;
//         setLoading(true);
//         setAnomalies([]); // reset anomalies on new star
//         getLightCurve(selectedStar).then(data => {
//             setLightcurve(data);
//             setLoading(false);
//         }).catch(err => {
//             console.error(err);
//             setLoading(false);
//         });
//     }, [selectedStar]);

//     const handleScan = async () => {
//         if (!selectedStar) return;
//         setScanning(true);
//         try {
//             const res = await detectAnomalies(selectedStar);
//             setAnomalies(res.anomalies);
//         } catch (e) {
//             console.error(e);
//         } finally {
//             setScanning(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
//             <header className="mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
//                 <Satellite className="text-cyan-400" size={32} />
//                 <h1 className="text-3xl font-bold tracking-tight text-white uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>Project Hail Mary</h1>
//                 <span className="ml-auto flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                     <span>System Online</span>
//                 </span>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
//                 {/* Sidebar */}
//                 <div className="space-y-4">
//                     <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">Tracked Targets</h2>
//                         <ul className="space-y-2">
//                             {stars.map(star => (
//                                 <li key={star.star_id}>
//                                     <button 
//                                         onClick={() => setSelectedStar(star.star_id)}
//                                         className={clsx(
//                                             "w-full text-left px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium",
//                                             selectedStar === star.star_id 
//                                                 ? "bg-cyan-900/40 text-cyan-400 border border-cyan-800/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
//                                                 : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
//                                         )}
//                                     >
//                                         <div className="flex justify-between items-center">
//                                             <span>{star.star_id}</span>
//                                             <span className="text-[10px] opacity-50 font-mono tracking-tighter mix-blend-screen">{star.mission}</span>
//                                         </div>
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Main HUD */}
//                 <div className="lg:col-span-3 space-y-6">
//                     {/* Control Panel */}
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
//                         <div>
//                             <h2 className="text-2xl font-bold text-white mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>{selectedStar || 'UNKNOWN_TARGET'}</h2>
//                             <p className="text-sm text-slate-400">Raw PyTorch Timeseries telemetry routing via NASA Kepler Database</p>
//                         </div>
                        
//                         <button 
//                             onClick={handleScan}
//                             disabled={scanning || !lightcurve}
//                             className={clsx(
//                                 "mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300",
//                                 scanning 
//                                     ? "bg-amber-500/20 text-amber-400 cursor-not-allowed border border-amber-500/30" 
//                                     : "bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400"
//                             )}
//                         >
//                             {scanning ? <Activity className="animate-spin" size={18} /> : <AlertTriangle size={18} />}
//                             {scanning ? 'Running Neural Net...' : 'Run Anomaly Detection'}
//                         </button>
//                     </div>

//                     {/* Chart Container */}
//                     <div className="relative">
//                         {loading && (
//                             <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl">
//                                 <Activity className="text-cyan-500 animate-spin" size={48} />
//                             </div>
//                         )}
                        
//                         {lightcurve ? (
//                             <LightCurveGraph 
//                                 times={lightcurve.times} 
//                                 fluxes={lightcurve.fluxes} 
//                                 anomalies={anomalies}
//                             />
//                         ) : (
//                             <div className="w-full h-[400px] bg-slate-900 border-2 border-slate-800 flex items-center justify-center rounded-xl text-slate-600 font-mono">
//                                 AWAITING TELEMETRY...
//                             </div>
//                         )}
//                     </div>
                    
//                     {/* Anomaly Dashboard Feed */}
//                     {anomalies.length > 0 && (
//                         <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
//                             <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
//                                 <AlertTriangle className="text-red-500 animate-pulse" size={20} /> 
//                                 WARNING: {anomalies.length} ALIEN CONTACTS DETECTED
//                             </h3>
//                             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
//                                 {anomalies.map((a, i) => (
//                                     <div key={i} className="bg-red-950/50 border border-red-900 p-2 rounded text-center">
//                                         <div className="text-xs text-slate-400 mb-1">Time: {a.time.toFixed(2)}</div>
//                                         <div className="text-sm font-mono text-red-400 font-bold">ERR: {a.loss.toFixed(4)}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import { getStars, getLightCurve, detectAnomalies } from '../api';
import { LightCurveGraph } from './LightCurveGraph';
import { Satellite, AlertTriangle, Activity, Radio, Zap } from 'lucide-react';

// ─── Inline styles extracted as constants for clarity ───────────────────────

const FONTS = {
    display: '"Orbitron", "Space Grotesk", sans-serif',
    mono: '"JetBrains Mono", "Courier New", monospace',
    body: '"IBM Plex Sans", system-ui, sans-serif',
};

// Drawn from the movie poster palette:
// Poster 1: hyper-speed amber/copper light trails on void black
// Poster 2: solar gold, nebula teal-green, deep orange sun corona
// Poster 3: cinematic teal-blue space with ember orange bokeh
const C = {
    void: '#060508',           // deepest background
    deepSpace: '#0A0810',      // secondary background
    panel: '#100C18',          // panel background
    panelBorder: 'rgba(194,120,40,0.25)',   // amber panel borders
    amber: '#C87828',          // primary accent — poster 1 light streaks
    amberBright: '#F0C060',    // highlights
    amberGlow: 'rgba(200,120,40,0.15)',
    solarOrange: '#E06020',    // poster 2 sun corona
    teal: '#0F9B7A',           // poster 2 nebula atmosphere
    tealDim: 'rgba(15,155,120,0.6)',
    emberRed: '#FF5020',       // anomaly / contact alerts
    starWhite: '#F4EED8',      // primary text — warm white like poster typography
    dimText: 'rgba(244,238,216,0.45)',
    mutedText: 'rgba(194,150,60,0.55)',
    online: '#30C878',
};

const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

    * { box-sizing: border-box; }

    body, #root {
        background: ${C.void};
        margin: 0;
    }

    @keyframes pulse-amber {
        0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(200,120,40,0.5); }
        50% { opacity: 0.7; box-shadow: 0 0 16px rgba(200,120,40,0.2); }
    }
    @keyframes pulse-red {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    @keyframes scan-line {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
    }
    @keyframes slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes count-up {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.void}; }
    ::-webkit-scrollbar-thumb { background: ${C.amber}40; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: ${C.amber}80; }

    .star-item-btn {
        width: 100%;
        text-align: left;
        padding: 10px 14px;
        border-radius: 6px;
        border: 1px solid transparent;
        background: rgba(16,12,24,0.6);
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: ${FONTS.mono};
    }
    .star-item-btn:hover {
        background: rgba(194,120,40,0.08);
        border-color: rgba(194,120,40,0.3);
    }
    .star-item-btn.active {
        background: rgba(194,120,40,0.12);
        border-color: rgba(194,120,40,0.5);
        box-shadow: 0 0 16px rgba(194,120,40,0.1), inset 0 0 20px rgba(194,120,40,0.05);
    }

    .scan-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: ${FONTS.display};
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid ${C.amber};
        background: linear-gradient(135deg, rgba(200,120,40,0.15) 0%, rgba(224,96,32,0.1) 100%);
        color: ${C.amberBright};
        box-shadow: 0 0 24px rgba(200,120,40,0.2);
    }
    .scan-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, rgba(200,120,40,0.3) 0%, rgba(224,96,32,0.2) 100%);
        box-shadow: 0 0 40px rgba(200,120,40,0.35), 0 0 80px rgba(200,120,40,0.1);
        transform: translateY(-1px);
    }
    .scan-btn:active:not(:disabled) { transform: translateY(0); }
    .scan-btn:disabled {
        border-color: rgba(240,96,48,0.4);
        background: rgba(240,96,48,0.08);
        color: rgba(240,160,80,0.6);
        cursor: not-allowed;
        box-shadow: 0 0 16px rgba(240,96,48,0.1);
    }
`;

// ─── Stat Card Component ─────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; accent?: string; pulse?: boolean }> = ({
    label, value, accent = C.amber, pulse = false
}) => (
    <div style={{
        background: 'linear-gradient(135deg, rgba(16,12,24,0.9) 0%, rgba(10,8,16,0.9) 100%)',
        border: `1px solid ${accent}30`,
        borderRadius: '8px',
        padding: '14px 18px',
        position: 'relative',
        overflow: 'hidden',
    }}>
        {/* corner accent */}
        <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '24px', height: '24px',
            borderTop: `2px solid ${accent}60`,
            borderLeft: `2px solid ${accent}60`,
            borderRadius: '8px 0 0 0',
        }} />
        <div style={{
            fontFamily: FONTS.mono,
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: `${accent}80`,
            marginBottom: '6px',
            textTransform: 'uppercase',
        }}>
            {label}
        </div>
        <div style={{
            fontFamily: FONTS.display,
            fontSize: '22px',
            fontWeight: 700,
            color: accent,
            animation: pulse ? 'pulse-red 2s ease-in-out infinite' : 'count-up 0.5s ease-out',
        }}>
            {value}
        </div>
    </div>
);

// ─── Contact Alert Card ──────────────────────────────────────────────────────
const ContactCard: React.FC<{ anomaly: any; index: number }> = ({ anomaly, index }) => (
    <div style={{
        background: 'rgba(255,80,32,0.06)',
        border: '1px solid rgba(255,80,32,0.3)',
        borderRadius: '6px',
        padding: '10px 12px',
        animation: 'slide-up 0.3s ease-out',
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'both',
        position: 'relative',
        overflow: 'hidden',
    }}>
        {/* scan line effect */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,80,32,0.6), transparent)',
        }} />
        <div style={{ fontFamily: FONTS.mono, fontSize: '9px', color: 'rgba(255,160,80,0.6)', letterSpacing: '0.12em', marginBottom: 4 }}>
            CONTACT #{String(index + 1).padStart(3, '0')}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: '11px', color: 'rgba(255,200,100,0.7)', marginBottom: 3 }}>
            T+ {anomaly.time.toFixed(3)}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: '13px', color: '#FF7040', fontWeight: 600 }}>
            Δ {anomaly.loss.toFixed(5)}
        </div>
    </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stars, setStars] = useState<any[]>([]);
    const [selectedStar, setSelectedStar] = useState<string | null>(null);
    const [lightcurve, setLightcurve] = useState<{ times: number[]; fluxes: number[] } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        getStars().then(data => {
            setStars(data);
            if (data.length > 0) setSelectedStar(data[0].star_id);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!selectedStar) return;
        setLoading(true);
        setAnomalies([]);
        getLightCurve(selectedStar).then(data => {
            setLightcurve(data);
            setLoading(false);
        }).catch(err => { console.error(err); setLoading(false); });
    }, [selectedStar]);

    const handleScan = async () => {
        if (!selectedStar) return;
        setScanning(true);
        try {
            const res = await detectAnomalies(selectedStar);
            setAnomalies(res.anomalies);
        } catch (e) { console.error(e); }
        finally { setScanning(false); }
    };

    return (
        <>
            <style>{globalStyles}</style>

            <div style={{
                minHeight: '100vh',
                background: `
                    radial-gradient(ellipse at 0% 0%, rgba(15,155,120,0.04) 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 100%, rgba(224,96,32,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, rgba(10,8,16,1) 0%, rgba(6,5,8,1) 100%)
                `,
                color: C.starWhite,
                fontFamily: FONTS.body,
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Subtle scan line that slowly drifts down */}
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    height: '1px', zIndex: 100, pointerEvents: 'none',
                    background: `linear-gradient(90deg, transparent 0%, ${C.amber}20 40%, ${C.amber}40 50%, ${C.amber}20 60%, transparent 100%)`,
                    animation: 'scan-line 12s linear infinite',
                }} />

                {/* ── HEADER ── */}
                <header style={{
                    padding: '0 32px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderBottom: `1px solid ${C.panelBorder}`,
                    background: 'linear-gradient(90deg, rgba(10,8,16,0.98) 0%, rgba(16,12,6,0.98) 100%)',
                    position: 'sticky', top: 0, zIndex: 50,
                    backdropFilter: 'blur(12px)',
                }}>
                    {/* Logo mark */}
                    <div style={{
                        width: 36, height: 36,
                        border: `1px solid ${C.amber}60`,
                        borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${C.amberGlow}`,
                        flexShrink: 0,
                    }}>
                        <Satellite size={18} color={C.amber} />
                    </div>

                    <div>
                        <div style={{
                            fontFamily: FONTS.display,
                            fontSize: '15px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            color: C.amberBright,
                            lineHeight: 1,
                        }}>
                            PROJECT HAIL MARY
                        </div>
                        <div style={{
                            fontFamily: FONTS.mono,
                            fontSize: '8px',
                            color: C.mutedText,
                            letterSpacing: '0.2em',
                            marginTop: '2px',
                        }}>
                            STELLAR ANOMALY DETECTION ENGINE
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '28px', background: `${C.amber}25`, marginLeft: 8 }} />

                    {/* Mission title — PHM font style from poster */}
                    <div style={{
                        fontFamily: FONTS.display,
                        fontSize: '11px',
                        fontWeight: 400,
                        letterSpacing: '0.3em',
                        color: `${C.amber}70`,
                        textTransform: 'uppercase',
                    }}>
                        · CONTACT PROTOCOL
                    </div>

                    {/* Status badge */}
                    <div style={{
                        marginLeft: 'auto',
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px',
                        border: `1px solid rgba(48,200,120,0.3)`,
                        borderRadius: '20px',
                        background: 'rgba(48,200,120,0.05)',
                        fontFamily: FONTS.mono,
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        color: C.online,
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: C.online,
                            animation: 'pulse-amber 2s ease-in-out infinite',
                            boxShadow: `0 0 8px ${C.online}`,
                        }} />
                        SYSTEMS NOMINAL
                    </div>
                </header>

                {/* ── STAT STRIP ── */}
                <div style={{
                    padding: '16px 32px',
                    borderBottom: `1px solid ${C.panelBorder}`,
                    background: 'rgba(10,8,16,0.6)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                }}>
                    <StatCard label="Targets Tracked" value={stars.length} accent={C.amber} />
                    <StatCard label="Selected Target" value={selectedStar?.slice(0, 12) ?? '—'} accent={C.teal} />
                    <StatCard label="Contacts Detected" value={anomalies.length} accent={anomalies.length > 0 ? C.emberRed : C.amber} pulse={anomalies.length > 0} />
                    <StatCard label="Neural Net Status" value={scanning ? 'SCANNING' : 'STANDBY'} accent={scanning ? C.solarOrange : C.amber} />
                </div>

                {/* ── MAIN CONTENT AREA ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px 32px',
                    gap: '24px',
                    minHeight: 'calc(100vh - 140px)',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                }}>

                    {/* ── MAIN CONTENT ── */}
                    <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Control bar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, rgba(16,12,24,0.9) 0%, rgba(12,10,6,0.9) 100%)',
                            border: `1px solid ${C.panelBorder}`,
                            borderRadius: '10px',
                            padding: '20px 24px',
                            flexWrap: 'wrap',
                            gap: '16px',
                        }}>
                            <div style={{ position: 'relative' }}>
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        fontFamily: FONTS.display,
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        color: C.amberBright,
                                        lineHeight: 1.2,
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: 0,
                                        outline: 'none',
                                        textShadow: `0 0 10px ${C.amber}40`,
                                    }}
                                >
                                    {selectedStar ?? 'SELECT TARGET'} 
                                    <span style={{ 
                                        fontSize: '12px', 
                                        transition: 'transform 0.3s ease',
                                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>▼</span>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        marginTop: '12px',
                                        width: '280px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        background: 'rgba(10,8,16,0.98)',
                                        border: `1px solid ${C.panelBorder}`,
                                        borderRadius: '8px',
                                        boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${C.amber}20`,
                                        zIndex: 1000,
                                        backdropFilter: 'blur(16px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '8px',
                                        gap: '4px',
                                        animation: 'slide-up 0.2s ease-out'
                                    }}>
                                        <div style={{
                                            fontFamily: FONTS.mono,
                                            fontSize: '9px',
                                            letterSpacing: '0.25em',
                                            color: C.mutedText,
                                            padding: '8px',
                                            borderBottom: `1px solid ${C.panelBorder}`,
                                            marginBottom: '4px',
                                        }}>
                                            AVAILABLE STELLAR SYSTEMS
                                        </div>
                                        {stars.length === 0 ? (
                                            <div style={{ padding: '12px 8px', fontFamily: FONTS.mono, fontSize: '10px', color: C.dimText }}>
                                                No systems online.
                                            </div>
                                        ) : stars.map(star => (
                                            <button
                                                key={star.star_id}
                                                onClick={() => {
                                                    setSelectedStar(star.star_id);
                                                    setDropdownOpen(false);
                                                }}
                                                style={{
                                                    background: selectedStar === star.star_id ? `rgba(194,120,40,0.15)` : 'transparent',
                                                    border: '1px solid transparent',
                                                    borderColor: selectedStar === star.star_id ? `rgba(194,120,40,0.4)` : 'transparent',
                                                    padding: '10px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'rgba(194,120,40,0.1)';
                                                    e.currentTarget.style.borderColor = 'rgba(194,120,40,0.3)';
                                                }}
                                                onMouseOut={(e) => {
                                                    if(selectedStar !== star.star_id) {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                    } else {
                                                        e.currentTarget.style.background = 'rgba(194,120,40,0.15)';
                                                        e.currentTarget.style.borderColor = 'rgba(194,120,40,0.4)';
                                                    }
                                                }}
                                            >
                                                <span style={{ fontFamily: FONTS.display, fontSize: '13px', color: selectedStar === star.star_id ? C.amberBright : '#E0E0E0' }}>
                                                    {star.star_id}
                                                </span>
                                                <span style={{ fontFamily: FONTS.mono, fontSize: '9px', color: C.mutedText }}>
                                                    {star.mission}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div style={{
                                    fontFamily: FONTS.mono,
                                    fontSize: '10px',
                                    color: C.mutedText,
                                    marginTop: '8px',
                                    letterSpacing: '0.12em',
                                }}>
                                    PYTORCH LSTM AUTOENCODER · REAL-TIME TELEMETRY
                                </div>
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={scanning || !lightcurve}
                                className="scan-btn"
                            >
                                {scanning
                                    ? <Activity size={16} style={{ animation: 'spin-slow 1s linear infinite' }} />
                                    : <Zap size={16} />
                                }
                                {scanning ? 'RUNNING NEURAL NET...' : 'RUN ANOMALY DETECTION'}
                            </button>
                        </div>

                        {/* Chart area */}
                        <div style={{ position: 'relative' }}>
                            {loading && (
                                <div style={{
                                    position: 'absolute', inset: 0, zIndex: 10,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(6,5,8,0.85)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: '12px',
                                    gap: '12px',
                                }}>
                                    <div style={{
                                        width: 48, height: 48,
                                        border: `2px solid ${C.amber}20`,
                                        borderTop: `2px solid ${C.amber}`,
                                        borderRadius: '50%',
                                        animation: 'spin-slow 0.8s linear infinite',
                                    }} />
                                    <div style={{ fontFamily: FONTS.mono, fontSize: '10px', color: C.mutedText, letterSpacing: '0.2em' }}>
                                        DOWNLOADING TELEMETRY...
                                    </div>
                                </div>
                            )}

                            {lightcurve ? (
                                <LightCurveGraph
                                    times={lightcurve.times}
                                    fluxes={lightcurve.fluxes}
                                    anomalies={anomalies}
                                />
                            ) : (
                                <div style={{
                                    width: '100%', height: '420px',
                                    background: 'linear-gradient(135deg, rgba(16,12,24,0.8) 0%, rgba(10,8,16,0.8) 100%)',
                                    border: `1px dashed ${C.panelBorder}`,
                                    borderRadius: '12px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    gap: '12px',
                                }}>
                                    <div style={{
                                        width: 48, height: 48,
                                        border: `1px solid ${C.amber}30`,
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Satellite size={20} color={`${C.amber}50`} />
                                    </div>
                                    <div style={{ fontFamily: FONTS.mono, fontSize: '11px', color: C.mutedText, letterSpacing: '0.2em' }}>
                                        AWAITING TELEMETRY FEED
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact alerts */}
                        {anomalies.length > 0 && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(255,80,32,0.05) 0%, rgba(16,6,4,0.9) 100%)',
                                border: '1px solid rgba(255,80,32,0.35)',
                                borderRadius: '10px',
                                padding: '20px 24px',
                                animation: 'slide-up 0.4s ease-out',
                            }}>
                                {/* Alert header */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    marginBottom: '16px',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid rgba(255,80,32,0.2)',
                                }}>
                                    <div style={{
                                        width: 32, height: 32,
                                        border: '1px solid rgba(255,80,32,0.5)',
                                        borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(255,80,32,0.1)',
                                    }}>
                                        <AlertTriangle size={16} color={C.emberRed} style={{ animation: 'pulse-red 1.5s ease-in-out infinite' }} />
                                    </div>
                                    <div>
                                        <div style={{
                                            fontFamily: FONTS.display,
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            letterSpacing: '0.15em',
                                            color: C.emberRed,
                                        }}>
                                            ⚠ UNEXPLAINED CONTACTS DETECTED
                                        </div>
                                        <div style={{
                                            fontFamily: FONTS.mono,
                                            fontSize: '9px',
                                            color: 'rgba(255,120,60,0.6)',
                                            letterSpacing: '0.12em',
                                            marginTop: '2px',
                                        }}>
                                            {anomalies.length} SIGNAL{anomalies.length > 1 ? 'S' : ''} FLAGGED · RECONSTRUCTION ERROR EXCEEDS THRESHOLD
                                        </div>
                                    </div>
                                    <div style={{
                                        marginLeft: 'auto',
                                        fontFamily: FONTS.mono,
                                        fontSize: '24px',
                                        fontWeight: 700,
                                        color: C.emberRed,
                                        animation: 'pulse-red 2s ease-in-out infinite',
                                    }}>
                                        {anomalies.length}
                                    </div>
                                </div>

                                {/* Contact grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '8px',
                                }}>
                                    {anomalies.map((a, i) => (
                                        <ContactCard key={i} anomaly={a} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
};
