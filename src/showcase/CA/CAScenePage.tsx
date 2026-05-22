import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useEffect, useRef, useState } from "react";
import type { CAConfigValues } from "../../helpers/configs/CAConfig";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { GeneratorType } from "../../helpers/types/GeneratorTypes";
import { CA2DSmoothMeshBuilder } from "../../engine/renderers/CA/CA2DSmoothMeshBuilder";
import type { IMeshBuilder } from "../../engine/renderers/IMeshBuilder";
import { CA2DBlockMeshBuilder } from "../../engine/renderers/CA/CA2DBlockMeshBuilder";
import { CA3DCaveMeshBuilder } from "../../engine/renderers/CA/CA3DCaveMeshBuilder";
import type { ISceneMode } from "../../engine/scenemodes/ISceneMode";
import { CaveSceneMode } from "../../engine/scenemodes/CaveSceneMode";

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
      const mode = config.mode;
      const mount = mountRef.current;
      if (!mount) return;

      // ── Scene setup ─────────────────────────────────────────────────────────

      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      if (!renderer || !scene || !camera || !controls) return;

      const manager = new SceneManager(scene,camera,controls);

      
      let meshBuilder : IMeshBuilder<any,any>
      let sceneMode : ISceneMode<CAConfigValues>
      let type : GeneratorType

      switch(mode){
        case "Smooth2D":
          meshBuilder = new CA2DSmoothMeshBuilder()
          sceneMode = new PlaneSceneMode()
          type = "CA2D"
          break
        case "Blocky2D":
          meshBuilder = new CA2DBlockMeshBuilder()
          sceneMode = new PlaneSceneMode()
          type = "CA2D"
          break
        case "Cave3D":
          meshBuilder = new CA3DCaveMeshBuilder()
          sceneMode = new CaveSceneMode()
          type = "CA3D"
      }

      const pipeline = new Pipeline(
          meshBuilder
      )

      manager.loadAsync(sceneMode, pipeline, config, type);
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
        <Styled.LoadingSpinner/>
      )}
    </Styled.SceneContainer>
  );
}