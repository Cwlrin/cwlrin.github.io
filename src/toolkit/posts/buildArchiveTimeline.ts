interface ArchivePostLike {
  data: {
    date: Date;
  };
}

export interface ArchiveTimelineItem<TPost extends ArchivePostLike> {
  post: TPost;
  year: number;
  month: number;
  showMonthSection: boolean;
  monthPostCount: number;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function buildArchiveTimeline<TPost extends ArchivePostLike>(
  posts: TPost[],
): ArchiveTimelineItem<TPost>[] {
  if (posts.length === 0) {
    return [];
  }

  const monthCounts = posts.reduce((acc, post) => {
    const key = getMonthKey(post.data.date);
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  let previousMonthKey = "";

  return posts.map((post) => {
    const date = post.data.date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = getMonthKey(date);
    const showMonthSection = monthKey !== previousMonthKey;

    previousMonthKey = monthKey;

    return {
      post,
      year,
      month,
      showMonthSection,
      monthPostCount: monthCounts.get(monthKey) || 0,
    };
  });
}
