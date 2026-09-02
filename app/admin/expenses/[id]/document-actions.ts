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

function safeFileName(
  value: string
) {
  return value
    .replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );
}

export async function uploadExpenseDocument(
  expenseId: string,
  formData: FormData
) {
  const supabase =
    getSupabase();

  if (!expenseId) {
    throw new Error(
      "Expense ID is required."
    );
  }

  const file =
    formData.get(
      "document"
    );

  if (
    !file ||
    !(file instanceof File)
  ) {
    throw new Error(
      "A document is required."
    );
  }

  if (file.size === 0) {
    throw new Error(
      "The selected document is empty."
    );
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Only PDF, JPG, and PNG files are allowed."
    );
  }

  const {
    data: expense,
    error: expenseError,
  } =
    await supabase
      .from("reo_expenses")
      .select(`
        id,
        asset_id,
        work_order_id,
        vendor_id,
        invoice_number
      `)
      .eq(
        "id",
        expenseId
      )
      .single();

  if (expenseError) {
    throw expenseError;
  }

  const cleanName =
    safeFileName(
      file.name
    );

  const storagePath =
    `assets/${expense.asset_id}/expenses/${expense.id}/${cleanName}`;

  const bytes =
    await file.arrayBuffer();

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from(
        "reo-documents"
      )
      .upload(
        storagePath,
        bytes,
        {
          contentType:
            file.type,
          upsert: true,
        }
      );

  if (uploadError) {
    throw uploadError;
  }

  const {
    error: documentError,
  } =
    await supabase
      .from(
        "reo_documents"
      )
      .upsert(
        {
          asset_id:
            expense.asset_id,

          expense_id:
            expense.id,

          work_order_id:
            expense.work_order_id,

          vendor_id:
            expense.vendor_id,

          document_type:
            "vendor_invoice",

          file_name:
            cleanName,

          storage_bucket:
            "reo-documents",

          storage_path:
            storagePath,

          mime_type:
            file.type,

          file_size:
            file.size,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "expense_id,document_type",
        }
      );

  if (documentError) {
    throw documentError;
  }

  const {
    error: expenseUpdateError,
  } =
    await supabase
      .from(
        "reo_expenses"
      )
      .update({
        document_url:
          storagePath,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        expense.id
      );

  if (
    expenseUpdateError
  ) {
    throw expenseUpdateError;
  }

  redirect(
    `/admin/expenses/${expense.id}`
  );
}
