"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sendContactMessage,
  type ContactFormState,
  type ContactFormValues,
} from "./actions";

const initialState: ContactFormState = { status: "idle" };

const emptyValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {errors[0]}
    </p>
  );
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const values = state.values ?? emptyValues;
  const errors = state.errors;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-5">
      <div aria-live="polite">
        {state.status === "success" && state.message && (
          <p
            role="status"
            className="rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-700 dark:text-green-400"
          >
            {state.message}
          </p>
        )}
        {state.status === "error" && state.message && !errors && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {state.message}
          </p>
        )}
        {state.status === "error" && errors && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>

      {/* Honeypot — ซ่อนจากผู้ใช้จริง */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">ชื่อ</Label>
        <Input
          id="name"
          name="name"
          defaultValue={values.name}
          required
          minLength={2}
          maxLength={100}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? "name-error" : undefined}
          disabled={isPending}
        />
        <FieldError id="name-error" errors={errors?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">อีเมล</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={values.email}
          required
          aria-invalid={Boolean(errors?.email)}
          aria-describedby={errors?.email ? "email-error" : undefined}
          disabled={isPending}
        />
        <FieldError id="email-error" errors={errors?.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">หัวข้อ</Label>
        <Input
          id="subject"
          name="subject"
          defaultValue={values.subject}
          required
          minLength={3}
          maxLength={150}
          aria-invalid={Boolean(errors?.subject)}
          aria-describedby={errors?.subject ? "subject-error" : undefined}
          disabled={isPending}
        />
        <FieldError id="subject-error" errors={errors?.subject} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">ข้อความ</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={values.message}
          required
          minLength={10}
          maxLength={2000}
          className="border-input file:text-foreground placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm"
          aria-invalid={Boolean(errors?.message)}
          aria-describedby={errors?.message ? "message-error" : undefined}
          disabled={isPending}
        />
        <FieldError id="message-error" errors={errors?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  );
}
