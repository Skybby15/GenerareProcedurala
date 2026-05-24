export class CancelledGenerationError extends Error {
    cancelled = true

    constructor() {
        super("Cancelled")
        this.name = "CancelledGenerationError"
    }
}
