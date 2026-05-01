// src/components/common/EmptyState.jsx
export default function EmptyState({ title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-6xl">🔍</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs">{description}</p>
      {action && (
        <button onClick={action} className="px-4 py-2 bg-blue-600 text-white
          rounded-lg text-sm hover:bg-blue-700 transition">
          {actionLabel}
        </button>
      )}
    </div>
  );
}