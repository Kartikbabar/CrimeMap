'use client';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', icon: '📡', label: 'Command Overview' },
        { id: 'fir', icon: '📋', label: 'FIR Management' },
        { id: 'nexus', icon: '🌐', label: 'Inter-Station Hub' },
        { id: 'patrol', icon: '🚔', label: 'Patrol Optimization' },
        { id: 'personnel', icon: '👮', label: 'Officer Management' },
        { id: 'analytics', icon: '📊', label: 'Intel Analytics' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ];

    const styles = {
        sidebar: {
            position: 'fixed',
            left: 0,
            top: 0,
            width: '180px',
            height: '100vh',
            background: '#0d1117',
            borderRight: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100
        },
        logo: {
            padding: '1.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #21262d'
        },
        logoIcon: {
            fontSize: '2rem'
        },
        menu: {
            flex: 1,
            padding: '1rem 0',
            overflowY: 'auto'
        },
        menuItem: (active) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            margin: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            borderLeft: active ? '3px solid #f59e0b' : '3px solid transparent',
            color: active ? '#f59e0b' : '#8b949e',
            fontSize: '0.875rem',
            fontWeight: active ? '600' : '500'
        }),
        icon: {
            fontSize: '1.1rem'
        }
    };

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>
                <span style={styles.logoIcon}>🛡️</span>
            </div>

            <div style={styles.menu}>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        style={styles.menuItem(activeTab === item.id)}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
