import { toggleSidebar } from "@/stores/sidebarSignal";

function SidebarOverlay() {
  return (
    <button
      type="button"
      class="fixed inset-0 bg-black/50 z-7 cursor-pointer lg:hidden border-none p-0 [animation:fadeIn_0.3s_ease]"
      onclick={toggleSidebar}
      aria-label="Close sidebar"
    ></button>
  );
}

export default SidebarOverlay;
