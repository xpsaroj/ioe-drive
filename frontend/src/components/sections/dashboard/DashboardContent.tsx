import RecentAccess from "./RecentAccess";
import DashboardHero from "./DashboardHero";
import SemesterInformation from "./SemesterInformation";
import UpcomingExams from "./ExamsSection";

const DashboardContent = () => {
  return (
    <div className="space-y-10">
      <DashboardHero />
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row gap-10">
          <RecentAccess />
          <UpcomingExams />
        </div>

        <div className="flex-1 space-y-6">
          <SemesterInformation />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
