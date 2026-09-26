import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

export type ProofItem = { id: string; title: string; value: string; image?: string };

const credentialsSchema = z.object({
  username: z.string().max(80),
  password: z.string().max(120),
});

const adminActionSchema = z.object({ token: z.string().min(1) });
const createProofSchema = adminActionSchema.extend({
  title: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(80),
  image: z.string().max(7_000_000).optional(),
});
const deleteProofSchema = adminActionSchema.extend({ id: z.string().uuid() });
const importProofsSchema = adminActionSchema.extend({
  proofs: z.array(z.object({
    id: z.string().min(1),
    title: z.string().trim().min(1).max(120),
    value: z.string().trim().min(1).max(80),
    image: z.string().max(7_000_000).optional(),
  })).max(100),
});

function sessionSecret() {
  const secret = process.env["PEDRO_CPA_ADMIN_SESSION_SECRET"];
  if (!secret) throw new Error("Sessão administrativa indisponível.");
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + 12 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyAdminToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) throw new Error("Acesso administrativo expirado.");
  const expected = sign(payload);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    throw new Error("Acesso administrativo inválido.");
  }
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number };
  if (!parsed.expiresAt || parsed.expiresAt < Date.now()) throw new Error("Acesso administrativo expirado.");
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function imageUrl(path: string | null) {
  if (!path) return undefined;
  const admin = await getAdmin();
  const { data } = await admin.storage.from("proof-images").createSignedUrl(path, 60 * 60);
  return data?.signedUrl;
}

async function uploadImage(dataUrl: string | undefined) {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match?.[1] || !match[2]) throw new Error("Formato de foto inválido.");
  const extension = match[1] === "image/png" ? "png" : match[1] === "image/webp" ? "webp" : "jpg";
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.byteLength > 5_000_000) throw new Error("A foto ultrapassa o limite de 5 MB.");
  const path = `${crypto.randomUUID()}.${extension}`;
  const admin = await getAdmin();
  const { error } = await admin.storage.from("proof-images").upload(path, bytes, { contentType: match[1], upsert: false });
  if (error) throw new Error("Não foi possível armazenar a foto.");
  return path;
}

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.username !== "pedrocpa" || data.password !== "thebestcpa") {
      throw new Error("Usuário ou senha incorretos.");
    }
    return { token: createAdminToken() };
  });

export const getProofs = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdmin();
  const { data, error } = await admin.from("proofs").select("id,title,value,image").order("display_order").order("created_at");
  if (error) throw new Error("Não foi possível carregar as referências.");
  return Promise.all((data ?? []).map(async (proof) => ({
    id: proof.id,
    title: proof.title,
    value: proof.value,
    ...(proof.image ? { image: await imageUrl(proof.image) } : {}),
  })));
});

export const createProof = createServerFn({ method: "POST" })
  .inputValidator((data) => createProofSchema.parse(data))
  .handler(async ({ data }) => {
    verifyAdminToken(data.token);
    const admin = await getAdmin();
    const image = await uploadImage(data.image);
    const { data: last } = await admin.from("proofs").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await admin.from("proofs").insert({ title: data.title, value: data.value, image, display_order: (last?.display_order ?? 0) + 1 });
    if (error) throw new Error("Não foi possível adicionar a referência.");
    return { ok: true };
  });

export const deleteProof = createServerFn({ method: "POST" })
  .inputValidator((data) => deleteProofSchema.parse(data))
  .handler(async ({ data }) => {
    verifyAdminToken(data.token);
    const admin = await getAdmin();
    const { data: proof } = await admin.from("proofs").select("image").eq("id", data.id).maybeSingle();
    const { error } = await admin.from("proofs").delete().eq("id", data.id);
    if (error) throw new Error("Não foi possível remover a referência.");
    if (proof?.image) await admin.storage.from("proof-images").remove([proof.image]);
    return { ok: true };
  });

export const importLocalProofs = createServerFn({ method: "POST" })
  .inputValidator((data) => importProofsSchema.parse(data))
  .handler(async ({ data }) => {
    verifyAdminToken(data.token);
    const admin = await getAdmin();
    const rows = [];
    for (const [index, proof] of data.proofs.entries()) {
      rows.push({
        title: proof.title,
        value: proof.value,
        image: await uploadImage(proof.image),
        display_order: index + 1,
      });
    }
    const { error: clearError } = await admin.from("proofs").delete().not("id", "is", null);
    if (clearError) throw new Error("Não foi possível preparar a importação.");
    if (rows.length) {
      const { error } = await admin.from("proofs").insert(rows);
      if (error) throw new Error("Não foi possível importar as referências.");
    }
    return { ok: true };
  });