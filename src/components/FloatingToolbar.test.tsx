import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import FloatingToolbar from "./FloatingToolbar";

describe("FloatingToolbar", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders default top button without player buttons when player is absent", () => {
    const { container } = render(() => <FloatingToolbar hasNyxPlayer={false} />);
    const topBtn = container.querySelector(".tool.top button");
    expect(topBtn).not.toBeNull();

    const nyxShowBtn = container.querySelector("#nyx-show-btn");
    const nyxPlayBtn = container.querySelector("#nyx-play-btn");
    expect(nyxShowBtn).toBeNull();
    expect(nyxPlayBtn).toBeNull();
  });

  it("renders player buttons when hyacine slot nyx player island is present", () => {
    const slotDiv = document.createElement("div");
    slotDiv.className = "hyacine-slot hyacine-slot-layout-bottom";
    slotDiv.setAttribute("data-hyacine-slot", "layout-bottom");

    const island = document.createElement("astro-island");
    island.setAttribute("opts", '{"name":"NyxPlayerWrapper","value":true}');
    slotDiv.appendChild(island);
    document.body.appendChild(slotDiv);

    const { container } = render(() => <FloatingToolbar />);

    const nyxShowBtn = container.querySelector("#nyx-show-btn");
    const nyxPlayBtn = container.querySelector("#nyx-play-btn");
    expect(nyxShowBtn).not.toBeNull();
    expect(nyxPlayBtn).not.toBeNull();
  });

  it("renders comment button when comments container is present", () => {
    const commentsDiv = document.createElement("div");
    commentsDiv.id = "comments";
    document.body.appendChild(commentsDiv);

    const { container } = render(() => <FloatingToolbar />);
    const commentBtn = container.querySelector('button[aria-label="前往评论区"]');
    expect(commentBtn).not.toBeNull();
  });
});
