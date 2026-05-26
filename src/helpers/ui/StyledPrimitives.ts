import styled, { createGlobalStyle, keyframes } from "styled-components";

// ─── Global styles ────────────────────────────────────────────────────────────

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #080c10;
    --surface:      #0d1117;
    --surface-2:    #111820;
    --border:       #1e2d3d;
    --border-glow:  #1e3a52;
    --accent:       #00d4ff;
    --accent-dim:   #00d4ff22;
    --accent-2:     #ff6b35;
    --text:         #c8d6e5;
    --text-muted:   #4a6580;
    --text-bright:  #eaf4ff;
    --mono:         'Share Tech Mono', monospace;
    --sans:         'Rajdhani', sans-serif;
    --panel-radius: 2px;
  }

  html, body, #root {
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
}

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 400;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border-glow); border-radius: 2px; }
`;



// ─── Animations ───────────────────────────────────────────────────────────────

export const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px var(--accent-dim); }
  50%       { box-shadow: 0 0 20px #00d4ff44; }
`;

export const homePulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

// ─── Layout shells ────────────────────────────────────────────────────────────

export const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* Subtle scanline overlay */
  &::after {
    content: '';
    position: fixed;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%);
    background-size: 100% 3px;
    pointer-events: none;
    z-index: 9999;
  }
`;

export const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 20px;
  height: calc(100vh - 48px);
  overflow-y: auto;
  width: 100%;
`;

export const HeroPanel = styled.section`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--panel-radius);
  box-shadow: 0 0 40px rgba(0, 212, 255, 0.08);
`;

export const HeroSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 2fr) minmax(260px, 1fr);
  gap: 1px;
  background: var(--border);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const AlgorithmDetailsPanel = styled.section`
  flex-shrink: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
`;

export const AlgorithmDetailsScroll = styled.div`
  padding: 20px;
`;

export const PlaceholderScene = styled.div`
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, rgba(0, 212, 255, 0.08), transparent 40%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 45%),
    var(--surface-2);
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 32px;
  background: var(--surface);
  text-align: left;
`;

export const HeroTitle = styled.h1`
  font-family: var(--sans);
  font-size: clamp(2rem, 4vw, 3.2rem);
  color: var(--text-bright);
  line-height: 1.05;
`;

export const HeroDescription = styled.p`
  font-family: var(--mono);
  color: var(--text-muted);
  font-size: 0.96rem;
  line-height: 1.75;
  max-width: 80ch;
`;

export const ModelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  width: fit-content;
`;

export const DetailsPanel = styled.section`
  width: min(100%, 1120px);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--panel-radius);
`;

export const FeatureHeading = styled.h2`
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--text-bright);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const FeatureText = styled.p`
  font-family: var(--mono);
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.7;
`;

// ─── Home button ──────────────────────────────────────────────────────────────
 
export const HomeBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding: 0 20px;
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s ease;
 
  /* left accent bar */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 25%; bottom: 25%;
    width: 2px;
    background: var(--accent);
    border-radius: 1px;
    box-shadow: 0 0 8px var(--accent);
  }
 
  &:hover {
    background: var(--accent-dim);
 
    .home-icon path,
    .home-icon rect {
      stroke: var(--accent);
    }
 
    .home-label {
      color: var(--accent);
    }
 
    .home-dot {
      animation: ${homePulse} 0.8s ease-in-out infinite;
    }
  }
`;
 
export const HomeIcon = styled.svg`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
 
  path, rect, polyline {
    stroke: var(--text-muted);
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.2s ease;
  }
`;
 
export const HomeLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
`;
 
export const HomeLabel = styled.span`
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: color 0.2s ease;
  line-height: 1;
`;
 
export const HomeDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 5px var(--accent);
  flex-shrink: 0;
  align-self: center;
`;

// ─── Top bar ──────────────────────────────────────────────────────────────────

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  height: 48px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  position: relative;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.4;
  }
`;

export const ModeSelector = styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 3px;
  border-radius: var(--panel-radius);
