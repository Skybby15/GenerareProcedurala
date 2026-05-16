import { useEffect } from "react";
import type { PNConfigValues } from "../../helpers/configs/PNConfig";
import * as Styled from "../../helpers/ui/ConfigPrimitives";
import { OctavePreview } from "../../helpers/ui/OctavePreview";
import { setAccentColor } from "../../helpers/ui/setAccentColor";
import { SliderField } from "../../helpers/ui/SliderField";


interface PNConfigProps {
  values: PNConfigValues;
  onChange: (values: PNConfigValues) => void;
}

export default function PNConfigPage({ values, onChange }: PNConfigProps) {
    const set = <K extends keyof PNConfigValues>(key: K, val: PNConfigValues[K]) =>
        onChange({ ...values, [key]: val });


    useEffect(()=>{
        setAccentColor("violet");
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

            {/* ── Noise ── */}
            <Styled.Section>
                <Styled.SectionTitle>Noise</Styled.SectionTitle>
                <SliderField
                label="Scale"
                value={values.scale}
                min={1} max={200}
                onChange={v => set("scale", v)}
                />
                <SliderField
                label="Amplitude"
                value={values.amplitude}
                min={0.1} max={5} step={0.1}
                onChange={v => set("amplitude", v)}
                />
            </Styled.Section>

            {/* ── Octaves ── */}
            <Styled.Section>
                <Styled.SectionTitle>Octaves</Styled.SectionTitle>
                <SliderField
                label="Octaves"
                value={values.octaves}
                min={1} max={12}
                onChange={v => set("octaves", v)}
                />
                <SliderField
                label="Persistence"
                value={values.persistance}
                min={0.1} max={1} step={0.01}
                onChange={v => set("persistance", v)}
                />
                <SliderField
                label="Lacunarity"
                value={values.lacunarity}
                min={1} max={8} step={0.1}
                onChange={v => set("lacunarity", v)}
                />

                {/* Per-octave amplitude (cyan) vs frequency (orange) preview */}
                <OctavePreview
                octaves={values.octaves}
                persistence={values.persistance}
                lacunarity={values.lacunarity}
                />
            </Styled.Section>

        </Styled.Wrap>
    );
}