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
export type PropertyInspectionInput = {
  inspectionDate: string;
  inspectionTime: string;

  inspectedBy: string;
  vendorCompany: string;

  accessObtained: boolean;
  interiorAccess: boolean;

  overallCondition: string;
  occupancyObserved: string;

  exteriorCondition: string;
  roofCondition: string;
  foundationCondition: string;
  sidingCondition: string;
  windowsCondition: string;
  doorsCondition: string;
  landscapingCondition: string;
  drivewayCondition: string;

  kitchenCondition: string;
  livingAreaCondition: string;
  bedroomCondition: string;
  bathroomCondition: string;
  basementCondition: string;
  atticCondition: string;
  garageCondition: string;

  hvacCondition: string;
  electricalCondition: string;
  plumbingCondition: string;
  waterHeaterCondition: string;
  appliancesCondition: string;

  electricStatus: string;
  waterStatus: string;
  gasStatus: string;

  activeLeak: boolean;
  moldObserved: boolean;
  fireDamage: boolean;
  waterDamage: boolean;
  structuralIssue: boolean;
  vandalism: boolean;
  biohazard: boolean;
  pestIssue: boolean;

  debrisPresent: boolean;
  personalPropertyPresent: boolean;

  immediateActionRequired: boolean;
  securingRequired: boolean;
  preservationRequired: boolean;
  repairsRecommended: boolean;

  estimatedRepairs: string;

  conditionGrade: string;

  repairSummary: string;
  safetyNotes: string;
  generalNotes: string;
};

