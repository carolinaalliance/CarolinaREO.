"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

function textValue(
  formData: FormData,
  field: string
) {
  const value = String(
    formData.get(field) || ""
  ).trim();

  return value || null;
}

function moneyValue(
  formData: FormData,
  field: string
) {
  const raw = String(
    formData.get(field) || ""
  ).trim();

  if (!raw) {
    return null;
  }

  const number = Number(
    raw.replace(/[$,]/g, "")
  );

  return Number.isFinite(number)
    ? number
    : null;
}

function checkboxValue(
  formData: FormData,
  field: string
) {
  return formData.get(field) === "on";
}

function generateWorkOrderNumber() {
  const datePart =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

  const randomPart =
    Math.floor(
      1000 +
        Math.random() * 9000
    );

  return `WO-${datePart}-${randomPart}`;
}

export async function createWorkOrder(
  formData: FormData
) {
  const supabase = getSupabase();

  const assetId =
    textValue(
      formData,
      "asset_id"
    );

  const vendorId =
    textValue(
      formData,
      "vendor_id"
    );

  const category =
    textValue(
      formData,
      "category"
    );

  const title =
    textValue(
      formData,
      "title"
    );

  if (!assetId) {
    throw new Error(
      "Asset is required."
    );
  }

  if (!category) {
    throw new Error(
      "Work order category is required."
    );
  }

  if (!title) {
    throw new Error(
      "Work order title is required."
    );
  }

  const workOrderNumber =
    generateWorkOrderNumber();

  const {
    data: workOrder,
    error,
  } =
    await supabase
      .from("reo_work_orders")
      .insert({
        asset_id:
          assetId,

        vendor_id:
          vendorId,

        work_order_number:
          workOrderNumber,

        category,

        title,

        scope_of_work:
          textValue(
            formData,
            "scope_of_work"
          ),

        priority:
          textValue(
            formData,
            "priority"
          ) || "normal",

        status:
          "assigned",

        authorization_limit:
          moneyValue(
            formData,
            "authorization_limit"
          ),

        estimated_cost:
          moneyValue(
            formData,
            "estimated_cost"
          ),

        assigned_date:
          textValue(
            formData,
            "assigned_date"
          ),

        due_date:
          textValue(
            formData,
            "due_date"
          ),

        client_approval_required:
          checkboxValue(
            formData,
            "client_approval_required"
          ),

        client_approved:
          false,

        completion_verified:
          false,

        invoice_received:
          false,

        notes:
          textValue(
            formData,
            "notes"
          ),

        updated_at:
          new Date().toISOString(),
      })
      .select(
        "id, vendor_id"
      )
      .single();

  if (error) {
    throw error;
  }

  if (workOrder.vendor_id) {
    redirect(
      `/admin/vendors/${workOrder.vendor_id}`
    );
  }

  redirect(
    `/admin/work-orders/${workOrder.id}`
  );
}

export async function updateWorkOrder(
  workOrderId: string,
  formData: FormData
) {
  const supabase = getSupabase();

  if (!workOrderId) {
    throw new Error(
      "Work order ID is required."
    );
  }

  const status =
    textValue(
      formData,
      "status"
    ) || "assigned";

  const title =
    textValue(
      formData,
      "title"
    );

  const category =
    textValue(
      formData,
      "category"
    );

  if (!title) {
    throw new Error(
      "Work order title is required."
    );
  }

  if (!category) {
    throw new Error(
      "Work order category is required."
    );
  }

  const clientApproved =
    checkboxValue(
      formData,
      "client_approved"
    );

  const completionVerified =
    checkboxValue(
      formData,
      "completion_verified"
    );

  const invoiceReceived =
    checkboxValue(
      formData,
      "invoice_received"
    );

  const clientApprovalDate =
    clientApproved
      ? textValue(
          formData,
          "client_approval_date"
        )
      : null;

  const completedDate =
    status === "completed"
      ? textValue(
          formData,
          "completed_date"
        )
      : null;

  const { error } =
    await supabase
      .from("reo_work_orders")
      .update({
        category,

        title,

        scope_of_work:
          textValue(
            formData,
            "scope_of_work"
          ),

        priority:
          textValue(
            formData,
            "priority"
          ) || "normal",

        status,

        authorization_limit:
          moneyValue(
            formData,
            "authorization_limit"
          ),

        estimated_cost:
          moneyValue(
            formData,
            "estimated_cost"
          ),

        final_cost:
          moneyValue(
            formData,
            "final_cost"
          ),

        assigned_date:
          textValue(
            formData,
            "assigned_date"
          ),

        due_date:
          textValue(
            formData,
            "due_date"
          ),

        completed_date:
          completedDate,

        client_approval_required:
          checkboxValue(
            formData,
            "client_approval_required"
          ),

        client_approved:
          clientApproved,

        client_approval_date:
          clientApprovalDate,

        completion_verified:
          completionVerified,

        invoice_received:
          invoiceReceived,

        invoice_number:
          textValue(
            formData,
            "invoice_number"
          ),

        notes:
          textValue(
            formData,
            "notes"
          ),

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        workOrderId
      );

  if (error) {
    throw error;
  }

  redirect(
    `/admin/work-orders/${workOrderId}`
  );
}
