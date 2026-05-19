import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useEffect, useRef, useState } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { PNConfigValues } from "../../helpers/configs/PNConfig";
import { PNPlaneMeshBuilder } from "../../engine/renderers/PN/PNPlaneMeshBuilder";
import type { GeneratorType } from "../../helpers/types/GeneratorTypes";

interface PNSceneProps {
    config: PNConfigValues;
}

export default function PNScenePage({ config }: PNSceneProps) {
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
            setLoading(true)
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
                new PNPlaneMeshBuilder()
            )
            const type : GeneratorType = "PN2D"

            manager.loadAsync(sceneMode, pipeline, config, type)
            .then(() => 
                setLoading(false)
            )
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            loadScene();
        },150);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };

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