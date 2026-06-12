import * as Styled from "./helpers/ui/StyledPrimitives";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import WorldScenePage from "./showcase/Custom/WorldScenePage";
import { WorldConfigPresets } from "./helpers/configs/WorldConfig";


export default function Home() {
  const navigate = useNavigate();

  const navigateToLab = () => {
    navigate("/lab");
  }

  const homeContainerRef = useRef<HTMLDivElement | null>(null);

  const handleHomeClick = () => {
    const el = homeContainerRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else if (el) {
      el.scrollTop = 0;
    }
  }

  return (
    <>
      <Styled.GlobalStyle />
      <Styled.Shell>
          <Styled.TopBar>
          <Styled.HomeBtn onClick={handleHomeClick}>
            <Styled.HomeIcon className="home-icon" viewBox="0 0 16 16">
              <path d="M1 7L8 1L15 7" />
              <path d="M3 5.5V14H6.5V10H9.5V14H13V5.5" />
            </Styled.HomeIcon>
            <Styled.HomeLabelGroup>
              <Styled.HomeLabel className="home-label">Home</Styled.HomeLabel>
            </Styled.HomeLabelGroup>
            <Styled.HomeDot className="home-dot" />
          </Styled.HomeBtn>
          <Styled.ModeSelector>
            <Styled.ModeTab 
              $active
              onClick={navigateToLab}
            >
              Showcase
            </Styled.ModeTab>
          </Styled.ModeSelector>
        </Styled.TopBar>

        <Styled.HomeContainer ref={homeContainerRef}>
          <Styled.HeroPanel>
            <Styled.PanelLabel>
              <span className="tag">WORLD MODEL //</span>
              <span className="title">Welcome</span>
            </Styled.PanelLabel>
            <Styled.HeroSplit>
              <Styled.PlaceholderScene>
                <WorldScenePage config={WorldConfigPresets.default} />
              </Styled.PlaceholderScene>
              <Styled.HeroContent>
                <Styled.HeroTitle>Shape Entire Worlds with Procedural Generation</Styled.HeroTitle>
                <Styled.HeroDescription>
                  Generate vast and diverse environments using a collection of procedural algorithms.
                  From terrain formation and biome placement to river networks and cave systems,
                  every world is created automatically from configurable generation rules.
                </Styled.HeroDescription>
                <Styled.HeroDescription>
                  Harness the power of procedural generation to produce unique and reproducible environments. Combine multiple algorithms to generate terrain, ecosystems, waterways, and natural structures in real time.
                </Styled.HeroDescription>
              </Styled.HeroContent>
            </Styled.HeroSplit>
          </Styled.HeroPanel>
        </Styled.HomeContainer>
        <Styled.HeroActionButton onClick={navigateToLab}>
          Explore the Lab
        </Styled.HeroActionButton>
      </Styled.Shell>
    </>
  );
}
