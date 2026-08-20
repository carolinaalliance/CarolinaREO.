"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function stageForTask(taskType: string) {
  switch (taskType) {
    case "occupancy_verification":
      return "occupancy";

    case "secure_property":
      return "securing";

    case "initial_inspection":
      return "inspection";

    case "bpo":
      return "valuation";

    case "preservation_review":
      return "preservation";

    default:
      return null;
  }
}

function stageRank(stage: string | null | undefined) {
  const stages = [
    "assignment",
    "occupancy",
    "securing",
    "inspection",
    "valuation",
    "preservation",
    "repairs",
    "pre_marketing",
    "listed",
    "offer_review",
    "under_contract",
    "closing",
    "disposed",
  ];

  const index = stages.indexOf(stage || "assignment");

  return index < 0 ? 0 : index;
}

export async function completeReoTask(
  assetId: string,
  taskId: string
) {
  try {
    const supabase = getSupabase();

    const { data: task, error: taskError } = await supabase
      .from("reo_asset_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("asset_id", assetId)
      .single();

    if (taskError || !task) {
      return {
        success: false,
        error: "Task could not be found.",
      };
    }

    if (task.status === "completed") {
      return {
        success: true,
      };
    }

    const completedAt = new Date().toISOString();

    const { error: updateTaskError } = await supabase
      .from("reo_asset_tasks")
      .update({
        status: "completed",
        completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq("id", taskId)
      .eq("asset_id", assetId);

    if (updateTaskError) {
      throw updateTaskError;
    }

    const { data: asset, error: assetError } = await supabase
      .from("reo_assets")
      .select("id, workflow_stage, property_address")
      .eq("id", assetId)
      .single();

    if (assetError || !asset) {
      throw assetError || new Error("Asset could not be found.");
    }

    const recommendedStage = stageForTask(task.task_type);

    let newStage = asset.workflow_stage;

    if (
      recommendedStage &&
      stageRank(recommendedStage) >
        stageRank(asset.workflow_stage)
    ) {
      const { error: stageUpdateError } = await supabase
        .from("reo_assets")
        .update({
          workflow_stage: recommendedStage,
          updated_at: completedAt,
        })
        .eq("id", assetId);

      if (stageUpdateError) {
        throw stageUpdateError;
      }

      newStage = recommendedStage;
    }

    const { error: activityError } = await supabase
      .from("reo_asset_activity")
      .insert({
        asset_id: assetId,
        activity_type: "task_completed",
        title: task.title,
        description: `Completed task: ${task.title}.`,
        old_stage: asset.workflow_stage,
        new_stage: newStage,
        client_visible: true,
      });

    if (activityError) {
      throw activityError;
    }

    revalidatePath(`/admin/assets/${assetId}`);
    revalidatePath("/admin");

    return {
      success: true,
      newStage,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO COMPLETE TASK ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to complete task.",
    };
  }
}