export async function saveInitialPropertyInspection(
  assetId: string,
  input: PropertyInspectionInput
) {
  try {
    const supabase = getSupabase();

    if (!assetId) {
      return {
        success: false,
        error: "Asset ID is missing.",
      };
    }

    if (!input.inspectionDate) {
      return {
        success: false,
        error: "Inspection date is required.",
      };
    }

    if (!input.overallCondition) {
      return {
        success: false,
        error: "Overall condition is required.",
      };
    }

    const now = new Date().toISOString();

    const repairAmount =
      input.estimatedRepairs.trim() === ""
        ? null
        : Number(
            input.estimatedRepairs.replace(
              /[$,]/g,
              ""
            )
          );

    const {
      data: inspection,
      error: inspectionError,
    } = await supabase
      .from("reo_property_inspections")
      .insert({
        asset_id: assetId,

        inspection_type: "initial",

        inspection_date:
          input.inspectionDate,

        inspection_time:
          input.inspectionTime || null,

        inspected_by:
          input.inspectedBy || null,

        vendor_company:
          input.vendorCompany || null,

        access_obtained:
          input.accessObtained,

        interior_access:
          input.interiorAccess,

        overall_condition:
          input.overallCondition,

        occupancy_observed:
          input.occupancyObserved || null,

        exterior_condition:
          input.exteriorCondition || null,

        roof_condition:
          input.roofCondition || null,

        foundation_condition:
          input.foundationCondition || null,

        siding_condition:
          input.sidingCondition || null,

        windows_condition:
          input.windowsCondition || null,

        doors_condition:
          input.doorsCondition || null,

        landscaping_condition:
          input.landscapingCondition || null,

        driveway_condition:
          input.drivewayCondition || null,

        kitchen_condition:
          input.kitchenCondition || null,

        living_area_condition:
          input.livingAreaCondition || null,

        bedroom_condition:
          input.bedroomCondition || null,

        bathroom_condition:
          input.bathroomCondition || null,

        basement_condition:
          input.basementCondition || null,

        attic_condition:
          input.atticCondition || null,

        garage_condition:
          input.garageCondition || null,

        hvac_condition:
          input.hvacCondition || null,

        electrical_condition:
          input.electricalCondition || null,

        plumbing_condition:
          input.plumbingCondition || null,

        water_heater_condition:
          input.waterHeaterCondition || null,

        appliances_condition:
          input.appliancesCondition || null,

        electric_status:
          input.electricStatus || null,

        water_status:
          input.waterStatus || null,

        gas_status:
          input.gasStatus || null,

        active_leak:
          input.activeLeak,

        mold_observed:
          input.moldObserved,

        fire_damage:
          input.fireDamage,

        water_damage:
          input.waterDamage,

        structural_issue:
          input.structuralIssue,

        vandalism:
          input.vandalism,

        biohazard:
          input.biohazard,

        pest_issue:
          input.pestIssue,

        debris_present:
          input.debrisPresent,

        personal_property_present:
          input.personalPropertyPresent,

        immediate_action_required:
          input.immediateActionRequired,

        securing_required:
          input.securingRequired,

        preservation_required:
          input.preservationRequired,

        repairs_recommended:
          input.repairsRecommended,

        estimated_repairs:
          Number.isFinite(repairAmount)
            ? repairAmount
            : null,

        condition_grade:
          input.conditionGrade || null,

        repair_summary:
          input.repairSummary || null,

        safety_notes:
          input.safetyNotes || null,

        general_notes:
          input.generalNotes || null,

        updated_at: now,
      })
      .select("id")
      .single();

    if (inspectionError) {
      throw inspectionError;
    }

    // Update master asset record.
    const { error: assetUpdateError } =
      await supabase
        .from("reo_assets")
        .update({
          workflow_stage: "inspection",

          electric_status:
            input.electricStatus || "Unknown",

          water_status:
            input.waterStatus || "Unknown",

          gas_status:
            input.gasStatus || "Unknown",

          repair_estimate:
            Number.isFinite(repairAmount)
              ? repairAmount
              : null,

          updated_at: now,
        })
        .eq("id", assetId);

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    // Complete the initial inspection task.
    const {
      data: inspectionTasks,
      error: taskLookupError,
    } = await supabase
      .from("reo_asset_tasks")
      .select("id")
      .eq("asset_id", assetId)
      .eq("task_type", "initial_inspection")
      .eq("status", "open");

    if (taskLookupError) {
      throw taskLookupError;
    }

    if (
      inspectionTasks &&
      inspectionTasks.length > 0
    ) {
      const ids =
        inspectionTasks.map(
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
          .in("id", ids);

      if (taskUpdateError) {
        throw taskUpdateError;
      }
    }

    // Create audit history.
    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            "initial_property_inspection_completed",

          title:
            "Initial Property Inspection Completed",

          description:
            `Initial inspection completed. Overall condition: ${input.overallCondition}.`,

          old_stage: "occupancy",
          new_stage: "inspection",

          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    // Create follow-up tasks.
    const followUpTasks: any[] = [];

    if (input.immediateActionRequired) {
      followUpTasks.push({
        asset_id: assetId,
        task_type:
          "inspection_immediate_action",

        title:
          "Address Immediate Inspection Issue",

        description:
          input.safetyNotes ||
          "Inspection identified an issue requiring immediate attention.",

        workflow_stage:
          "inspection",

        priority: "high",
        status: "open",

        due_at:
          new Date().toISOString(),

        client_visible: true,
        is_sla_task: true,
      });
    }

    if (
      input.securingRequired
    ) {
      const { data: existingSecuring } =
        await supabase
          .from("reo_asset_tasks")
          .select("id")
          .eq("asset_id", assetId)
          .eq(
            "task_type",
            "secure_property"
          )
          .eq("status", "open")
          .limit(1);

      if (!existingSecuring?.length) {
        followUpTasks.push({
          asset_id: assetId,
          task_type:
            "secure_property",

          title:
            "Secure and Rekey Property",

          description:
            "Inspection identified a securing requirement.",

          workflow_stage:
            "securing",

          priority: "high",
          status: "open",

          due_at:
            new Date(
              Date.now() +
                24 * 60 * 60 * 1000
            ).toISOString(),

          client_visible: true,
          is_sla_task: true,
        });
      }
    }

    if (
      input.repairsRecommended
    ) {
      followUpTasks.push({
        asset_id: assetId,

        task_type:
          "repair_scope",

        title:
          "Prepare Repair Scope and Estimate",

        description:
          input.repairSummary ||
          "Repairs were recommended during the initial inspection.",

        workflow_stage:
          "repairs",

        priority: "normal",
        status: "open",

        due_at:
          new Date(
            Date.now() +
              48 * 60 * 60 * 1000
          ).toISOString(),

        client_visible: false,
        is_sla_task: false,
      });
    }

    if (
      input.preservationRequired
    ) {
      followUpTasks.push({
        asset_id: assetId,

        task_type:
          "preservation_follow_up",

        title:
          "Review Inspection Preservation Needs",

        description:
          "Preservation needs were identified during the initial inspection.",

        workflow_stage:
          "preservation",

        priority: "normal",
        status: "open",

        due_at:
          new Date(
            Date.now() +
              48 * 60 * 60 * 1000
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

    revalidatePath(
      `/admin/assets/${assetId}`
    );

    revalidatePath("/admin");

    return {
      success: true,
      inspectionId: inspection.id,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO INSPECTION ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save property inspection.",
    };
  }
}
export type BpoInput = {
  valuationDate: string;

  preparedBy: string;
  brokerageCompany: string;

  occupancyStatus: string;
  propertyCondition: string;

  asIsValue: string;
  repairedValue: string;
  quickSaleValue: string;
  recommendedListPrice: string;

  estimatedRepairs: string;

  marketTrend: string;
  marketingTimeDays: string;

  comp1Address: string;
  comp1SalePrice: string;
  comp1Distance: string;
  comp1Notes: string;

  comp2Address: string;
  comp2SalePrice: string;
  comp2Distance: string;
  comp2Notes: string;

  comp3Address: string;
  comp3SalePrice: string;
  comp3Distance: string;
  comp3Notes: string;

  listing1Address: string;
  listing1Price: string;
  listing1Distance: string;
  listing1Notes: string;

  listing2Address: string;
  listing2Price: string;
  listing2Distance: string;
  listing2Notes: string;

  neighborhoodSummary: string;
  conditionSummary: string;
  repairSummary: string;
  pricingRationale: string;
  marketingStrategy: string;

  clientRecommendation: string;
};

function bpoNumber(value: string) {
  if (!value?.trim()) return null;

  const parsed = Number(
    value.replace(/[$,]/g, "")
  );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

export async function saveInitialBpo(
  assetId: string,
  input: BpoInput
) {
  try {
    const supabase = getSupabase();

    if (!assetId) {
      return {
        success: false,
        error: "Asset ID is missing.",
      };
    }

    if (!input.valuationDate) {
      return {
        success: false,
        error: "Valuation date is required.",
      };
    }

    if (!input.asIsValue) {
      return {
        success: false,
        error: "As-is value is required.",
      };
    }

    if (!input.recommendedListPrice) {
      return {
        success: false,
        error:
          "Recommended list price is required.",
      };
    }

    const now = new Date().toISOString();

    const { data: asset, error: assetError } =
      await supabase
        .from("reo_assets")
        .select(
          "id, workflow_stage, property_address"
        )
        .eq("id", assetId)
        .single();

    if (assetError || !asset) {
      throw (
        assetError ||
        new Error("Asset could not be found.")
      );
    }

    const { data: bpo, error: bpoError } =
      await supabase
        .from("reo_bpo_reports")
        .insert({
          asset_id: assetId,

          bpo_type: "initial",

          valuation_date:
            input.valuationDate,

          prepared_by:
            input.preparedBy || null,

          brokerage_company:
            input.brokerageCompany || null,

          occupancy_status:
            input.occupancyStatus || null,

          property_condition:
            input.propertyCondition || null,

          as_is_value:
            bpoNumber(input.asIsValue),

          repaired_value:
            bpoNumber(input.repairedValue),

          quick_sale_value:
            bpoNumber(input.quickSaleValue),

          recommended_list_price:
            bpoNumber(
              input.recommendedListPrice
            ),

          estimated_repairs:
            bpoNumber(
              input.estimatedRepairs
            ),

          market_trend:
            input.marketTrend || null,

          marketing_time_days:
            bpoNumber(
              input.marketingTimeDays
            ),

          comp_1_address:
            input.comp1Address || null,

          comp_1_sale_price:
            bpoNumber(
              input.comp1SalePrice
            ),

          comp_1_distance:
            bpoNumber(
              input.comp1Distance
            ),

          comp_1_notes:
            input.comp1Notes || null,

          comp_2_address:
            input.comp2Address || null,

          comp_2_sale_price:
            bpoNumber(
              input.comp2SalePrice
            ),

          comp_2_distance:
            bpoNumber(
              input.comp2Distance
            ),

          comp_2_notes:
            input.comp2Notes || null,

          comp_3_address:
            input.comp3Address || null,

          comp_3_sale_price:
            bpoNumber(
              input.comp3SalePrice
            ),

          comp_3_distance:
            bpoNumber(
              input.comp3Distance
            ),

          comp_3_notes:
            input.comp3Notes || null,

          listing_1_address:
            input.listing1Address || null,

          listing_1_price:
            bpoNumber(
              input.listing1Price
            ),

          listing_1_distance:
            bpoNumber(
              input.listing1Distance
            ),

          listing_1_notes:
            input.listing1Notes || null,

          listing_2_address:
            input.listing2Address || null,

          listing_2_price:
            bpoNumber(
              input.listing2Price
            ),

          listing_2_distance:
            bpoNumber(
              input.listing2Distance
            ),

          listing_2_notes:
            input.listing2Notes || null,

          neighborhood_summary:
            input.neighborhoodSummary || null,

          condition_summary:
            input.conditionSummary || null,

          repair_summary:
            input.repairSummary || null,

          pricing_rationale:
            input.pricingRationale || null,

          marketing_strategy:
            input.marketingStrategy || null,

          client_recommendation:
            input.clientRecommendation || null,

          updated_at: now,
        })
        .select("id")
        .single();

    if (bpoError) {
      throw bpoError;
    }

    const currentStage =
      asset.workflow_stage || "assignment";

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

    const currentIndex =
      lifecycle.indexOf(currentStage);

    const valuationIndex =
      lifecycle.indexOf("valuation");

    const newStage =
      currentIndex < valuationIndex
        ? "valuation"
        : currentStage;

    const { error: assetUpdateError } =
      await supabase
        .from("reo_assets")
        .update({
          workflow_stage: newStage,

          initial_list_price:
            bpoNumber(
              input.recommendedListPrice
            ),

          updated_at: now,
        })
        .eq("id", assetId);

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    const {
      data: bpoTasks,
      error: taskLookupError,
    } = await supabase
      .from("reo_asset_tasks")
      .select("id")
      .eq("asset_id", assetId)
      .eq("task_type", "bpo")
      .eq("status", "open");

    if (taskLookupError) {
      throw taskLookupError;
    }

    if (bpoTasks?.length) {
      const ids = bpoTasks.map(
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
          .in("id", ids);

      if (taskUpdateError) {
        throw taskUpdateError;
      }
    }

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            "initial_bpo_completed",

          title:
            "Initial BPO Completed",

          description:
            `Initial BPO completed. As-is value: ${
              input.asIsValue
            }. Recommended list price: ${
              input.recommendedListPrice
            }.`,

          old_stage: currentStage,
          new_stage: newStage,

          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    revalidatePath(
      `/admin/assets/${assetId}`
    );

    revalidatePath("/admin");

    return {
      success: true,
      bpoId: bpo.id,
      workflowStage: newStage,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO BPO ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save BPO.",
    };
  }
}
export type PreservationInput = {
  reviewDate: string;

  reviewedBy: string;
  vendorCompany: string;

  lawnServiceRequired: boolean;
  debrisRemovalRequired: boolean;
  winterizationRequired: boolean;
  utilityManagementRequired: boolean;
  emergencyMaintenanceRequired: boolean;
  poolServiceRequired: boolean;
  pestControlRequired: boolean;

  lawnServiceStatus: string;
  debrisRemovalStatus: string;
  winterizationStatus: string;
  utilityManagementStatus: string;
  emergencyMaintenanceStatus: string;
  poolServiceStatus: string;
  pestControlStatus: string;

  preservationBid: string;
  clientApprovalStatus: string;
  approvedAmount: string;
  finalCost: string;

  workOrderNumber: string;

  preservationSummary: string;
  approvalNotes: string;
  completionNotes: string;

  completed: boolean;
};

function preservationNumber(value: string) {
  if (!value?.trim()) return null;

  const number = Number(
    value.replace(/[$,]/g, "")
  );

  return Number.isFinite(number)
    ? number
    : null;
}

export async function savePreservationReview(
  assetId: string,
  input: PreservationInput
) {
  try {
    const supabase = getSupabase();

    if (!assetId) {
      return {
        success: false,
        error: "Asset ID is missing.",
      };
    }

    if (!input.reviewDate) {
      return {
        success: false,
        error: "Review date is required.",
      };
    }

    const now = new Date().toISOString();

    const { data: asset, error: assetError } =
      await supabase
        .from("reo_assets")
        .select("id, workflow_stage")
        .eq("id", assetId)
        .single();

    if (assetError || !asset) {
      throw assetError ||
        new Error("Asset could not be found.");
    }

    const {
      data: preservation,
      error: preservationError,
    } = await supabase
      .from("reo_preservation_records")
      .insert({
        asset_id: assetId,

        review_date:
          input.reviewDate,

        reviewed_by:
          input.reviewedBy || null,

        vendor_company:
          input.vendorCompany || null,

        lawn_service_required:
          input.lawnServiceRequired,

        debris_removal_required:
          input.debrisRemovalRequired,

        winterization_required:
          input.winterizationRequired,

        utility_management_required:
          input.utilityManagementRequired,

        emergency_maintenance_required:
          input.emergencyMaintenanceRequired,

        pool_service_required:
          input.poolServiceRequired,

        pest_control_required:
          input.pestControlRequired,

        lawn_service_status:
          input.lawnServiceStatus || null,

        debris_removal_status:
          input.debrisRemovalStatus || null,

        winterization_status:
          input.winterizationStatus || null,

        utility_management_status:
          input.utilityManagementStatus || null,

        emergency_maintenance_status:
          input.emergencyMaintenanceStatus || null,

        pool_service_status:
          input.poolServiceStatus || null,

        pest_control_status:
          input.pestControlStatus || null,

        preservation_bid:
          preservationNumber(
            input.preservationBid
          ),

        client_approval_status:
          input.clientApprovalStatus || null,

        approved_amount:
          preservationNumber(
            input.approvedAmount
          ),

        final_cost:
          preservationNumber(
            input.finalCost
          ),

        work_order_number:
          input.workOrderNumber || null,

        preservation_summary:
          input.preservationSummary || null,

        approval_notes:
          input.approvalNotes || null,

        completion_notes:
          input.completionNotes || null,

        completed:
          input.completed,

        completed_at:
          input.completed
            ? now
            : null,

        updated_at: now,
      })
      .select("id")
      .single();

    if (preservationError) {
      throw preservationError;
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

    const currentStage =
      asset.workflow_stage || "assignment";

    const currentIndex =
      lifecycle.indexOf(currentStage);

    const preservationIndex =
      lifecycle.indexOf("preservation");

    const newStage =
      currentIndex < preservationIndex
        ? "preservation"
        : currentStage;

    const { error: assetUpdateError } =
      await supabase
        .from("reo_assets")
        .update({
          workflow_stage: newStage,
          preservation_required:
            input.completed
              ? "No"
              : "Yes",
          updated_at: now,
        })
        .eq("id", assetId);

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    if (input.completed) {
      const {
        data: preservationTasks,
        error: taskLookupError,
      } = await supabase
        .from("reo_asset_tasks")
        .select("id")
        .eq("asset_id", assetId)
        .in("task_type", [
          "preservation_review",
          "preservation_follow_up",
        ])
        .eq("status", "open");

      if (taskLookupError) {
        throw taskLookupError;
      }

      if (
        preservationTasks &&
        preservationTasks.length > 0
      ) {
        const ids =
          preservationTasks.map(
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
            .in("id", ids);

        if (taskUpdateError) {
          throw taskUpdateError;
        }
      }
    }

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            input.completed
              ? "preservation_completed"
              : "preservation_review_saved",

          title:
            input.completed
              ? "Preservation Completed"
              : "Preservation Review Saved",

          description:
            input.preservationSummary ||
            "Preservation review updated.",

          old_stage: currentStage,
          new_stage: newStage,

          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    revalidatePath(
      `/admin/assets/${assetId}`
    );

    revalidatePath("/admin");

    return {
      success: true,
      preservationId:
        preservation.id,
      workflowStage:
        newStage,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO PRESERVATION ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save preservation review.",
    };
  }
}
export type RepairInput = {
  scopeDate: string;
  preparedBy: string;

  scopeSummary: string;

  roofingAmount: string;
  hvacAmount: string;
  plumbingAmount: string;
  electricalAmount: string;
  structuralAmount: string;
  interiorAmount: string;
  exteriorAmount: string;
  landscapingAmount: string;
  appliancesAmount: string;
  otherAmount: string;

  vendor1Name: string;
  vendor1Bid: string;

  vendor2Name: string;
  vendor2Bid: string;

  vendor3Name: string;
  vendor3Bid: string;

  selectedVendor: string;

  clientApprovalStatus: string;
  approvedBudget: string;

  workStartedDate: string;
  targetCompletionDate: string;
  actualCompletionDate: string;

  finalCost: string;

  workStatus: string;

  repairNotes: string;
  approvalNotes: string;
  completionNotes: string;
};

function repairNumber(value: string) {
  if (!value?.trim()) return 0;

  const number = Number(
    value.replace(/[$,]/g, "")
  );

  return Number.isFinite(number)
    ? number
    : 0;
}

export async function saveRepairScope(
  assetId: string,
  input: RepairInput
) {
  try {
    const supabase = getSupabase();

    if (!assetId) {
      return {
        success: false,
        error: "Asset ID is missing.",
      };
    }

    if (!input.scopeDate) {
      return {
        success: false,
        error: "Scope date is required.",
      };
    }

    const now = new Date().toISOString();

    const total =
      repairNumber(input.roofingAmount) +
      repairNumber(input.hvacAmount) +
      repairNumber(input.plumbingAmount) +
      repairNumber(input.electricalAmount) +
      repairNumber(input.structuralAmount) +
      repairNumber(input.interiorAmount) +
      repairNumber(input.exteriorAmount) +
      repairNumber(input.landscapingAmount) +
      repairNumber(input.appliancesAmount) +
      repairNumber(input.otherAmount);

    const { data: asset, error: assetError } =
      await supabase
        .from("reo_assets")
        .select("id, workflow_stage")
        .eq("id", assetId)
        .single();

    if (assetError || !asset) {
      throw assetError ||
        new Error("Asset could not be found.");
    }

    const {
      data: repair,
      error: repairError,
    } = await supabase
      .from("reo_repair_records")
      .insert({
        asset_id: assetId,

        scope_date:
          input.scopeDate,

        prepared_by:
          input.preparedBy || null,

        scope_summary:
          input.scopeSummary || null,

        roofing_amount:
          repairNumber(
            input.roofingAmount
          ),

        hvac_amount:
          repairNumber(
            input.hvacAmount
          ),

        plumbing_amount:
          repairNumber(
            input.plumbingAmount
          ),

        electrical_amount:
          repairNumber(
            input.electricalAmount
          ),

        structural_amount:
          repairNumber(
            input.structuralAmount
          ),

        interior_amount:
          repairNumber(
            input.interiorAmount
          ),

        exterior_amount:
          repairNumber(
            input.exteriorAmount
          ),

        landscaping_amount:
          repairNumber(
            input.landscapingAmount
          ),

        appliances_amount:
          repairNumber(
            input.appliancesAmount
          ),

        other_amount:
          repairNumber(
            input.otherAmount
          ),

        estimated_total: total,

        vendor_1_name:
          input.vendor1Name || null,

        vendor_1_bid:
          repairNumber(
            input.vendor1Bid
          ),

        vendor_2_name:
          input.vendor2Name || null,

        vendor_2_bid:
          repairNumber(
            input.vendor2Bid
          ),

        vendor_3_name:
          input.vendor3Name || null,

        vendor_3_bid:
          repairNumber(
            input.vendor3Bid
          ),

        selected_vendor:
          input.selectedVendor || null,

        client_approval_status:
          input.clientApprovalStatus || null,

        approved_budget:
          repairNumber(
            input.approvedBudget
          ),

        work_started_date:
          input.workStartedDate || null,

        target_completion_date:
          input.targetCompletionDate || null,

        actual_completion_date:
          input.actualCompletionDate || null,

        final_cost:
          repairNumber(
            input.finalCost
          ),

        work_status:
          input.workStatus || "scope",

        repair_notes:
          input.repairNotes || null,

        approval_notes:
          input.approvalNotes || null,

        completion_notes:
          input.completionNotes || null,

        updated_at: now,
      })
      .select("id")
      .single();

    if (repairError) {
      throw repairError;
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

    const currentStage =
      asset.workflow_stage || "assignment";

    const currentIndex =
      lifecycle.indexOf(currentStage);

    const repairIndex =
      lifecycle.indexOf("repairs");

    const newStage =
      currentIndex < repairIndex
        ? "repairs"
        : currentStage;

    const { error: assetUpdateError } =
      await supabase
        .from("reo_assets")
        .update({
          workflow_stage: newStage,

          repair_estimate: total,

          updated_at: now,
        })
        .eq("id", assetId);

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    const {
      data: repairTasks,
      error: taskLookupError,
    } = await supabase
      .from("reo_asset_tasks")
      .select("id")
      .eq("asset_id", assetId)
      .eq("task_type", "repair_scope")
      .eq("status", "open");

    if (taskLookupError) {
      throw taskLookupError;
    }

    if (
      repairTasks &&
      repairTasks.length > 0
    ) {
      const ids =
        repairTasks.map(
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
          .in("id", ids);

      if (taskUpdateError) {
        throw taskUpdateError;
      }
    }

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: assetId,

          activity_type:
            "repair_scope_completed",

          title:
            "Repair Scope and Estimate Completed",

          description:
            `Repair scope prepared. Estimated total: $${total.toLocaleString()}.`,

          old_stage:
            currentStage,

          new_stage:
            newStage,

          client_visible:
            true,
        });

    if (activityError) {
      throw activityError;
    }

    revalidatePath(
      `/admin/assets/${assetId}`
    );

    revalidatePath("/admin");

    return {
      success: true,
      repairId:
        repair.id,
      estimatedTotal:
        total,
      workflowStage:
        newStage,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO REPAIR ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save repair scope.",
    };
  }
}
