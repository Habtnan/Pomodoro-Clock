import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

function PomodoroClock() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60); // Time in seconds
  const [isRunning, setIsRunning] = React.useState(false);
  const [isSession, setIsSession] = React.useState(true); // Track if it's a session or break
  const beepRef = React.useRef(null);

  // Format time to always be in mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update displayed time when sessionLength changes
  React.useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  // Play the beep sound and handle audio properly
  const playBeep = () => {
    if (beepRef.current) {
      beepRef.current.currentTime = 0; // Reset audio to start from the beginning
      beepRef.current.play().then(() => {
        // Audio played successfully
      }).catch((error) => {
        console.error("Audio playback error:", error);
      });
    }
  };

  // Timer effect
  React.useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            // Play the beep sound when reaching 00:00
            playBeep();

            // Toggle between session and break
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isSession, breakLength, sessionLength]);

  // Handle reset functionality
  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  // Handle break increment and decrement with boundaries
  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength((prev) => prev + 1);
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength((prev) => prev - 1);
    }
  };

  // Handle session increment and decrement with boundaries
  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength((prev) => prev + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength((prev) => prev - 1);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Pomodoro Clock</h1>
      <div className="settings">
        <div className="break">
          <div id="break-label" className="label">Break Length</div>
          <div className="control">
            <button id="break-decrement" className="btn" onClick={handleBreakDecrement}>-</button>
            <span id="break-length" className="value">{breakLength}</span>
            <button id="break-increment" className="btn" onClick={handleBreakIncrement}>+</button>
          </div>
        </div>
        <div className="session">
          <div id="session-label" className="label">Session Length</div>
          <div className="control">
            <button id="session-decrement" className="btn" onClick={handleSessionDecrement}>-</button>
            <span id="session-length" className="value">{sessionLength}</span>
            <button id="session-increment" className="btn" onClick={handleSessionIncrement}>+</button>
          </div>
        </div>
      </div>

      <div className="timer">
        <div id="timer-label" className="timer-label">{isSession ? "Session" : "Break"}</div>
        <div id="time-left" className="time">{formatTime(timeLeft)}</div>
      </div>

      <div className="controls">
        <button id="start_stop" className="btn start-stop" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" className="btn reset" onClick={handleReset}>Reset</button>
      </div>

      {/* Ensure the audio is 1 second or longer */}
      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
/>

    </div>
  );
}

ReactDOM.render(<PomodoroClock />, document.getElementById('root'));






