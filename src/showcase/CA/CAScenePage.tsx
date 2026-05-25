import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { CAConfigValues } from "../../helpers/configs/CAConfig";
import type { SceneSettingsValues } from "../../helpers/types/SceneSettings";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import { CA2DSmoothMeshBuilder } from "../../engine/renderers/CA/CA2DSmoothMeshBuilder";
import { CA2DBlockMeshBuilder } from "../../engine/renderers/CA/CA2DBlockMeshBuilder";
import { CA3DCaveMeshBuilder } from "../../engine/renderers/CA/CA3DCaveMeshBuilder";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";
import { CaveSceneMode } from "../../engine/scenemodes/CaveSceneMode";
import SceneSettingsComponent from "../SceneSettingsComponent";

type CASceneProps = {
    config: CAConfigValues;
    settings: SceneSettingsValues;
    setSettings: Dispatch<SetStateAction<SceneSettingsValues>>;
}

export default function CAScenePage({ config, settings, setSettings }: CASceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const {
    rendererRef,
    sceneRef,
    cameraRef,
  } = useThreeScene(mountRef);

  const {
    focusedRef,
    keysRef
  } = useCameraControls(cameraRef, rendererRef, mountRef);

  const getSetup : setupFunction<CAConfigValues> = useCallback((config) => {
    switch(config.mode){
      case "Smooth2D":
        return {
          sceneMode: new PlaneSceneMode(),
          pipeline: new Pipeline(new CA2DSmoothMeshBuilder()),
          type: "CA2D" 
        }
      case "Blocky2D":
        return {
          sceneMode: new PlaneSceneMode(),
          pipeline: new Pipeline(new CA2DBlockMeshBuilder()),
          type: "CA2D"
        }
      case "Cave3D":
        return {
          sceneMode: new CaveSceneMode(),
          pipeline: new Pipeline(new CA3DCaveMeshBuilder()),
          type: "CA3D"
        }
    }
  }, []);

  const { 
      loading 
  } = useGeneratedScene({
      config,
      mountRef,
      sceneRef,
      cameraRef,
      getSetup,
      settings
  })

  useAnimationLoop({
    mountRef,
    sceneRef,
    cameraRef,
    rendererRef,
    keysRef,
    focusedRef
  })

  useEffect(()=>{
    setSettings((prev) => ({
      ...prev,
      resetCameraPosition: true,
    }));
  })

  return (
    <Styled.SceneContainer>
      <Styled.SceneMountRef
        ref={mountRef}
      >
        {!loading &&
          <SceneSettingsComponent settings={settings} setSettings={setSettings} />
        }
      </Styled.SceneMountRef>

      {loading && (
        <Styled.LoadingSpinner/>
      )}
    </Styled.SceneContainer>
  );
}