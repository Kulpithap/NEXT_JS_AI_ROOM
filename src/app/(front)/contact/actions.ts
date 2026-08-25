"use server";

import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  subject: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(150, "หัวข้อต้องไม่เกิน 150 ตัวอักษร"),
  message: z
    .string()
    .trim()
    .min(10, "ข้อความต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(2000, "ข้อความต้องไม่เกิน 2000 ตัวอักษร"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactFormValues, string[]>>;
  values?: ContactFormValues;
};

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = formData.get("website");

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง",
       errors: parsed.error.flatten().fieldErrors as ContactFormState["errors"],
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      },
    };
  }

  // Honeypot มีค่า → bot: ไม่ส่งอีเมล แต่ตอบเหมือนส่งสำเร็จ
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success", message: "ส่งข้อความเรียบร้อยแล้ว" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Contact email configuration is missing");
    return {
      status: "error",
      message: "ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
      values: parsed.data,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: parsed.data.email,
      subject: `[Contact] ${parsed.data.subject}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        "",
        parsed.data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        status: "error",
        message: "ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
        values: parsed.data,
      };
    }

    return { status: "success", message: "ส่งข้อความเรียบร้อยแล้ว" };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return {
      status: "error",
      message: "ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
      values: parsed.data,
    };
  }
}
