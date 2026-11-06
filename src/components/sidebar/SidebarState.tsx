import { currentLocale, getT } from "@/i18n";

interface SiteState {
  categories: number;
  posts: number;
  tags: number;
}

interface SidebarStateProps {
  state: SiteState;
}

function SidebarState(props: SidebarStateProps) {
  const t = getT(currentLocale);
  const state = () => props.state;

  const hasStats = () => state() && (state().posts || state().categories || state().tags);

  return (
    <>
      {hasStats() && (
        <nav
          aria-label="站点统计导航"
          class="state flex justify-center leading-[1.4] mt-2.5 overflow-hidden text-center whitespace-nowrap"
        >
          {state().posts > 0 && (
            <div class="item px-[15px]">
              <a href="/archives/" class="no-underline [border-bottom:none] text-inherit">
                <span class="block text-lg font-semibold text-center">{state().posts}</span>
                <span class="text-[0.8125rem] text-inherit">{t("sidebar.state.posts")}</span>
              </a>
            </div>
          )}
          {state().categories > 0 && (
            <div class="item px-[15px]">
              <a href="/categories/" class="no-underline [border-bottom:none] text-inherit">
                <span class="block text-lg font-semibold text-center">{state().categories}</span>
                <span class="text-[0.8125rem] text-inherit">{t("sidebar.state.categories")}</span>
              </a>
            </div>
          )}
          {state().tags > 0 && (
            <div class="item px-[15px]">
              <a href="/tags/" class="no-underline [border-bottom:none] text-inherit">
                <span class="block text-lg font-semibold text-center">{state().tags}</span>
                <span class="text-[0.8125rem] text-inherit">{t("sidebar.state.tags")}</span>
              </a>
            </div>
          )}
        </nav>
      )}
    </>
  );
}

export default SidebarState;
