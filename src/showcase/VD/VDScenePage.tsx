import { useEffect, useRef } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { VDConfigValues } from "../../helpers/configs/VDConfig";
import { VDTerritoriesMeshBuilder } from "../../engine/renderers/VD/VDTerritoriesMeshBuilder";
import { VD2DGridGenerator } from "../../engine/generators/VD/VD2DGridGenerator";
import { useMarkerPopup } from "../../helpers/hooks/useMarkerPopup";

interface VD2DSceneProps {
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
            new VD2DGridGenerator(),
            new VDTerritoriesMeshBuilder(),
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

    const popup = useMarkerPopup({
        mountRef,
        cameraRef,
        sceneRef
    })

    return (
        <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
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
        </div>
    );
}