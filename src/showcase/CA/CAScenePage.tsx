import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useEffect, useRef, useState } from "react";
import type { CAConfigValues } from "../../helpers/configs/CAConfig";
import { CA2DGridGenerator } from "../../engine/generators/CA/CN2DGridGenerator";
import { CA2DMeshBuilder } from "../../engine/renderers/CA/CAPlaneMeshBuilder";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";

interface CA2DSceneProps {
    config: CAConfigValues;
}

export default function CA2DScene({ config }: CA2DSceneProps) {
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const mountRef = useRef<HTMLDivElement>(null);
  const {
    rendererRef,
    sceneRef,
    cameraRef,
  } = useThreeScene(mountRef);

  const {
    controlsRef,
    keysRef
  } = useCameraControls(cameraRef, rendererRef);

  useEffect(() => {
    const loadScene = async () => {
      setLoading(true);
      const mount = mountRef.current;
      if (!mount) return;

      // ── Scene setup ─────────────────────────────────────────────────────────

      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      if (!renderer || !scene || !camera || !controls) return;

      const manager = new SceneManager(scene,camera,controls);

      const sceneMode = new PlaneSceneMode();
      const pipeline = new Pipeline(
          new CA2DGridGenerator(),
          new CA2DMeshBuilder()
    )

      manager.load(sceneMode, pipeline, config);
      setLoading(false);
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      loadScene();
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    }

  }, [config, rendererRef, sceneRef, cameraRef, controlsRef]);

  useAnimationLoop({
    mountRef,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    keysRef
  })

  return (
    <Styled.SceneContainer
    >
      <Styled.SceneMountRef
        ref={mountRef}
      />

      {loading && (
        <Styled.LoadingPanel>
          Loading...
        </Styled.LoadingPanel>
      )}
    </Styled.SceneContainer>
  );
}