`;

export const ModeTab = styled.button<{ $active: boolean }>`
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 14px;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.15s ease;

  background: ${p => p.$active ? 'var(--accent)' : 'transparent'};
  color: ${p => p.$active ? '#000' : 'var(--text-muted)'};

  &:hover {
    color: ${p => p.$active ? '#000' : 'var(--accent)'};
    background: ${p => p.$active ? 'var(--accent)' : 'var(--accent-dim)'};
  }
`;

// ─── Main workspace ───────────────────────────────────────────────────────────

export const Workspace = styled.main`
  display: flex;
  height: calc(100vh - 48px);
  flex-shrink: 0;
  overflow: hidden;
  gap: 1px;
  background: var(--border);
`;

// ─── Scene panel ──────────────────────────────────────────────────────────────

export const ScenePanel = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  animation: ${fadeSlideIn} 0.4s ease both;
`;

export const PanelLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;

  span.tag {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  span.title {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-bright);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

export const CornerDecor = styled.div`
  position: absolute;
  width: 16px; height: 16px;
  pointer-events: none;
  z-index: 5;

  &.tl { top: 40px; left: 0; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
  &.tr { top: 40px; right: 0; border-top: 1px solid var(--accent); border-right: 1px solid var(--accent); }
  &.bl { bottom: 0; left: 0; border-bottom: 1px solid var(--accent); border-left: 1px solid var(--accent); }
  &.br { bottom: 0; right: 0; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }
`;

export const SceneMount = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;

export const ScenePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.4;
  }

  .icon {
    font-family: var(--mono);
    font-size: 32px;
    color: var(--border-glow);
    z-index: 1;
  }

  .label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    z-index: 1;
  }
`;

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

export const LoadingSpinner = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;

    width: 32px;
    height: 32px;

    border: 4px solid rgba(255,255,255,0.2);
    border-top: 4px solid white;
    border-radius: 50%;

    animation: ${spin} 1s linear infinite;

    z-index: 9999;
`;

export const SceneContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
`;

export const SceneMountRef = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;
  outline: none;
`;

export const SceneSettingsButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${p => p.$active ? 'rgba(0, 212, 255, 0.2)' : 'rgba(13, 24, 32, 0.9)'};
  color: ${p => p.$active ? 'var(--accent)' : '#ffffff'};
  cursor: pointer;
  z-index: 20;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${p => p.$active ? 'rgba(0, 212, 255, 0.25)' : 'rgba(18, 33, 45, 0.95)'};
  }
`;

// ─── Config panel ─────────────────────────────────────────────────────────────

export const ConfigPanel = styled.aside`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  overflow: hidden;
  animation: ${fadeSlideIn} 0.4s ease 0.1s both;
`;

export const ConfigScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ConfigPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FakeSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .name {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .val {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--accent);
  }

  .track {
    height: 2px;
    background: var(--border);
    border-radius: 1px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: ${() => Math.random() * 60 + 20}%;
      background: var(--accent);
      border-radius: 1px;
    }
  }
`;

export const ConfigFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const Btn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 1px solid ${p => p.$primary ? 'var(--accent)' : 'var(--border)'};
  background: ${p => p.$primary ? 'var(--accent-dim)' : 'transparent'};
  color: ${p => p.$primary ? 'var(--accent)' : 'var(--text-muted)'};
  cursor: pointer;
  border-radius: var(--panel-radius);
  transition: all 0.15s ease;
  animation: ${p => p.$primary ? pulseGlow : 'none'} 3s ease-in-out infinite;

  &:hover {
    background: ${p => p.$primary ? '#00d4ff33' : 'var(--surface-2)'};
    color: ${p => p.$primary ? 'var(--accent)' : 'var(--text)'};
    border-color: ${p => p.$primary ? 'var(--accent)' : 'var(--border-glow)'};
  }
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.div`
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border-glow), transparent);
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.label`
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const Value = styled.span`
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  min-width: 28px;
  text-align: right;
`;

