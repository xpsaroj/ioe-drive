import RecentAccess from "./RecentAccess";
import DashboardHero from "./DashboardHero";
import SemesterInformation from "./SemesterInformation";

const DashboardContent = () => {
  return (
    <div className="space-y-10">
      <DashboardHero />
      <RecentAccess />
      <SemesterInformation />
    </div>
  );
};

export default DashboardContent;
