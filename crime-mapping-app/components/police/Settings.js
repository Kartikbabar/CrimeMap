'use client';
import { useState } from 'react';

const Settings = ({ userData }) => {
    const [activeSection, setActiveSection] = useState('profile');

    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '1.5rem'
        },
        sidebar: {
            background: '#161b22',
            borderRadius: '0.75rem',
            border: '1px solid #21262d',
            padding: '1rem',
            height: 'fit-content'
        },
        sidebarItem: (active) => ({
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            color: active ? '#f59e0b' : '#8b949e',
            fontWeight: active ? '600' : '500',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
        }),
        content: {
            background: '#161b22',
            borderRadius: '0.75rem',
            border: '1px solid #21262d',
            padding: '2rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#c9d1d9',
            marginBottom: '1.5rem'
        },
        section: {
            marginBottom: '2rem'
        },
        sectionTitle: {
            fontSize: '1rem',
            fontWeight: '600',
            color: '#c9d1d9',
            marginBottom: '1rem'
        },
        formGroup: {
            marginBottom: '1.5rem'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#8b949e',
            marginBottom: '0.5rem'
        },
        input: {
            width: '100%',
            padding: '0.75rem 1rem',
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: '0.5rem',
            color: '#c9d1d9',
            fontSize: '0.875rem'
        },
        button: (primary) => ({
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            background: primary ? '#f59e0b' : 'rgba(139, 148, 158, 0.1)',
            color: primary ? '#0d1117' : '#8b949e',
            marginRight: '0.75rem'
        }),
        toggle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#0d1117',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem'
        },
        toggleLabel: {
            fontSize: '0.875rem',
            color: '#c9d1d9'
        },
        switch: {
            width: '44px',
            height: '24px',
            background: '#21262d',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer'
        },
        infoCard: {
            background: '#0d1117',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            fontSize: '0.875rem'
        },
        infoLabel: {
            color: '#8b949e'
        },
        infoValue: {
            color: '#c9d1d9',
            fontWeight: '600'
        }
    };

    const menuItems = [
        { id: 'profile', label: '👤 Profile', icon: '👤' },
        { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
        { id: 'security', label: '🔒 Security', icon: '🔒' },
        { id: 'preferences', label: '⚙️ Preferences', icon: '⚙️' },
        { id: 'about', label: 'ℹ️ About', icon: 'ℹ️' }
    ];

    return (
        <div>
            <h2 style={{ color: '#c9d1d9', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                Settings
            </h2>

            <div style={styles.container}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    {menuItems.map(item => (
                        <div
                            key={item.id}
                            style={styles.sidebarItem(activeSection === item.id)}
                            onClick={() => setActiveSection(item.id)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div style={styles.content}>
                    {activeSection === 'profile' && (
                        <div>
                            <h3 style={styles.title}>Profile Settings</h3>

                            <div style={styles.infoCard}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Full Name:</span>
                                    <span style={styles.infoValue}>{userData?.fullName || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Rank:</span>
                                    <span style={styles.infoValue}>{userData?.rank || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Badge Number:</span>
                                    <span style={styles.infoValue}>{userData?.badgeNumber || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>District:</span>
                                    <span style={styles.infoValue}>{userData?.district || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Station:</span>
                                    <span style={styles.infoValue}>{userData?.stationName || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email:</span>
                                    <span style={styles.infoValue}>{userData?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Contact Number</label>
                                <input type="tel" style={styles.input} placeholder="+91 XXXXX-XXXXX" />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Emergency Contact</label>
                                <input type="tel" style={styles.input} placeholder="+91 XXXXX-XXXXX" />
                            </div>

                            <button style={styles.button(true)}>Save Changes</button>
                            <button style={styles.button(false)}>Cancel</button>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div>
                            <h3 style={styles.title}>Notification Preferences</h3>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Email Notifications</h4>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>New FIR Assignments</span>
                                    <div style={styles.switch} />
                                </div>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>Patrol Updates</span>
                                    <div style={styles.switch} />
                                </div>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>System Alerts</span>
                                    <div style={styles.switch} />
                                </div>
                            </div>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Push Notifications</h4>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>High Priority Cases</span>
                                    <div style={styles.switch} />
                                </div>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>Team Messages</span>
                                    <div style={styles.switch} />
                                </div>
                            </div>

                            <button style={styles.button(true)}>Save Preferences</button>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div>
                            <h3 style={styles.title}>Security Settings</h3>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Current Password</label>
                                <input type="password" style={styles.input} placeholder="Enter current password" />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>New Password</label>
                                <input type="password" style={styles.input} placeholder="Enter new password" />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Confirm New Password</label>
                                <input type="password" style={styles.input} placeholder="Confirm new password" />
                            </div>

                            <button style={styles.button(true)}>Update Password</button>

                            <div style={{ marginTop: '2rem' }}>
                                <h4 style={styles.sectionTitle}>Two-Factor Authentication</h4>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>Enable 2FA</span>
                                    <div style={styles.switch} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'preferences' && (
                        <div>
                            <h3 style={styles.title}>System Preferences</h3>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Language</label>
                                <select style={styles.input}>
                                    <option>English</option>
                                    <option>हिन्दी (Hindi)</option>
                                    <option>मराठी (Marathi)</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Time Zone</label>
                                <select style={styles.input}>
                                    <option>IST (UTC +5:30)</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Date Format</label>
                                <select style={styles.input}>
                                    <option>DD/MM/YYYY</option>
                                    <option>MM/DD/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Display Settings</h4>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>Dark Mode (Active)</span>
                                    <div style={styles.switch} />
                                </div>
                                <div style={styles.toggle}>
                                    <span style={styles.toggleLabel}>Compact View</span>
                                    <div style={styles.switch} />
                                </div>
                            </div>

                            <button style={styles.button(true)}>Save Preferences</button>
                        </div>
                    )}

                    {activeSection === 'about' && (
                        <div>
                            <h3 style={styles.title}>About System</h3>

                            <div style={styles.infoCard}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>System Name:</span>
                                    <span style={styles.infoValue}>Crime Management System</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Version:</span>
                                    <span style={styles.infoValue}>2.5.1</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Last Updated:</span>
                                    <span style={styles.infoValue}>January 2024</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Organization:</span>
                                    <span style={styles.infoValue}>Maharashtra Police</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <h4 style={styles.sectionTitle}>Support</h4>
                                <p style={{ color: '#8b949e', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                    For technical support or to report issues, contact:<br />
                                    📧 support@mahapolice.gov.in<br />
                                    📞 1800-XXX-XXXX (Toll Free)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
