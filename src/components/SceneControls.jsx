import './SceneControls.css'

const SPEEDS = [1, 5, 20]

export default function SceneControls({ paused, onTogglePause, speed, onSpeedChange }) {
  return (
    <div className="scene-controls">
      <button
        className="scene-controls__play"
        onClick={onTogglePause}
        aria-pressed={paused}
        title={paused ? 'Resume orbits' : 'Pause orbits'}
      >
        {paused ? '▶' : '❚❚'}
        <span>{paused ? 'Resume' : 'Pause'}</span>
      </button>

      <div className="scene-controls__speeds" role="group" aria-label="Orbit speed">
        {SPEEDS.map((value) => (
          <button
            key={value}
            className={value === speed ? 'is-active' : ''}
            onClick={() => onSpeedChange(value)}
            aria-pressed={value === speed}
          >
            {value}×
          </button>
        ))}
      </div>
    </div>
  )
}
