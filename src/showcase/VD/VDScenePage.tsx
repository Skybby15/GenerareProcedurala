import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { VDConfigValues } from "../../helpers/configs/VDConfig";
import { VDTerritoriesMeshBuilder } from "../../engine/renderers/VD/VDTerritoriesMeshBuilder";
import { useMarkerPopup } from "../../helpers/hooks/useMarkerPopup";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";
import type { SceneSettingsValues } from "../../helpers/types/SceneSettings";
import SceneSettingsComponent from "../SceneSettingsComponent";

type VD2DSceneProps = {
    config: VDConfigValues;
    settings: SceneSettingsValues;
    setSettings: Dispatch<SetStateAction<SceneSettingsValues>>;
}

export default function VDScenePage({ config, settings, setSettings }: VD2DSceneProps) {
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

    const getSetup : setupFunction<VDConfigValues> = useCallback(() => {
        return {
            sceneMode: new PlaneSceneMode(),
            pipeline: new Pipeline(new VDTerritoriesMeshBuilder()),
            type: "VD2D"
        };
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

    const popup = useMarkerPopup({
        mountRef,
        cameraRef,
        sceneRef
    })

    useEffect(()=>{
        setSettings((prev) => ({
            ...prev,
            resetCameraPosition: true,
        }));
    })

    return (
    <Styled.SceneContainer
    >
        <Styled.SceneMountRef
        ref={mountRef}
        >
            {!loading && 
                <SceneSettingsComponent 
                    settings={settings}
                    setSettings={setSettings}
                />
            }   
            {popup && (
                <div
                    style={{
                        position: "absolute",
                        left: popup.screenX,
                        top: popup.screenY,
                        background: "#222",
                        color: "white",
                        padding: "8px",
                        borderRadius: "8px",
                        pointerEvents: "none"
                    }}
                >
                    <div>X: {popup.x.toFixed(2)}</div>
                    <div>Y: {popup.y.toFixed(2)}</div>
                    <div>Weight: {popup.weight.toFixed(2)}</div>
                </div>
            )}
        </Styled.SceneMountRef>

        {loading && (
        <Styled.LoadingSpinner/>
        )}
    </Styled.SceneContainer>
    );
}