// src/components/common/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
  return (
    <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">
      {message || "Something went wrong"}
    </div>
  );
}