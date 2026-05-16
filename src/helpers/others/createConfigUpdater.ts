export function createConfigUpdater<T>(
    setConfig: React.Dispatch<React.SetStateAction<T>>
) {
    return function <K extends keyof T>(
        key: K,
        value: T[K]
    ) {
        setConfig(prev => ({
            ...prev,
            [key]: value
        }))
    }
}