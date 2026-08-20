"use server";

import { createClient } from "@supabase/supabase-js";

type AssignmentData = {
  institutionName: string;
  institutionType: string;
  clientAssetNumber: string;
  loanNumber: string;
  assignmentDate: string;
  priority: string;

  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  acreage: string;
  yearBuilt: string;

  foreclosureSaleDate: string;
  redemptionExpirationDate: string;
  deedRecorded: string;
  titleCompany: string;
  attorney: string;

  occupancyStatus: string;
  occupantName: string;
  occupantPhone: string;
  cashForKeysAuthorized: string;

  lockboxCode: string;
  keyLocation: string;
  rekeyRequired: string;
  propertySecured: string;

  electricStatus: string;
  waterStatus: string;
  gasStatus: string;

  hoaName: string;
  hoaContact: string;
  hoaPhone: string;
  hoaBalanceKnown: string;

  bpoRequired: string;
  appraisalRequired: string;
  valuationDueDate: string;

  preservationRequired: string;
  initialServiceLimit: string;
  repairLimit: string;

  listingRequired: string;
  initialListPrice: string;
  listDateTarget: string;
  commissionInstructions: string;

  inspectionDueHours: string;
  occupancyDueHours: string;
  bpoDueHours: string;
  offerResponseHours: string;

  assetManagerName: string;
  assetManagerEmail: string;
  assetManagerPhone: string;
  attorneyContact: string;
  titleContact: string;

  notes: string;
};

function nullableNumber(value: string) {
  if (!value?.trim()) return null;

  const number = Number(value.replace(/[$,]/g, ""));

  return Number.isFinite(number) ? number : null;
}

function nullableInteger(value: string) {
  if (!value?.trim()) return null;

  const number = Number.parseInt(value, 10);

  return Number.isFinite(number) ? number : null;
}

function nullableDate(value: string) {
  return value?.trim() ? value : null;
}

function hoursFromAssignment(
  assignmentDate: string,
  hours: number
) {
  const startingDate = assignmentDate
    ? new Date(`${assignmentDate}T12:00:00`)
    : new Date();

  startingDate.setHours(startingDate.getHours() + hours);

  return startingDate.toISOString();
}

