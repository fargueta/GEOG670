import React from 'react';
import Footer from './components/Footer.js';
import StatsHeader from './components/header/StatsHeader.js';
import Map from './components/Map.js';
import StatsDashboardCopy from './components/StatsDashboardCopy.js';
import StatsDashboardApex from './components/StatsDashboardApex.js';

function StatsPage() {
  return (
    <div
      sx={{
        '& .scrollDiv': {
          height: 'auto',
          maxHeight: '100%',
          overflow: 'auto',
        },
      }}
    >
      <StatsHeader />
      <br />
      <StatsDashboardApex />
      <Footer />
    </div>
  );
}

export default StatsPage;
