export const ProfileLoadingSkeleton = () => {
    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
            <div className="flex justify-between items-start mb-4">
                <div className="h-7 w-20 bg-gray-600 rounded animate-pulse" />
                <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-600 rounded p-3 border border-gray-500 animate-pulse">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-9 h-9 bg-gray-500 rounded-2xl" />
                            <div className="flex-1 ml-2">
                                <div className="h-4 w-32 bg-gray-500 rounded mb-2" />
                                <div className="h-3 w-24 bg-gray-500 rounded" />
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded" />
                        </div>
                        <div className="h-3 w-full bg-gray-500 rounded mb-1" />
                        <div className="h-3 w-20 bg-gray-500 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};
