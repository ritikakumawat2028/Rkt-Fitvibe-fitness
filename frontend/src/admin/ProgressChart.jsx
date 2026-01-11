import React from 'react';
import './ProgressChart.css'; // Make sure this CSS file exists

const ProgressChart = ({ data, totalUsers }) => {
  
  // Sort data from most users to least
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="progress-chart-container card">
      {sortedData.map((item) => {
        // Calculate percentage for the bar width
        const percentage = totalUsers > 0 ? (item.count / totalUsers) * 100 : 0;

        return (
          <div key={item.name} className="progress-item">
            <div className="progress-labels">
              <span className="progress-name">{item.name}</span>
              <span className="progress-count">
                {item.count} {item.count === 1 ? 'User' : 'Users'} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="progress-bar-background">
              <div
                className="progress-bar-fill"
                style={{ width: `${percentage}%` }}
                title={`${item.name} Plan: ${item.count} users`}
              ></div>
            </div>
          </div>
        );
      })}
      {data.length === 0 && <p>No plan data available for any users.</p>}
    </div>
  );
};

export default ProgressChart;
