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
export type OccupancyVerificationInput = {
  occupancyStatus: string;

  verificationDate: string;
  verificationTime: string;

  verifiedBy: string;
  vendorCompany: string;

  contactAttempted: boolean;
  contactResult: string;

  occupantName: string;
  occupantPhone: string;
  occupantType: string;

  leasePresent: boolean;
  leaseExpirationDate: string;

  personalPropertyPresent: boolean;
  vehiclesPresent: boolean;

  electricObserved: string;
  waterObserved: string;
  gasObserved: string;

  postedNotices: string;
  exteriorCondition: string;

  healthSafetyIssue: boolean;
  emergencyCondition: boolean;

  cashForKeysCandidate: boolean;
  relocationStatus: string;

  vacancyConfirmed: boolean;

  securingRecommended: boolean;
  winterizationRecommended: boolean;
  preservationRecommended: boolean;

  notes: string;
};

export async function saveOccupancyVerification(
  assetId: string,
  input: OccupancyVerificationInput
) {
  try {
    const supabase = getSupabase();

    if (!assetId) {
      return {
        success: false,
        error: "Asset ID is missing.",
      };
    }

    if (!input.occupancyStatus) {
      return {
        success: false,
        error: "Occupancy status is required.",
      };
    }

    if (!input.verificationDate) {
      return {
        success: false,
        error: "Verification date is required.",
      };
    }

    const now = new Date().toISOString();

    // ---------------------------------------------------------
    // 1. SAVE PERMANENT OCCUPANCY VERIFICATION
    // ---------------------------------------------------------

    const { data: verification, error: verificationError } =
      await supabase
        .from("reo_occupancy_verifications")
        .insert({
          asset_id: assetId,

          occupancy_status:
            input.occupancyStatus,

          verification_date:
            input.verificationDate,

          verification_time:
            input.verificationTime || null,

          verified_by:
            input.verifiedBy || null,

          vendor_company:
            input.vendorCompany || null,

          contact_attempted:
            input.contactAttempted,

          contact_result:
            input.contactResult || null,

          occupant_name:
            input.occupantName || null,

          occupant_phone:
            input.occupantPhone || null,

          occupant_type:
            input.occupantType || null,

          lease_present:
            input.leasePresent,

          lease_expiration_date:
            input.leaseExpirationDate || null,

          personal_property_present:
            input.personalPropertyPresent,

          vehicles_present:
            input.vehiclesPresent,

          electric_observed:
            input.electricObserved || null,

          water_observed:
            input.waterObserved || null,

          gas_observed:
            input.gasObserved || null,

          posted_notices:
            input.postedNotices || null,

          exterior_condition:
            input.exteriorCondition || null,

          health_safety_issue:
            input.healthSafetyIssue,

          emergency_condition:
            input.emergencyCondition,

          cash_for_keys_candidate:
            input.cashForKeysCandidate,

          relocation_status:
            input.relocationStatus || null,

          vacancy_confirmed:
            input.vacancyConfirmed,

          securing_recommended:
            input.securingRecommended,

          winterization_recommended:
            input.winterizationRecommended,

          preservation_recommended:
            input.preservationRecommended,

          notes:
            input.notes || null,

          updated_at: now,
        })
        .select("id")
        .single();

    if (verificationError) {
      throw verificationError;
    }

    // ---------------------------------------------------------
    // 2. UPDATE MASTER ASSET RECORD
    // ---------------------------------------------------------

    const { error: assetUpdateError } =
      await supabase
        .from("reo_assets")
        .update({
          occupancy_status:
            input.occupancyStatus,

          occupant_name:
            input.occupantName || null,

          occupant_phone:
            input.occupantPhone || null,

          workflow_stage: "occupancy",

          updated_at: now,
        })
        .eq("id", assetId);

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    // ---------------------------------------------------------
    // 3. COMPLETE OPEN OCCUPANCY SLA TASK
    // ---------------------------------------------------------

    const { data: occupancyTasks, error: taskLookupError } =
      await supabase
        .from("reo_asset_tasks")
        .select("id")
        .eq("asset_id", assetId)
        .eq("task_type", "occupancy_verification")
        .eq("status", "open");

    if (taskLookupError) {
      throw taskLookupError;
    }

    if (occupancyTasks && occupancyTasks.length > 0) {
      const ids = occupancyTasks.map((task) => task.id);

      const { error: taskUpdateError } =
        await supabase
          .from("reo_asset_tasks")
          .update({
            status: "completed",
            completed_at: now,
            updated_at: now,
          })
          .in("id", ids);

      if (taskUpdateError) {
        throw taskUpdateError;
      }
    }

    // ---------------------------------------------------------
    // 4. CREATE ACTIVITY / AUDIT RECORD
    // ---------------------------------------------------------

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            "occupancy_verification_completed",

          title:
            "Occupancy Verification Completed",

          description:
            `Occupancy determined as ${input.occupancyStatus}.`,

          old_stage: "assignment",
          new_stage: "occupancy",

          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    // ---------------------------------------------------------
    // 5. GENERATE EXCEPTION / FOLLOW-UP TASKS
    // ---------------------------------------------------------

    const followUpTasks = [];

    if (
      input.occupancyStatus === "Vacant" &&
      input.securingRecommended
    ) {
      const { data: existingSecuring } =
        await supabase
          .from("reo_asset_tasks")
          .select("id")
          .eq("asset_id", assetId)
          .eq("task_type", "secure_property")
          .eq("status", "open")
          .limit(1);

      if (!existingSecuring?.length) {
        followUpTasks.push({
          asset_id: assetId,
          task_type: "secure_property",
          title: "Secure and Rekey Property",
          description:
            "Vacancy was confirmed and securing was recommended during occupancy verification.",
          workflow_stage: "securing",
          priority: "high",
          status: "open",
          due_at: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(),
          client_visible: true,
          is_sla_task: true,
        });
      }
    }

    if (input.emergencyCondition) {
      followUpTasks.push({
        asset_id: assetId,
        task_type: "emergency_condition",
        title: "Address Emergency Property Condition",
        description:
          "An emergency condition was reported during occupancy verification.",
        workflow_stage: "occupancy",
        priority: "high",
        status: "open",
        due_at: new Date().toISOString(),
        client_visible: true,
        is_sla_task: true,
      });
    }

    if (
      input.preservationRecommended
    ) {
      followUpTasks.push({
        asset_id: assetId,
        task_type: "preservation_follow_up",
        title: "Review Preservation Recommendation",
        description:
          "Preservation services were recommended during occupancy verification.",
        workflow_stage: "preservation",
        priority: "normal",
        status: "open",
        due_at: new Date(
          Date.now() + 48 * 60 * 60 * 1000
        ).toISOString(),
        client_visible: false,
        is_sla_task: false,
      });
    }

    if (followUpTasks.length > 0) {
      const { error: followUpError } =
        await supabase
          .from("reo_asset_tasks")
          .insert(followUpTasks);

      if (followUpError) {
        throw followUpError;
      }
    }

    revalidatePath(`/admin/assets/${assetId}`);
    revalidatePath("/admin");

    return {
      success: true,
      verificationId: verification.id,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO OCCUPANCY ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save occupancy verification.",
    };
  }
}
