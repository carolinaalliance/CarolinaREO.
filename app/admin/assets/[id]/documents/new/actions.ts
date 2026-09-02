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

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getText(
  formData: FormData,
  fieldName: string
) {
  const value = String(
    formData.get(fieldName) || ""
  ).trim();

  return value || null;
}

function cleanFileName(
  fileName: string
) {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadAssetDocument(
  formData: FormData
) {
  const supabase = getSupabase();

  const assetId = getText(
    formData,
    "asset_id"
  );

  const documentType = getText(
    formData,
    "document_type"
  );

  const expenseId = getText(
    formData,
    "expense_id"
  );

  const workOrderId = getText(
    formData,
    "work_order_id"
  );

  const vendorId = getText(
    formData,
    "vendor_id"
  );

  const notes = getText(
    formData,
    "notes"
  );

  if (!assetId) {
    throw new Error(
      "Asset ID is required."
    );
  }

  if (!documentType) {
    throw new Error(
      "Document type is required."
    );
  }

  const file = formData.get(
    "document"
  );

  if (
    !file ||
    !(file instanceof File)
  ) {
    throw new Error(
      "Please select a document."
    );
  }

  if (file.size === 0) {
    throw new Error(
      "The selected file is empty."
    );
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (
    !allowedTypes.includes(file.type)
  ) {
    throw new Error(
      "Only PDF, JPG, and PNG files are allowed."
    );
  }

  const fileName =
    cleanFileName(file.name);

  const storagePath =
    `assets/${assetId}/${Date.now()}-${fileName}`;

  const fileBuffer =
    await file.arrayBuffer();

  const {
    error: uploadError,
  } = await supabase.storage
    .from("reo-documents")
    .upload(
      storagePath,
      fileBuffer,
      {
        contentType: file.type,
        upsert: false,
      }
    );

  if (uploadError) {
    throw uploadError;
  }

  const {
    error: documentError,
  } = await supabase
    .from("reo_documents")
    .insert({
      asset_id: assetId,
      expense_id: expenseId,
      work_order_id: workOrderId,
      vendor_id: vendorId,
      document_type: documentType,
      storage_bucket:
        "reo-documents",
      storage_path: storagePath,
      mime_type: file.type,
      file_size: file.size,
      notes,
      updated_at:
        new Date().toISOString(),
    });

  if (documentError) {
    await supabase.storage
      .from("reo-documents")
      .remove([storagePath]);

    throw documentError;
  }

  if (expenseId) {
    const {
      error: expenseUpdateError,
    } = await supabase
      .from("reo_expenses")
      .update({
        document_url:
          storagePath,
      })
      .eq("id", expenseId);

    if (expenseUpdateError) {
      throw expenseUpdateError;
    }
  }

  redirect(
    `/admin/assets/${assetId}?tab=documents`
  );
}
