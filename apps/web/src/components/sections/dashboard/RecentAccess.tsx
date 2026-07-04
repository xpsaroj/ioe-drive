"use client";
import { ContainerBox } from "@/components/ui/ContainerBox";
import { recentResources } from "@/data/demo-data";

const RecentAccessItem = ({ title, author }: { title: string; author: string }) => (
  <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-background-tertiary transition duration-150">
    <p className="overflow-hidden whitespace-nowrap text-ellipsis">{title}</p>
    <p className="text-xs text-foreground-secondary"> By {author}</p>
  </div>
);

const RecentAccess = () => {
  return (
    <ContainerBox
      title="Recently accessed resources"
      comment="Jump back to your resources and continue where you left off."
      className="md:min-w-xs flex-1"
    >
      <div className="space-y-3">
        {recentResources.slice(0, 2).map((resourceItem) => (
          <RecentAccessItem
            key={resourceItem.resourceId}
            title={resourceItem.resource.title}
            author={resourceItem.resource.uploader?.fullName || "Unknown"}
          />
        ))}
      </div>
    </ContainerBox>
  );
};

export default RecentAccess;
