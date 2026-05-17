import { useEffect, useRef } from "react"
import * as THREE from "three"

export function useThreeScene(mountRef: React.RefObject<HTMLDivElement | null>) {
    const resizeTimerRef = useRef<number | null>(0);

    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const mount = mountRef.current

        const width = mount.clientWidth
        const height = mount.clientHeight

        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene()
            sceneRef.current.background = new THREE.Color('#0d1117')
        }

        if (!cameraRef.current) {
            const camera = new THREE.PerspectiveCamera(
                55,
                width / height,
                1,
                700
            );

            cameraRef.current = camera
        }

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ antialias: true })
            renderer.setSize(width, height)
            renderer.setPixelRatio(window.devicePixelRatio * 0.7)

            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFShadowMap

            renderer.setClearColor(0x080c10)

            renderer.domElement.style.width = "100%"
            renderer.domElement.style.height = "100%"

            mount.appendChild(renderer.domElement)

            rendererRef.current = renderer
        }

        const renderer = rendererRef.current
        const camera = cameraRef.current

        const resizeObserver = new ResizeObserver(() => {
            if(resizeTimerRef.current)
                clearTimeout(resizeTimerRef.current)

            resizeTimerRef.current = window.setTimeout(()=>{
                if (!mount || !renderer || !camera) return

                const w = mount.clientWidth
                const h = mount.clientHeight

                renderer.setSize(w, h)
                camera.aspect = w / h
                camera.updateProjectionMatrix()
            }, 150)
        })

        resizeObserver.observe(mount)

        return () => {
            resizeObserver.disconnect()

            if (renderer) {
                renderer.dispose()
            }

            if (resizeTimerRef.current) {
               clearTimeout(resizeTimerRef.current);
            }
        }

    }, [mountRef])

    return {
        sceneRef,
        cameraRef,
        rendererRef,
    }
}