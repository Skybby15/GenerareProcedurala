import type { DistanceMetric } from "../../helpers/types/DistanceMetric";
import type { VDConfigValues } from "../../helpers/configs/VDConfig";
import * as Styled from "../../helpers/ui/ConfigPrimitives";
import { SliderField } from "../../helpers/ui/SliderField";
import { setAccentColor } from "../../helpers/ui/setAccentColor";
import { useEffect } from "react";

const DISTANCE_METRICS: DistanceMetric[] = [
    "euclidean",
    "manhattan",
    "chebyshev",
    "minkowski",
];
 
interface VDConfigProps {
    values: VDConfigValues;
    onChange: (values: VDConfigValues) => void;
}
 
export default function VDConfigPage({ values, onChange }: VDConfigProps) {
    const set = <K extends keyof VDConfigValues>(key: K, val: VDConfigValues[K]) =>
        onChange({ ...values, [key]: val });

    useEffect(()=>{
        setAccentColor("limegreen");
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

            {/* ── Sites ── */}
            <Styled.Section>
            <Styled.SectionTitle>Sites</Styled.SectionTitle>
            <SliderField
                label="Number of Sites"
                value={values.sitesNumber}
                min={2} max={500}
                onChange={v => set("sitesNumber", v)}
            />
            <SliderField
                label="Relaxation Steps"
                value={values.relaxationSteps}
                min={0} max={20}
                onChange={v => set("relaxationSteps", v)}
            />
            </Styled.Section>

            {/* ── Distance function ── */}
            <Styled.Section>
            <Styled.SectionTitle>Distance Function</Styled.SectionTitle>
            <Styled.SegmentRow>
                {DISTANCE_METRICS.map(metric => (
                <Styled.Seg
                    key={metric}
                    $active={values.distanceFunction === metric}
                    onClick={() => set("distanceFunction", metric)}
                >
                    {metric}
                </Styled.Seg>
                ))}
            </Styled.SegmentRow>

            {values.distanceFunction === "minkowski" && (
                <>
                <SliderField
                    label="Minkowski P"
                    value={values.minkowskiP}
                    min={1} max={10} step={0.5}
                    onChange={v => set("minkowskiP", v)}
                />
                </>
            )}
            </Styled.Section>

            {/* ── Weighted sites ── */}
            <Styled.Section>
            <Styled.SectionTitle>Weights</Styled.SectionTitle>
            <Styled.ToggleRow>
                <Styled.Label>Weighted Sites</Styled.Label>
                <Styled.Toggle
                $on={values.weightedSites}
                onClick={() => set("weightedSites", !values.weightedSites)}
                >
                <span className="pip" />
                {values.weightedSites ? "ON" : "OFF"}
                </Styled.Toggle>
            </Styled.ToggleRow>

            {values.weightedSites && (
                <SliderField
                label="Max Weight"
                value={values.maxWeight}
                min={1} max={20} step={0.5}
                onChange={v => set("maxWeight", v)}
                />
            )}
        </Styled.Section>

    </Styled.Wrap>
    );
}