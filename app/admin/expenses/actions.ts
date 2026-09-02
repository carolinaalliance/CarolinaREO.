"use server";

import { redirect } from "next/navigation";
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

  return createClient(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
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

export async function createExpense(
  formData: FormData
) {
  const supabase = getSupabase();

  const assetId =
    textValue(
      formData,
      "asset_id"
    );

  const expenseCategory =
    textValue(
      formData,
      "expense_category"
    );

  if (!assetId) {
    throw new Error(
      "Asset is required."
    );
  }

  if (!expenseCategory) {
    throw new Error(
      "Expense category is required."
    );
  }

  const {
    data: expense,
    error,
  } =
    await supabase
      .from("reo_expenses")
      .insert({
        asset_id:
          assetId,

        work_order_id:
          textValue(
            formData,
            "work_order_id"
          ),

        vendor_id:
          textValue(
            formData,
            "vendor_id"
          ),

        expense_category:
          expenseCategory,

        description:
          textValue(
            formData,
            "description"
          ),

        invoice_number:
          textValue(
            formData,
            "invoice_number"
          ),

        invoice_amount:
          moneyValue(
            formData,
            "invoice_amount"
          ),

        invoice_date:
          textValue(
            formData,
            "invoice_date"
          ),

        approval_status:
          textValue(
            formData,
            "approval_status"
          ) || "submitted",

        approved_amount:
          moneyValue(
            formData,
            "approved_amount"
          ),

        approved_date:
          textValue(
            formData,
            "approved_date"
          ),

        payment_status:
          textValue(
            formData,
            "payment_status"
          ) || "unpaid",

        paid_amount:
          moneyValue(
            formData,
            "paid_amount"
          ),

        paid_date:
          textValue(
            formData,
            "paid_date"
          ),

        payment_reference:
          textValue(
            formData,
            "payment_reference"
          ),

        reimbursement_status:
          textValue(
            formData,
            "reimbursement_status"
          ) || "not_submitted",

        reimbursed_amount:
          moneyValue(
            formData,
            "reimbursed_amount"
          ),

        reimbursed_date:
          textValue(
            formData,
            "reimbursed_date"
          ),

        internal_notes:
          textValue(
            formData,
            "internal_notes"
          ),

        updated_at:
          new Date().toISOString(),
      })
      .select("id, asset_id")
      .single();

  if (error) {
    throw error;
  }

  redirect(
    `/admin/assets/${expense.asset_id}?tab=expenses`
  );
}
