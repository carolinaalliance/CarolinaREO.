"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { completeReoTask } from "./actions";

export default function TaskCompleteButton({
  assetId,
  taskId,
}: {
  assetId: string;
  taskId: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete() {
    setError("");
    setIsSaving(true);

    const result = await completeReoTask(
      assetId,
      taskId
    );

    setIsSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Unable to complete this task."
      );
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleComplete}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 className="h-4 w-4" />

        {isSaving
          ? "Completing..."
          : "Mark Complete"}
      </button>

      {error && (
        <div className="mt-2 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
