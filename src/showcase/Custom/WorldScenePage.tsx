import * as Styled from "../../helpers/ui/StyledPrimitives";
import { useCallback, useRef } from "react";
import type { WorldConfigValues } from "../../helpers/configs/WorldConfig";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import { WorldPlaneMeshBuilder } from "../../engine/renderers/Custom/WorldPlaneMeshBuilder";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";

interface WorldSceneProps {
    config: WorldConfigValues;
}

export default function WorldScenePage({ config }: WorldSceneProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    const { rendererRef, sceneRef, cameraRef } = useThreeScene(mountRef);
    const { focusedRef, keysRef } = useCameraControls(cameraRef, rendererRef, mountRef);

    const getSetup: setupFunction<WorldConfigValues> = useCallback(() => {
        return {
            sceneMode: new PlaneSceneMode(),
            pipeline: new Pipeline(new WorldPlaneMeshBuilder()),
            type: "W2D"
        };
    }, []);

    const { loading } = useGeneratedScene({
        config,
        mountRef,
        sceneRef,
        cameraRef,
        getSetup,
        settings:{
            resetCameraPosition: true,
        }
    });

    useAnimationLoop({
        mountRef,
        sceneRef,
        cameraRef,
        rendererRef,
        keysRef,
        focusedRef,
        showFPS: false
    });

    return (
        <Styled.SceneContainer>
            <Styled.SceneMountRef ref={mountRef} />
            {loading && <Styled.LoadingSpinner />}
        </Styled.SceneContainer>
    );
}
