export const ProjectLoadingSkeleton = () => {
    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
            <div className="flex justify-between items-start mb-4">
                <div className="h-7 w-24 bg-gray-600 rounded animate-pulse" />
                <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-600 rounded p-4 border border-gray-500 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 bg-gray-500 rounded-full" />
                            <div className="h-5 w-32 bg-gray-500 rounded" />
                        </div>
                        <div className="ml-13 space-y-2">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="flex items-center gap-2">
                                    <div className="size-6 bg-gray-500 rounded" />
                                    <div className="h-4 w-24 bg-gray-500 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
