export function TodoListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          {/* título grupo */}
          <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />

          {/* tareas */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-md animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-40 h-4 bg-gray-300 rounded" />
              </div>

              <div className="w-16 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}