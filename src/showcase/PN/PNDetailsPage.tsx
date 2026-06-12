import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function PNDetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Perlin noise is a gradient noise algorithm created by Ken Perlin.
          It generates smooth, continuous values by interpolating gradients at
          integer lattice points, producing natural-looking terrain, clouds,
          and organic textures. The scene above renders Perlin noise as color
          and displacement on a 2D plane.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>
              Assign gradient vectors to each grid point in the lattice.
            </Styled.StepItem>
            <Styled.StepItem>
              For a sample location, compute dot products with the gradients at
              the surrounding corners.
            </Styled.StepItem>
            <Styled.StepItem>
              Interpolate those values using a smooth fade curve to avoid
              visible seams.
            </Styled.StepItem>
            <Styled.StepItem>
              Layer multiple octaves to create fractal detail and richer noise.
            </Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>
              <strong>Scale</strong>: base frequency of the noise field, which
              changes overall feature size.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Amplitude</strong>: output magnitude applied to the
              sampled noise for color or displacement intensity.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Octaves</strong>: number of noise layers combined for
              added detail.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Persistence</strong>: amplitude falloff for each successive octave.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Lacunarity</strong>: frequency growth factor between octaves.
            </Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Terrain heightmaps and procedural landscapes.</Styled.StepItem>
            <Styled.StepItem>Clouds, smoke, and natural texture generation.</Styled.StepItem>
            <Styled.StepItem>Detail maps for materials and surface variation.</Styled.StepItem>
            <Styled.StepItem>Animated noise fields for motion and weather effects.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          Per-sample noise is inexpensive, but higher grid resolution or many
          octaves increases cost. Use lower detail or GPU evaluation for real-time
          scenes, and cache samples when the same noise values are reused.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Swap Perlin noise for Simplex noise to reduce grid artifacts, use
          domain warping for more complex structures, or blend multiple noise
          functions for hybrid patterns and stylized results.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
