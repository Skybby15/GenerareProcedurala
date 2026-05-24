import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useCallback, useRef } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { PNConfigValues } from "../../helpers/configs/PNConfig";
import { PNPlaneMeshBuilder } from "../../engine/renderers/PN/PNPlaneMeshBuilder";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";

type PNSceneProps = {
    config: PNConfigValues;
}

export default function PNScenePage({ config }: PNSceneProps) {
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

    const getSetup : setupFunction<PNConfigValues> = useCallback(() => {
        return {
            sceneMode: new PlaneSceneMode(),
            pipeline: new Pipeline(new PNPlaneMeshBuilder()),
            type: "PN2D"
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

    return (
    <Styled.SceneContainer>
        <Styled.SceneMountRef
        ref={mountRef}
        />

        {loading && (
        <Styled.LoadingSpinner/>
        )}
    </Styled.SceneContainer>
    );
}