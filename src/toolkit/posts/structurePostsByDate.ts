import type { Post } from "./types";

type PostWithDay = Post;

export interface ArchiveConfig {
  daily?: boolean;
}

export interface MonthlyPostGroup {
  posts: PostWithDay[];
  dailyGroups?: Record<number, PostWithDay[]>;
}

export interface YearlyPostGroup {
  yearlySummary: PostWithDay[];
  monthlyData: Record<number, MonthlyPostGroup>;
}

export type StructuredPosts = Record<number, YearlyPostGroup>;

/**
 * 将文章按日期结构化
 * @param posts 文章列表
 * @param config 配置项
 * @param config.daily 是否按天分组
 * @returns 结构化的文章列表
 */
export function structurePostsByDate(posts: Post[], config: ArchiveConfig = {}): StructuredPosts {
  const grouped: StructuredPosts = {};

  posts.forEach((post) => {
    const date = post.data.date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (!grouped[year]) {
      grouped[year] = {
        yearlySummary: [],
        monthlyData: {},
      };
    }

    const yearGroup = grouped[year];
    yearGroup.yearlySummary.push(post);

    if (!yearGroup.monthlyData[month]) {
      yearGroup.monthlyData[month] = { posts: [] };
    }

    const monthGroup = yearGroup.monthlyData[month];
    monthGroup.posts.push(post);

    if (config.daily) {
      monthGroup.dailyGroups ??= {};
      monthGroup.dailyGroups[day] ??= [];

      monthGroup.dailyGroups[day].push(post);
    }
  });

  return grouped;
}
