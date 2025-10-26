'use client';
import { useState } from 'react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  const analyticsData = {
    crimeTrends: [
      { month: 'Jan', theft: 45, assault: 32, burglary: 28, fraud: 15 },
      { month: 'Feb', theft: 52, assault: 28, burglary: 31, fraud: 18 },
      { month: 'Mar', theft: 48, assault: 35, burglary: 26, fraud: 22 },
      { month: 'Apr', theft: 55, assault: 30, burglary: 33, fraud: 20 }
    ],
    topCrimeAreas: [
      { area: 'South Mumbai', crimes: 147, trend: 'up' },
      { area: 'Pune Central', crimes: 128, trend: 'down' },
      { area: 'Nagpur East', crimes: 95, trend: 'up' },
      { area: 'Thane West', crimes: 87, trend: 'stable' }
    ],
    resolutionRates: {
      solved: 68,
      pending: 25,
      underInvestigation: 7
    },
    officerPerformance: [
      { name: 'PI Sharma', cases: 24, solved: 18, rating: 4.8 },
      { name: 'SI Patil', cases: 19, solved: 14, rating: 4.6 },
      { name: 'Constable Kumar', cases: 16, solved: 11, rating: 4.2 }
    ]
  };

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Crime Analytics Dashboard</h2>
          <p style={{ color: '#6b7280' }}>Advanced crime analysis and performance metrics</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem',
            backgroundColor: 'white'
          }}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          borderLeft: '4px solid #3b82f6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
            {analyticsData.resolutionRates.solved}%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '600' }}>Cases Solved</div>
        </div>
        
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          borderLeft: '4px solid #ef4444',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
            1,247
          </div>
          <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '600' }}>Total Crimes</div>
        </div>
        
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          borderLeft: '4px solid #10b981',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
            18
          </div>
          <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>Active Patrols</div>
        </div>
        
        <div style={{
          backgroundColor: '#fffbeb',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          borderLeft: '4px solid #f59e0b',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
            12.4
          </div>
          <div style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: '600' }}>Avg Response (mins)</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Crime Trends */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Crime Trends</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {analyticsData.crimeTrends.map((trend, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: '#6b7280' }}>{trend.month}</div>
                <div style={{ display: 'flex', gap: '0.5rem', height: '24px' }}>
                  <div style={{ 
                    flex: trend.theft, 
                    backgroundColor: '#ef4444',
                    borderRadius: '0.25rem',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.75rem',
                      color: '#ef4444',
                      fontWeight: '500'
                    }}>
                      {trend.theft}
                    </div>
                  </div>
                  <div style={{ 
                    flex: trend.assault, 
                    backgroundColor: '#f59e0b',
                    borderRadius: '0.25rem'
                  }}></div>
                  <div style={{ 
                    flex: trend.burglary, 
                    backgroundColor: '#8b5cf6',
                    borderRadius: '0.25rem'
                  }}></div>
                  <div style={{ 
                    flex: trend.fraud, 
                    backgroundColor: '#06b6d4',
                    borderRadius: '0.25rem'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
              <span>Theft</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
              <span>Assault</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div>
              <span>Burglary</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#06b6d4', borderRadius: '2px' }}></div>
              <span>Fraud</span>
            </div>
          </div>
        </div>

        {/* Top Crime Areas */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>High Crime Areas</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {analyticsData.topCrimeAreas.map((area, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{area.area}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{area.crimes} crimes</div>
                </div>
                <div style={{ 
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 
                    area.trend === 'up' ? '#fef2f2' :
                    area.trend === 'down' ? '#f0fdf4' : '#fffbeb',
                  color: 
                    area.trend === 'up' ? '#dc2626' :
                    area.trend === 'down' ? '#059669' : '#d97706',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {area.trend === 'up' ? '↑' : area.trend === 'down' ? '↓' : '→'}
                  {area.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Case Resolution */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Case Resolution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Solved</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '60%' }}>
                <div style={{ 
                  flex: analyticsData.resolutionRates.solved,
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontWeight: '600' }}>{analyticsData.resolutionRates.solved}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Pending</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '60%' }}>
                <div style={{ 
                  flex: analyticsData.resolutionRates.pending,
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontWeight: '600' }}>{analyticsData.resolutionRates.pending}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Under Investigation</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '60%' }}>
                <div style={{ 
                  flex: analyticsData.resolutionRates.underInvestigation,
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontWeight: '600' }}>{analyticsData.resolutionRates.underInvestigation}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Performance */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Top Performers</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {analyticsData.officerPerformance.map((officer, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{officer.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {officer.solved}/{officer.cases} cases solved
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    ⭐ {officer.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}