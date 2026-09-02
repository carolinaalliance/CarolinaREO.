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

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const supabase =
      getSupabase();

    const {
      data: document,
      error,
    } =
      await supabase
        .from("reo_documents")
        .select(`
          id,
          storage_bucket,
          storage_path
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!document) {
      return new NextResponse(
        "Document not found.",
        {
          status: 404,
        }
      );
    }

    if (
      !document.storage_bucket ||
      !document.storage_path
    ) {
      return new NextResponse(
        "Document storage information is missing.",
        {
          status: 404,
        }
      );
    }

    const {
      data: signedData,
      error: signedError,
    } =
      await supabase.storage
        .from(
          document.storage_bucket
        )
        .createSignedUrl(
          document.storage_path,
          60
        );

    if (signedError) {
      throw signedError;
    }

    if (!signedData?.signedUrl) {
      return new NextResponse(
        "Unable to generate secure document link.",
        {
          status: 500,
        }
      );
    }

    return NextResponse.redirect(
      signedData.signedUrl
    );
  } catch (error) {
    console.error(
      "Secure document view error:",
      error
    );

    return new NextResponse(
      "Unable to open document.",
      {
        status: 500,
      }
    );
  }
}
