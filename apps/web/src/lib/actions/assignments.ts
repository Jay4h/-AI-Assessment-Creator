"use server";

import { redirect } from "next/navigation";
import { getServerApiUrl } from "@/lib/api/config";
import type { FormState } from "@/lib/validation/assignment-form";

export async function submitAssignment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const className = String(formData.get("className") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const additionalInstructions = String(formData.get("additionalInstructions") ?? "").trim();
  const rowCount = Number(formData.get("rowCount") ?? 0);
  const imageBase64Raw = formData.get("imageBase64");
  const imageMimeTypeRaw = formData.get("imageMimeType");
  const imageBase64 = imageBase64Raw ? String(imageBase64Raw) : undefined;
  const imageMimeType = (imageMimeTypeRaw === "image/jpeg" || imageMimeTypeRaw === "image/png")
    ? imageMimeTypeRaw
    : undefined;

  const errors: Record<string, string> = {};
  if (!title || title.length < 3) errors.title = "Title must be at least 3 characters";
  if (!subject || subject.length < 2) errors.subject = "Subject is required";
  if (!className) errors.className = "Class is required";
  if (!dueDate) errors.dueDate = "Due date is required";
  if (rowCount < 1) errors.questionTypes = "Add at least one question type";

  const questionTypes = [];
  for (let i = 0; i < rowCount; i++) {
    const type = String(formData.get(`type-${i}`) ?? "");
    const label = String(formData.get(`label-${i}`) ?? type);
    const count = Number(formData.get(`count-${i}`) ?? 0);
    const marks = Number(formData.get(`marks-${i}`) ?? 0);
    if (count < 1) errors[`count-${i}`] = "Must be at least 1";
    if (marks < 1) errors[`marks-${i}`] = "Must be at least 1";
    questionTypes.push({ id: `row-${i}`, type, label, count, marksPerQuestion: marks });
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  let assignmentId: string;
  try {
    const res = await fetch(`${getServerApiUrl()}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subject,
        className,
        dueDate,
        additionalInstructions,
        questionTypes,
        ...(imageBase64 ? { imageBase64, imageMimeType } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        ok: false,
        errors: { _form: body.error ?? "Failed to create assignment. Please try again." },
      };
    }

    const data = await res.json();
    assignmentId = data.assignmentId;
  } catch {
    return {
      ok: false,
      errors: { _form: "Could not reach the server. Is the API running?" },
    };
  }

  const { revalidateTag } = await import("next/cache");
  revalidateTag("assignments");

  redirect(`/assignments/${assignmentId}/output`);
}

export async function deleteAssignment(assignmentId: string) {
  const { revalidatePath, revalidateTag } = await import("next/cache");
  try {
    const res = await fetch(`${getServerApiUrl()}/api/assignments/${assignmentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete assignment");
    }

    revalidatePath("/assignments");
    revalidateTag("assignments");
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete assignment";
    console.error("[actions] Failed to delete assignment", err);
    return { ok: false, error: message };
  }
}
