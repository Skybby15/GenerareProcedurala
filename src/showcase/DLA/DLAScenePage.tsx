import * as Styled from "../../helpers/ui/StyledPrimitives"
import { useEffect, useRef, useState } from "react";
import { useThreeScene } from "../../helpers/hooks/useThreeScene";
import { SceneManager } from "../../engine/manager/SceneManager";
import { useCameraControls } from "../../helpers/hooks/useCameraControls";
import { useAnimationLoop } from "../../helpers/hooks/useAnimationLoop";
import { PlaneSceneMode } from "../../engine/scenemodes/PlaneSceneMode";
import { Pipeline } from "../../engine/pipeline/Pipeline";
import type { DLAConfigValues } from "../../helpers/configs/DLAConfig";
import { DLAPlaneMeshBuilder } from "../../engine/renderers/DLA/DLAPlaneMeshBuilder";
import type { GeneratorType } from "../../helpers/types/GeneratorTypes";
import { CaveSceneMode } from "../../engine/scenemodes/CaveSceneMode";
import { DLACaveMeshBuilder } from "../../engine/renderers/DLA/DLACaveMeshBuilder";
import type { ISceneMode } from "../../engine/scenemodes/ISceneMode";

interface DLASceneProps {
    config: DLAConfigValues;
}

export default function DLAScenePage({ config }: DLASceneProps) {
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
            await new Promise(requestAnimationFrame);
            const mount = mountRef.current;
            const mode = config.mode;
            if (!mount) return;

            // ── Scene setup ─────────────────────────────────────────────────────────

            const renderer = rendererRef.current;
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            const controls = controlsRef.current;

            if (!renderer || !scene || !camera || !controls) return;

            const manager = new SceneManager(scene,camera,controls);

            let sceneMode : ISceneMode<any>;
            let pipeline : Pipeline<any>
            let type : GeneratorType = "DLA2D"

            switch(mode){
                case "2DSmooth":
                    sceneMode = new PlaneSceneMode();
                    pipeline = new Pipeline(
                        new DLAPlaneMeshBuilder()
                    )
                    type = "DLA2D"
                    break
                case "3DCave":
                    sceneMode = new CaveSceneMode();
                    pipeline = new Pipeline(
                        new DLACaveMeshBuilder()
                    )
                    type = "DLA3D"
                    break
            }

            manager.loadAsync(sceneMode, pipeline, config, type);
            setLoading(false)
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