import { createClient } from "@insforge/sdk";

export const insforgeConfig = {
  baseUrl:
    import.meta.env.PUBLIC_INSFORGE_URL ??
    "https://e29jwqbi.eu-central.insforge.app",
  anonKey:
    import.meta.env.PUBLIC_INSFORGE_ANON_KEY ??
    "anon_fad59a3b1120cf873c0bf8cdc70d0c2c6aa7eab89ac73a8ea8494807e0d1c384",
};

export const insforge = createClient(insforgeConfig);
