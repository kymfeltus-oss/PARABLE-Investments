export type InstagramHomeFeedPost = {
  id: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaAspect?: "square" | "portrait";
  caption: string;
  likeCount: number;
  timeLabel?: string;
};
