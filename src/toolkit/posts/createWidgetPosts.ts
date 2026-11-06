import { DEFAULT_EXCERPT_LENGTH, resolveExcerpt, type ExcerptSourceLike } from "./excerpt";

export interface WidgetPost {
  id: string;
  data: {
    title: string;
    description: string;
  };
}

export interface WidgetPostSource extends ExcerptSourceLike {
  id: string;
  data: {
    title: string;
    description?: string;
    encrypted?: boolean;
    password?: string;
  };
}

export function createWidgetPosts(
  posts: WidgetPostSource[],
  excerptLength: number = DEFAULT_EXCERPT_LENGTH,
): WidgetPost[] {
  return posts.map((post) => {
    return {
      id: post.id,
      data: {
        title: post.data.title,
        description: resolveExcerpt(post, { length: excerptLength }),
      },
    };
  });
}
