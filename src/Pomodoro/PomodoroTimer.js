import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('study');
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Time options for study/work and break
  const studyWorkTimes = [50, 25, 90];
  const breakTimes = [10, 20, 30];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 't' || event.key === 'T') {
        toggleMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect to update timer
  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (!isActive && time === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  // Start/Stop Timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Change Mode
  const toggleMode = () => {
    const modes = ['study', 'work', 'break'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
    // Reset time based on the new mode
    setTime(getInitialTime(modes[nextIndex]));
  };

  // Get initial time based on mode
  const getInitialTime = (mode) => {
    switch (mode) {
      case 'study':
      case 'work':
        return studyWorkTimes[0] * 60; // Default to first option (50 minutes)
      case 'break':
        return breakTimes[0] * 60; // Default to first option (10 minutes)
      default:
        return 0;
    }
  };

  // Handle time option change
  const handleTimeChange = (event) => {
    const selectedTime = parseInt(event.target.value, 10);
    setTime(selectedTime * 60); // Convert minutes to seconds
  };

  return (
    <div className="pomodoro-container">
      <div className="mode-toggle">
        <button
          className={`mode-button ${mode === 'study' ? 'active' : ''}`}
          onClick={() => setMode('study')}
        >
          Study
        </button>
        <button
          className={`mode-button ${mode === 'work' ? 'active' : ''}`}
          onClick={() => setMode('work')}
        >
          Work
        </button>
        <button
          className={`mode-button ${mode === 'break' ? 'active' : ''}`}
          onClick={() => setMode('break')}
        >
          Break
        </button>
      </div>
      <div className="timer-display">
        {Math.floor(time / 60).toString().padStart(2, '0')}:
        {(time % 60).toString().padStart(2, '0')}
      </div>
      <div className="time-options">
        <select onChange={handleTimeChange} value={Math.floor(time / 60)}>
          {mode === 'break'
            ? breakTimes.map((t) => (
                <option key={t} value={t}>
                  {t} minutes
                </option>
              ))
            : studyWorkTimes.map((t) => (
                <option key={t} value={t}>
                  {t} minutes
                </option>
              ))}
        </select>
      </div>
      <div className="controls">
        <button className="control-button" onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="control-button" onClick={() => setTime(getInitialTime(mode))}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
