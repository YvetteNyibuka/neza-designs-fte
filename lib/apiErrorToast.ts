import { toast } from "sonner";

interface ApiFieldError {
  field?: string;
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: ApiFieldError[] | string;
}

function normalizeMessage(item: ApiFieldError): string | null {
  if (!item) return null;
  if (item.field && item.message) return `${item.field}: ${item.message}`;
  if (item.message) return item.message;
  return null;
}

export function extractApiErrorMessages(error: unknown, fallbackMessage: string): string[] {
  const response = (error as { response?: { data?: ApiErrorResponse } })?.response?.data;
  if (!response) return [fallbackMessage];

  if (Array.isArray(response.error) && response.error.length > 0) {
    const messages = response.error
      .map(normalizeMessage)
      .filter((m): m is string => Boolean(m));
    if (messages.length > 0) return messages;
  }

  if (typeof response.error === "string" && response.error.trim().length > 0) {
    return [response.error];
  }

  if (response.message && response.message.trim().length > 0) {
    return [response.message];
  }

  return [fallbackMessage];
}

export function toastApiErrors(error: unknown, fallbackMessage: string): void {
  const messages = extractApiErrorMessages(error, fallbackMessage);
  messages.forEach((msg) => toast.error(msg));
}

export function toastValidationErrors(errors: string[]): void {
  errors.forEach((err) => toast.error(err));
}

export function parseApiFieldErrors(error: unknown): Record<string, string> {
  const response = (error as { response?: { data?: ApiErrorResponse } })?.response?.data;
  if (!response || !Array.isArray(response.error)) return {};
  return Object.fromEntries(
    response.error
      .filter((e): e is Required<ApiFieldError> => Boolean(e.field && e.message))
      .map((e) => [e.field!, e.message!])
  );
}
