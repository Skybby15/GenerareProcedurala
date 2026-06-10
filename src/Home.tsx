import * as Styled from "./helpers/ui/StyledPrimitives";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CAConfigPresets } from "./helpers/configs/CAConfig";
import CustomScenePage from "./showcase/CustomScenePage";


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
              <span className="tag">CUSTOM MODEL //</span>
              <span className="title">Placeholder Preview</span>
            </Styled.PanelLabel>
            <Styled.HeroSplit>
              <Styled.PlaceholderScene>
                <CustomScenePage config={CAConfigPresets.default} />
              </Styled.PlaceholderScene>
              <Styled.HeroContent>
                <Styled.ModelBadge>Powered by Cellular Automata</Styled.ModelBadge>
                <Styled.HeroTitle>Custom procedural model coming soon</Styled.HeroTitle>
                <Styled.HeroDescription>
                  This placeholder uses the existing CA pipeline while the final custom model is developed.
                </Styled.HeroDescription>
                <Styled.HeroDescription>
                  The scene stays centered, and this panel gives a compact explanation alongside it.
                </Styled.HeroDescription>
              </Styled.HeroContent>
            </Styled.HeroSplit>
            <Styled.HeroActionButton onClick={navigateToLab}>
              Explore the Lab
            </Styled.HeroActionButton>
          </Styled.HeroPanel>
        </Styled.HomeContainer>
      </Styled.Shell>
    </>
  );
}
