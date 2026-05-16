import { useEffect, useRef } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { PNConfigValues } from "../../helpers/configs/PNConfig";
import { PN2DGridGenerator } from "../../engine/generators/PN/PN2DGridGenerator";
import { PNPlaneMeshBuilder } from "../../engine/renderers/PN/PNPlaneMeshBuilder";

interface PNSceneProps {
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
        controlsRef,
        keysRef
    } = useCameraControls(cameraRef, rendererRef);

    useEffect(() => {
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
            new PN2DGridGenerator(),
            new PNPlaneMeshBuilder()
        )

        manager.load(sceneMode, pipeline, config);

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
        <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />
    );
}