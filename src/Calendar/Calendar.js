// Calendar.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const getDayWiseData = (data) => {
  // Logic to filter data for the selected day
  const today = new Date().toISOString().split('T')[0];
  return data.filter((session) => session.date === today);
};

export const getMonthWiseData = (data) => {
  // Logic to filter data for the current month
  const currentMonth = new Date().getMonth();
  return data.filter((session) => new Date(session.date).getMonth() === currentMonth);
};

export const getYearWiseData = (data) => {
  // Logic to filter data for the current year
  const currentYear = new Date().getFullYear();
  return data.filter((session) => new Date(session.date).getFullYear() === currentYear);
};

const DatePicker = ({ onDateChange }) => {
  return (
    <div className="calendar-container">
      <Calendar onChange={onDateChange} />
    </div>
  );
};

export default DatePicker;
