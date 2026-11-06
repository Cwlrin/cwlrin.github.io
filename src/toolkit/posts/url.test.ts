import { describe, expect, it } from "vitest";
import { toCategoryHref, toPostHref, toTagHref, toTagSlug } from "./url";

describe("url helpers", () => {
  it("normalizes tag slug with lowercase and separators", () => {
    expect(toTagSlug("  Astro  Blog/中文  ")).toBe("astro-blog-中文");
    expect(toTagSlug("A\\B/C")).toBe("a-b-c");
  });

  it("builds encoded tag href with trailing slash", () => {
    expect(toTagHref("Hello World")).toBe("/tags/hello-world/");
    expect(toTagHref("前端 & Astro")).toBe("/tags/%E5%89%8D%E7%AB%AF-%26-astro/");
    expect(toTagHref("")).toBe("/tags/");
  });

  it("builds encoded category href with trailing slash", () => {
    expect(toCategoryHref("前端/Astro")).toBe("/categories/%E5%89%8D%E7%AB%AF%2FAstro/");
    expect(toCategoryHref("General")).toBe("/categories/General/");
  });

  it("builds post href with suffix trimming and encoding", () => {
    expect(toPostHref("notes/hello world.md")).toBe("/posts/notes/hello%20world/");
    expect(toPostHref("/nested/path/")).toBe("/posts/nested/path/");
    expect(toPostHref("")).toBe("/posts/");
  });

  it("keeps tag slug and href consistent", () => {
    const name = "Tag 中文 + Plus";
    const href = toTagHref(name);
    const slugInHref = decodeURIComponent(href.slice("/tags/".length, -1));

    expect(slugInHref).toBe(toTagSlug(name));
  });
});
