import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function PNDetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Perlin noise is a gradient-based procedural noise technique used to
          generate smooth, natural-looking textures and heightfields. It
          produces band-limited, continuous values that blend smoothly across
          space, useful for terrain, clouds, and organic patterns. The scene
          above visualizes Perlin noise mapped to color or displacement.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Define a lattice of gradient vectors at integer grid points.</Styled.StepItem>
            <Styled.StepItem>For a sample point, compute dot products with corner gradients.</Styled.StepItem>
            <Styled.StepItem>Interpolate those dot values using a smooth easing curve.</Styled.StepItem>
            <Styled.StepItem>Combine multiple octaves (frequencies) for fractal noise.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem><strong>Scale</strong>: base frequency that controls feature size.</Styled.StepItem>
            <Styled.StepItem><strong>Octaves</strong>: number of layered frequencies to combine.</Styled.StepItem>
            <Styled.StepItem><strong>Persistence</strong>: amplitude falloff between octaves.</Styled.StepItem>
            <Styled.StepItem><strong>Lacunarity</strong>: frequency multiplier between octaves.</Styled.StepItem>
            <Styled.StepItem><strong>Seed</strong>: random seed for gradient generation.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Heightmap and terrain generation.</Styled.StepItem>
            <Styled.StepItem>Clouds, smoke, and volumetric textures.</Styled.StepItem>
            <Styled.StepItem>Procedural textures for materials and detail maps.</Styled.StepItem>
            <Styled.StepItem>Animated noise for natural motion and variation.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          Noise evaluation is cheap per sample but becomes costly for large
          dense fields or many octaves. Prefer GPU shaders for realtime noise
          and sample caching for repeated queries. Reduce octaves or resolution
          when profiling hotspots.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Use Simplex noise for fewer artifacts and better performance in
          higher dimensions, apply domain warping for richer structures, or
          blend multiple noise types. Map outputs to palettes, terraces, or
          slope-based masks for stylized terrains.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
