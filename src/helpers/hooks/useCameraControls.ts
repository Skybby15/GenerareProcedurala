import { useEffect, useRef, type RefObject } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

export function useCameraControls(
    cameraRef: RefObject<THREE.PerspectiveCamera | null>,
    rendererRef: RefObject<THREE.WebGLRenderer | null>
) {
    const controlsRef = useRef<OrbitControls | null>(null)
    const keysRef = useRef<Record<string, boolean>>({})

    useEffect(() => {
        const camera = cameraRef.current
        const renderer = rendererRef.current

        if (!camera || !renderer) return

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.enableZoom = true
        controls.zoomSpeed = 1.3
        controls.minDistance = 5
        controls.maxDistance = 900

        if (controlsRef.current) {
            controls.target.copy(controlsRef.current.target)
        }

        controlsRef.current = controls

        // 🎮 keyboard input
        const onKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.code] = true
        }

        const onKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.code] = false
        }

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)

        return () => {
            controls.dispose()
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }

    }, [cameraRef, rendererRef])

    return {
        controlsRef,
        keysRef
    }
}