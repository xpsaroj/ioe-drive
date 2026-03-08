const ResourceCardSkeleton = () => {
    return (
        <div className="animate-pulse md:border py-3 md:p-6 md:rounded-md">
            <div className="h-6 w-1/4 bg-background-secondary mb-2"></div>
            <div className="h-3 w-full bg-background-secondary mb-1"></div>
            <div className="h-3 w-1/2 bg-background-secondary mb-2"></div>
            <div className="h-4 w-1/8 bg-background-secondary mb-1"></div>
            <div className="flex flex-row gap-2">
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
            </div>
        </div>
    );
}

export default ResourceCardSkeleton;