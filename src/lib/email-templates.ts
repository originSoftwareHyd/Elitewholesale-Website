import { siteConfig } from "@/lib/site";

const BRAND = "#38bdf8";
const INK = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const LOGO_URL = `https://${siteConfig.domain}/images/elite-wholesale-logo.png`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapEmail(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
            <tr>
              <td style="background:${INK};padding:22px 28px;" align="left">
                <img src="${LOGO_URL}" alt="${escapeHtml(siteConfig.name)}" height="34" style="display:block;height:34px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <h1 style="margin:0 0 4px 0;font-size:20px;line-height:28px;color:${INK};">${title}</h1>
                <p style="margin:0 0 20px 0;font-size:13px;color:${MUTED};">
                  Received ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} (Portland, OR time)
                </p>
              </td>
            </tr>
            ${bodyHtml}
            <tr>
              <td style="padding:20px 28px 26px 28px;border-top:1px solid ${BORDER};">
                <p style="margin:0;font-size:12px;line-height:18px;color:${MUTED};">
                  ${escapeHtml(siteConfig.name)} &middot; ${escapeHtml(siteConfig.address.line1)}, ${escapeHtml(siteConfig.address.line2)}<br />
                  ${escapeHtml(siteConfig.phone)} &middot; ${escapeHtml(siteConfig.email)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:4px 0;font-size:13px;color:${MUTED};width:90px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:4px 0;font-size:13px;color:${INK};font-weight:600;">${value}</td>
  </tr>`;
}

export type EnquiryEmailItem = {
  productName: string;
  productSlug: string;
  variationLabel?: string | null;
  image: string | null;
  quantity: number;
};

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  items: EnquiryEmailItem[];
};

export function renderEnquiryEmail(data: EnquiryEmailData): { subject: string; html: string; text: string } {
  const totalQty = data.items.reduce((sum, i) => sum + i.quantity, 0);
  const subject = `New Wholesale Enquiry from ${data.name} (${totalQty} item${totalQty === 1 ? "" : "s"})`;

  const itemRows = data.items
    .map((item) => {
      const productUrl = `https://${siteConfig.domain}/product/${item.productSlug}`;
      const image = item.image
        ? `<img src="${item.image}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border-radius:8px;object-fit:contain;background:#f1f5f9;border:1px solid ${BORDER};" />`
        : `<div style="width:56px;height:56px;border-radius:8px;background:#f1f5f9;border:1px solid ${BORDER};"></div>`;
      return `<tr>
        <td style="padding:10px 0;border-top:1px solid ${BORDER};width:56px;">${image}</td>
        <td style="padding:10px 0 10px 14px;border-top:1px solid ${BORDER};">
          <a href="${productUrl}" style="font-size:14px;font-weight:600;color:${INK};text-decoration:none;">${escapeHtml(item.productName)}</a>
          ${item.variationLabel ? `<div style="margin-top:2px;font-size:12px;color:${MUTED};">${escapeHtml(item.variationLabel)}</div>` : ""}
        </td>
        <td style="padding:10px 0;border-top:1px solid ${BORDER};text-align:right;white-space:nowrap;vertical-align:middle;">
          <span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${BRAND}1a;color:${INK};font-size:13px;font-weight:700;">x${item.quantity}</span>
        </td>
      </tr>`;
    })
    .join("");

  const bodyHtml = `<tr>
    <td style="padding:0 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
        ${infoRow("Name", escapeHtml(data.name))}
        ${infoRow("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${INK};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
        ${data.phone ? infoRow("Phone", `<a href="tel:${escapeHtml(data.phone)}" style="color:${INK};text-decoration:none;">${escapeHtml(data.phone)}</a>`) : ""}
      </table>
      <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${MUTED};">
        Requested Products (${totalQty} item${totalQty === 1 ? "" : "s"})
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${itemRows}
      </table>
      ${
        data.notes
          ? `<div style="margin-top:18px;padding:14px 16px;background:#f8fafc;border-radius:10px;border:1px solid ${BORDER};">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${MUTED};">Notes</p>
              <p style="margin:0;font-size:13px;line-height:20px;color:${INK};white-space:pre-wrap;">${escapeHtml(data.notes)}</p>
            </div>`
          : ""
      }
    </td>
  </tr>
  <tr><td style="height:22px;"></td></tr>`;

  const text = [
    `New wholesale enquiry from ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : "",
    "",
    "Requested items:",
    ...data.items.map(
      (i) => `- ${i.productName}${i.variationLabel ? ` (${i.variationLabel})` : ""} x${i.quantity}`,
    ),
    data.notes ? `\nNotes: ${data.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html: wrapEmail("New Wholesale Enquiry", bodyHtml), text };
}

export type ContactEmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function renderContactEmail(data: ContactEmailData): { subject: string; html: string; text: string } {
  const subject = data.subject ? `Contact Form: ${data.subject}` : `New Contact Form Message from ${data.name}`;

  const bodyHtml = `<tr>
    <td style="padding:0 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
        ${infoRow("Name", escapeHtml(data.name))}
        ${infoRow("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${INK};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
        ${data.subject ? infoRow("Subject", escapeHtml(data.subject)) : ""}
      </table>
      <div style="padding:14px 16px;background:#f8fafc;border-radius:10px;border:1px solid ${BORDER};">
        <p style="margin:0;font-size:13px;line-height:20px;color:${INK};white-space:pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    </td>
  </tr>
  <tr><td style="height:22px;"></td></tr>`;

  const text = [
    `New contact form message from ${data.name}`,
    `Email: ${data.email}`,
    data.subject ? `Subject: ${data.subject}` : "",
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html: wrapEmail("New Contact Message", bodyHtml), text };
}
