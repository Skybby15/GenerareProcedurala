import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function DLADetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Diffusion-Limited Aggregation (DLA) models cluster formation by
          particles performing random walks until they stick to an existing
          aggregate. The result is tree-like, fractal structures resembling
          mineral deposits, lightning paths, or coral. The interactive scene
          visualizes particles walking and joining the growing aggregate.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Seed an initial aggregate (single particle or shape).</Styled.StepItem>
            <Styled.StepItem>Spawn walker particles at the boundary or from infinity.</Styled.StepItem>
            <Styled.StepItem>Each walker performs a random walk until it contacts the aggregate.</Styled.StepItem>
            <Styled.StepItem>On contact, the walker sticks and becomes part of the aggregate; repeat.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem><strong>Spawn radius</strong>: where walkers are introduced relative to the aggregate.</Styled.StepItem>
            <Styled.StepItem><strong>Walk rules</strong>: step types (4/8-neighbor, continuous random walk) and bias.</Styled.StepItem>
            <Styled.StepItem><strong>Stick condition</strong>: contact distance or probability of adhesion.</Styled.StepItem>
            <Styled.StepItem><strong>Particle count</strong>: total walkers to aggregate or target size.</Styled.StepItem>
            <Styled.StepItem><strong>Bounds</strong>: clipping, kill-radius, or periodic edges to manage walkers.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Modeling lightning, mineral deposits, and dendritic patterns.</Styled.StepItem>
            <Styled.StepItem>Procedural growth for plants, corals, or root systems.</Styled.StepItem>
            <Styled.StepItem>Artistic and generative visuals with fractal aesthetics.</Styled.StepItem>
            <Styled.StepItem>Studying diffusion-limited processes and scaling laws.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          Naive DLA can be expensive because many walkers wander far before
          sticking. Use acceleration: kill-radius, launch-radius adaptation,
          spatial hashing, or biased walks. Parallelizing independent walkers
          or using GPU compute speeds up large aggregates.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Variations include adding attraction/repulsion fields, particle
          size and branching rules, anisotropic diffusion, or multi-species
          walkers with different sticking behaviors. Convert to continuous
         -space DLA or couple with flow fields for richer structures.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
