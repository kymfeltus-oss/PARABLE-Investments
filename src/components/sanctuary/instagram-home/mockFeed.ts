import type { InstagramHomeFeedPost } from "./types";

/** Skeleton feed — replace with API data later */
export const MOCK_INSTAGRAM_HOME_FEED: InstagramHomeFeedPost[] = [
  {
    id: "1",
    username: "parable.community",
    avatarUrl: "https://picsum.photos/id/64/96/96",
    mediaUrl: "https://picsum.photos/id/1015/1080/1080",
    mediaAspect: "square",
    caption: "Sunday gratitude — share one thing you’re thankful for below.",
    likeCount: 12840,
    timeLabel: "2 hours ago",
  },
  {
    id: "2",
    username: "sanctuary.creative",
    avatarUrl: "https://picsum.photos/id/177/96/96",
    mediaUrl: "https://picsum.photos/id/1016/1080/1350",
    mediaAspect: "portrait",
    caption: "New reel dropping tonight — turn on notifications.",
    likeCount: 892,
    timeLabel: "5 hours ago",
  },
  {
    id: "3",
    username: "faith.stories",
    avatarUrl: "https://picsum.photos/id/338/96/96",
    mediaUrl: "https://picsum.photos/id/1025/1080/1080",
    mediaAspect: "square",
    caption: "Testimony Tuesday — tag someone who encouraged you this week.",
    likeCount: 3421,
    timeLabel: "Yesterday",
  },
];
