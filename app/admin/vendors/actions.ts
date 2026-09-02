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

function checkboxValue(
  formData: FormData,
  field: string
) {
  return formData.get(field) === "on";
}

export async function createVendor(
  formData: FormData
) {
  const supabase = getSupabase();

  const companyName =
    textValue(
      formData,
      "company_name"
    );

  if (!companyName) {
    throw new Error(
      "Company name is required."
    );
  }

  const {
    data: vendor,
    error,
  } = await supabase
    .from("reo_vendors")
    .insert({
      company_name: companyName,

      contact_name:
        textValue(
          formData,
          "contact_name"
        ),

      email:
        textValue(
          formData,
          "email"
        ),

      phone:
        textValue(
          formData,
          "phone"
        ),

      address_line_1:
        textValue(
          formData,
          "address_line_1"
        ),

      address_line_2:
        textValue(
          formData,
          "address_line_2"
        ),

      city:
        textValue(
          formData,
          "city"
        ),

      state:
        textValue(
          formData,
          "state"
        ),

      zip_code:
        textValue(
          formData,
          "zip_code"
        ),

      vendor_type:
        textValue(
          formData,
          "vendor_type"
        ),

      service_areas:
        textValue(
          formData,
          "service_areas"
        ),

      tax_id_on_file:
        checkboxValue(
          formData,
          "tax_id_on_file"
        ),

      w9_on_file:
        checkboxValue(
          formData,
          "w9_on_file"
        ),

      insurance_on_file:
        checkboxValue(
          formData,
          "insurance_on_file"
        ),

      insurance_expiration:
        textValue(
          formData,
          "insurance_expiration"
        ),

      active: true,

      notes:
        textValue(
          formData,
          "notes"
        ),

      updated_at:
        new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  redirect(
    `/admin/vendors/${vendor.id}`
  );
}

export async function updateVendor(
  vendorId: string,
  formData: FormData
) {
  const supabase = getSupabase();

  if (!vendorId) {
    throw new Error(
      "Vendor ID is required."
    );
  }

  const companyName =
    textValue(
      formData,
      "company_name"
    );

  if (!companyName) {
    throw new Error(
      "Company name is required."
    );
  }

  const { error } =
    await supabase
      .from("reo_vendors")
      .update({
        company_name:
          companyName,

        contact_name:
          textValue(
            formData,
            "contact_name"
          ),

        email:
          textValue(
            formData,
            "email"
          ),

        phone:
          textValue(
            formData,
            "phone"
          ),

        address_line_1:
          textValue(
            formData,
            "address_line_1"
          ),

        address_line_2:
          textValue(
            formData,
            "address_line_2"
          ),

        city:
          textValue(
            formData,
            "city"
          ),

        state:
          textValue(
            formData,
            "state"
          ),

        zip_code:
          textValue(
            formData,
            "zip_code"
          ),

        vendor_type:
          textValue(
            formData,
            "vendor_type"
          ),

        service_areas:
          textValue(
            formData,
            "service_areas"
          ),

        tax_id_on_file:
          checkboxValue(
            formData,
            "tax_id_on_file"
          ),

        w9_on_file:
          checkboxValue(
            formData,
            "w9_on_file"
          ),

        insurance_on_file:
          checkboxValue(
            formData,
            "insurance_on_file"
          ),

        insurance_expiration:
          textValue(
            formData,
            "insurance_expiration"
          ),

        notes:
          textValue(
            formData,
            "notes"
          ),

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", vendorId);

  if (error) {
    throw error;
  }

  redirect(
    `/admin/vendors/${vendorId}`
  );
}

export async function setVendorActiveStatus(
  vendorId: string,
  active: boolean
) {
  const supabase = getSupabase();

  if (!vendorId) {
    throw new Error(
      "Vendor ID is required."
    );
  }

  const { error } =
    await supabase
      .from("reo_vendors")
      .update({
        active,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", vendorId);

  if (error) {
    throw error;
  }

  redirect(
    `/admin/vendors/${vendorId}`
  );
}
