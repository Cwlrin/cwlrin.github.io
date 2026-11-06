import type { JSX } from "solid-js";

interface SidebarAuthorProps {
  author?: string;
  description?: string;
  avatarImage?: JSX.Element;
}

function SidebarAuthor(props: SidebarAuthorProps) {
  const hasAuthor = () => Boolean(props.author || props.avatarImage);

  return (
    <>
      {hasAuthor() && (
        <div class="author" itemscope itemtype="http://schema.org/Person">
          {props.avatarImage && (
            <div
              class="image border border-body-bg-shadow block mx-auto max-w-40 p-0.5 shadow-[0_0_1rem_0.625rem_var(--body-bg-shadow)] rounded-full transition-transform duration-300 overflow-hidden"
              itemprop="image"
            >
              {props.avatarImage}
            </div>
          )}
          {props.author && (
            <p class="text-grey-7 font-normal m-0 mt-[5px] text-center" itemprop="name">
              {props.author}
            </p>
          )}
          {props.description && (
            <div class="text-grey-5 text-sm mt-[5px] text-center" itemprop="description">
              {props.description}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SidebarAuthor;
