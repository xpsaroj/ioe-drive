import RecentAccess from "./RecentAccess";
import DashboardHero from "./DashboardHero";
import SemesterInformation from "./SemesterInformation";
import ShareResources from "./ShareResources";
import CurrentResources from "./CurrentResources";

const DashboardContent = () => {
  return (
    <div className="space-y-8">
      <DashboardHero />
      <div className="space-y-8">
        <div className="flex flex-col flex-wrap md:flex-row gap-8">
          <RecentAccess />
          <CurrentResources />
          <ShareResources />
        </div>

        <div className="flex-1 space-y-6">
          <SemesterInformation />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
