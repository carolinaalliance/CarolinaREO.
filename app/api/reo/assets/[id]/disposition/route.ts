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
    const { id: assetId } =
      await context.params;

    if (!assetId) {
      return NextResponse.json(
        {
          error:
            "Asset ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      getSupabase();

    const [
      assetResult,
      closingResult,
      contractResult,
      marketingResult,
      offerResult,
      activityResult,
      taskResult,
    ] = await Promise.all([
      supabase
        .from("reo_assets")
        .select("*")
        .eq("id", assetId)
        .single(),

      supabase
        .from("reo_closing_records")
        .select("*")
        .eq("asset_id", assetId)
        .maybeSingle(),

      supabase
        .from("reo_contract_records")
        .select("*")
        .eq("asset_id", assetId)
        .maybeSingle(),

      supabase
        .from("reo_marketing_records")
        .select("*")
        .eq("asset_id", assetId)
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle(),

      supabase
        .from("reo_offers")
        .select("*")
        .eq("asset_id", assetId)
        .eq("status", "accepted")
        .order(
          "accepted_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle(),

      supabase
        .from("reo_asset_activity")
        .select(`
          id,
          activity_type,
          title,
          description,
          old_stage,
          new_stage,
          created_at
        `)
        .eq("asset_id", assetId)
        .order(
          "created_at",
          {
            ascending: true,
          }
        ),

      supabase
        .from("reo_asset_tasks")
        .select(`
          id,
          title,
          task_type,
          workflow_stage,
          status,
          due_at,
          completed_at
        `)
        .eq("asset_id", assetId)
        .order(
          "created_at",
          {
            ascending: true,
          }
        ),
    ]);

    if (
      assetResult.error ||
      !assetResult.data
    ) {
      throw (
        assetResult.error ||
        new Error(
          "Asset could not be found."
        )
      );
    }

    if (
      closingResult.error
    ) {
      throw closingResult.error;
    }

    if (
      contractResult.error
    ) {
      throw contractResult.error;
    }

    if (
      marketingResult.error
    ) {
      throw marketingResult.error;
    }

    if (
      offerResult.error
    ) {
      throw offerResult.error;
    }

    if (
      activityResult.error
    ) {
      throw activityResult.error;
    }

    if (
      taskResult.error
    ) {
      throw taskResult.error;
    }

    const asset =
      assetResult.data;

    const closing =
      closingResult.data;

    const contract =
      contractResult.data;

    const marketing =
      marketingResult.data;

    const acceptedOffer =
      offerResult.data;

    const activities =
      activityResult.data || [];

    const tasks =
      taskResult.data || [];

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "completed"
      );

    const openTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "open"
      );

    let daysInInventory:
      number | null = null;

    if (
      asset.assignment_date &&
      closing?.closing_date
    ) {
      const start =
        new Date(
          `${asset.assignment_date}T00:00:00`
        );

      const end =
        new Date(
          `${closing.closing_date}T00:00:00`
        );

      daysInInventory =
        Math.max(
          0,
          Math.round(
            (
              end.getTime() -
              start.getTime()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              )
          )
        );
    }

    return NextResponse.json({
      success: true,

      report: {
        asset,
        closing,
        contract,
        marketing,
        acceptedOffer,
        activities,
        tasks,

        metrics: {
          daysInInventory,
          totalTasks:
            tasks.length,

          completedTasks:
            completedTasks.length,

          openTasks:
            openTasks.length,

          totalActivities:
            activities.length,

          finalSalePrice:
            closing?.gross_sale_price ??
            acceptedOffer?.accepted_price ??
            asset.accepted_offer ??
            null,

          netProceeds:
            closing?.net_proceeds ??
            null,

          originalListPrice:
            marketing?.original_list_price ??
            asset.initial_list_price ??
            null,

          finalListPrice:
            marketing?.current_list_price ??
            asset.initial_list_price ??
            null,

          dispositionDate:
            closing?.closing_date ??
            asset.disposition_date ??
            null,
        },
      },
    });
  } catch (error) {
    console.error(
      "CAROLINA REO DISPOSITION REPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load disposition report.",
      },
      {
        status: 500,
      }
    );
  }
}
