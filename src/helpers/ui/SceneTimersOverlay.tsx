import * as Styled from "./StyledPrimitives";

export default function SceneTimersOverlay({resultTimers}: {resultTimers: {
    gridTime: number;
    meshTime: number;
    setupTime: number;
}}) {
    return(
        <Styled.SceneTimerOverlay>
            <span className="label">Scene timers</span>
            <div className="row">
                <span className="name">Setup</span>
                <span className="value">{resultTimers.setupTime.toFixed(1)} ms</span>
            </div>
            <div className="row">
                <span className="name">Grid</span>
                <span className="value">{resultTimers.gridTime.toFixed(1)} ms</span>
            </div>
            <div className="row">
                <span className="name">Mesh</span>
                <span className="value">{resultTimers.meshTime.toFixed(1)} ms</span>
            </div>
        </Styled.SceneTimerOverlay>
    )
}