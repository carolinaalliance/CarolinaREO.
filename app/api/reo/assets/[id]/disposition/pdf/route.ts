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
  repairResult,
  activityResult,
  taskResult,
] = await Promise.all([
      supabase
  .from("reo_assets")
  .select(`
    *,
    reo_clients (
      id,
      institution_name,
      institution_type,
      primary_contact_name,
      primary_contact_email,
      primary_contact_phone
    )
  `)
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
  .from("reo_repair_records")
  .select("*")
  .eq("asset_id", assetId)
  .order("created_at", {
    ascending: false,
  })
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

    if (
  repairResult.error
) {
  throw repairResult.error;
}

    if (activityResult.error) {
      throw activityResult.error;
    }

    if (taskResult.error) {
      throw taskResult.error;
    }

    const asset =
      assetResult.data;

    const client =
  Array.isArray(
    asset.reo_clients
  )
    ? asset.reo_clients[0]
    : asset.reo_clients;

    const closing =
      closingResult.data;

    const contract =
      contractResult.data;

    const marketing =
      marketingResult.data;

    const offer =
      offerResult.data;

    const repair =
  repairResult.data;

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
    client?.institution_name,
    asset.client_name,
    asset.institution_name,
    asset.asset_owner,
    asset.servicer_name
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

    function wrapText(
  text: string,
  maxCharacters = 55
) {
  const words =
    text.split(/\s+/);

  const lines:
    string[] = [];

  let current = "";

  for (
    const word of words
  ) {
    const proposed =
      current
        ? `${current} ${word}`
        : word;

    if (
      proposed.length >
        maxCharacters &&
      current
    ) {
      lines.push(
        current
      );

      current =
        word;
    } else {
      current =
        proposed;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length
    ? lines
    : [""];
}

function row(
  label: string,
  value: unknown
) {
  const valueText =
    clean(value);

  const lines =
    wrapText(
      valueText,
      48
    );

  const height =
    Math.max(
      18,
      lines.length * 13
    );

  ensureSpace(height);

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

  let valueY = y;

  for (
    const line of lines
  ) {
    page.drawText(
      line,
      {
        x: 210,
        y: valueY,
        size: 9,
        font: regular,
        color: dark,
      }
    );

    valueY -= 13;
  }

  y -= height;
}

function subheading(
  text: string
) {
  ensureSpace(26);

  page.drawText(
    text,
    {
      x: margin,
      y,
      size: 10,
      font: bold,
      color: dark,
    }
  );

  y -= 17;
}
   // -----------------------------------------
// REPORT HEADER
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
  location,
  {
    size: 10,
    color: gray,
  }
);

y -= 10;

row(
  "Report ID",
  reportId
);

row(
  "Report Generated",
  generatedAt.toLocaleString(
    "en-US"
  )
);

row(
  "Final Status",
  "DISPOSED"
);

// -----------------------------------------
// INSTITUTIONAL IDENTIFICATION
// -----------------------------------------

heading(
  "Institutional Client & Asset Identification"
);

row(
  "Institutional Client",
  clientName
);

  row(
  "Institution Type",
  client?.institution_type
);  

row(
  "Client Asset Number",
  clientAssetNumber
);

row(
  "Loan / Servicing Number",
  loanNumber
);

row(
  "Property Address",
  asset.property_address
);

row(
  "Location",
  location
);

row(
  "Assignment Date",
  date(
    assignmentDate
  )
);

row(
  "Disposition Date",
  date(
    dispositionDate
  )
);

row(
  "Days in Inventory",
  daysInInventory !== null
    ? daysInInventory
    : "Not provided"
);

// -----------------------------------------
// EXECUTIVE SUMMARY
// -----------------------------------------

heading(
  "Executive Disposition Summary"
);

row(
  "Original List Price",
  money(
    originalListPrice
  )
);

row(
  "Final List Price",
  money(
    finalListPrice
  )
);

row(
  "Accepted Offer",
  money(
    acceptedPrice
  )
);

row(
  "Final Sale Price",
  money(
    finalSalePrice
  )
);

row(
  "Net Proceeds",
  money(
    netProceeds
  )
);

row(
  "Operational Tasks",
  `${completedTasks.length} of ${tasks.length} completed`
);

row(
  "Open Tasks at Disposition",
  openTasks.length
);

// -----------------------------------------
// PROPERTY SUMMARY
// -----------------------------------------

heading(
  "Property Summary"
);

row(
  "Property Type",
  asset.property_type
);

row(
  "Occupancy at Disposition",
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

// -----------------------------------------
// VALUATION AND MARKETING
// -----------------------------------------

heading(
  "Valuation & Marketing"
);

row(
  "Initial / Original List Price",
  money(
    originalListPrice
  )
);

row(
  "Final List Price",
  money(
    finalListPrice
  )
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
  firstValue(
    marketing?.listing_agent,
    marketing?.assigned_listing_agent,
    asset.listing_agent
  )
);

row(
  "Total Showings",
  marketing?.total_showings
);

row(
  "Total Inquiries",
  marketing?.total_inquiries
);

row(
  "MLS Closed / Sold",
  yesNo(
    closing?.mls_closed
  )
);

// -----------------------------------------
// OFFER AND CONTRACT
// -----------------------------------------

heading(
  "Offer & Contract Summary"
);

row(
  "Buyer",
  firstValue(
    closing?.buyer_name,
    contract?.buyer_name,
    offer?.buyer_name
  )
);

row(
  "Accepted Price",
  money(
    acceptedPrice
  )
);

row(
  "Contract Date",
  date(
    contract?.contract_date
  )
);

row(
  "Financing",
  firstValue(
    closing?.financing_type,
    contract?.financing_type,
    offer?.financing_type
  )
);

row(
  "Earnest Money",
  money(
    contract?.earnest_money_amount
  )
);

row(
  "Earnest Money Received",
  yesNo(
    contract?.earnest_money_received
  )
);

row(
  "Executed Contract Received",
  yesNo(
    contract?.executed_contract_received
  )
);

// -----------------------------------------
// REPAIR / PRESERVATION
// -----------------------------------------

heading(
  "Preservation & Repair Financials"
);

row(
  "Estimated Repair Scope",
  money(
    repair?.estimated_total ??
      asset.repair_estimate
  )
);

row(
  "Client Approved Repair Budget",
  money(
    repair?.approved_budget
  )
);

row(
  "Final Repair Cost",
  money(
    repair?.final_cost
  )
);

row(
  "Repair / Preservation Cost at Closing",
  money(
    closing?.repair_preservation_costs
  )
);

row(
  "Repair Agreement Complete",
  yesNo(
    contract?.repair_agreement_complete
  )
);

row(
  "Inspection Complete",
  yesNo(
    contract?.inspection_complete
  )
);

// -----------------------------------------
// CLOSING FINANCIAL RECONCILIATION
// -----------------------------------------

heading(
  "Closing & Financial Reconciliation"
);

row(
  "Closing Date",
  date(
    closing?.closing_date
  )
);

row(
  "Closing Attorney",
  firstValue(
    closing?.attorney_name,
    contract?.attorney_name
  )
);

row(
  "Title Company",
  firstValue(
    closing?.title_company,
    contract?.title_company
  )
);

row(
  "Gross Sale Price",
  money(
    closing?.gross_sale_price
  )
);

row(
  "Seller Credits",
  money(
    closing?.seller_credits
  )
);

row(
  "Commission Cost",
  money(
    closing?.commission_cost
  )
);

row(
  "Attorney / Title Cost",
  money(
    closing?.attorney_title_cost
  )
);

row(
  "Taxes / Prorations",
  money(
    closing?.taxes_prorations
  )
);

row(
  "HOA Costs",
  money(
    closing?.hoa_costs
  )
);

row(
  "Repair / Preservation Costs",
  money(
    closing?.repair_preservation_costs
  )
);

row(
  "Other Deductions",
  money(
    closing?.other_deductions
  )
);

row(
  "FINAL NET PROCEEDS",
  money(
    netProceeds
  )
);

// -----------------------------------------
// FUNDING / RECORDING
// -----------------------------------------

heading(
  "Funding & Recording"
);

row(
  "Closing Completed",
  yesNo(
    closing?.closing_completed
  )
);

row(
  "Funds Received",
  yesNo(
    closing?.funds_received
  )
);

row(
  "Funding Date",
  date(
    closing?.funding_date
  )
);

row(
  "Deed Executed",
  yesNo(
    closing?.deed_executed
  )
);

row(
  "Deed Recorded",
  yesNo(
    closing?.deed_recorded
  )
);

row(
  "Recording Date",
  date(
    closing?.recording_date
  )
);

row(
  "Book / Page",
  closing?.recording_book_page
);

row(
  "Instrument Number",
  closing?.recording_instrument_number
);

// -----------------------------------------
// FINAL CLOSEOUT
// -----------------------------------------

heading(
  "Final Property & File Closeout"
);

row(
  "Settlement Statement Approved",
  yesNo(
    closing?.settlement_statement_approved
  )
);

row(
  "Client Closing Package Complete",
  yesNo(
    closing?.client_closing_package_complete
  )
);

row(
  "Final Invoice Package Complete",
  yesNo(
    closing?.final_invoice_package_complete
  )
);

row(
  "Utilities Transferred",
  yesNo(
    closing?.utilities_transferred
  )
);

row(
  "Keys Released",
  yesNo(
    closing?.keys_released
  )
);

row(
  "Lockbox Removed",
  yesNo(
    closing?.lockbox_removed
  )
);

row(
  "Signage Removed",
  yesNo(
    closing?.signage_removed
  )
);

row(
  "Vendors Notified",
  yesNo(
    closing?.vendors_notified
  )
);

// -----------------------------------------
// OPERATIONAL COMPLETION
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
  openTasks.length
);

for (
  const task of tasks
) {
  ensureSpace(30);

  drawText(
    `${
      task.status ===
      "completed"
        ? "[COMPLETE]"
        : "[OPEN]"
    } ${clean(
      task.title
    )}`,
    {
      size: 9,
      bold:
        task.status !==
        "completed",
      color:
        task.status ===
        "completed"
          ? dark
          : gray,
      indent: 8,
    }
  );
}

// -----------------------------------------
// LIFECYCLE AUDIT
// -----------------------------------------

heading(
  "Lifecycle & Activity History"
);

for (
  const activity of activities
) {
  ensureSpace(45);

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
    const lines =
      wrapText(
        String(
          activity.description
        ),
        78
      );

    for (
      const line of lines
    ) {
      drawText(
        line,
        {
          size: 8,
          color: gray,
          indent: 8,
        }
      );
    }
  }

  drawText(
    dateTime(
      activity.created_at
    ),
    {
      size: 7,
      color: gray,
      indent: 8,
    }
  );

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
    subheading(
      "Closing Notes"
    );

    const lines =
      wrapText(
        String(
          closing.closing_notes
        ),
        78
      );

    for (
      const line of lines
    ) {
      drawText(
        line,
        {
          size: 8,
          color: gray,
          indent: 8,
        }
      );
    }
  }

  if (
    closing?.disposition_notes
  ) {
    subheading(
      "Disposition Notes"
    );

    const lines =
      wrapText(
        String(
          closing.disposition_notes
        ),
        78
      );

    for (
      const line of lines
    ) {
      drawText(
        line,
        {
          size: 8,
          color: gray,
          indent: 8,
        }
      );
    }
  }
}

// -----------------------------------------
// FINAL CERTIFICATION
// -----------------------------------------

heading(
  "Final Disposition Certification"
);

drawText(
  "Carolina REO Asset Management",
  {
    size: 11,
    bold: true,
    color: green,
  }
);

const certificationLines = [
  "This report summarizes the operational record maintained by Carolina REO for this asset.",
  "The asset has completed the institutional asset-management lifecycle through final disposition.",
  "Property, task, financial, closing, and activity information shown above reflects the data recorded in the Carolina REO platform at the time this report was generated.",
];

for (
  const certification of certificationLines
) {
  const lines =
    wrapText(
      certification,
      82
    );

  for (
    const line of lines
  ) {
    drawText(
      line,
      {
        size: 8,
        color: gray,
      }
    );
  }

  y -= 3;
}

y -= 8;

row(
  "Final Status",
  "DISPOSED"
);

row(
  "Disposition Date",
  date(
    dispositionDate
  )
);

row(
  "Final Sale Price",
  money(
    finalSalePrice
  )
);

row(
  "Net Proceeds",
  money(
    netProceeds
  )
);

row(
  "Report ID",
  reportId
);

row(
  "Generated",
  generatedAt.toLocaleString(
    "en-US"
  )
); 
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
  `Carolina REO Asset Management | ${reportId} | Final Asset Disposition Report | Page ${
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
