'use client';
import { useState } from 'react';
import { DataSeedingService } from '../../lib/firebase';

export default function TestSeedPage() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Starting seed...');

        try {
            await DataSeedingService.seedInitialData('Mumbai');
            setStatus('✅ Seeding completed successfully! Check Firebase Console.');
        } catch (error) {
            setStatus(`❌ Error: ${error.message}`);
            console.error('Full error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem' }}>Firebase Data Seeding Test</h1>

            <button
                onClick={handleSeed}
                disabled={loading}
                style={{
                    padding: '1rem 2rem',
                    background: loading ? '#ccc' : '#f59e0b',
                    color: '#000',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '1rem'
                }}
            >
                {loading ? 'Seeding...' : '🌱 Seed Maharashtra Data'}
            </button>

            {status && (
                <div style={{
                    padding: '1rem',
                    background: status.includes('✅') ? '#d1fae5' : '#fee2e2',
                    borderRadius: '0.5rem',
                    marginTop: '1rem'
                }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{status}</pre>
                </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Click the "Seed Maharashtra Data" button above</li>
                    <li>Wait for confirmation message</li>
                    <li>Go to Firebase Console to verify the data</li>
                    <li>Refresh your dashboard to see the new data</li>
                </ol>
            </div>
        </div>
    );
}
