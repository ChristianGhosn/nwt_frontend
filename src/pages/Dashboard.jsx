import AssetsTable from "../components/DashboardPage/AssetsTable";
import LiabilitiesTable from "../components/DashboardPage/LiabilitiesTable";

const Dashboard = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetsTable />
        <LiabilitiesTable />
      </div>
    </div>
  );
};

export default Dashboard;
