import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function PNDetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Cellular Automata are grid-based simulations where each cell updates
          based on local neighbor rules. Repeating simple rules can create
          caves, textures, and organic patterns. The interactive scene above uses
          a grid in which every cell only has one of two states: "empty" or
          "full". Full cells appear as green (plane) or brownish (cave) spots.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Initialize a 2D or 3D grid with filled/empty cells.</Styled.StepItem>
            <Styled.StepItem>Count neighbors around each cell.</Styled.StepItem>
            <Styled.StepItem>Apply survival/birth rules based on thresholds.</Styled.StepItem>
            <Styled.StepItem>Repeat for multiple iterations to let patterns emerge.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem><strong>Grid size</strong>: width, height, and depth of the representation.</Styled.StepItem>
            <Styled.StepItem><strong>Initial density</strong>: chance each cell begins filled.</Styled.StepItem>
            <Styled.StepItem><strong>Steps</strong>: number of simulation iterations.</Styled.StepItem>
            <Styled.StepItem><strong>Min / max neighbors</strong>: survival and birth conditions.</Styled.StepItem>
            <Styled.StepItem><strong>Edge behavior</strong>: whether the border counts as empty or full.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Procedural cave generation.</Styled.StepItem>
            <Styled.StepItem>Organic terrain masks.</Styled.StepItem>
            <Styled.StepItem>Texture and pattern synthesis.</Styled.StepItem>
            <Styled.StepItem>Emergent behavior demonstrations.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          Complexity scales with grid size and iteration count. For 3D grids,
          keep iteration counts moderate and use chunked updates
          for smoother interaction.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Although this model uses only two states, it can be extended to
          multiple cell types like water, grass, stone, or dirt. More states
          increase rule complexity because cells may need to change type based
          on neighboring cell types rather than just binary alive/dead transitions.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
