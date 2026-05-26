import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { DLAConfigValues } from "../../helpers/configs/DLAConfig";
import { DLAPlaneMeshBuilder } from "../../engine/renderers/DLA/DLAPlaneMeshBuilder";
import { CaveSceneMode } from "../../engine/scenemodes/CaveSceneMode";
import { DLACaveMeshBuilder } from "../../engine/renderers/DLA/DLACaveMeshBuilder";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";
import type { SceneSettingsValues } from "../../helpers/types/SceneSettings";
import SceneSettingsComponent from "../SceneSettingsComponent";

type DLASceneProps = {
    config: DLAConfigValues;
    settings: SceneSettingsValues;
    setSettings: Dispatch<SetStateAction<SceneSettingsValues>>;
}

export default function DLAScenePage({ config, settings, setSettings }: DLASceneProps) {
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

    const getSetup : setupFunction<DLAConfigValues> = useCallback((config) => {
        switch (config.mode) {
            case "2DSmooth":
            return {
                sceneMode: new PlaneSceneMode(),
                pipeline: new Pipeline(new DLAPlaneMeshBuilder()),
                type: "DLA2D"
            };

            case "3DCave":
            return {
                sceneMode: new CaveSceneMode(),
                pipeline: new Pipeline(new DLACaveMeshBuilder()),
                type: "DLA3D"
            };
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
        settings,
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
    },[setSettings])

    return (
        <Styled.SceneContainer
        >
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