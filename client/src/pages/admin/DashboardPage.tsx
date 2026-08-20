import { useDashboard, usePersonsByAgeRange, useApplicationsByStatus } from '@/hooks/useReports';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import BarChartWidget from '@/components/charts/BarChartWidget';
import PieChartWidget from '@/components/charts/PieChartWidget';

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: ageRanges } = usePersonsByAgeRange();
  const { data: appStatus } = useApplicationsByStatus();

  if (isLoading) return <PageLoader />;

  const ageData = (ageRanges ?? []).map((r: { range: string; count: number }) => ({
    name: r.range,
    value: r.count,
  }));

  const statusData = (appStatus ?? []).map((r: { status: string; count: string }) => ({
    name: r.status.replace(/_/g, ' '),
    value: Number(r.count),
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Wereda-wide overview" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Households" value={dashboard?.households?.total ?? 0} color="blue" />
        <StatCard label="Applications" value={dashboard?.applications?.total ?? 0} color="yellow" />
        <StatCard label="Active Beneficiaries" value={dashboard?.beneficiaries?.total ?? 0} color="green" />
        <StatCard label="Open Complaints" value={dashboard?.open_complaints?.open ?? 0} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartWidget title="People by Age Range" data={ageData} />
        <PieChartWidget title="Applications by Status" data={statusData} />
      </div>
    </div>
  );
}
