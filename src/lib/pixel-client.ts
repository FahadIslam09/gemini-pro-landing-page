"use client";

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function trackPixelEvent(
  eventName: string,
  parameters: Record<string, any> = {},
  eventId?: string
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", eventName, parameters, { eventID: eventId });
    } else {
      window.fbq("track", eventName, parameters);
    }
  }
}

export function trackCustomPixelEvent(
  eventName: string,
  parameters: Record<string, any> = {},
  eventId?: string
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("trackCustom", eventName, parameters, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, parameters);
    }
  }
}
