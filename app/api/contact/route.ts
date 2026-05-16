import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contact — server-side proxy to Rita OS.
 *
 * Forwards the body to
 *   https://os.galavizgroup.com/api/public/opportunities/capture
 *
 * The body mirrors Rita OS&apos;s `leadCaptureSchema` (snake_case,
 * `lead_type: 'buyer' | 'seller'`, `sms_consent: 'yes' | 'no'`,
 * `marketing_email_consent: boolean`). We validate the required
 * shape server-side and surface friendly errors, but the canonical
 * validation runs in Rita OS.
 *
 * Why a proxy (vs the form posting directly to Rita OS):
 *   1. Avoid CORS — galavizgroup.com vs os.galavizgroup.com are
 *      different origins.
 *   2. Hide the upstream URL from the public bundle.
 *   3. Forward the real client IP via x-forwarded-for so Rita OS can
 *      record `sms_consent_ip` as TCPA audit evidence.
 *   4. Single point to add metadata (UTM, source) later without
 *      touching the React client.
 *
 * Sprint LAND-001.
 */

const RITA_OS_CAPTURE_URL =
    process.env.RITA_OS_CAPTURE_URL ||
    "https://os.galavizgroup.com/api/public/opportunities/capture";

interface ContactPayload {
    first_name?: unknown;
    last_name?: unknown;
    email?: unknown;
    phone?: unknown;
    lead_type?: unknown;
    lead_source?: unknown;
    message?: unknown;
    sms_consent?: unknown;
    marketing_email_consent?: unknown;
    website?: unknown;
}

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: NextRequest) {
    let body: ContactPayload;
    try {
        body = (await req.json()) as ContactPayload;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    // ── Required fields ────────────────────────────────────────────
    const requiredStringFields: (keyof ContactPayload)[] = [
        "first_name",
        "last_name",
        "email",
        "phone",
    ];
    for (const field of requiredStringFields) {
        if (!isNonEmptyString(body[field])) {
            return NextResponse.json(
                { error: `Missing or invalid field: ${field}` },
                { status: 400 },
            );
        }
    }
    if (body.lead_type !== "buyer" && body.lead_type !== "seller") {
        return NextResponse.json(
            { error: "lead_type must be 'buyer' or 'seller'" },
            { status: 400 },
        );
    }
    if (body.sms_consent !== "yes" && body.sms_consent !== "no") {
        return NextResponse.json(
            { error: "sms_consent must be 'yes' or 'no'" },
            { status: 400 },
        );
    }

    // ── Compose the upstream payload (snake_case, mirrors leadCaptureSchema) ──
    const upstream = {
        first_name: (body.first_name as string).trim(),
        last_name: (body.last_name as string).trim(),
        email: (body.email as string).trim(),
        phone: (body.phone as string).trim(),
        lead_type: body.lead_type,
        lead_source:
            typeof body.lead_source === "string" && body.lead_source.length > 0
                ? body.lead_source
                : "website",
        message: typeof body.message === "string" ? body.message : undefined,
        sms_consent: body.sms_consent,
        marketing_email_consent: Boolean(body.marketing_email_consent),
        ...(typeof body.website === "string" && body.website.length > 0
            ? { website: body.website }
            : {}),
    };

    // Forward the real client IP so Rita OS records it as TCPA evidence
    // on contacts.sms_consent_ip. Next.js gives us the proxy-forwarded
    // headers via the standard request headers map.
    const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "";

    let upstreamRes: Response;
    try {
        upstreamRes = await fetch(RITA_OS_CAPTURE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
                "User-Agent": "galavizgroup-landing/1.0",
            },
            body: JSON.stringify(upstream),
            cache: "no-store",
        });
    } catch (err) {
        console.error("[api/contact] Upstream fetch failed:", err);
        return NextResponse.json(
            { error: "Capture service unavailable. Please try again shortly." },
            { status: 502 },
        );
    }

    const upstreamBody = await upstreamRes.json().catch(() => ({}));

    if (!upstreamRes.ok) {
        console.error(
            "[api/contact] Rita OS rejected submission:",
            upstreamRes.status,
            upstreamBody,
        );
        return NextResponse.json(
            {
                error:
                    (upstreamBody as { error?: string }).error ||
                    "We couldn’t process your request right now. Please try again.",
            },
            { status: upstreamRes.status >= 500 ? 502 : upstreamRes.status },
        );
    }

    return NextResponse.json(
        {
            success: true,
            message:
                (upstreamBody as { message?: string }).message ||
                "Thank you. Rita’s team will reach out soon.",
        },
        { status: 200 },
    );
}
