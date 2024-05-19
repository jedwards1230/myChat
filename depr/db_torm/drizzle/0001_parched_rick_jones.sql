ALTER TABLE "User" DROP CONSTRAINT "FK_020002df4ba03af085a7b4c871f";
--> statement-breakpoint
ALTER TABLE "AgentTool" DROP CONSTRAINT "FK_594c1ce0cab05bc1a0d47387568";
--> statement-breakpoint
ALTER TABLE "Agent" DROP CONSTRAINT "FK_413252bb492a4a95f0fe1756d3e";
--> statement-breakpoint
ALTER TABLE "UserSession" DROP CONSTRAINT "FK_7353eaf92987aeaf38c2590e943";
--> statement-breakpoint
ALTER TABLE "Thread" DROP CONSTRAINT "FK_e890a2d3645547f7bf2e204d63b";
--> statement-breakpoint
ALTER TABLE "Thread" DROP CONSTRAINT "FK_517b1981e4fd8709586865fb1bf";
--> statement-breakpoint
ALTER TABLE "Thread" DROP CONSTRAINT "FK_87d1c427aecddf8cdb1ef65904e";
--> statement-breakpoint
ALTER TABLE "document" DROP CONSTRAINT "FK_f68c231246d738ee2aea9d573be";
--> statement-breakpoint
ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd";
--> statement-breakpoint
ALTER TABLE "document" DROP CONSTRAINT "FK_932fb6efa239cce299f5f06577e";
--> statement-breakpoint
ALTER TABLE "Message" DROP CONSTRAINT "FK_57b45d0685ae72c74150840e20c";
--> statement-breakpoint
ALTER TABLE "Message" DROP CONSTRAINT "FK_8b38a933c77f4398908d09febea";
--> statement-breakpoint
ALTER TABLE "MessageFile" DROP CONSTRAINT "FK_251e73e4405200edd05f962ef03";
--> statement-breakpoint
ALTER TABLE "MessageFile" DROP CONSTRAINT "FK_0172936f398a69bcd650d2e68e7";
--> statement-breakpoint
ALTER TABLE "FileData" DROP CONSTRAINT "FK_bb4c5813ed4c9713c3068289a75";
--> statement-breakpoint
ALTER TABLE "ToolCall" DROP CONSTRAINT "FK_823d14e1c12461c7cef94d112c9";
--> statement-breakpoint
ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_35612191ef308b88a9f37564643";
--> statement-breakpoint
ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_a2f19faa0d7faf9ca88ca96e296";
--> statement-breakpoint
ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_10e4a76b9290991647e732abf1b";
--> statement-breakpoint
ALTER TABLE "agent_tools_agent_tool" DROP CONSTRAINT "FK_adabee28ab05d5e8eb770109156";
--> statement-breakpoint
ALTER TABLE "agent_tools_agent_tool" DROP CONSTRAINT "FK_7faea4e95f26d2f121c96243899";
--> statement-breakpoint
ALTER TABLE "Message_closure" DROP CONSTRAINT "FK_941ea848f09d43306b75ea97911";
--> statement-breakpoint
ALTER TABLE "Message_closure" DROP CONSTRAINT "FK_090362f69add0ffff1dcc98539b";
--> statement-breakpoint
ALTER TABLE "embed_item" ALTER COLUMN "embedding" SET DATA TYPE vector(1536);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_defaultAgentId_Agent_id_fk" FOREIGN KEY ("defaultAgentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "Thread_activeMessageId_Message_id_fk" FOREIGN KEY ("activeMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "Thread_agentId_Agent_id_fk" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_threadId_Thread_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_Thread_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "Message_toolCallIdId_ToolCall_id_fk" FOREIGN KEY ("toolCallIdId") REFERENCES "public"."ToolCall"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageFile" ADD CONSTRAINT "MessageFile_fileDataId_FileData_id_fk" FOREIGN KEY ("fileDataId") REFERENCES "public"."FileData"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageFile" ADD CONSTRAINT "MessageFile_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FileData" ADD CONSTRAINT "FileData_messageFileId_MessageFile_id_fk" FOREIGN KEY ("messageFileId") REFERENCES "public"."MessageFile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ToolCall" ADD CONSTRAINT "ToolCall_assistantMessageId_Message_id_fk" FOREIGN KEY ("assistantMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_threadId_Thread_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_agentId_Agent_id_fk" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_filesId_document_id_fk" FOREIGN KEY ("filesId") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "agent_tools_agent_tool_agentId_Agent_id_fk" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "agent_tools_agent_tool_agentToolId_AgentTool_id_fk" FOREIGN KEY ("agentToolId") REFERENCES "public"."AgentTool"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message_closure" ADD CONSTRAINT "Message_closure_id_ancestor_Message_id_fk" FOREIGN KEY ("id_ancestor") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message_closure" ADD CONSTRAINT "Message_closure_id_descendant_Message_id_fk" FOREIGN KEY ("id_descendant") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
