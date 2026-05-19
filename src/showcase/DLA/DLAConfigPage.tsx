import { useEffect } from "react";
import type { DLAConfigValues } from "../../helpers/configs/DLAConfig";
import { ComplexityPreview } from "../../helpers/ui/ComplexityPreview";
import * as Styled from "../../helpers/ui/StyledPrimitives";
import { SliderField } from "../../helpers/ui/SliderField";
import { setAccentColor } from "../../helpers/ui/setAccentColor";

interface DLAConfigProps {
  values: DLAConfigValues;
  onChange: (values: DLAConfigValues) => void;
}

export default function DLAConfigPage({ values, onChange }: DLAConfigProps) {
    const set = <K extends keyof DLAConfigValues>(key: K, val: DLAConfigValues[K]) =>
        onChange({ ...values, [key]: val });

    useEffect(()=>{
        setAccentColor("cyan");
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
                placeholder="e.g. 0"
                />
            </Styled.Field>
            </Styled.Section>

            {/* ── Grid ── */}
            <Styled.Section>
            <Styled.SectionTitle>Grid</Styled.SectionTitle>
            <SliderField
                label="Grid Size"
                value={values.gridSize}
                min={32} max={512} step={32}
                onChange={v => set("gridSize", v)}
            />
            </Styled.Section>

            {/* ── Simulation ── */}
            <Styled.Section>
            <Styled.SectionTitle>Simulation</Styled.SectionTitle>
            <SliderField
                label="Particles"
                value={values.particles}
                min={10} max={10_000} step={10}
                onChange={v => set("particles", v)}
            />
            <SliderField
                label="Steps"
                value={values.steps}
                min={10} max={10_000} step={10}
                onChange={v => set("steps", v)}
            />

            <ComplexityPreview
                particles={values.particles}
                steps={values.steps}
                gridSize={values.gridSize}
            />
            </Styled.Section>

        </Styled.Wrap>
    );
}