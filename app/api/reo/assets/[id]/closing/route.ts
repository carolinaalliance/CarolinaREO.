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

function numberOrNull(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const parsed = Number(
    String(value).replace(/[$,]/g, "")
  );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function dateOrNull(value: unknown) {
  if (!value) return null;

  const text = String(value).trim();

  return text || null;
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
          error: "Asset ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      getSupabase();

    const {
      data: closing,
      error: closingError,
    } = await supabase
      .from("reo_closing_records")
      .select("*")
      .eq("asset_id", assetId)
      .maybeSingle();

    if (closingError) {
      throw closingError;
    }

    if (!closing) {
      return NextResponse.json({
        success: true,
        closing: null,
      });
    }

    return NextResponse.json({
      success: true,
      closing,
    });
  } catch (error) {
    console.error(
      "CAROLINA REO CLOSING GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load Closing workspace.",
      },
      {
        status: 500,
      }
    );
  }
}
export async function POST(
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
          error: "Asset ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const supabase =
      getSupabase();

    const now =
      new Date().toISOString();

    const {
      data: asset,
      error: assetError,
    } = await supabase
      .from("reo_assets")
      .select(`
        id,
        workflow_stage,
        property_address,
        accepted_offer
      `)
      .eq("id", assetId)
      .single();

    if (assetError || !asset) {
      return NextResponse.json(
        {
          error:
            "Asset could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const grossSalePrice =
      numberOrNull(
        body.grossSalePrice
      ) ||
      numberOrNull(
        body.acceptedPrice
      ) ||
      0;

    const sellerCredits =
      numberOrNull(
        body.sellerCredits
      ) || 0;

    const commissionCost =
      numberOrNull(
        body.commissionCost
      ) || 0;

    const attorneyTitleCost =
      numberOrNull(
        body.attorneyTitleCost
      ) || 0;

    const taxesProrations =
      numberOrNull(
        body.taxesProrations
      ) || 0;

    const hoaCosts =
      numberOrNull(
        body.hoaCosts
      ) || 0;

    const repairPreservationCosts =
      numberOrNull(
        body.repairPreservationCosts
      ) || 0;

    const otherDeductions =
      numberOrNull(
        body.otherDeductions
      ) || 0;

    const netProceeds =
      grossSalePrice -
      sellerCredits -
      commissionCost -
      attorneyTitleCost -
      taxesProrations -
      hoaCosts -
      repairPreservationCosts -
      otherDeductions;

    const readinessItems = [
      Boolean(
        body.finalWalkthroughComplete
      ),
      Boolean(
        body.clearToCloseConfirmed
      ),
      Boolean(
        body.finalTitleClear
      ),
      Boolean(
        body.settlementStatementReceived
      ),
      Boolean(
        body.settlementStatementApproved
      ),
      Boolean(
        body.sellerSigned
      ),
      Boolean(
        body.buyerSigned
      ),
      Boolean(
        body.closingCompleted
      ),
      Boolean(
        body.fundsReceived
      ),
      Boolean(
        body.deedExecuted
      ),
      Boolean(
        body.deedRecorded
      ),
      Boolean(
        body.clientClosingPackageComplete
      ),
      Boolean(
        body.mlsClosed
      ),
    ];

    const readinessCount =
      readinessItems.filter(
        Boolean
      ).length;

    const dispositionReadiness =
      Math.round(
        (
          readinessCount /
          readinessItems.length
        ) * 100
      );

    const hasCriticalException =
      Boolean(body.fundingIssue) ||
      Boolean(body.titleIssue) ||
      Boolean(body.recordingIssue) ||
      Boolean(body.documentIssue) ||
      Boolean(body.clientHold) ||
      Boolean(
        body.legalReviewNeeded
      );

    const eligibleForDisposition =
      dispositionReadiness === 100 &&
      !hasCriticalException;

    const {
      data: closingRecord,
      error: closingError,
    } = await supabase
      .from("reo_closing_records")
      .upsert(
        {
          asset_id:
            assetId,

          closing_date:
            dateOrNull(
              body.closingDate
            ),

          closing_time:
            body.closingTime ||
            null,

          closing_location:
            body.closingLocation ||
            null,

          accepted_price:
            numberOrNull(
              body.acceptedPrice
            ),

          buyer_name:
            body.buyerName ||
            null,

          financing_type:
            body.financingType ||
            null,

          attorney_name:
            body.attorneyName ||
            null,

          title_company:
            body.titleCompany ||
            null,

          final_walkthrough_complete:
            Boolean(
              body.finalWalkthroughComplete
            ),

          clear_to_close_confirmed:
            Boolean(
              body.clearToCloseConfirmed
            ),

          final_title_clear:
            Boolean(
              body.finalTitleClear
            ),

          settlement_statement_received:
            Boolean(
              body.settlementStatementReceived
            ),

          settlement_statement_approved:
            Boolean(
              body.settlementStatementApproved
            ),

          seller_signed:
            Boolean(
              body.sellerSigned
            ),

          buyer_signed:
            Boolean(
              body.buyerSigned
            ),

          closing_completed:
            Boolean(
              body.closingCompleted
            ),

          gross_sale_price:
            grossSalePrice,

          seller_credits:
            sellerCredits,

          commission_cost:
            commissionCost,

          attorney_title_cost:
            attorneyTitleCost,

          taxes_prorations:
            taxesProrations,

          hoa_costs:
            hoaCosts,

          repair_preservation_costs:
            repairPreservationCosts,

          other_deductions:
            otherDeductions,

          net_proceeds:
            netProceeds,

          funds_received:
            Boolean(
              body.fundsReceived
            ),

          funding_date:
            dateOrNull(
              body.fundingDate
            ),

          funding_reference:
            body.fundingReference ||
            null,

          deed_executed:
            Boolean(
              body.deedExecuted
            ),

          deed_recorded:
            Boolean(
              body.deedRecorded
            ),

          recording_date:
            dateOrNull(
              body.recordingDate
            ),

          recording_book_page:
            body.recordingBookPage ||
            null,

          recording_instrument_number:
            body.recordingInstrumentNumber ||
            null,

          closing_disclosure_received:
            Boolean(
              body.closingDisclosureReceived
            ),

          deed_copy_received:
            Boolean(
              body.deedCopyReceived
            ),

          wire_confirmation_received:
            Boolean(
              body.wireConfirmationReceived
            ),

          final_invoice_package_complete:
            Boolean(
              body.finalInvoicePackageComplete
            ),

          client_closing_package_complete:
            Boolean(
              body.clientClosingPackageComplete
            ),

          utilities_transferred:
            Boolean(
              body.utilitiesTransferred
            ),

          keys_released:
            Boolean(
              body.keysReleased
            ),

          lockbox_removed:
            Boolean(
              body.lockboxRemoved
            ),

          signage_removed:
            Boolean(
              body.signageRemoved
            ),

          mls_closed:
            Boolean(
              body.mlsClosed
            ),

          vendors_notified:
            Boolean(
              body.vendorsNotified
            ),

          funding_issue:
            Boolean(
              body.fundingIssue
            ),

          title_issue:
            Boolean(
              body.titleIssue
            ),

          recording_issue:
            Boolean(
              body.recordingIssue
            ),

          document_issue:
            Boolean(
              body.documentIssue
            ),

          client_hold:
            Boolean(
              body.clientHold
            ),

          legal_review_needed:
            Boolean(
              body.legalReviewNeeded
            ),

          closing_notes:
            body.closingNotes ||
            null,

          disposition_notes:
            body.dispositionNotes ||
            null,

          disposition_readiness:
            dispositionReadiness,

          disposed:
            eligibleForDisposition,

          disposed_at:
            eligibleForDisposition
              ? now
              : null,

          updated_at:
            now,
        },
        {
          onConflict:
            "asset_id",
        }
      )
      .select("*")
      .single();

    if (closingError) {
      throw closingError;
    }

    const assetUpdates:
      Record<
        string,
        unknown
      > = {
        updated_at:
          now,
      };

    if (grossSalePrice) {
      assetUpdates.accepted_offer =
        grossSalePrice;
    }

    if (body.titleCompany) {
      assetUpdates.title_company =
        body.titleCompany;
    }

    if (body.attorneyName) {
      assetUpdates.attorney =
        body.attorneyName;
    }

    if (
      eligibleForDisposition
    ) {
      assetUpdates.workflow_stage =
        "disposed";

      assetUpdates.disposition_date =
        body.closingDate ||
        new Date()
          .toISOString()
          .slice(0, 10);
    }

    const {
      error: assetUpdateError,
    } = await supabase
      .from("reo_assets")
      .update(
        assetUpdates
      )
      .eq(
        "id",
        assetId
      );

    if (assetUpdateError) {
      throw assetUpdateError;
    }

    if (
      eligibleForDisposition
    ) {
      const {
        error:
          completeClosingTaskError,
      } = await supabase
        .from(
          "reo_asset_tasks"
        )
        .update({
          status:
            "completed",

          completed_at:
            now,

          updated_at:
            now,
        })
        .eq(
          "asset_id",
          assetId
        )
        .eq(
          "task_type",
          "complete_closing"
        )
        .eq(
          "status",
          "open"
        );

      if (
        completeClosingTaskError
      ) {
        throw completeClosingTaskError;
      }

      const {
        error:
          activityError,
      } = await supabase
        .from(
          "reo_asset_activity"
        )
        .insert({
          asset_id:
            assetId,

          activity_type:
            "asset_disposed",

          title:
            "Asset Disposed",

          description:
            `Closing completed at $${grossSalePrice.toLocaleString()}. Estimated net proceeds: $${netProceeds.toLocaleString()}.`,

          old_stage:
            asset.workflow_stage,

          new_stage:
            "disposed",

          client_visible:
            true,
        });

      if (activityError) {
        throw activityError;
      }
    }

    return NextResponse.json({
      success: true,

      closing:
        closingRecord,

      dispositionReadiness,

      netProceeds,

      disposed:
        eligibleForDisposition,

      hasCriticalException,
    });
  } catch (error) {
    console.error(
      "CAROLINA REO CLOSING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save Closing workspace.",
      },
      {
        status: 500,
      }
    );
  }
}
