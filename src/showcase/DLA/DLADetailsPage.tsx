import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function DLADetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Diffusion-Limited Aggregation simulates particles diffusing until
          they adhere to an existing cluster. The process generates organic,
          branching fractal shapes that resemble lightning, mineral deposits,
          or coral growth. The scene above shows particles walking and
          sticking to a growing aggregate.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>
              Place an initial seed or aggregate in the simulation grid.
            </Styled.StepItem>
            <Styled.StepItem>
              Spawn walker particles along the edge or in empty space.
            </Styled.StepItem>
            <Styled.StepItem>
              Each walker performs a random walk and checks for proximity to
              the cluster.
            </Styled.StepItem>
            <Styled.StepItem>
              When a walker reaches the sticking threshold, it attaches and
              becomes part of the aggregate.
            </Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>
              <strong>Mode</strong>: chooses the output view type for the
              generated structure.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Particles</strong>: number of walkers released into the
              simulation.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Steps</strong>: maximum walker movement iterations before
              a particle is discarded.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Stick radius</strong>: how close a walker must come to
              the cluster to attach.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Stick proximity</strong>: proximity threshold used when
              checking stick conditions against the existing aggregate.
            </Styled.StepItem>
            <Styled.StepItem>
              <strong>Spawn behavior</strong>: edge or empty-centre spawning for
              different growth patterns.
            </Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Visualizing growth processes and branching patterns.</Styled.StepItem>
            <Styled.StepItem>Generating fractal textures and natural-looking structures.</Styled.StepItem>
            <Styled.StepItem>Exploring diffusion-limited systems in art or science.</Styled.StepItem>
            <Styled.StepItem>Simulating dendritic and aggregate growth for games or visualization.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          DLA can be expensive because many walkers may wander without
          finding the cluster. Limiting steps, reusing spawn radii, or using
          spatial acceleration can keep iteration time manageable.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Add fields, anisotropic diffusion, or alternate attach rules for
          richer structures. You can also explore 3D modes, multi-species
          walkers, or goal-directed drift for more complex aggregates.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
