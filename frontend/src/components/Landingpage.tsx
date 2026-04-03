import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Import your actual images ─────────────────────────────────────────────
// Replace these paths with your actual image imports
import bgGreen from '../assets/bg_green.png';   // Image 1 — green nebula
import bgPink from '../assets/bg_pink.png';      // Image 2 — red Astrophage cloud

// If you're not using a bundler that handles image imports, use:
// const bgGreen = '/assets/bg_green.png';
// const bgPink  = '/assets/bg_pink.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const [launched, setLaunched] = useState(false);
    const [particles, setParticles] = useState<Array<{id:number, x:number, y:number, size:number, speed:number, opacity:number}>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate floating particle specs once
    useEffect(() => {
        const pts = Array.from({ length: 28 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 2.5,
            speed: 15 + Math.random() * 30,
            opacity: 0.2 + Math.random() * 0.6,
        }));
        setParticles(pts);
    }, []);

    const handleLaunch = () => {
        setLaunched(true);
        setTimeout(() => navigate('/dashboard'), 900);
    };

    const accentColor = hovered ? '#FF3060' : '#7FD420';
    const accentGlow  = hovered ? 'rgba(255,48,96,0.55)' : 'rgba(127,212,32,0.55)';
    const accentDim   = hovered ? 'rgba(255,48,96,0.2)'  : 'rgba(127,212,32,0.2)';
    const accentText  = hovered ? '#FFB0C0' : '#D4F580';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes drift-up {
                    0%   { transform: translateY(0px) translateX(0px); opacity: var(--op); }
                    33%  { transform: translateY(-18px) translateX(6px); }
                    66%  { transform: translateY(-8px) translateX(-4px); }
                    100% { transform: translateY(0px) translateX(0px); opacity: var(--op); }
                }
                @keyframes glow-pulse {
                    0%, 100% { text-shadow: 0 0 20px var(--g), 0 0 60px var(--g2), 0 0 120px var(--g3); }
                    50%      { text-shadow: 0 0 40px var(--g), 0 0 100px var(--g2), 0 0 180px var(--g3); }
                }
                @keyframes btn-idle-glow {
                    0%, 100% { box-shadow: 0 0 24px var(--bg), 0 0 60px var(--bg2), inset 0 0 20px var(--bg3); }
                    50%      { box-shadow: 0 0 40px var(--bg), 0 0 100px var(--bg2), inset 0 0 30px var(--bg3); }
                }
                @keyframes scanline {
                    0%   { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes launchOut {
                    0%   { opacity: 1; transform: scale(1); }
                    40%  { opacity: 1; transform: scale(1.06); }
                    100% { opacity: 0; transform: scale(0.85); }
                }
                @keyframes warpIn {
                    0%   { clip-path: inset(0 50% 0 50%); opacity:0; }
                    100% { clip-path: inset(0 0% 0 0%); opacity:1; }
                }
                @keyframes tagline-reveal {
                    0%   { letter-spacing: 0.6em; opacity: 0; filter: blur(6px); }
                    100% { letter-spacing: 0.22em; opacity: 1; filter: blur(0); }
                }
                @keyframes border-march {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes spin-ring {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes spin-ring-rev {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(-360deg); }
                }
                @keyframes flicker {
                    0%, 95%, 100% { opacity: 1; }
                    96% { opacity: 0.4; }
                    98% { opacity: 0.9; }
                }

                .landing-root {
                    width: 100vw; height: 100vh;
                    position: relative; overflow: hidden;
                    cursor: crosshair;
                    font-family: 'JetBrains Mono', monospace;
                    user-select: none;
                }
                .bg-layer {
                    position: absolute; inset: 0;
                    background-size: cover;
                    background-position: center;
                    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: opacity;
                }
                .scanline {
                    position: absolute; inset: 0; pointer-events: none; z-index: 4;
                    overflow: hidden;
                }
                .scanline::after {
                    content: '';
                    position: absolute; left: 0; right: 0; top: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
                    animation: scanline 7s linear infinite;
                }
                .vignette {
                    position: absolute; inset: 0; pointer-events: none; z-index: 3;
                    background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%);
                }
                .noise {
                    position: absolute; inset: 0; pointer-events: none; z-index: 5;
                    opacity: 0.035;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 256px 256px;
                }
                .content {
                    position: relative; z-index: 10;
                    width: 100%; height: 100%;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 0;
                }
                .overline {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.45em;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                    animation: fadeIn 0.8s ease-out 0.2s both;
                    display: flex; align-items: center; gap: 14px;
                }
                .overline-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    transition: background 0.8s ease, box-shadow 0.8s ease;
                }
                .title-wrap {
                    position: relative;
                    animation: warpIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
                    text-align: center;
                }
                .title-main {
                    font-family: 'Bebas Neue', 'Orbitron', sans-serif;
                    font-size: clamp(80px, 14vw, 200px);
                    line-height: 0.88;
                    letter-spacing: 0.04em;
                    color: #fff;
                    display: block;
                    transition: color 0.8s ease;
                    animation: flicker 8s ease-in-out 2s infinite;
                }
                .title-sub {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(28px, 4.5vw, 72px);
                    letter-spacing: 0.32em;
                    color: #fff;
                    display: block;
                    transition: color 0.8s ease, text-shadow 0.8s ease;
                    margin-top: -4px;
                }
                .tagline {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: clamp(9px, 1.1vw, 12px);
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    margin-top: 22px;
                    opacity: 0;
                    animation: tagline-reveal 1s ease-out 1s forwards, fadeIn 1s ease-out 1s both;
                    transition: color 0.8s ease;
                }
                .btn-wrap {
                    margin-top: 52px;
                    position: relative;
                    animation: fadeIn 0.8s ease-out 1.4s both;
                }
                .btn-rings {
                    position: absolute; inset: -20px;
                    pointer-events: none;
                }
                .btn-ring {
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 1px solid;
                    transition: border-color 0.8s ease;
                }
                .btn-ring-1 {
                    inset: -8px;
                    animation: spin-ring 12s linear infinite;
                    border-style: dashed;
                    opacity: 0.35;
                }
                .btn-ring-2 {
                    inset: -18px;
                    animation: spin-ring-rev 18s linear infinite;
                    opacity: 0.2;
                }
                .btn {
                    position: relative;
                    padding: 18px 48px;
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(11px, 1.5vw, 14px);
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    border: 1.5px solid;
                    border-radius: 4px;
                    cursor: pointer;
                    color: #fff;
                    background: transparent;
                    transition:
                        border-color 0.4s ease,
                        background 0.4s ease,
                        transform 0.2s ease,
                        box-shadow 0.4s ease;
                    overflow: hidden;
                }
                .btn::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, var(--btn-hl) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .btn:hover::before { opacity: 1; }
                .btn-shimmer {
                    position: absolute; inset: 0; pointer-events: none;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
                    background-size: 200% 100%;
                    transition: background-position 0s;
                }
                .btn:hover .btn-shimmer {
                    animation: border-march 0.5s ease forwards;
                }
                .corner {
                    position: absolute; width: 8px; height: 8px;
                    transition: border-color 0.8s ease;
                }
                .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
                .corner-tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
                .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
                .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

                .mission-id {
                    position: absolute;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    transition: color 0.8s ease;
                    animation: fadeIn 0.8s ease-out 1.8s both;
                }
                .mission-id-bl { bottom: 28px; left: 32px; }
                .mission-id-br { bottom: 28px; right: 32px; text-align: right; }
                .mission-id-tr { top: 24px; right: 32px; text-align: right; }
                .mission-id-tl { top: 24px; left: 32px; }

                .coord-line {
                    display: flex; align-items: center; gap: 8px; margin-top: 4px;
                }
                .coord-bar {
                    width: 40px; height: 1px;
                    transition: background 0.8s ease;
                }

                .particle {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    transition: background 0.8s ease, box-shadow 0.8s ease;
                }

                .launch-overlay {
                    position: absolute; inset: 0; z-index: 20;
                    background: #000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.9s ease;
                }
                .launch-overlay.active { opacity: 1; pointer-events: all; }

                .launched .content { animation: launchOut 0.9s ease forwards; }
            `}</style>

            <div
                ref={containerRef}
                className={`landing-root${launched ? ' launched' : ''}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* ── Backgrounds ── */}
                <div
                    className="bg-layer"
                    style={{
                        backgroundImage: `url(${bgGreen})`,
                        opacity: hovered ? 0 : 1,
                        zIndex: 1,
                    }}
                />
                <div
                    className="bg-layer"
                    style={{
                        backgroundImage: `url(${bgPink})`,
                        opacity: hovered ? 1 : 0,
                        zIndex: 2,
                    }}
                />

                {/* ── Floating particles ── */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            background: accentColor,
                            boxShadow: `0 0 ${p.size * 4}px ${accentColor}`,
                            opacity: p.opacity * (hovered ? 1.4 : 1),
                            zIndex: 6,
                            animation: `drift-up ${p.speed}s ease-in-out ${-p.speed * Math.random()}s infinite`,
                            ['--op' as any]: p.opacity,
                        } as React.CSSProperties}
                    />
                ))}

                {/* ── Atmospheric layers ── */}
                <div className="vignette" />
                <div className="scanline" />
                <div className="noise" />

                {/* ── Corner mission IDs ── */}
                <div className="mission-id mission-id-tl" style={{ color: `${accentColor}80` }}>
                    <div></div>
                    <div className="coord-line">
                        <div className="coord-bar" style={{ background: accentColor }} />
                        <span></span>
                    </div>
                </div>
                <div className="mission-id mission-id-tr" style={{ color: `${accentColor}80` }}>
                    <div></div>
                    <div className="coord-line" style={{ justifyContent: 'flex-end' }}>
                        <span></span>
                        <div className="coord-bar" style={{ background: accentColor }} />
                    </div>
                </div>
                <div className="mission-id mission-id-bl" style={{ color: `${accentColor}60` }}>
                    <div></div>
                    <div></div>
                </div>
                <div className="mission-id mission-id-br" style={{ color: `${accentColor}60` }}>
                    <div></div>
                    <div></div>
                </div>

                {/* ── Main Content ── */}
                <div className="content">

                    {/* Overline */}
                    <div className="overline" style={{ color: `${accentColor}CC` }}>
                        <div
                            className="overline-dot"
                            style={{
                                background: accentColor,
                                boxShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentGlow}`,
                            }}
                        />
                        
                        <div
                            className="overline-dot"
                            style={{
                                background: accentColor,
                                boxShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentGlow}`,
                            }}
                        />
                    </div>

                    {/* Title */}
                    <div className="title-wrap">
                        <span
                            className="title-main"
                            style={{
                                color: '#FFFFFF',
                                textShadow: `0 0 80px ${accentGlow}, 0 0 160px ${accentDim}`,
                                ['--g' as any]: accentColor,
                                ['--g2' as any]: accentGlow,
                                ['--g3' as any]: accentDim,
                            } as React.CSSProperties}
                        >
                            HAIL MARY
                        </span>
                        <span
                            className="title-sub"
                            style={{
                                color: accentText,
                                textShadow: `0 0 30px ${accentGlow}, 0 0 60px ${accentDim}`,
                                letterSpacing: '0.32em',
                            }}
                        >
                            ANOMALY DETECTION ENGINE
                        </span>

                        {/* Tagline */}
                        <div className="tagline" style={{ color: `${accentColor}B0` }}>
                            {hovered
                                ? ''
                                : ''}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="btn-wrap">
                        <div className="btn-rings">
                            <div
                                className="btn-ring btn-ring-1"
                                style={{ borderColor: accentColor }}
                            />
                            <div
                                className="btn-ring btn-ring-2"
                                style={{ borderColor: accentColor }}
                            />
                        </div>

                        <button
                            className="btn"
                            onClick={handleLaunch}
                            onMouseEnter={() => setBtnHovered(true)}
                            onMouseLeave={() => setBtnHovered(false)}
                            style={{
                                borderColor: accentColor,
                                boxShadow: btnHovered
                                    ? `0 0 40px ${accentGlow}, 0 0 80px ${accentDim}, inset 0 0 30px ${accentDim}`
                                    : `0 0 24px ${accentGlow}60, 0 0 60px ${accentDim}, inset 0 0 20px ${accentDim}`,
                                background: btnHovered
                                    ? `${accentDim}`
                                    : 'rgba(0,0,0,0.3)',
                                transform: btnHovered ? 'scale(1.04) translateY(-2px)' : 'scale(1)',
                                ['--btn-hl' as any]: `${accentColor}30`,
                                animation: !btnHovered
                                    ? `btn-idle-glow 3s ease-in-out infinite`
                                    : 'none',
                                ['--bg' as any]: `${accentColor}80`,
                                ['--bg2' as any]: `${accentGlow}`,
                                ['--bg3' as any]: `${accentDim}`,
                            } as React.CSSProperties}
                        >
                            <span className="btn-shimmer" />
                            <div className="corner corner-tl" style={{ borderColor: accentColor }} />
                            <div className="corner corner-tr" style={{ borderColor: accentColor }} />
                            <div className="corner corner-bl" style={{ borderColor: accentColor }} />
                            <div className="corner corner-br" style={{ borderColor: accentColor }} />
                            TIME GO FISHING !!
                        </button>
                    </div>
                </div>

                {/* ── Launch fade overlay ── */}
                <div className={`launch-overlay${launched ? ' active' : ''}`} />
            </div>
        </>
    );
};

export default LandingPage;