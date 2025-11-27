import { Trash2 } from "lucide-react";

const DeleteAccountModal = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteConfirmText,
  setDeleteConfirmText,
  handleDeleteAccount,
  deleting,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Delete Account</h3>
        </div>

        <p className="text-slate-400 mb-4">
          This action cannot be undone. This will permanently delete your account and remove all your data from our
          servers.
        </p>

        <div className="mb-4">
          <label className="text-sm text-slate-400 block mb-2">
            Type <span className="text-red-400 font-mono">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
            placeholder="DELETE"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirmText !== "DELETE"}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
            }}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
