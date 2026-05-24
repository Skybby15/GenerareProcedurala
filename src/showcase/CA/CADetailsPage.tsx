import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives"

export default function CADetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.Section>
        <Styled.SectionTitle>Cellular Automata Overview</Styled.SectionTitle>
        <Styled.Hint>
          Cellular Automata are grid-based simulations where each cell updates
          based on local neighbor rules. Repeating simple rules can create
          caves, textures, and organic patterns.
        </Styled.Hint>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>How It Works</Styled.SectionTitle>
        <Styled.Hint>
            <p>Initialize a 2D or 3D grid with filled/empty cells.</p>
            <p>Count neighbors around each cell.</p>
            <p>Apply survival/birth rules based on thresholds.</p>
            <p>Repeat for multiple iterations.</p>
        </Styled.Hint>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>Parameters</Styled.SectionTitle>
        <Styled.Hint>          
            <p><strong>Grid size</strong>: width, height, and depth.</p>
            <p><strong>Initial density</strong>: starting fill probability.</p>
            <p><strong>Steps</strong>: number of simulation iterations.</p>
            <p><strong>Min / max neighbors</strong>: survival thresholds.</p>
            <p><strong>Seed</strong>: deterministic random value.</p>
        </Styled.Hint>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>Use Cases</Styled.SectionTitle>
        <Styled.Hint>
            <p>Procedural cave generation.</p>
            <p>Organic terrain masks.</p>
            <p>Texture and pattern synthesis.</p>
            <p>Emergent behavior demonstrations.</p>
        </Styled.Hint>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>Performance Notes</Styled.SectionTitle>
        <Styled.Hint>
          Complexity is proportional to grid size and iteration count. For 3D
          grids, use Web Workers, chunking, and reduced iteration counts for
          smoother interaction.
        </Styled.Hint>
      </Styled.Section>
    </Styled.Wrap>
  );
}