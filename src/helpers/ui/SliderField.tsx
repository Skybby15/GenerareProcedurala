import * as Styled from "./StyledPrimitives";

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <Styled.Field>
      <Styled.FieldRow>
        <Styled.Label>{label}</Styled.Label>
        <Styled.Value>{value}</Styled.Value>
      </Styled.FieldRow>
      <Styled.Slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </Styled.Field>
  );
}