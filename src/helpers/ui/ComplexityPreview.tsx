import * as Styled from "./ConfigPrimitives";

// Estimates simulation cost: O(particles × steps)
export function ComplexityPreview({ particles, steps, gridSize }: {
  particles: number;
  steps: number;
  gridSize: number;
}) {
  const ops = particles * steps;
  const maxOps = 10_000 * 500;
  const opsPct = pct(ops, 0, maxOps);
  const opsWarn = ops > 200_000;

  const density = (particles / (gridSize * gridSize)) * 100;
  const densityWarn = density > 50;

  const level: 'low' | 'mid' | 'high' =
    ops > 400_000 ? 'high' : ops > 150_000 ? 'mid' : 'low';

  const levelLabel = level === 'high' ? 'HEAVY' : level === 'mid' ? 'MODERATE' : 'LIGHT';

  function fmtOps(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  }

  return (
    <Styled.ComplexityCard>
      <Styled.ComplexityRow>
        <Styled.ComplexityLabel>Walk ops</Styled.ComplexityLabel>
        <Styled.ComplexityBar $pct={opsPct} $warn={opsWarn} />
        <Styled.ComplexityValue $warn={opsWarn}>{fmtOps(ops)}</Styled.ComplexityValue>
      </Styled.ComplexityRow>

      <Styled.ComplexityRow>
        <Styled.ComplexityLabel>Density</Styled.ComplexityLabel>
        <Styled.ComplexityBar $pct={density} $warn={densityWarn} />
        <Styled.ComplexityValue $warn={densityWarn}>{density.toFixed(1)}%</Styled.ComplexityValue>
      </Styled.ComplexityRow>

      <Styled.ComplexityDivider />

      <Styled.TotalRow>
        <Styled.TotalLabel>Sim cost</Styled.TotalLabel>
        <Styled.TotalValue $level={level}>{levelLabel}</Styled.TotalValue>
      </Styled.TotalRow>
    </Styled.ComplexityCard>
  );
}


function pct(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}