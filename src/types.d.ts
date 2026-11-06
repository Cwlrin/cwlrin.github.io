declare module "nyx-player";
declare module "nyx-player/style";
declare module "@waline/client/style";
declare module "@pagefind/component-ui";
declare module "@pagefind/component-ui/css";

declare module "virtual:hyacine/runtime" {
  export const initialized: boolean;
}
declare module "virtual:hyacine/config" {
  export const config: Record<string, unknown>;
}
declare module "virtual:hyacine/slots-manifest" {
  const slotsManifest: Record<string, any>;
  export { slotsManifest };
}
declare module "virtual:hyacine/slots/*" {
  const component: any;
  export default component;
}
