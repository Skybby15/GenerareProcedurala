import * as Styled from "./StyledPrimitives";

export function OctavePreview({ octaves, persistence, lacunarity }: {
  octaves: number;
  persistence: number;
  lacunarity: number;
}) {
  const bars = Array.from({ length: octaves }, (_, i) => ({
    amplitude: Math.pow(persistence, i),
    frequency: Math.pow(lacunarity, i),
  }));
  const maxAmp = bars[0].amplitude;
  const maxFreq = bars[bars.length - 1].frequency;

  return (
    <Styled.Hint>
      {bars.map((b, i) => (
        <Styled.HintRow key={i}>
          <Styled.HintLabel>OCT {i + 1}</Styled.HintLabel>
          <Styled.HintBar
            $pct={(b.amplitude / maxAmp) * 100}
            $color="var(--accent)"
          />
          <Styled.HintValue>{fmt(b.amplitude, 2)}</Styled.HintValue>
          <Styled.HintBar
            $pct={Math.min((b.frequency / maxFreq) * 100, 100)}
            $color="var(--accent-2)"
          />
          <Styled.HintValue>{fmt(b.frequency, 1)}×</Styled.HintValue>
        </Styled.HintRow>
      ))}
    </Styled.Hint>
  );
}

function fmt(value: number, decimals = 2) {
  return Number.isInteger(value) ? String(value) : value.toFixed(decimals);
}
