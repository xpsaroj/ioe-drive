const ResourceCardSkeleton = () => {
    return (
        <div className="animate-pulse border p-4 rounded-md">
            <div className="h-7 w-1/4 bg-background-secondary mb-2"></div>
            <div className="h-3 w-full bg-background-secondary mb-1"></div>
            <div className="h-3 w-1/2 bg-background-secondary mb-2"></div>
            <div className="h-5 w-1/8 bg-background-secondary mb-1"></div>
            <div className="flex flex-row gap-2">
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
                <div className="h-7 w-50 bg-background-secondary rounded"></div>
            </div>
        </div>
    );
}

export default ResourceCardSkeleton;