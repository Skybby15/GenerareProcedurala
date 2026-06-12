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
        <Styled.Hint>
          Right click on one of the marks on the scene to see a popup with the coordinates and weight of the site.
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
            <Styled.StepItem><strong>Number of sites</strong>: number of seed points creating regions.</Styled.StepItem>
            <Styled.StepItem><strong>Distance metric</strong>: Euclidean, Manhattan, or custom metric.</Styled.StepItem>
            <Styled.StepItem><strong>Relaxation</strong>: iterations of Lloyd's algorithm for centroidal Voronoi.</Styled.StepItem>
            <Styled.StepItem><strong>Weights</strong>: weights can be added for each site if weighted Voronoi is desired. This adds a random weight from a chosen range to each site.</Styled.StepItem>
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
          Exact Voronoi computation is typically
          O(n^2) or O(n^3) depending on how many dimensions are used, with n being the grid size.
          Using relaxation (Lloyd's algorithm) adds additional iterations, 
          so keep site counts moderate for real-time interaction.
        </Styled.Hint>
      </Styled.AnimatedSection>

      <Styled.AnimatedSection>
        <Styled.AnimatedTitle>Possible Modifications</Styled.AnimatedTitle>
        <Styled.Hint>
          The representation above counts the distance for every cell to every site, which is simple but inefficient. 
          More efficient algorithms like Fortune's sweep line or jump flooding can compute Voronoi diagrams in O(n log n) time.
        </Styled.Hint>
        <Styled.Hint>
          The algorithm can be extended into a 3d representation (Voronoi tessellation) by using a 3D grid and computing the nearest site in 3D space.
        </Styled.Hint>
      </Styled.AnimatedSection>
    </Styled.Wrap>
  );
}
