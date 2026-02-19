import { useState } from 'react';

const TopBar = ({ userData, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const styles = {
        topBar: {
            position: 'fixed',
            top: 0,
            left: '180px',
            right: 0,
            height: '60px',
            background: '#161b22',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 99
        },
        titleSection: {
            flex: 1
        },
        title: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#c9d1d9',
            margin: 0
        },
        subtitle: {
            fontSize: '0.75rem',
            color: '#8b949e',
            marginTop: '0.25rem'
        },
        userSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            position: 'relative'
        },
        notifications: {
            position: 'relative',
            cursor: 'pointer'
        },
        notifIcon: {
            fontSize: '1.25rem',
            color: '#8b949e'
        },
        badge: {
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#f85149',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: '700',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s',
            background: showDropdown ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            userSelect: 'none'
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.875rem'
        },
        userName: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#c9d1d9'
        },
        userRole: {
            fontSize: '0.7rem',
            color: '#8b949e'
        },
        dropdownArrow: {
            fontSize: '0.75rem',
            color: '#8b949e',
            transition: 'transform 0.2s',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)'
        },
        menu: {
            position: 'absolute',
            top: '120%',
            right: 0,
            width: '200px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            padding: '0.5rem',
            display: showDropdown ? 'block' : 'none'
        },
        menuItem: (danger) => ({
            padding: '0.75rem 1rem',
            borderRadius: '0.4rem',
            fontSize: '0.875rem',
            color: danger ? '#f85149' : '#c9d1d9',
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        }),
        menuDivider: {
            height: '1px',
            background: '#30363d',
            margin: '0.5rem 0'
        }
    };

    const getInitials = (name) => {
        if (!name) return 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div style={styles.topBar}>
            <div style={styles.titleSection}>
                <h1 style={styles.title}>Crime Management System - Maharashtra Police</h1>
                <p style={styles.subtitle}>Connecting Police Stations for Safer Communities</p>
            </div>

            <div style={styles.userSection}>
                <div style={styles.notifications}>
                    <span style={styles.notifIcon}>🔔</span>
                    <span style={styles.badge}>3</span>
                </div>

                <div style={styles.userInfo} onClick={() => setShowDropdown(!showDropdown)}>
                    <div style={styles.avatar}>
                        {getInitials(userData?.fullName)}
                    </div>
                    <div>
                        <div style={styles.userName}>{userData?.fullName || 'Officer'}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <div style={styles.userRole}>{userData?.rank || 'Police'}</div>
                            <span style={{ fontSize: '0.6rem', color: '#58a6ff', fontWeight: 'bold', background: 'rgba(56, 139, 253, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>
                                {userData?.district || 'Mumbai'}
                            </span>
                        </div>
                    </div>
                    <span style={styles.dropdownArrow}>▼</span>
                </div>

                {/* Dropdown Menu */}
                <div style={styles.menu}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #30363d' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>Signed in as</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f0f6fc' }}>{userData?.fullName}</div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <div style={styles.menuItem(false)} className="menu-btn">
                            <span>👤</span> Profile Settings
                        </div>
                        <div style={styles.menuItem(false)} className="menu-btn">
                            <span>💬</span> Support
                        </div>
                        <div style={styles.menuDivider}></div>
                        <div
                            style={styles.menuItem(true)}
                            onClick={onLogout}
                            className="menu-btn"
                        >
                            <span>🚪</span> Sign Out
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .menu-btn:hover { background: rgba(56, 139, 253, 0.15); }
            `}</style>
        </div>
    );
};

export default TopBar;
