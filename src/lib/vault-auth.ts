import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getAdminSession } from "./auth";

export const VAULT_COOKIE_NAME = "gai_vault_session";
const VAULT_JWT_SECRET_STRING =
  process.env.JWT_SECRET || "gai-pro-secure-vault-key-2026-bangladesh";
const VAULT_JWT_SECRET = new TextEncoder().encode(VAULT_JWT_SECRET_STRING);

// In-memory rate limiting for vault password attempts (5 attempts per 15 minutes)
const vaultRateLimits: Record<string, { attempts: number; resetAt: number }> = {};

export function checkVaultRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = vaultRateLimits[ip];

  if (!entry || now > entry.resetAt) {
    vaultRateLimits[ip] = { attempts: 1, resetAt: now + 15 * 60 * 1000 };
    return { allowed: true };
  }

  if (entry.attempts >= 5) {
    const waitSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  entry.attempts += 1;
  return { allowed: true };
}

export function resetVaultRateLimit(ip: string) {
  delete vaultRateLimits[ip];
}

export async function verifyVaultPassword(password: string): Promise<boolean> {
  const masterPassword =
    process.env.ACTIVATION_VAULT_PASSWORD ||
    process.env.VAULT_PASSWORD ||
    "adminVault2026!";

  // Trim and compare securely
  return password.trim() === masterPassword.trim();
}

export async function generateVaultToken(adminId: string): Promise<string> {
  return await new SignJWT({
    vaultAccess: true,
    adminId,
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Vault auto-locks after 2 hours
    .sign(VAULT_JWT_SECRET);
}

export async function verifyVaultToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, VAULT_JWT_SECRET);
    return payload.vaultAccess === true;
  } catch {
    return false;
  }
}

export async function setVaultSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(VAULT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60, // 2 hours
  });
}

export async function clearVaultSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(VAULT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isVaultUnlocked(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(VAULT_COOKIE_NAME)?.value;
    if (!token) return false;
    return await verifyVaultToken(token);
  } catch {
    return false;
  }
}

/**
 * High-Security Server Guard for all Activation Link API endpoints.
 * Requires BOTH a valid main Admin session AND an active Vault session.
 */
export async function verifyVaultAccess(req?: NextRequest): Promise<{ authorized: boolean; error?: string }> {
  // 1. Check Main Admin Session
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return { authorized: false, error: "Unauthorized: Admin session required" };
  }

  // 2. Check Vault Session Cookie
  let vaultToken: string | undefined;
  if (req) {
    vaultToken = req.cookies.get(VAULT_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      vaultToken = cookieStore.get(VAULT_COOKIE_NAME)?.value;
    } catch {
      vaultToken = undefined;
    }
  }

  if (!vaultToken) {
    return { authorized: false, error: "Locked: Activation Vault is locked. Enter password to access." };
  }

  const isValid = await verifyVaultToken(vaultToken);
  if (!isValid) {
    return { authorized: false, error: "Session Expired: Vault session has expired. Please unlock again." };
  }

  return { authorized: true };
}