export const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: var(--border);
  outline: none;
  border-radius: 1px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    cursor: pointer;
    transition: box-shadow 0.15s ease;
  }

  &:hover::-webkit-slider-thumb {
    box-shadow: 0 0 12px var(--accent);
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    cursor: pointer;
    border: none;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--panel-radius);
  color: var(--text-bright);
  font-family: var(--mono);
  font-size: 11px;
  padding: 6px 10px;
  outline: none;
  transition: border-color 0.15s ease;
  letter-spacing: 0.06em;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-dim);
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Toggle = styled.button<{ $on: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid ${p => p.$on ? 'var(--accent)' : 'var(--border)'};
  border-radius: 2px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${p => p.$on ? 'var(--accent)' : 'var(--text-muted)'};
  background: ${p => p.$on ? 'var(--accent-dim)' : 'transparent'};
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  span.pip {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${p => p.$on ? 'var(--accent)' : 'var(--border-glow)'};
    box-shadow: ${p => p.$on ? '0 0 5px var(--accent)' : 'none'};
    transition: all 0.15s ease;
  }
`;

export const SegmentRow = styled.div`
  display: flex;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 3px;
  border-radius: var(--panel-radius);
`;

export const Seg = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 4px 0;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${p => p.$active ? 'var(--accent)' : 'transparent'};
  color: ${p => p.$active ? '#000' : 'var(--text-muted)'};

  &:hover {
    background: ${p => p.$active ? 'var(--accent)' : 'var(--accent-dim)'};
    color: ${p => p.$active ? '#000' : 'var(--accent)'};
  }
`;

export const ComplexityCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--panel-radius);
`;

export const ComplexityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const ComplexityLabel = styled.span`
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  flex-shrink: 0;
  width: 60px;
`;

export const ComplexityBar = styled.div<{ $pct: number; $warn: boolean }>`
  flex: 1;
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${p => Math.min(p.$pct, 100)}%;
    background: ${p => p.$warn ? 'var(--accent-2)' : 'var(--accent)'};
    border-radius: 1px;
    transition: width 0.2s ease, background 0.2s ease;
  }
`;

export const ComplexityValue = styled.span<{ $warn: boolean }>`
  font-family: var(--mono);
  font-size: 9px;
  color: ${p => p.$warn ? 'var(--accent-2)' : 'var(--text-bright)'};
  min-width: 52px;
  text-align: right;
  transition: color 0.2s ease;
`;

export const ComplexityDivider = styled.div`
  height: 1px;
  background: var(--border);
  margin: 0 -2px;
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TotalLabel = styled.span`
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const TotalValue = styled.span<{ $level: 'low' | 'mid' | 'high' }>`
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p =>
    p.$level === 'high' ? 'var(--accent-2)' :
    p.$level === 'mid'  ? '#f0c040' :
    'var(--accent)'
  };
`;

export const SliderTrack = styled.div`
  position: relative;
  height: 2px;
  background: var(--border);
  border-radius: 1px;
`;

export const SliderFill = styled.div<{ $pct: number }>`
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: ${p => p.$pct}%;
  background: var(--accent);
  border-radius: 1px;
  pointer-events: none;
`;

export const SliderWrapper = styled.div`
  position: relative;
  height: 10px;
  display: flex;
  align-items: center;
`;

export const Hint = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--panel-radius);
`;

export const HintRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const HintLabel = styled.span`
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const HintBar = styled.div<{ $pct: number; $color: string }>`
  flex: 1;
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${p => p.$pct}%;
    background: ${p => p.$color};
    border-radius: 1px;
    transition: width 0.2s ease;
  }
`;

export const HintValue = styled.span`
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text-bright);
  min-width: 28px;
  text-align: right;
`;


export const AnimatedSection = styled(Section)`
  padding: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(0, 212, 255, 0.14);
  border-radius: 14px;
  transition: transform 0.25s ease, border-color 0.2s ease, background 0.2s ease;
  animation: ${fadeSlideIn} 0.45s ease both;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 212, 255, 0.28);
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const AnimatedTitle = styled(SectionTitle)`
  position: relative;
  padding-right: 20px;

  &::before {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

export const StepList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 10px;
  list-style: none;
`;

export const StepItem = styled.li`
  position: relative;
  color: var(--text-muted);
  font-family: var(--mono);
  line-height: 1.75;
  font-size: 0.95rem;

  &::before {
    content: "›";
    position: absolute;
    left: -1.1rem;
    color: var(--accent);
    font-size: 1rem;
    line-height: 1.5;
  }
`;