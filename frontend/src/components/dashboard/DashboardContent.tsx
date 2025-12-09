

import RecentAccess from "./RecentAccess";
import YourArchive from "./YourArchieve";
import UploadNotes from "./UploadNotes";
import SemesterInformation from "./SemesterInformation";
import UpcomingExams from "./ExamsSection";

const DashboardContent = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Left Column */}
        <div className="lg:w-1/3 space-y-6">
          <RecentAccess />
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
            <YourArchive />
            <UploadNotes />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-2/3 space-y-6">
          <SemesterInformation />
          <UpcomingExams />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
