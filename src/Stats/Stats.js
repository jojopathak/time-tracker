import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Stats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Stats = () => {
  const [timeRange, setTimeRange] = useState("day");
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loggedSessions = JSON.parse(localStorage.getItem('sessions')) || [];
    setData(loggedSessions);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getDataForTimeRange = () => {
    const sessions = data.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === selectedDate.toDateString();
    });

    const studyTime = sessions
      .filter(session => session.category === "Study")
      .reduce((total, session) => total + session.duration, 0);

    const workTime = sessions
      .filter(session => session.category === "Work")
      .reduce((total, session) => total + session.duration, 0);

    return {
      labels: ["Study", "Work"],
      times: [studyTime / 3600, workTime / 3600] // convert seconds to hours
    };
  };

  const { labels, times } = getDataForTimeRange();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Time (in hours)",
        data: times,
        backgroundColor: chartType === "bar" ? "rgba(75, 192, 192, 0.2)" : chartType === "pie" ? ["#FF6384", "#36A2EB"] : undefined,
        borderColor: chartType === "bar" ? "rgba(75, 192, 192, 1)" : undefined,
        borderWidth: chartType === "bar" ? 1 : undefined,
        fill: chartType === "line",
        hoverBackgroundColor: chartType === "pie" ? ["#FF6384", "#36A2EB"] : undefined,
      },
    ],
  };

  return (
    <div className="stats-container">
      <h2>Time Usage Stats</h2>
      <div className="controls">
        <label>
          Time Range:
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="day">Day</option>
            {/* Optionally, you can add "Month" and "Year" if needed */}
          </select>
        </label>
        <label>
          Chart Type:
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="line">Line</option>
          </select>
        </label>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        className="date-picker"
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
      />
      <div className="chart-container">
        {chartType === "bar" && <Bar data={chartData} />}
        {chartType === "pie" && <Pie data={chartData} />}
        {chartType === "line" && <Line data={chartData} />}
      </div>
    </div>
  );
};

export default Stats;
