
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16000;

function respond(
  message: string,
  status: number
) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

function cleanText(
  value: unknown,
  maxLength = 255
): string {
  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);
}

function requiredText(
  value: unknown,
  maxLength = 255
): string {
  return cleanText(value, maxLength);
}

function parseList(
  value: unknown,
  maxItems = 100
): string[] {
  if (typeof value !== "string") return [];

  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ]
    .slice(0, maxItems)
    .map((item) => item.slice(0, 100));
}

function parseYears(value: unknown): number | null {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0 ||
    number > 100
  ) {
    return null;
  }

  return number;
}

function parseDate(
  value: unknown
): string | null {
  if (!value) return null;

  if (typeof value !== "string") return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return value;
}

function isValidEmail(email: string): boolean {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

export async function POST(request: NextRequest) {
  try {
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return respond(
        "Content type must be application/json.",
        415
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (
      !Number.isFinite(contentLength) ||
      contentLength > MAX_BODY_BYTES
    ) {
      return respond("Request is too large.", 413);
    }

    const rawBody = await request.text();

    if (
      Buffer.byteLength(rawBody, "utf8") >
      MAX_BODY_BYTES
    ) {
      return respond("Request is too large.", 413);
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = JSON.parse(rawBody);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return respond("Invalid application data.", 400);
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return respond("Invalid JSON.", 400);
    }

    // Honeypot: ordinary applicants leave this empty.
    if (cleanText(body.website, 500)) {
      return NextResponse.json(
        {
          success: true,
          message: "Application received.",
        },
        { status: 200 }
      );
    }

    const full_name = requiredText(
      body.full_name,
      150
    );

    const email = requiredText(
      body.email,
      254
    ).toLowerCase();

    const phone = requiredText(
      body.phone,
      40
    );

    const brokerage_name = requiredText(
      body.brokerage_name,
      200
    );

    const license_number = requiredText(
      body.license_number,
      100
    );

    const license_state = requiredText(
      body.license_state,
      50
    ).toUpperCase();

    const license_expiration = parseDate(
      body.license_expiration
    );

    const years_experience = parseYears(
      body.years_experience
    );

    const reo_experience_years = parseYears(
      body.reo_experience_years
    );

    const service_states = parseList(
      body.service_states,
      50
    );

    const service_counties = parseList(
      body.service_counties,
      200
    );

    const service_zip_codes = parseList(
      body.service_zip_codes,
      500
    );

    const eo_insurance_carrier = cleanText(
      body.eo_insurance_carrier,
      200
    );

    const eo_policy_expiration = parseDate(
      body.eo_policy_expiration
    );

    if (
      !full_name ||
      !email ||
      !phone ||
      !brokerage_name ||
      !license_number ||
      !license_state ||
      !license_expiration ||
      years_experience === null ||
      reo_experience_years === null ||
      service_states.length === 0 ||
      service_counties.length === 0
    ) {
      return respond(
        "Please complete all required fields with valid information.",
        400
      );
    }

    if (!isValidEmail(email)) {
      return respond(
        "Please enter a valid email address.",
        400
      );
    }

    if (body.confirmed !== true) {
      return respond(
        "You must confirm the application acknowledgment.",
        400
      );
    }

    // Registration remains closed until persistent
    // rate limiting and bot protection are configured.
    // Do not remove this guard for public launch.
    if (
      process.env.REO_AGENT_REGISTRATION_ENABLED !==
      "true"
    ) {
      return respond(
        "Agent registration is not accepting applications yet.",
        503
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Carolina REO registration configuration missing."
      );

      return respond(
        "Registration is temporarily unavailable.",
        503
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error } = await supabase
      .from("reo_agent_applications")
      .insert({
        full_name,
        email,
        phone,
        brokerage_name,
        license_number,
        license_state,
        license_expiration,
        years_experience,
        reo_experience_years,
        service_states,
        service_counties,
        service_zip_codes,
        eo_insurance_carrier:
          eo_insurance_carrier || null,
        eo_policy_expiration,
        application_status: "pending",
      });

    if (error) {
      console.error(
        "Carolina REO agent registration failed:",
        error.code
      );

      return respond(
        "Unable to process your application at this time.",
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your application has been received and is pending review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Carolina REO registration unexpected error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return respond(
      "An unexpected error occurred.",
      500
    );
  }
}
