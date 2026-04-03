// import React, { useMemo } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

// interface Anomaly {
//   time: number;
//   loss: number;
// }

// interface Props {
//     times: number[];
//     fluxes: number[];
//     anomalies?: Anomaly[];
// }

// export const LightCurveGraph: React.FC<Props> = ({ times, fluxes, anomalies = [] }) => {
    
//     // Map raw arrays to Recharts friendly object array
//     const chartData = useMemo(() => {
//         return times.map((t, i) => ({
//             time: Number(t.toFixed(4)),
//             flux: fluxes[i],
//             isAnomaly: anomalies.some(a => Math.abs(a.time - t) < 0.001)
//         }));
//     }, [times, fluxes, anomalies]);

//     const anomalyDataPoints = useMemo(() => {
//         return chartData.filter(d => d.isAnomaly);
//     }, [chartData])

//     return (
//         <div className="w-full h-[400px] bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-xl">
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                     <XAxis 
//                         dataKey="time" 
//                         stroke="#94a3b8" 
//                         tick={{fill: '#94a3b8'}} 
//                         type="number"
//                         domain={['dataMin', 'dataMax']}
//                         tickFormatter={(t: number) => t.toFixed(2)}
//                     />
//                     <YAxis 
//                         domain={['auto', 'auto']}
//                         stroke="#94a3b8" 
//                         tick={{fill: '#94a3b8'}}
//                     />
//                     <Tooltip 
//                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
//                         labelStyle={{ color: '#38bdf8' }}
//                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                         formatter={(value: any) => [Number(value || 0).toFixed(5), 'Flux']}
//                     />
                    
//                     <Line 
//                         type="monotone" 
//                         dataKey="flux" 
//                         stroke="#38bdf8" 
//                         strokeWidth={1} 
//                         dot={false}
//                         activeDot={{ r: 4, fill: '#0ea5e9' }}
//                     />
                    
//                     {/* Render Anomaly Dots */}
//                     {anomalyDataPoints.map((point, index) => (
//                         <ReferenceDot 
//                             key={`anomaly-${index}`}
//                             x={point.time}
//                             y={point.flux}
//                             r={4}
//                             fill="#ef4444"
//                             stroke="#7f1d1d"
//                         />
//                     ))}
                    
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }

import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceDot
} from 'recharts';

interface Anomaly {
    time: number;
    loss: number;
}

interface Props {
    times: number[];
    fluxes: number[];
    anomalies?: Anomaly[];
}

// Custom tooltip styled like a mission readout panel
const MissionTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const point = payload[0]?.payload;
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(10,8,4,0.97) 0%, rgba(20,12,4,0.97) 100%)',
            border: '1px solid rgba(194,120,40,0.5)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            boxShadow: '0 0 20px rgba(194,120,40,0.2), inset 0 0 20px rgba(0,0,0,0.3)',
        }}>
            <div style={{ color: '#C87828', fontSize: '10px', letterSpacing: '0.15em', marginBottom: 4 }}>
                ◈ TELEMETRY READOUT
            </div>
            <div style={{ color: '#F0D090', fontSize: '12px' }}>
                T+{Number(label).toFixed(4)} <span style={{ color: 'rgba(240,208,144,0.4)' }}>days</span>
            </div>
            <div style={{ color: point?.isAnomaly ? '#FF6030' : '#50C8A0', fontSize: '13px', fontWeight: 'bold', marginTop: 2 }}>
                Φ {Number(payload[0]?.value || 0).toFixed(6)}
                {point?.isAnomaly && <span style={{ color: '#FF6030', marginLeft: 8, fontSize: '10px' }}>⚠ CONTACT</span>}
            </div>
        </div>
    );
};

