import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Stopwatch from "./StopWatch/Stopwatch";
import PomodoroTimer from "./Pomodoro/PomodoroTimer";
import Stats from "./Stats/Stats";
import Navbar from "./Navbar/Navbar";
import DatePicker from "./Calendar/Calendar";
import './App.css'; // Import any additional styles if needed

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Stopwatch />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/stats" element={<Stats />} /> {/* No need to pass data prop */}
          <Route path="/calendar" element={<DatePicker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
