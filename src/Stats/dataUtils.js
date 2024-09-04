// dataUtils.js

// Helper function to group data by day
const groupByDay = (data) => {
    const groupedData = {};
    data.forEach(({ start, end, duration }) => {
      const date = new Date(start).toISOString().split('T')[0]; // Extract date part only
      if (!groupedData[date]) {
        groupedData[date] = 0;
      }
      groupedData[date] += duration / 3600; // Convert seconds to hours
    });
    return groupedData;
  };
  
  // Helper function to group data by week
  const groupByWeek = (data) => {
    const groupedData = {};
    data.forEach(({ start, end, duration }) => {
      const date = new Date(start);
      const weekNumber = getWeekNumber(date);
      if (!groupedData[weekNumber]) {
        groupedData[weekNumber] = 0;
      }
      groupedData[weekNumber] += duration / 3600; // Convert seconds to hours
    });
    return groupedData;
  };
  
  // Helper function to group data by month
  const groupByMonth = (data) => {
    const groupedData = {};
    data.forEach(({ start, end, duration }) => {
      const date = new Date(start);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM
      if (!groupedData[month]) {
        groupedData[month] = 0;
      }
      groupedData[month] += duration / 3600; // Convert seconds to hours
    });
    return groupedData;
  };
  
  // Function to get week number from date
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };
  
  // Function to format data for day-wise stats
  export const getDayWiseData = (data) => {
    const groupedData = groupByDay(data);
    const labels = Object.keys(groupedData);
    const times = Object.values(groupedData);
    return { labels, times };
  };
  
  // Function to format data for week-wise stats
  export const getWeekWiseData = (data) => {
    const groupedData = groupByWeek(data);
    const labels = Object.keys(groupedData);
    const times = Object.values(groupedData);
    return { labels, times };
  };
  
  // Function to format data for month-wise stats
  export const getMonthWiseData = (data) => {
    const groupedData = groupByMonth(data);
    const labels = Object.keys(groupedData);
    const times = Object.values(groupedData);
    return { labels, times };
  };
  