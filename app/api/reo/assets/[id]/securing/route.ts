import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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

const lifecycle = [
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

function stageRank(stage?: string | null) {
  const index = lifecycle.indexOf(stage || "assignment");
  return index < 0 ? 0 : index;
}

function numberOrNull(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const number = Number(
    String(value).replace(/[$,]/g, "")
  );

  return Number.isFinite(number)
    ? number
    : null;
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id: assetId } = await context.params;
    const body = await request.json();

    const supabase = getSupabase();
    const now = new Date().toISOString();

    // ---------------------------------------------------------
    // 1. LOAD CURRENT ASSET
    // ---------------------------------------------------------

    const { data: asset, error: assetError } =
      await supabase
        .from("reo_assets")
        .select(`
          id,
          property_address,
          workflow_stage
        `)
        .eq("id", assetId)
        .single();

    if (assetError || !asset) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset could not be found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // 2. SAVE PERMANENT SECURING RECORD
    // ---------------------------------------------------------

    const { data: securing, error: securingError } =
      await supabase
        .from("reo_securing_records")
        .insert({
          asset_id: assetId,

          property_secured:
            Boolean(body.propertySecured),

          rekey_completed:
            Boolean(body.rekeyCompleted),

          lockbox_installed:
            Boolean(body.lockboxInstalled),

          lockbox_code:
            body.lockboxCode || null,

          key_location:
            body.keyLocation || null,

          doors_secured:
            Boolean(body.doorsSecured),

          windows_secured:
            Boolean(body.windowsSecured),

          garage_secured:
            Boolean(body.garageSecured),

          outbuildings_secured:
            Boolean(body.outbuildingsSecured),

          winterization_required:
            Boolean(body.winterizationRequired),

          winterization_completed:
            Boolean(body.winterizationCompleted),

          vendor_name:
            body.vendorName || null,

          service_date:
            body.serviceDate || null,

          service_cost:
            numberOrNull(body.serviceCost),

          damage_observed:
            Boolean(body.damageObserved),

          emergency_condition:
            Boolean(body.emergencyCondition),

          securing_notes:
            body.securingNotes || null,

          updated_at: now,
        })
        .select("id")
        .single();

    if (securingError) {
      throw securingError;
    }

    // ---------------------------------------------------------
    // 3. DETERMINE LIFECYCLE
    // Never move an asset backwards.
    // ---------------------------------------------------------

    const currentStage =
      asset.workflow_stage || "assignment";

    const newStage =
      stageRank(currentStage) <
      stageRank("securing")
        ? "securing"
        : currentStage;

    // ---------------------------------------------------------
    // 4. UPDATE MASTER ASSET
    // ---------------------------------------------------------

    const { error: updateAssetError } =
      await supabase
        .from("reo_assets")
        .update({
          property_secured:
            body.propertySecured
              ? "Yes"
              : "No",

         rekey_required:
  Boolean(body.rekeyCompleted)
    ? "No"
    : "Yes",

          lockbox_code:
            body.lockboxCode || null,

          key_location:
            body.keyLocation || null,

          workflow_stage: newStage,

          updated_at: now,
        })
        .eq("id", assetId);

    if (updateAssetError) {
      throw updateAssetError;
    }

    // ---------------------------------------------------------
    // 5. COMPLETE SECURING TASK
    // ---------------------------------------------------------

    const { data: securingTasks, error: taskLookupError } =
      await supabase
        .from("reo_asset_tasks")
        .select("id")
        .eq("asset_id", assetId)
        .eq("task_type", "secure_property")
        .eq("status", "open");

    if (taskLookupError) {
      throw taskLookupError;
    }

    if (
      securingTasks &&
      securingTasks.length > 0
    ) {
      const taskIds =
        securingTasks.map(
          (task) => task.id
        );

      const { error: taskUpdateError } =
        await supabase
          .from("reo_asset_tasks")
          .update({
            status: "completed",
            completed_at: now,
            updated_at: now,
          })
          .in("id", taskIds);

      if (taskUpdateError) {
        throw taskUpdateError;
      }
    }

    // ---------------------------------------------------------
    // 6. ACTIVITY HISTORY
    // ---------------------------------------------------------

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            "property_securing_completed",

          title:
            "Property Securing Completed",

          description:
            body.propertySecured
              ? "Property securing and access-control work was completed."
              : "Securing review was completed; property was not marked fully secured.",

          old_stage: currentStage,
          new_stage: newStage,

          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    // ---------------------------------------------------------
    // 7. EMERGENCY FOLLOW-UP
    // ---------------------------------------------------------

    if (body.emergencyCondition) {
      const { error: emergencyTaskError } =
        await supabase
          .from("reo_asset_tasks")
          .insert({
            asset_id: assetId,

            task_type:
              "securing_emergency",

            title:
              "Address Securing Emergency Condition",

            description:
              body.securingNotes ||
              "An emergency condition was identified during securing.",

            workflow_stage:
              newStage,

            priority: "high",
            status: "open",

            due_at: now,

            client_visible: true,
            is_sla_task: true,
          });

      if (emergencyTaskError) {
        throw emergencyTaskError;
      }
    }

    return NextResponse.json({
      success: true,
      securingId: securing.id,
      workflowStage: newStage,
    });
  } catch (error) {
    console.error(
      "CAROLINA REO SECURING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save securing record.",
      },
      { status: 500 }
    );
  }
}
