import { useEffect, useRef, type RefObject } from "react"
import * as THREE from "three"
import { PointerLockControls } from "three/examples/jsm/Addons.js"

export function useCameraControls(
    cameraRef: RefObject<THREE.PerspectiveCamera | null>,
    rendererRef: RefObject<THREE.WebGLRenderer | null>,
    mountRef: RefObject<HTMLDivElement | null>
) {
    const controlsRef = useRef<PointerLockControls | null>(null)
    const keysRef = useRef<Record<string, boolean>>({})
    const focusedRef = useRef(false)
    

    useEffect(() => {
        const camera = cameraRef.current
        const renderer = rendererRef.current
        const mount = mountRef.current

        if (!camera || !renderer || !mount) return

        const controls = new PointerLockControls(camera, renderer.domElement)
        controlsRef.current = controls

        const onKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.code] = true
        }

        const onKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.code] = false
        }

        renderer.domElement.addEventListener("click", () => {
            if (controls.isLocked) {
                controls.unlock();
            } else {
                controls.lock();
            }
        });

        const onFocus = () => {
            focusedRef.current = true
        }

        const onBlur = () => {
            focusedRef.current = false

            for (const key in keysRef.current) {
                keysRef.current[key] = false
            }
        }

        const onPointerDown = () => {
            mount.focus({
                preventScroll: true
            })
        }

        mount.addEventListener("focus", onFocus)
        mount.addEventListener("blur", onBlur)
        mount.addEventListener("pointerdown", onPointerDown)

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)

        return () => {
            controls.dispose()
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)

            mount.removeEventListener("focus", onFocus)
            mount.removeEventListener("blur", onBlur)
            mount.removeEventListener("pointerdown", onPointerDown)
        }

    }, [cameraRef, rendererRef, mountRef])

    return {
        focusedRef,
        keysRef
    }
}