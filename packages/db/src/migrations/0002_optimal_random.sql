ALTER TABLE "document" RENAME TO "db_document";--> statement-breakpoint
ALTER TABLE "AgentRun" DROP CONSTRAINT "AgentRun_filesId_document_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_filesId_db_document_id_fk" FOREIGN KEY ("filesId") REFERENCES "public"."db_document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
