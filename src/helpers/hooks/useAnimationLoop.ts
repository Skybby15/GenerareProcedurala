import { useEffect, useRef } from "react"
import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/Addons.js"

export function useAnimationLoop({
    mountRef,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    keysRef
}: {
    mountRef: React.RefObject<HTMLDivElement | null>
    sceneRef: React.RefObject<THREE.Scene | null>
    cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
    rendererRef: React.RefObject<THREE.WebGLRenderer | null>
    controlsRef: React.RefObject<OrbitControls | null>
    keysRef: React.RefObject<Record<string, boolean>>
}) {
    const animationRef = useRef<number | null>(null)
    const statsRef = useRef<Stats | null>(null)

    const forwardRef = useRef<THREE.Vector3>(new THREE.Vector3())
    const flatForwardRef = useRef<THREE.Vector3>(new THREE.Vector3())
    const rightRef = useRef<THREE.Vector3>(new THREE.Vector3())

    useEffect(() => {
        const scene = sceneRef.current
        const camera = cameraRef.current
        const renderer = rendererRef.current
        const mount = mountRef.current

        const forward = forwardRef.current
        const flatForward = flatForwardRef.current
        const right = rightRef.current

        if (!scene || !camera || !renderer || !mount) return

        const controls = controlsRef.current
        const keys = keysRef.current

        if (!statsRef.current) {

            const stats = new Stats()
            stats.showPanel(0) // sets it to be the fps panel
            mount.appendChild(stats.dom)
            stats.dom.style.position = "absolute";
            stats.dom.style.pointerEvents = "none";

            statsRef.current = stats
        }

        const animate = () => {
            statsRef.current?.begin()

            controls?.update()
            renderer.render(scene, camera)

            let speed = 0.2

            // movement vectors
            camera.getWorldDirection(forward)
            forward.normalize()

            flatForward.copy(forward)
            flatForward.y = 0
            flatForward.normalize()

            right.set(-flatForward.z, 0, flatForward.x)

            if (keys["ShiftLeft"]) speed *= 2

            if (keys["KeyW"]) {
                camera.position.addScaledVector(forward, speed)
                controls?.target.addScaledVector(forward, speed)
            }

            if (keys["KeyS"]) {
                camera.position.addScaledVector(forward, -speed)
                controls?.target.addScaledVector(forward, -speed)
            }

            if (keys["KeyA"]) {
                camera.position.addScaledVector(right, -speed)
                controls?.target.addScaledVector(right, -speed)
            }

            if (keys["KeyD"]) {
                camera.position.addScaledVector(right, speed)
                controls?.target.addScaledVector(right, speed)
            }

            statsRef.current?.end()
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }

            statsRef.current?.dom?.remove()
            statsRef.current = null
        }

    },[mountRef,cameraRef,controlsRef,keysRef,sceneRef,rendererRef])
}