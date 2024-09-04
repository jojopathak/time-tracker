import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Stopwatch.css";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem('sessions')) || [];
    setSessions(storedSessions);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleRunning = () => {
    if (!isRunning) {
      setSessionStartTime(new Date());
    } else {
      const sessionEndTime = new Date();
      logSession(sessionStartTime, sessionEndTime);
    }
    setIsRunning(!isRunning);
  };

  const resetTime = () => {
    setTime(0);
    setIsRunning(false);
    setSessionStartTime(null);
  };

  const toggleMode = () => {
    setIsStudyMode(!isStudyMode);
  };

  const logSession = (start, end) => {
    const session = {
      start: start.toISOString(),
      end: end.toISOString(),
      duration: (end - start) / 1000,
      category: isStudyMode ? 'Study' : 'Work',
      date: start.toISOString().split('T')[0]
    };

    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  };

  const exportToCSV = () => {
    const csvData = sessions.map(session => ({
      Date: session.date,
      Start: session.start,
      End: session.end,
      Duration: session.duration,
      Category: session.category
    }));
    return csvData;
  };

  const getSessionsByDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === formattedDate);
  };

  const getTotalTimeByCategory = (category) => {
    return sessions
      .filter(session => session.category === category)
      .reduce((total, session) => total + session.duration, 0);
  };

  const displaySessions = getSessionsByDate(selectedDate);

  return (
    <div className="stopwatch-container">
      <div className="mode-toggle">
        <span className={`mode ${isStudyMode ? "active" : ""}`}>Study</span>
        <label className="switch">
          <input type="checkbox" checked={!isStudyMode} onChange={toggleMode} />
          <span className="slider"></span>
        </label>
        <span className={`mode ${!isStudyMode ? "active" : ""}`}>Work</span>
      </div>

      <div className="timer-display">
        {new Date(time * 1000).toISOString().substr(11, 8)}
      </div>

      <div className="controls">
        <button className="control-button" onClick={toggleRunning}>
          <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
        </button>
        <button className="control-button" onClick={resetTime}>
          <FontAwesomeIcon icon={faStop} />
        </button>
      </div>

      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          className="date-picker"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
        <FontAwesomeIcon icon={faCalendarAlt} />
      </div>

      <div className="session-log">
        <h3>Sessions on {selectedDate.toDateString()}</h3>
        <ul>
          {displaySessions.length > 0 ? displaySessions.map((session, index) => (
            <li key={index}>
              {session.category} | Start: {new Date(session.start).toLocaleTimeString()} | End: {new Date(session.end).toLocaleTimeString()} | Duration: {Math.round(session.duration / 60)} min
            </li>
          )) : <p>No sessions logged for this day.</p>}
        </ul>
      </div>

      <div className="total-time">
        <h3>Total Time</h3>
        <p>Study: {Math.round(getTotalTimeByCategory('Study') / 60)} min</p>
        <p>Work: {Math.round(getTotalTimeByCategory('Work') / 60)} min</p>
      </div>

      <div className="export-csv">
        <CSVLink data={exportToCSV()} filename={`sessions-${selectedDate.toISOString().split('T')[0]}.csv`}>
          <button className="control-button">
            Export CSV
          </button>
        </CSVLink>
      </div>
    </div>
  );
};

export default Stopwatch;
