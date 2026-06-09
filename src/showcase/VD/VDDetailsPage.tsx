import type React from "react";
import * as Styled from "../../helpers/ui/StyledPrimitives";

export default function VDDetailsPage(): React.JSX.Element {
  return (
    <Styled.Wrap>
      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Overview</Styled.AnimatedTitle>
        <Styled.Hint>
          Voronoi diagrams partition space into regions around a set of seed
          points (sites). Each region contains all locations closer to its site
          than to any other. They are useful for natural-looking cells,
          territory maps, and tiling patterns. The interactive scene above
          visualizes sites and their corresponding Voronoi cells.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>How It Works</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Place a set of sites (random, grid, or user-defined).</Styled.StepItem>
            <Styled.StepItem>Compute the Voronoi cell for each site by nearest-distance.</Styled.StepItem>
            <Styled.StepItem>Optionally relax sites (Lloyd's algorithm) to produce
              more even regions.</Styled.StepItem>
            <Styled.StepItem>Clip or project cells to the scene bounds and render polygons.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Parameters</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem><strong>Site count</strong>: number of seed points creating regions.</Styled.StepItem>
            <Styled.StepItem><strong>Seed distribution</strong>: random, Poisson, grid, or custom placement.</Styled.StepItem>
            <Styled.StepItem><strong>Distance metric</strong>: Euclidean, Manhattan, or custom metric.</Styled.StepItem>
            <Styled.StepItem><strong>Relaxation</strong>: iterations of Lloyd's algorithm for centroidal Voronoi.</Styled.StepItem>
            <Styled.StepItem><strong>Bounding</strong>: clipping to scene bounds or applying wrap/periodic edges.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Use Cases</Styled.AnimatedTitle>
        <Styled.Hint>
          <Styled.StepList>
            <Styled.StepItem>Procedural territory and biome partitioning.</Styled.StepItem>
            <Styled.StepItem>Mesh cell decomposition and tiling for rendering.</Styled.StepItem>
            <Styled.StepItem>Voronoi-based textures, art, and pattern generation.</Styled.StepItem>
            <Styled.StepItem>Simulating growth, influence zones, and nearest-neighbor maps.</Styled.StepItem>
          </Styled.StepList>
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Performance Notes</Styled.AnimatedTitle>
        <Styled.Hint>
          Exact Voronoi computation (e.g., Fortune's algorithm) is typically
          O(n log n). Rasterized or grid-approximate approaches trade accuracy
          for speed and scale well for many sites. Use spatial indexing or
          tiling for large site counts and limit relaxation iterations.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          Extend to power diagrams (weighted Voronoi), apply anisotropic
          distance metrics, compute 3D Voronoi, or integrate site attributes
          (colors, weights). Use centroidal relaxation for more uniform cells
          or constrain sites to features like coastlines or existing geometry.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
