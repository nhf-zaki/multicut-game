import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import typeMapping from '../../utils/typeMapping';

import './leaderboard.css';
import getTimeObj from '../../utils/timeObject';

const prepareGroupedData = () => {
  const leaderboardData = JSON.parse(localStorage.getItem('leaderboard'));
  leaderboardData.sort((a, b) => a.time - b.time);
  const groupedData = {};
  leaderboardData.forEach((item) => {
    if (!groupedData[item.type]) {
      groupedData[item.type] = [];
    }
    if (item.type === 'challenge') {
      groupedData[item.type].push({
        type: item.type,
        solvedCount: item.solvedCount,
      });
    } else {
      groupedData[item.type].push({
        type: item.type,
        timeObj: getTimeObj(item.time),
      });
    }
  });
  // sort for challenge data
  groupedData['challenge'].sort((b, a) => a.solvedCount - b.solvedCount);

  return groupedData;
};

const Leaderboard = () => {
  const data = prepareGroupedData();

  const types = Object.keys(typeMapping);

  const [activeTab, setActiveTab] = useState(types[0]); // Set the first tab as active by default

  const handleTabClick = (type) => {
    setActiveTab(type);
  };

  // Check if data is empty or undefined
  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div>
        <Link to={`/`} className="btn-main">
          <i className="fa fa-home" />
          &nbsp; Back to Main Menu
        </Link>
      </div>
      <div className="title">Leaderboard</div>

      <div className="leaderboard-container">
        <ul className="tabs">
          {types.map((type) => (
            <li
              key={type}
              className={activeTab === type ? 'active' : ''}
              onClick={() => handleTabClick(type)}
            >
              {typeMapping[type]}
            </li>
          ))}
        </ul>
        <div className="tab-content">
          <div className="table-container">
            {data[activeTab]?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Game Mode</th>
                    {data[activeTab][0].type === 'challenge' ? (
                      <th>Solved Count</th>
                    ) : (
                      <th>Time</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data[activeTab]?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{typeMapping[item.type]}</td>
                      {item.type === 'challenge' ? (
                        <td>{item.solvedCount}</td>
                      ) : (
                        <td>
                          {item.timeObj.minutes}:{item.timeObj.seconds}.
                          {item.timeObj.millis}0
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
