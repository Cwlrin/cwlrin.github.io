import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_CONFIG } from "./themeConfig.defaults";
import { defineConfig } from "./themeConfig";

describe("themeConfig", () => {
  it("returns built-in defaults when user config is empty", () => {
    const config = defineConfig({});

    expect(config).toEqual(DEFAULT_THEME_CONFIG);
    expect(config.diagnostics?.suppressFsWatcherMaxListenersWarning).toBe(true);
  });

  it("deep merges nested objects without dropping untouched siblings", () => {
    const config = defineConfig({
      footer: {
        icon: {
          name: "custom-icon",
        },
      },
    });

    expect(config.footer?.icon?.name).toBe("custom-icon");
    expect(config.footer?.icon?.color).toBe(DEFAULT_THEME_CONFIG.footer?.icon?.color);
    expect(config.footer?.count).toBe(DEFAULT_THEME_CONFIG.footer?.count);
  });

  it("replaces arrays instead of concatenating them", () => {
    const navOverride = [
      {
        href: "/custom/",
        text: "自定义",
        icon: "i-ri-star-line",
      },
    ];

    const config = defineConfig({
      nav: [...navOverride],
      layout: {
        rightSidebar: {
          order: ["search"],
        },
      },
      friends: {
        links: [
          {
            url: "https://example.com/",
            title: "Example",
            desc: "Example desc",
            author: "Example Author",
            avatar: "https://example.com/avatar.png",
          },
        ],
      },
    });

    expect(config.nav).toEqual(navOverride);
    expect(config.nav).toHaveLength(1);
    expect(config.layout?.rightSidebar?.order).toEqual(["search"]);
    expect(config.friends?.links).toEqual([
      {
        url: "https://example.com/",
        title: "Example",
        desc: "Example desc",
        author: "Example Author",
        avatar: "https://example.com/avatar.png",
      },
    ]);
  });

  it("does not mutate default config or user overrides", () => {
    const override = {
      nav: [
        {
          href: "/only/",
          text: "Only",
          icon: "i-ri-home-line",
        },
      ],
      footer: {
        icon: {
          name: "override-icon",
        },
      },
    };
    const defaultsSnapshot = JSON.parse(JSON.stringify(DEFAULT_THEME_CONFIG));
    const overrideSnapshot = JSON.parse(JSON.stringify(override));

    defineConfig(override);

    expect(DEFAULT_THEME_CONFIG).toEqual(defaultsSnapshot);
    expect(override).toEqual(overrideSnapshot);
  });

  it("allows disabling watcher warning suppression", () => {
    const config = defineConfig({
      diagnostics: {
        suppressFsWatcherMaxListenersWarning: false,
      },
    });

    expect(config.diagnostics?.suppressFsWatcherMaxListenersWarning).toBe(false);
    expect(DEFAULT_THEME_CONFIG.diagnostics?.suppressFsWatcherMaxListenersWarning).toBe(true);
  });
});
