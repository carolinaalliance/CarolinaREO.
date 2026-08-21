import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

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

function money(
  value: number | string | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return "Not provided";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(numberValue);
}

function date(
  value: string | null | undefined
) {
  if (!value) {
    return "Not provided";
  }

  const raw =
    String(value).slice(
      0,
      10
    );

  const parsed =
    new Date(
      `${raw}T12:00:00`
    );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return String(value);
  }

  return parsed.toLocaleDateString(
    "en-US"
  );
}

function dateTime(
  value: string | null | undefined
) {
  if (!value) {
    return "Not provided";
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return String(value);
  }

  return parsed.toLocaleString(
    "en-US"
  );
}

function clean(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  return String(value);
}

function firstValue(
  ...values: unknown[]
) {
  for (
    const value of values
  ) {
    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return "Not provided";
}

function yesNo(
  value: unknown
) {
  return value
    ? "Complete"
    : "Not completed";
}

function buildLocation(
  asset: any
) {
  let city =
    String(
      asset.city || ""
    ).trim();

  let state =
    String(
      asset.state || ""
    ).trim();

  const zip =
    String(
      asset.zip_code || ""
    ).trim();

  /*
   * Some existing Carolina REO records have
   * values such as "Greenville, SC" stored
   * in the city field. Remove the duplicated
   * state before building the display line.
   */
  if (
    state &&
    city
      .toLowerCase()
      .endsWith(
        `, ${state.toLowerCase()}`
      )
  ) {
    city =
      city.slice(
        0,
        -(
          state.length +
          2
        )
      );
  }

  return [
    city,
    state,
  ]
    .filter(Boolean)
    .join(", ")
    .concat(
      zip
        ? ` ${zip}`
        : ""
    ) ||
    "Location not provided";
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
        .select("*")
        .eq("asset_id", assetId)
        .order(
          "created_at",
          {
            ascending: true,
          }
        ),

      supabase
        .from("reo_asset_tasks")
        .select("*")
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

    if (closingResult.error) {
      throw closingResult.error;
    }

    if (contractResult.error) {
      throw contractResult.error;
    }

    if (marketingResult.error) {
      throw marketingResult.error;
    }

    if (offerResult.error) {
      throw offerResult.error;
    }

    if (activityResult.error) {
      throw activityResult.error;
    }

    if (taskResult.error) {
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

    const offer =
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

const clientName =
  firstValue(
    asset.client_name,
    asset.institution_name,
    asset.institution,
    asset.asset_owner,
    asset.owner_name,
    asset.servicer_name,
    contract?.institution_name,
    closing?.institution_name
  );

const clientAssetNumber =
  firstValue(
    asset.client_asset_number,
    asset.asset_number,
    asset.client_reference_number
  );

const loanNumber =
  firstValue(
    asset.loan_number,
    asset.servicing_number
  );

const location =
  buildLocation(asset);

const assignmentDate =
  asset.assignment_date;

const dispositionDate =
  closing?.closing_date ||
  asset.disposition_date;

let daysInInventory:
  number | null = null;

if (
  assignmentDate &&
  dispositionDate
) {
  const start =
    new Date(
      `${String(
        assignmentDate
      ).slice(
        0,
        10
      )}T12:00:00`
    );

  const end =
    new Date(
      `${String(
        dispositionDate
      ).slice(
        0,
        10
      )}T12:00:00`
    );

  if (
    !Number.isNaN(
      start.getTime()
    ) &&
    !Number.isNaN(
      end.getTime()
    )
  ) {
    daysInInventory =
      Math.max(
        0,
        Math.round(
          (
            end.getTime() -
            start.getTime()
          ) /
            86400000
        )
      );
  }
}

const originalListPrice =
  marketing?.original_list_price ??
  asset.initial_list_price ??
  null;

const finalListPrice =
  marketing?.current_list_price ??
  asset.initial_list_price ??
  null;

const acceptedPrice =
  offer?.accepted_price ??
  contract?.accepted_price ??
  asset.accepted_offer ??
  null;

const finalSalePrice =
  closing?.gross_sale_price ??
  acceptedPrice ??
  null;

const netProceeds =
  closing?.net_proceeds ??
  null;

const repairPreservationCosts =
  closing?.repair_preservation_costs ??
  null;

const generatedAt =
  new Date();

const reportId =
  `REO-${String(
    asset.id
  )
    .replace(
      /-/g,
      ""
    )
    .slice(
      0,
      10
    )
    .toUpperCase()}`;
    
    const pdf =
      await PDFDocument.create();

    const regular =
      await pdf.embedFont(
        StandardFonts.Helvetica
      );

    const bold =
      await pdf.embedFont(
        StandardFonts.HelveticaBold
      );

    const pageWidth = 612;
    const pageHeight = 792;

    const margin = 48;

    const green =
      rgb(
        0.10,
        0.65,
        0.35
      );

    const dark =
      rgb(
        0.08,
        0.11,
        0.16
      );

    const gray =
      rgb(
        0.38,
        0.42,
        0.48
      );

    let page =
      pdf.addPage([
        pageWidth,
        pageHeight,
      ]);

    let y =
      pageHeight -
      margin;

    function newPage() {
      page =
        pdf.addPage([
          pageWidth,
          pageHeight,
        ]);

      y =
        pageHeight -
        margin;
    }

    function ensureSpace(
      needed: number
    ) {
      if (
        y - needed <
        margin
      ) {
        newPage();
      }
    }

    function drawText(
      text: string,
      options?: {
        size?: number;
        bold?: boolean;
        color?: ReturnType<
          typeof rgb
        >;
        indent?: number;
      }
    ) {
      const size =
        options?.size || 10;

      const font =
        options?.bold
          ? bold
          : regular;

      const color =
        options?.color ||
        dark;

      const indent =
        options?.indent || 0;

      ensureSpace(
        size + 8
      );

      page.drawText(
        text,
        {
          x:
            margin +
            indent,

          y,

          size,

          font,

          color,
        }
      );

      y -=
        size + 6;
    }

    function heading(
      text: string
    ) {
      ensureSpace(35);

      y -= 8;

      page.drawText(
        text,
        {
          x: margin,
          y,
          size: 14,
          font: bold,
          color: green,
        }
      );

      y -= 22;
    }

    function row(
      label: string,
      value: unknown
    ) {
      ensureSpace(18);

      page.drawText(
        `${label}:`,
        {
          x: margin,
          y,
          size: 9,
          font: bold,
          color: gray,
        }
      );

      page.drawText(
        clean(value),
        {
          x: 210,
          y,
          size: 9,
          font: regular,
          color: dark,
        }
      );

      y -= 16;
    }

    // -----------------------------------------
    // COVER / SUMMARY
    // -----------------------------------------

    drawText(
      "CAROLINA REO",
      {
        size: 11,
        bold: true,
        color: green,
      }
    );

    drawText(
      "FINAL ASSET DISPOSITION REPORT",
      {
        size: 20,
        bold: true,
      }
    );

    drawText(
      clean(
        asset.property_address
      ),
      {
        size: 16,
        bold: true,
      }
    );

    drawText(
      `${clean(
        asset.city
      )}, ${clean(
        asset.state
      )} ${clean(
        asset.zip_code
      )}`,
      {
        size: 10,
        color: gray,
      }
    );

    y -= 12;

    row(
      "Final Status",
      "Disposed"
    );

    row(
      "Institutional Client",
      asset.institution_name
    );

    row(
      "Client Asset Number",
      asset.client_asset_number
    );

    row(
      "Loan Number",
      asset.loan_number
    );

    row(
      "Assignment Date",
      date(
        asset.assignment_date
      )
    );

    row(
      "Disposition Date",
      date(
        closing?.closing_date ||
          asset.disposition_date
      )
    );

    heading(
      "Executive Financial Summary"
    );

    row(
      "Original List Price",
      money(
        marketing?.original_list_price ??
          asset.initial_list_price
      )
    );

    row(
      "Final List Price",
      money(
        marketing?.current_list_price ??
          asset.initial_list_price
      )
    );

    row(
      "Accepted Offer",
      money(
        offer?.accepted_price ??
          asset.accepted_offer
      )
    );

    row(
      "Final Sale Price",
      money(
        closing?.gross_sale_price
      )
    );

    row(
      "Net Proceeds",
      money(
        closing?.net_proceeds
      )
    );

    heading(
      "Property Summary"
    );

    row(
      "Property Type",
      asset.property_type
    );

    row(
      "Occupancy",
      asset.occupancy_status
    );

    row(
      "Bedrooms",
      asset.bedrooms
    );

    row(
      "Bathrooms",
      asset.bathrooms
    );

    row(
      "Square Feet",
      asset.square_feet
    );

    row(
      "Acreage",
      asset.acreage
    );

    heading(
      "Marketing & Sale"
    );

    row(
      "MLS Number",
      marketing?.mls_number
    );

    row(
      "MLS List Date",
      date(
        marketing?.mls_list_date
      )
    );

    row(
      "Listing Agent",
      marketing?.listing_agent
    );

    row(
      "Buyer",
      closing?.buyer_name ||
        contract?.buyer_name
    );

    row(
      "Financing",
      closing?.financing_type ||
        contract?.financing_type
    );

    heading(
      "Closing Summary"
    );

    row(
      "Contract Date",
      date(
        contract?.contract_date
      )
    );

    row(
      "Closing Date",
      date(
        closing?.closing_date
      )
    );

    row(
      "Closing Attorney",
      closing?.attorney_name ||
        contract?.attorney_name
    );

    row(
      "Title Company",
      closing?.title_company ||
        contract?.title_company
    );

    row(
      "Funds Received",
      closing?.funds_received
        ? "Yes"
        : "No"
    );

    row(
      "Deed Recorded",
      closing?.deed_recorded
        ? "Yes"
        : "No"
    );

    row(
      "Recording Date",
      date(
        closing?.recording_date
      )
    );

    row(
      "Instrument Number",
      closing?.recording_instrument_number
    );

    row(
      "MLS Closed / Sold",
      closing?.mls_closed
        ? "Yes"
        : "No"
    );

    // -----------------------------------------
    // TASK SUMMARY
    // -----------------------------------------

    heading(
      "Operational Completion"
    );

    row(
      "Total Tasks",
      tasks.length
    );

    row(
      "Completed Tasks",
      completedTasks.length
    );

    row(
      "Remaining Open",
      tasks.length -
        completedTasks.length
    );

    for (const task of tasks) {
      ensureSpace(24);

      drawText(
        `${task.status === "completed" ? "[Complete]" : "[Open]"} ${clean(
          task.title
        )}`,
        {
          size: 9,
          indent: 8,
        }
      );
    }

    // -----------------------------------------
    // ACTIVITY HISTORY
    // -----------------------------------------

    heading(
      "Lifecycle & Activity History"
    );

    for (
      const activity of activities
    ) {
      ensureSpace(42);

      drawText(
        clean(
          activity.title
        ),
        {
          size: 9,
          bold: true,
        }
      );

      if (
        activity.description
      ) {
        const description =
          String(
            activity.description
          );

        const chunks =
          description.match(
            /.{1,82}(\s|$)/g
          ) || [
            description,
          ];

        for (
          const chunk of chunks
        ) {
          drawText(
            chunk.trim(),
            {
              size: 8,
              color: gray,
              indent: 8,
            }
          );
        }
      }

      if (
        activity.created_at
      ) {
        drawText(
          new Date(
            activity.created_at
          ).toLocaleString(
            "en-US"
          ),
          {
            size: 7,
            color: gray,
            indent: 8,
          }
        );
      }

      y -= 4;
    }

    // -----------------------------------------
    // FINAL NOTES
    // -----------------------------------------

    if (
      closing?.closing_notes ||
      closing?.disposition_notes
    ) {
      heading(
        "Final Asset Manager Notes"
      );

      if (
        closing?.closing_notes
      ) {
        drawText(
          "Closing Notes",
          {
            size: 9,
            bold: true,
          }
        );

        drawText(
          clean(
            closing.closing_notes
          ),
          {
            size: 8,
            color: gray,
            indent: 8,
          }
        );
      }

      if (
        closing?.disposition_notes
      ) {
        drawText(
          "Disposition Notes",
          {
            size: 9,
            bold: true,
          }
        );

        drawText(
          clean(
            closing.disposition_notes
          ),
          {
            size: 8,
            color: gray,
            indent: 8,
          }
        );
      }
    }

    // -----------------------------------------
    // FOOTERS
    // -----------------------------------------

    const pages =
      pdf.getPages();

    pages.forEach(
      (
        pdfPage,
        index
      ) => {
        pdfPage.drawText(
          `Carolina REO | Final Asset Disposition Report | Page ${
            index + 1
          } of ${
            pages.length
          }`,
          {
            x: margin,
            y: 22,
            size: 7,
            font: regular,
            color: gray,
          }
        );
      }
    );

    const pdfBytes =
      await pdf.save();

    const safeAddress =
      String(
        asset.property_address ||
          "asset"
      )
        .replace(
          /[^a-zA-Z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );

    return new NextResponse(
      Buffer.from(
        pdfBytes
      ),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="Carolina-REO-${safeAddress}-Final-Asset-Report.pdf"`,

          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "CAROLINA REO PDF ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate final asset report.",
      },
      {
        status: 500,
      }
    );
  }
}
