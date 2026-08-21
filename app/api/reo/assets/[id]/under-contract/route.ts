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
          error:
            "Asset ID is required.",
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

    // --------------------------------------------------
    // CONFIRM ASSET EXISTS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // CLOSING READINESS
    // --------------------------------------------------

    const readinessItems = [
      Boolean(
        body.earnestMoneyReceived
      ),

      Boolean(
        body.executedContractReceived
      ),

      Boolean(
        body.inspectionComplete
      ),

      Boolean(
        body.appraisalComplete
      ),

      Boolean(
        body.financingApproved
      ),

      Boolean(
        body.titleClear
      ),

      Boolean(
        body.clearToClose
      ),

      Boolean(
        body.closingPackageReady
      ),
    ];

    const readinessCount =
      readinessItems.filter(
        Boolean
      ).length;

    const closingReadiness =
      Math.round(
        (
          readinessCount /
          readinessItems.length
        ) * 100
      );

    // --------------------------------------------------
    // EXCEPTIONS
    // --------------------------------------------------

    const hasCriticalException =
      Boolean(body.financingIssue) ||
      Boolean(body.appraisalIssue) ||
      Boolean(body.titleIssue) ||
      Boolean(
        body.buyerDefaultRisk
      ) ||
      Boolean(
        body.legalReviewNeeded
      );

    const eligibleForClosing =
      closingReadiness === 100 &&
      !hasCriticalException;

    // --------------------------------------------------
    // SAVE CONTRACT WORKSPACE
    // One permanent editable record per asset.
    // --------------------------------------------------

    const {
      data: contractRecord,
      error: contractError,
    } = await supabase
      .from(
        "reo_contract_records"
      )
      .upsert(
        {
          asset_id:
            assetId,

          contract_date:
            dateOrNull(
              body.contractDate
            ),

          accepted_price:
            numberOrNull(
              body.acceptedPrice
            ),

          closing_date:
            dateOrNull(
              body.closingDate
            ),

          buyer_name:
            body.buyerName ||
            null,

          buyer_agent_name:
            body.buyerAgentName ||
            null,

          financing_type:
            body.financingType ||
            null,

          lender_name:
            body.lenderName ||
            null,

          earnest_money_amount:
            numberOrNull(
              body.earnestMoneyAmount
            ),

          earnest_money_due_date:
            dateOrNull(
              body.earnestMoneyDueDate
            ),

          earnest_money_received:
            Boolean(
              body.earnestMoneyReceived
            ),

          earnest_money_received_date:
            dateOrNull(
              body.earnestMoneyReceivedDate
            ),

          earnest_money_holder:
            body.earnestMoneyHolder ||
            null,

          due_diligence_deadline:
            dateOrNull(
              body.dueDiligenceDeadline
            ),

          inspection_deadline:
            dateOrNull(
              body.inspectionDeadline
            ),

          financing_deadline:
            dateOrNull(
              body.financingDeadline
            ),

          appraisal_deadline:
            dateOrNull(
              body.appraisalDeadline
            ),

          title_deadline:
            dateOrNull(
              body.titleDeadline
            ),

          inspection_complete:
            Boolean(
              body.inspectionComplete
            ),

          repair_request_received:
            Boolean(
              body.repairRequestReceived
            ),

          repair_agreement_complete:
            Boolean(
              body.repairAgreementComplete
            ),

          appraisal_ordered:
            Boolean(
              body.appraisalOrdered
            ),

          appraisal_complete:
            Boolean(
              body.appraisalComplete
            ),

          appraised_value:
            numberOrNull(
              body.appraisedValue
            ),

          financing_approved:
            Boolean(
              body.financingApproved
            ),

          clear_to_close:
            Boolean(
              body.clearToClose
            ),

          title_ordered:
            Boolean(
              body.titleOrdered
            ),

          title_clear:
            Boolean(
              body.titleClear
            ),

          attorney_name:
            body.attorneyName ||
            null,

          title_company:
            body.titleCompany ||
            null,

          executed_contract_received:
            Boolean(
              body.executedContractReceived
            ),

          addenda_received:
            Boolean(
              body.addendaReceived
            ),

          closing_package_ready:
            Boolean(
              body.closingPackageReady
            ),

          financing_issue:
            Boolean(
              body.financingIssue
            ),

          appraisal_issue:
            Boolean(
              body.appraisalIssue
            ),

          title_issue:
            Boolean(
              body.titleIssue
            ),

          buyer_default_risk:
            Boolean(
              body.buyerDefaultRisk
            ),

          legal_review_needed:
            Boolean(
              body.legalReviewNeeded
            ),

          contract_notes:
            body.contractNotes ||
            null,

          closing_readiness:
            closingReadiness,

          approved_for_closing:
            eligibleForClosing,

          approved_for_closing_at:
            eligibleForClosing
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

    if (contractError) {
      throw contractError;
    }

    // --------------------------------------------------
    // UPDATE MASTER ASSET
    // --------------------------------------------------

    const assetUpdates:
      Record<
        string,
        unknown
      > = {
        updated_at:
          now,
      };

    if (
      body.acceptedPrice
    ) {
      assetUpdates.accepted_offer =
        numberOrNull(
          body.acceptedPrice
        );
    }

    if (
      body.titleCompany
    ) {
      assetUpdates.title_company =
        body.titleCompany;
    }

    if (
      body.attorneyName
    ) {
      assetUpdates.attorney =
        body.attorneyName;
    }

    if (
      eligibleForClosing
    ) {
      assetUpdates.workflow_stage =
        "closing";
    }

    const {
      error:
        assetUpdateError,
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

    // --------------------------------------------------
    // TASK: EXECUTED CONTRACT
    // --------------------------------------------------

    if (
      body.executedContractReceived
    ) {
      const {
        error:
          contractTaskError,
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
          "contract_review"
        )
        .eq(
          "status",
          "open"
        );

      if (
        contractTaskError
      ) {
        throw contractTaskError;
      }
    }

    // --------------------------------------------------
    // TASK: EARNEST MONEY
    // --------------------------------------------------

    if (
      body.earnestMoneyReceived
    ) {
      const {
        error:
          earnestTaskError,
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
          "earnest_money_confirmation"
        )
        .eq(
          "status",
          "open"
        );

      if (
        earnestTaskError
      ) {
        throw earnestTaskError;
      }
    }

    // --------------------------------------------------
    // MARKETING REPORT IS NO LONGER REQUIRED
    // ONCE PROPERTY IS UNDER CONTRACT.
    // --------------------------------------------------

    const {
      error:
        marketingTaskError,
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
        "marketing_report"
      )
      .eq(
        "status",
        "open"
      );

    if (
      marketingTaskError
    ) {
      throw marketingTaskError;
    }

    // --------------------------------------------------
    // MOVING TO CLOSING
    // --------------------------------------------------

    if (
      eligibleForClosing
    ) {
      const {
        error:
          closingTaskError,
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
          "closing_preparation"
        )
        .eq(
          "status",
          "open"
        );

      if (
        closingTaskError
      ) {
        throw closingTaskError;
      }

      // Create final closing task
      const {
        data:
          existingClosingTask,
        error:
          existingClosingTaskError,
      } = await supabase
        .from(
          "reo_asset_tasks"
        )
        .select("id")
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
        )
        .limit(1);

      if (
        existingClosingTaskError
      ) {
        throw existingClosingTaskError;
      }

      if (
        !existingClosingTask
          ?.length
      ) {
        const closingDate =
          body.closingDate;

        const dueAt =
          closingDate
            ? new Date(
                `${closingDate}T12:00:00`
              ).toISOString()
            : new Date(
                Date.now() +
                  24 *
                    60 *
                    60 *
                    1000
              ).toISOString();

        const {
          error:
            createClosingTaskError,
        } = await supabase
          .from(
            "reo_asset_tasks"
          )
          .insert({
            asset_id:
              assetId,

            task_type:
              "complete_closing",

            title:
              "Complete Property Closing",

            description:
              "Complete final closing, funding, deed, accounting, and disposition requirements.",

            workflow_stage:
              "closing",

            priority:
              "high",

            status:
              "open",

            due_at:
              dueAt,

            client_visible:
              true,

            is_sla_task:
              true,
          });

        if (
          createClosingTaskError
        ) {
          throw createClosingTaskError;
        }
      }
    }

    // --------------------------------------------------
    // ACTIVITY HISTORY
    // --------------------------------------------------

    if (
      eligibleForClosing
    ) {
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
            "approved_for_closing",

          title:
            "Asset Approved for Closing",

          description:
            "All required contract milestones were completed and the asset was advanced to Closing.",

          old_stage:
            asset.workflow_stage,

          new_stage:
            "closing",

          client_visible:
            true,
        });

      if (
        activityError
      ) {
        throw activityError;
      }
    }

    return NextResponse.json({
      success: true,

      contract:
        contractRecord,

      closingReadiness,

      movedToClosing:
        eligibleForClosing,

      hasCriticalException,
    });
  } catch (error) {
    console.error(
      "CAROLINA REO UNDER CONTRACT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save Under Contract workspace.",
      },
      {
        status: 500,
      }
    );
  }
}