export async function createReoAssignment(
  formData: AssignmentData
) {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        error:
          "Supabase server environment variables are missing.",
      };
    }

    if (!formData.institutionName.trim()) {
      return {
        success: false,
        error: "Institution Name is required.",
      };
    }

    if (!formData.address.trim()) {
      return {
        success: false,
        error: "Property Address is required.",
      };
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // =========================================================
    // 1. FIND OR CREATE INSTITUTION
    // =========================================================

    const { data: existingClients, error: clientSearchError } =
      await supabase
        .from("reo_clients")
        .select("id")
        .ilike(
          "institution_name",
          formData.institutionName.trim()
        )
        .limit(1);

    if (clientSearchError) {
      throw clientSearchError;
    }

    let clientId =
      existingClients && existingClients.length > 0
        ? existingClients[0].id
        : null;

    if (!clientId) {
      const { data: newClient, error: clientInsertError } =
        await supabase
          .from("reo_clients")
          .insert({
            institution_name:
              formData.institutionName.trim(),
            institution_type:
              formData.institutionType || null,
            primary_contact_name:
              formData.assetManagerName || null,
            primary_contact_email:
              formData.assetManagerEmail || null,
            primary_contact_phone:
              formData.assetManagerPhone || null,
            status: "active",
          })
          .select("id")
          .single();

      if (clientInsertError) {
        throw clientInsertError;
      }

      clientId = newClient.id;
    }

    // =========================================================
    // 2. CREATE ASSET
    // =========================================================

    const { data: asset, error: assetError } =
      await supabase
        .from("reo_assets")
        .insert({
          client_id: clientId,

          client_asset_number:
            formData.clientAssetNumber || null,

          loan_number:
            formData.loanNumber || null,

          assignment_date:
            formData.assignmentDate ||
            new Date().toISOString().slice(0, 10),

          priority:
            formData.priority || "Standard",

          property_address:
            formData.address.trim(),

          city:
            formData.city || null,

          state:
            formData.state || null,

          postal_code:
            formData.zip || null,

          county:
            formData.county || null,

          property_type:
            formData.propertyType || null,

          bedrooms:
            nullableInteger(formData.bedrooms),

          bathrooms:
            nullableNumber(formData.bathrooms),

          square_feet:
            nullableInteger(formData.squareFeet),

          acreage:
            nullableNumber(formData.acreage),

          year_built:
            nullableInteger(formData.yearBuilt),

          foreclosure_sale_date:
            nullableDate(formData.foreclosureSaleDate),

          redemption_expiration_date:
            nullableDate(
              formData.redemptionExpirationDate
            ),

          deed_recorded:
            formData.deedRecorded || null,

          title_company:
            formData.titleCompany || null,

          attorney:
            formData.attorney || null,

          occupancy_status:
            formData.occupancyStatus || "Unknown",

          occupant_name:
            formData.occupantName || null,

          occupant_phone:
            formData.occupantPhone || null,

          cash_for_keys_authorized:
            formData.cashForKeysAuthorized || "No",

          lockbox_code:
            formData.lockboxCode || null,

          key_location:
            formData.keyLocation || null,

          rekey_required:
            formData.rekeyRequired || "Yes",

          property_secured:
            formData.propertySecured || "No",

          electric_status:
            formData.electricStatus || "Unknown",

          water_status:
            formData.waterStatus || "Unknown",

          gas_status:
            formData.gasStatus || "Unknown",

          hoa_name:
            formData.hoaName || null,

          hoa_contact:
            formData.hoaContact || null,

          hoa_phone:
            formData.hoaPhone || null,

          hoa_balance_known:
            formData.hoaBalanceKnown || "No",

          bpo_required:
            formData.bpoRequired || "Yes",

          appraisal_required:
            formData.appraisalRequired || "No",

          valuation_due_date:
            nullableDate(formData.valuationDueDate),

          preservation_required:
            formData.preservationRequired || "Yes",

          initial_service_limit:
            nullableNumber(formData.initialServiceLimit),

          repair_limit:
            nullableNumber(formData.repairLimit),

          listing_required:
            formData.listingRequired || "Yes",

          initial_list_price:
            nullableNumber(formData.initialListPrice),

          list_date_target:
            nullableDate(formData.listDateTarget),

          commission_instructions:
            formData.commissionInstructions || null,

          inspection_due_hours:
            nullableInteger(
              formData.inspectionDueHours
            ) ?? 24,

          occupancy_due_hours:
            nullableInteger(
              formData.occupancyDueHours
            ) ?? 24,

          bpo_due_hours:
            nullableInteger(
              formData.bpoDueHours
            ) ?? 48,

          offer_response_hours:
            nullableInteger(
              formData.offerResponseHours
            ) ?? 24,

          asset_manager_name:
            formData.assetManagerName || null,

          asset_manager_email:
            formData.assetManagerEmail || null,

          asset_manager_phone:
            formData.assetManagerPhone || null,

          attorney_contact:
            formData.attorneyContact || null,

          title_contact:
            formData.titleContact || null,

          workflow_stage: "assignment",

          status: "active",

          notes:
            formData.notes || null,
        })
        .select(
          "id, asset_number, property_address"
        )
        .single();

    if (assetError) {
      throw assetError;
    }

    // =========================================================
    // 3. INITIAL ACTIVITY RECORD
    // =========================================================

    const { error: activityError } =
      await supabase
        .from("reo_asset_activity")
        .insert({
          asset_id: asset.id,
          activity_type: "assignment_received",
          title: "Assignment Received",
          description:
            `New institutional assignment received for ${asset.property_address}.`,
          old_stage: null,
          new_stage: "assignment",
          client_visible: true,
        });

    if (activityError) {
      throw activityError;
    }

    // =========================================================
    // 4. AUTOMATIC SLA TASKS
    // =========================================================

    const occupancyHours =
      nullableInteger(formData.occupancyDueHours) ?? 24;

    const inspectionHours =
      nullableInteger(formData.inspectionDueHours) ?? 24;

    const bpoHours =
      nullableInteger(formData.bpoDueHours) ?? 48;

    const tasks: {
      asset_id: string;
      task_type: string;
      title: string;
      description: string;
      workflow_stage: string;
      priority: string;
      status: string;
      due_at: string;
      client_visible: boolean;
      is_sla_task: boolean;
    }[] = [];

    tasks.push({
      asset_id: asset.id,
      task_type: "occupancy_verification",
      title: "Complete Occupancy Verification",
      description:
        "Verify and document current occupancy status.",
      workflow_stage: "occupancy",
      priority: "high",
      status: "open",
      due_at: hoursFromAssignment(
        formData.assignmentDate,
        occupancyHours
      ),
      client_visible: true,
      is_sla_task: true,
    });

    tasks.push({
      asset_id: asset.id,
      task_type: "initial_inspection",
      title: "Complete Initial Property Inspection",
      description:
        "Complete initial property inspection and condition documentation.",
      workflow_stage: "inspection",
      priority: "high",
      status: "open",
      due_at: hoursFromAssignment(
        formData.assignmentDate,
        inspectionHours
      ),
      client_visible: true,
      is_sla_task: true,
    });

    if (formData.rekeyRequired === "Yes") {
      tasks.push({
        asset_id: asset.id,
        task_type: "secure_property",
        title: "Secure and Rekey Property",
        description:
          "Coordinate initial securing, rekeying, and access control.",
        workflow_stage: "securing",
        priority: "high",
        status: "open",
        due_at: hoursFromAssignment(
          formData.assignmentDate,
          24
        ),
        client_visible: true,
        is_sla_task: true,
      });
    }

    if (formData.bpoRequired === "Yes") {
      tasks.push({
        asset_id: asset.id,
        task_type: "bpo",
        title: "Complete Initial BPO",
        description:
          "Prepare initial broker price opinion and disposition recommendation.",
        workflow_stage: "valuation",
        priority: "high",
        status: "open",
        due_at: hoursFromAssignment(
          formData.assignmentDate,
          bpoHours
        ),
        client_visible: true,
        is_sla_task: true,
      });
    }

    if (formData.preservationRequired === "Yes") {
      tasks.push({
        asset_id: asset.id,
        task_type: "preservation_review",
        title: "Review Preservation Requirements",
        description:
          "Evaluate immediate preservation, maintenance, and repair requirements.",
        workflow_stage: "preservation",
        priority: "normal",
        status: "open",
        due_at: hoursFromAssignment(
          formData.assignmentDate,
          48
        ),
        client_visible: false,
        is_sla_task: false,
      });
    }

    const { error: tasksError } =
      await supabase
        .from("reo_asset_tasks")
        .insert(tasks);

    if (tasksError) {
      throw tasksError;
    }

    return {
      success: true,
      assetId: asset.id,
      assetNumber: asset.asset_number,
    };
  } catch (error) {
    console.error(
      "CAROLINA REO CREATE ASSIGNMENT ERROR:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create assignment.",
    };
  }
}
