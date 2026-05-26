import * as THREE from 'three'
import type { ISceneMode } from '../../engine/scenemodes/ISceneMode';
import type { GeneratorType } from '../types/GeneratorTypes';
import { useEffect, useRef, useState } from 'react';
import { SceneManager } from '../../engine/manager/SceneManager';
import type { Pipeline } from '../../engine/pipeline/Pipeline';
import type { BasicConfigValues } from '../types/BasicConfig';
import type { SceneSettingsValues } from '../types/SceneSettings';

export type setupFunction<TConfig extends BasicConfigValues> = (config: TConfig) => SceneSetup<TConfig>

type SceneSetup<TConfig> = {
  sceneMode: ISceneMode<TConfig>;
  pipeline: Pipeline<any>;
  type: GeneratorType;
};

type UseGeneratedSceneArgs<TConfig extends BasicConfigValues> = {
  config: TConfig;
  mountRef: React.RefObject<HTMLDivElement | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.Camera | null>;
  getSetup: setupFunction<TConfig>;
  settings: SceneSettingsValues;
  debounceMs?: number;
};

export function useGeneratedScene<TConfig extends BasicConfigValues>({
  config,
  mountRef,
  sceneRef,
  cameraRef,
  getSetup,
  settings,
  debounceMs = 150,
}: UseGeneratedSceneArgs<TConfig>) {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const loadIdRef = useRef(0);
  const managerRef = useRef<SceneManager<any> | null>(null);

  useEffect(() => {
    const currentLoadId = ++loadIdRef.current;
    const firstRenderSettings: SceneSettingsValues = {
      resetCameraPosition : true,
    }

    const loadScene = async () => {
      const renderSettins = isFirstRender ? firstRenderSettings : settings
      setIsFirstRender(false)

      setLoading(true);
      await new Promise(requestAnimationFrame);

      if (currentLoadId !== loadIdRef.current) return;

      const mount = mountRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      if (!mount || !scene || !camera) {
        if (currentLoadId === loadIdRef.current) setLoading(false);
        return;
      }

      if (!managerRef.current) {
        managerRef.current = new SceneManager(scene, camera);
      }

      const setup = getSetup(config);

      if (!setup) {
        setLoading(false);
        return;
      }

      await managerRef.current.loadAsync(
        setup.sceneMode,
        setup.pipeline,
        config,
        renderSettins,
        setup.type
      );

      if (currentLoadId === loadIdRef.current) {
        setLoading(false);
      }
    };

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(loadScene, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [config, getSetup, debounceMs, cameraRef, mountRef, sceneRef, isFirstRender]);

  return { loading };
}