import Link from "next/link";
import {
  RiFacebookFill,
  RiInstagramFill,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTimeLine,
} from "@remixicon/react";
import ContactForm from "./contact-form";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// http://localhost:3000/contact
export default function ContactPage() {
  const faqs = [
    {
      question: "ติดต่อสอบถามได้ทางช่องทางไหนบ้าง?",
      answer:
        "สามารถติดต่อได้ผ่านฟอร์มในหน้านี้ อีเมล หรือโทรศัพท์ในเวลาทำการ",
    },
    {
      question: "ตอบกลับภายในกี่วัน?",
      answer: "ทีมงานจะตอบกลับภายใน 1-2 วันทำการหลังจากได้รับข้อความ",
    },
    {
      question: "มีที่ทำการให้เข้าเยี่ยมชมได้หรือไม่?",
      answer:
        "สามารถเข้าเยี่ยมชมได้ตามที่อยู่ด้านซ้ายมือในวันและเวลาทำการ",
    },
    {
      question: "ต้องสมัครสมาชิกก่อนส่งข้อความหรือไม่?",
      answer: "ไม่จำเป็น ทุกคนสามารถส่งข้อความติดต่อเราได้โดยไม่ต้อง login",
    },
  ];

  const socials = [
    { label: "Facebook", href: "https://facebook.com", icon: RiFacebookFill },
    { label: "Instagram", href: "https://instagram.com", icon: RiInstagramFill },
    { label: "Email", href: "mailto:contact@cosci.com", icon: RiMailLine },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto w-full grow sm:max-w-(--breakpoint-md) lg:max-w-(--breakpoint-xl)">
        <h2 className="text-center font-medium text-4xl tracking-[-0.045em] sm:text-[2.75rem]/[1.2]">
          ติดต่อเรา
        </h2>
        <p className="mt-3 text-pretty text-center text-lg text-muted-foreground tracking-[-0.01em] sm:text-2xl">
          สอบถามข้อมูลเพิ่มเติมหรือติดต่อทีมงาน
        </p>

        <div className="mt-18 grid gap-10 md:grid-cols-2 md:gap-16">
          {/* ซ้าย: ข้อมูลติดต่อ */}
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-medium text-xl tracking-[-0.015em]">
                  <RiMapPinLine className="size-5" aria-hidden="true" /> ที่อยู่
                </h3>
                <p className="mt-2 text-muted-foreground">
                  123 ถนนตัวอย่าง แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-medium text-xl tracking-[-0.015em]">
                  <RiPhoneLine className="size-5" aria-hidden="true" /> เบอร์โทร
                </h3>
                <p className="mt-2 text-muted-foreground">02-123-4567</p>
              </div>
              <div className="rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-medium text-xl tracking-[-0.015em]">
                  <RiMailLine className="size-5" aria-hidden="true" /> อีเมล
                </h3>
                <p className="mt-2 text-muted-foreground">contact@cosci.com</p>
              </div>
              <div className="rounded-xl border p-6">
                <h3 className="flex items-center gap-2 font-medium text-xl tracking-[-0.015em]">
                  <RiTimeLine className="size-5" aria-hidden="true" /> เวลาทำการ
                </h3>
                <p className="mt-2 text-muted-foreground">
                  จันทร์ - ศุกร์ 09:00 - 18:00 น.
                </p>
              </div>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="font-medium text-xl tracking-[-0.015em]">
                ติดตามเรา
              </h3>
              <ul className="mt-3 flex gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="font-medium text-xl tracking-[-0.015em]">
                คำถามที่พบบ่อย
              </h3>
              <div className="mt-3 divide-y">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-3">
                    <summary className="cursor-pointer list-none font-medium marker:hidden group-open:text-foreground">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* ขวา: Contact Form */}
          <div className="rounded-xl border p-6 sm:p-8">
            <h3 className="font-medium text-xl tracking-[-0.015em]">
              ส่งข้อความถึงเรา
            </h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับโดยเร็วที่สุด
            </p>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="underline text-muted-foreground hover:text-foreground"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
