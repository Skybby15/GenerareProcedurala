import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useCallback, useRef } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { VDConfigValues } from "../../helpers/configs/VDConfig";
import { VDTerritoriesMeshBuilder } from "../../engine/renderers/VD/VDTerritoriesMeshBuilder";
import { useMarkerPopup } from "../../helpers/hooks/useMarkerPopup";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";

type VD2DSceneProps = {
  config: VDConfigValues;
}

export default function VDScenePage({ config }: VD2DSceneProps) {
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
        getSetup
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

    return (
    <Styled.SceneContainer
    >
        <Styled.SceneMountRef
        ref={mountRef}
        >
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