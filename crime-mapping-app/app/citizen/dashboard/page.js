// app/citizen/dashboard/page.js
import CitizenDashboard from '@/components/citizen/CitizenDashboard';

export const metadata = {
    title: 'Citizen Dashboard | Sentinel Maharashtra',
    description: 'Public safety portal for Maharashtra citizens.',
};

export default function CitizenDashboardPage() {
    return <CitizenDashboard />;
}
