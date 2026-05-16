import { useEffect, useState } from "react"
import * as THREE from "three"

type PopupData = {
    x: number
    y: number
    weight: number
    screenX: number
    screenY: number
}

export function useMarkerPopup({
    mountRef,
    cameraRef,
    sceneRef
}: {
    mountRef: React.RefObject<HTMLDivElement | null>
    cameraRef: React.RefObject<THREE.Camera | null>
    sceneRef: React.RefObject<THREE.Scene | null>
}) {

    const [popup, setPopup] = useState<PopupData | null>(null)

    useEffect(() => {

        const mount = mountRef.current
        const camera = cameraRef.current
        const scene = sceneRef.current

        if (!mount || !camera || !scene)
            return

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        const onClick = (event: MouseEvent) => {

            const rect = mount.getBoundingClientRect()

            mouse.x =
                ((event.clientX - rect.left) / rect.width) * 2 - 1

            mouse.y =
                -((event.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects =
                raycaster.intersectObjects(scene.children, true)

            for (const hit of intersects) {

                const site = hit.object.userData.site

                if (!site)
                    continue

                setPopup({
                    x: site.x,
                    y: site.y,
                    weight: site.weight,
                    screenX: event.clientX - rect.left,
                    screenY: event.clientY - rect.top
                })

                return
            }

            setPopup(null)
        }

        mount.addEventListener("click", onClick)

        return () => {
            mount.removeEventListener("click", onClick)
        }

    }, [mountRef, cameraRef, sceneRef])

    return popup
}