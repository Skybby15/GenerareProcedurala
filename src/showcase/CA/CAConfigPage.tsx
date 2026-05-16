
import { useEffect } from "react";
import type { CAConfigValues } from "../../helpers/configs/CAConfig";
import * as Styled from "../../helpers/ui/ConfigPrimitives";
import { SliderField } from "../../helpers/ui/SliderField";
import { setAccentColor } from "../../helpers/ui/setAccentColor";

interface CA2DConfigProps {
  values: CAConfigValues;
  onChange: (values: CAConfigValues) => void;
}

export default function CA2DConfig({ values, onChange }: CA2DConfigProps) {
  const set = <K extends keyof CAConfigValues>(key: K, val: CAConfigValues[K]) =>
    onChange({ ...values, [key]: val });

  useEffect(()=>{
    setAccentColor("blue");
  },[])

  return (
    <Styled.Wrap>

      {/* ── Seed ── */}
      <Styled.Section>
        <Styled.SectionTitle>Seed</Styled.SectionTitle>
        <Styled.Field>
          <Styled.Label>Seed String</Styled.Label>
          <Styled.TextInput
            type="text"
            value={values.seed}
            onChange={e => set("seed", e.target.value)}
            placeholder="e.g. world_01"
          />
        </Styled.Field>
      </Styled.Section>

      {/* ── Grid ── */}
      <Styled.Section>
        <Styled.SectionTitle>Grid</Styled.SectionTitle>
        <SliderField
          label="Grid Size"
          value={values.gridSize}
          min={16} max={128} step={8}
          onChange={v => set("gridSize", v)}
        />
        <SliderField
          label="Initial Density %"
          value={values.initialGridDensity}
          min={10} max={90}
          onChange={v => set("initialGridDensity", v)}
        />
        <SliderField
          label="Steps"
          value={values.steps}
          min={0} max={20}
          onChange={v => set("steps", v)}
        />
      </Styled.Section>

      {/* ── Birth rules ── */}
      <Styled.Section>
        <Styled.SectionTitle>Birth Rules</Styled.SectionTitle>
        <SliderField
          label="Min Birth Neighbors"
          value={values.minimumBirthNeighbors}
          min={0} max={8}
          onChange={v => set("minimumBirthNeighbors", v)}
        />
        <SliderField
          label="Max Birth Neighbors"
          value={values.maximumBirthNeighbors}
          min={0} max={8}
          onChange={v => set("maximumBirthNeighbors", v)}
        />
      </Styled.Section>

      {/* ── Survival rules ── */}
      <Styled.Section>
        <Styled.SectionTitle>Survival Rules</Styled.SectionTitle>
        <SliderField
          label="Min Survival Neighbors"
          value={values.minimumSurvivalNeighbors}
          min={0} max={8}
          onChange={v => set("minimumSurvivalNeighbors", v)}
        />
        <SliderField
          label="Max Survival Neighbors"
          value={values.maximumSurvivalNeighbors}
          min={0} max={8}
          onChange={v => set("maximumSurvivalNeighbors", v)}
        />
      </Styled.Section>

      {/* ── Edge behavior ── */}
      <Styled.Section>
        <Styled.SectionTitle>Edge Behavior</Styled.SectionTitle>
        <Styled.SegmentRow>
          {(["dead", "alive"] as const).map(opt => (
            <Styled.Seg
              key={opt}
              $active={values.edgeBehavior === opt}
              onClick={() => set("edgeBehavior", opt)}
            >
              {opt}
            </Styled.Seg>
          ))}
        </Styled.SegmentRow>
      </Styled.Section>

      {/* ── Structures ── */}
      <Styled.Section>
        <Styled.SectionTitle>Structures</Styled.SectionTitle>
        <Styled.ToggleRow>
          <Styled.Label>Allow Isolated</Styled.Label>
          <Styled.Toggle
            $on={values.allowIsolatedStructures}
            onClick={() => set("allowIsolatedStructures", !values.allowIsolatedStructures)}
          >
            <span className="pip" />
            {values.allowIsolatedStructures ? "ON" : "OFF"}
          </Styled.Toggle>
        </Styled.ToggleRow>
        {!values.allowIsolatedStructures && (
          <SliderField
            label="Min Structure Size"
            value={values.minimumStructureSize}
            min={1} max={100}
            onChange={v => set("minimumStructureSize", v)}
          />
        )}
      </Styled.Section>

    </Styled.Wrap>
  );
}