import * as Styled from "../../helpers/ui/StyledPrimitives";
import { useCallback, useMemo, useRef, useState } from "react";
import type { WorldConfigValues } from "../../helpers/configs/WorldConfig";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import { WorldPlaneMeshBuilder } from "../../engine/renderers/Custom/WorldPlaneMeshBuilder";
import { useGeneratedScene, type setupFunction } from "../../helpers/hooks/useGeneratedScene";
import { WorldSceneMode } from "../../engine/scenemodes/WorldSceneMode";

interface WorldSceneProps {
    config: WorldConfigValues;
}

export default function WorldScenePage({ config }: WorldSceneProps) {
    const [seed] = useState<string>(() => Math.random().toString());
    const mountRef = useRef<HTMLDivElement>(null);

    const { rendererRef, sceneRef, cameraRef } = useThreeScene(mountRef);

    const getSetup: setupFunction<WorldConfigValues> = useCallback(() => {
        return {
            sceneMode: new WorldSceneMode(),
            pipeline: new Pipeline(new WorldPlaneMeshBuilder()),
            type: "W2D"
        };
    }, []);

    const memoConfig = useMemo(() => ({
        ...config,
        seed,
    }), [config, seed]);

    const { loading } = useGeneratedScene({
        config: memoConfig,
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
        showFPS: false
    });

    return (
        <Styled.SceneContainer>
            <Styled.SceneMountRef ref={mountRef} />
            {loading && <Styled.LoadingSpinner />}
        </Styled.SceneContainer>
    );
}
