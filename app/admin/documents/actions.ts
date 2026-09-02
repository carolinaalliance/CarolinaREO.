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

export async function createAssetDocument(
  formData: FormData
) {
  const supabase =
    getSupabase();

  const assetId =
    textValue(
      formData,
      "asset_id"
    );

  const documentType =
    textValue(
      formData,
      "document_type"
    );

  const expenseId =
    textValue(
      formData,
      "expense_id"
    );

  const workOrderId =
    textValue(
      formData,
      "work_order_id"
    );

  const vendorId =
    textValue(
      formData,
      "vendor_id"
    );

  const notes =
    textValue(
      formData,
      "notes"
    );

  if (!assetId) {
    throw new Error(
      "Asset is required."
    );
  }

  if (!documentType) {
    throw new Error(
      "Document type is required."
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
      "A document file is required."
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
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Only PDF, JPG, and PNG files are allowed."
    );
  }

  const cleanName =
    safeFileName(
      file.name
    );

  const uniqueName =
    `${Date.now()}-${cleanName}`;

  const storagePath =
    `assets/${assetId}/documents/${uniqueName}`;

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
          upsert: false,
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
      .insert({
        asset_id:
          assetId,

        expense_id:
          expenseId,

        work_order_id:
          workOrderId,

        vendor_id:
          vendorId,

        document_type:
          documentType,

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

        notes,

        updated_at:
          new Date().toISOString(),
      });

  if (documentError) {
    throw documentError;
  }

  redirect(
    `/admin/assets/${assetId}?tab=documents`
  );
}
