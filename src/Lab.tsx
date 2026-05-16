import { useState, useCallback } from "react";
import * as Styled from "./helpers/ui/ConfigPrimitives";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SceneConfigPair = {
  id: string;
  label: string;
  scene: React.ComponentType<{ config: any }>;
  config: React.ComponentType<{
    values: any;
    onChange: (values: any) => void;
  }>;
  defaultConfig: any;
};


interface LabProps {
  pairs: SceneConfigPair[];
}

export default function Lab({ pairs }: LabProps) {
  const [activePairId, setActivePairId] = useState<string>(pairs[0]?.id ?? "");
  const [configValues, setConfigValues] = useState<Record<string, unknown>>(
    Object.fromEntries(pairs.map(p => [p.id, p.defaultConfig]))
  );

  const activePair = pairs.find(p => p.id === activePairId);
  const activeConfig = configValues[activePairId];

  const handleConfigChange = useCallback(
    (values: unknown) => {
      setConfigValues(prev => ({ ...prev, [activePairId]: values }));
    },
    [activePairId]
  );

  const handleReset = useCallback(() => {
    if (!activePair) return;
    setConfigValues(prev => ({ ...prev, [activePairId]: activePair.defaultConfig }));
  }, [activePair, activePairId]);

  return (
    <>
      <Styled.GlobalStyle />
      <Styled.Shell>

        {/* ── Top bar ── */}
        <Styled.TopBar>
          {/* Home button */}
          <Styled.HomeBtn>
            <Styled.HomeIcon className="home-icon" viewBox="0 0 16 16">
              <path d="M1 7L8 1L15 7" />
              <path d="M3 5.5V14H6.5V10H9.5V14H13V5.5" />
            </Styled.HomeIcon>
            <Styled.HomeLabelGroup>
              <Styled.HomeLabel className="home-label">Home</Styled.HomeLabel>
            </Styled.HomeLabelGroup>
            <Styled.HomeDot className="home-dot" />
          </Styled.HomeBtn>
          {pairs.length > 1 && (
            <Styled.ModeSelector>
              {pairs.map(pair => (
                <Styled.ModeTab
                  key={pair.id}
                  $active={pair.id === activePairId}
                  onClick={() => setActivePairId(pair.id)}
                >
                  {pair.label}
                </Styled.ModeTab>
              ))}
            </Styled.ModeSelector>
          )}
        </Styled.TopBar>

        {/* ── Workspace ── */}
        <Styled.Workspace>

          {/* Scene */}
          <Styled.ScenePanel>
            <Styled.PanelLabel>
              <span className="tag">VIEW //</span>
              <span className="title">{activePair?.label ?? "Scene"}</span>
            </Styled.PanelLabel>

            <Styled.CornerDecor className="tl" />
            <Styled.CornerDecor className="tr" />
            <Styled.CornerDecor className="bl" />
            <Styled.CornerDecor className="br" />

            <Styled.SceneMount>
              {activePair ? (
                <activePair.scene config={activeConfig} />
              ) : (
                <Styled.ScenePlaceholder>
                  <div className="grid-bg" />
                  <div className="icon">⬡</div>
                  <div className="label">No scene loaded</div>
                </Styled.ScenePlaceholder>
              )}
            </Styled.SceneMount>
          </Styled.ScenePanel>

          {/* Config */}
          <Styled.ConfigPanel>
            <Styled.PanelLabel>
              <span className="tag">CONFIGURATION //</span>
              <span className="title">Parameters</span>
            </Styled.PanelLabel>

            <Styled.ConfigScroll>
              {activePair ? (
                <activePair.config
                  values={activeConfig}
                  onChange={handleConfigChange}
                />
              ) : (
                /* skeleton when no pair is loaded */
                <Styled.ConfigPlaceholder>
                  {["seed", "grid_size", "density", "steps", "min_cluster"].map(name => (
                    <Styled.FakeSlider key={name}>
                      <div className="row">
                        <span className="name">{name}</span>
                        <span className="val">—</span>
                      </div>
                      <div className="track" />
                    </Styled.FakeSlider>
                  ))}
                </Styled.ConfigPlaceholder>
              )}
            </Styled.ConfigScroll>

            <Styled.ConfigFooter>
              <Styled.Btn onClick={handleReset}>Reset</Styled.Btn>
              <Styled.Btn $primary>Generate</Styled.Btn>
            </Styled.ConfigFooter>
          </Styled.ConfigPanel>

        </Styled.Workspace>

      </Styled.Shell>
    </>
  );
}