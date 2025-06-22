import React from 'react';

interface PermissionProps {
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const Permission: React.FC<PermissionProps> = ({
  message = "This app needs access to your camera to proceed. Please allow camera permission.",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#7a422c]/50! text-white rounded hover:bg-[#7a422c]! transition"
          >
            Allow Camera
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Permission;
