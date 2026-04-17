import type { SanctuaryPost } from "@/lib/sanctuary-posts-storage";

export type ProfileGridItem = {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  type: "image" | "video" | "carousel";
  source: SanctuaryPost;
};

export type ProfileTab = "posts" | "reels" | "tagged";