export const LightCurveGraph: React.FC<Props> = ({ times, fluxes, anomalies = [] }) => {
    const chartData = useMemo(() => {
        return times.map((t, i) => ({
            time: Number(t.toFixed(4)),
            flux: fluxes[i],
            isAnomaly: anomalies.some(a => Math.abs(a.time - t) < 0.001)
        }));
    }, [times, fluxes, anomalies]);

    const anomalyDataPoints = useMemo(() => chartData.filter(d => d.isAnomaly), [chartData]);

    return (
        <div style={{
            width: '100%',
            height: '420px',
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(194,120,40,0.3)',
            boxShadow: '0 0 40px rgba(194,120,40,0.08), 0 0 80px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.4)',
        }}>
            {/* Deep space background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 20% 50%, rgba(30,18,6,1) 0%, rgba(8,6,14,1) 60%, rgba(4,8,16,1) 100%)',
                zIndex: 0,
            }} />

            {/* Subtle star field texture */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                backgroundImage: `
                    radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
                    radial-gradient(1px 1px at 72% 8%, rgba(255,255,255,0.4) 0%, transparent 100%),
                    radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,0.5) 0%, transparent 100%),
                    radial-gradient(1px 1px at 35% 78%, rgba(255,255,255,0.3) 0%, transparent 100%),
                    radial-gradient(1px 1px at 55% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
                    radial-gradient(1px 1px at 92% 82%, rgba(255,255,255,0.6) 0%, transparent 100%),
                    radial-gradient(1px 1px at 8% 65%, rgba(255,255,255,0.3) 0%, transparent 100%)
                `,
            }} />

            {/* Solar amber glow at bottom — like the sun in poster 2 */}
            <div style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '140%', height: '30%',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(200,100,20,0.12) 0%, transparent 70%)',
                zIndex: 1,
            }} />

            {/* Teal nebula glow top-right — like poster 2 atmosphere */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '50%', height: '50%',
                background: 'radial-gradient(ellipse at 100% 0%, rgba(15,155,120,0.06) 0%, transparent 70%)',
                zIndex: 1,
            }} />

            {/* Header strip */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '36px', zIndex: 3,
                background: 'linear-gradient(90deg, rgba(20,12,4,0.9) 0%, rgba(30,18,8,0.8) 100%)',
                borderBottom: '1px solid rgba(194,120,40,0.25)',
                display: 'flex', alignItems: 'center',
                padding: '0 16px', gap: '16px',
                fontFamily: '"JetBrains Mono", monospace',
            }}>
                <span style={{ color: '#C87828', fontSize: '9px', letterSpacing: '0.2em' }}>◈ STELLAR FLUX MONITOR</span>
                <span style={{ color: 'rgba(194,120,40,0.3)', fontSize: '9px' }}>///</span>
                <span style={{ color: 'rgba(240,180,80,0.5)', fontSize: '9px', letterSpacing: '0.1em' }}>
                    {times.length > 0 ? `${times.length} SAMPLES` : 'NO DATA'}
                </span>
                {anomalies.length > 0 && (
                    <>
                        <span style={{ color: 'rgba(194,120,40,0.3)', fontSize: '9px' }}>///</span>
                        <span style={{ color: '#FF6030', fontSize: '9px', letterSpacing: '0.15em', animation: 'pulse 2s infinite' }}>
                            ⚠ {anomalies.length} CONTACT{anomalies.length > 1 ? 'S' : ''} FLAGGED
                        </span>
                    </>
                )}
                <span style={{ marginLeft: 'auto', color: 'rgba(194,120,40,0.3)', fontSize: '9px' }}>NASA/KEPLER</span>
            </div>

            {/* Chart */}
            <div style={{ position: 'absolute', inset: '36px 0 0 0', zIndex: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                        <defs>
                            <linearGradient id="fluxLineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#C87828" stopOpacity={0.6} />
                                <stop offset="40%" stopColor="#F0C060" stopOpacity={0.9} />
                                <stop offset="70%" stopColor="#50C8A0" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#30A8D0" stopOpacity={0.6} />
                            </linearGradient>
                            <filter id="lineGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="anomalyGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="2 6"
                            stroke="rgba(194,120,40,0.12)"
                            vertical={true}
                            horizontal={true}
                        />

                        <XAxis
                            dataKey="time"
                            stroke="rgba(194,120,40,0.3)"
                            tick={{ fill: 'rgba(240,180,80,0.5)', fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(t: number) => t.toFixed(1)}
                            axisLine={{ stroke: 'rgba(194,120,40,0.2)' }}
                            tickLine={{ stroke: 'rgba(194,120,40,0.2)' }}
                            label={{ value: 'TIME (BJKD)', position: 'insideBottomRight', fill: 'rgba(194,120,40,0.3)', fontSize: 9, fontFamily: '"JetBrains Mono", monospace', dy: 4 }}
                        />

                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="rgba(194,120,40,0.3)"
                            tick={{ fill: 'rgba(240,180,80,0.5)', fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
                            axisLine={{ stroke: 'rgba(194,120,40,0.2)' }}
                            tickLine={{ stroke: 'rgba(194,120,40,0.2)' }}
                            tickFormatter={(v: number) => v.toFixed(3)}
                            label={{ value: 'FLUX Φ', angle: -90, position: 'insideLeft', fill: 'rgba(194,120,40,0.3)', fontSize: 9, fontFamily: '"JetBrains Mono", monospace', dx: 12 }}
                        />

                        <Tooltip content={<MissionTooltip />} />

                        {/* Main flux line — amber-to-teal gradient like the poster's light streaks */}
                        <Line
                            type="monotone"
                            dataKey="flux"
                            stroke="url(#fluxLineGradient)"
                            strokeWidth={1.5}
                            dot={false}
                            activeDot={{ r: 5, fill: '#F0C060', stroke: '#C87828', strokeWidth: 2 }}
                            filter="url(#lineGlow)"
                        />

                        {/* Anomaly markers — deep ember red like the bokeh orbs in poster 3 */}
                        {anomalyDataPoints.map((point, index) => (
                            <ReferenceDot
                                key={`anomaly-${index}`}
                                x={point.time}
                                y={point.flux}
                                r={6}
                                fill="rgba(255,80,30,0.85)"
                                stroke="rgba(255,160,60,0.6)"
                                strokeWidth={2}
                                filter="url(#anomalyGlow)"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};