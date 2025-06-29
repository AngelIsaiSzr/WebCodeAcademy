DROP TABLE "community_comments" CASCADE;--> statement-breakpoint
DROP TABLE "community_posts" CASCADE;--> statement-breakpoint
DROP TABLE "community_votes" CASCADE;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "coming_soon" boolean DEFAULT false;