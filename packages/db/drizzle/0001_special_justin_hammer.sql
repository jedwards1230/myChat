DO $$ BEGIN
 CREATE TYPE "public"."message_role_enum" AS ENUM('system', 'user', 'assistant', 'tool');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."toolCall_type_enum" AS ENUM('function');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Agent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text DEFAULT 'myChat Agent' NOT NULL,
	"model" jsonb DEFAULT '{"api":"openai","name":"gpt-4o","params":{"N":1,"topP":1,"maxTokens":128000,"temperature":0.7,"presencePenalty":0,"frequencyPenalty":0},"serviceName":"OpenAIService"}'::jsonb NOT NULL,
	"toolsEnabled" boolean DEFAULT true NOT NULL,
	"systemMessage" text DEFAULT 'You are a personal assistant.' NOT NULL,
	"version" integer NOT NULL,
	"ownerId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AgentRun" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model" jsonb NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"type" text NOT NULL,
	"stream" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"threadId" uuid,
	"agentId" uuid,
	"filesId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AgentTool" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"description" text NOT NULL,
	"parameters" jsonb NOT NULL,
	"toolName" text NOT NULL,
	"version" integer NOT NULL,
	"ownerId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_tools_agent_tool" (
	"agentId" uuid NOT NULL,
	"agentToolId" uuid NOT NULL,
	CONSTRAINT "PK_a3f4e7c952796e91f6c6509146b" PRIMARY KEY("agentId","agentToolId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document" (
	"id" serial PRIMARY KEY NOT NULL,
	"decoded" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"tokenCount" integer,
	"threadId" uuid,
	"userId" uuid,
	"messageId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "embed_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text,
	"role" "message_role_enum" NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"tokenCount" integer DEFAULT 0 NOT NULL,
	"threadId" uuid,
	"toolCallIdId" text,
	"parentId" uuid,
	CONSTRAINT "REL_8b38a933c77f4398908d09febe" UNIQUE("toolCallIdId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message_closure" (
	"id_ancestor" uuid NOT NULL,
	"id_descendant" uuid NOT NULL,
	CONSTRAINT "PK_883bac06f134fb892a0a01d72c0" PRIMARY KEY("id_ancestor","id_descendant")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FileData" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blob" "bytea" NOT NULL,
	"messageFileId" uuid,
	CONSTRAINT "REL_bb4c5813ed4c9713c3068289a7" UNIQUE("messageFileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MessageFile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"path" text,
	"lastModified" bigint,
	"uploadDate" timestamp DEFAULT now() NOT NULL,
	"size" bigint NOT NULL,
	"mimetype" text NOT NULL,
	"tokenCount" integer,
	"extension" text NOT NULL,
	"parsedText" text,
	"fileDataId" uuid,
	"messageId" uuid,
	CONSTRAINT "REL_251e73e4405200edd05f962ef0" UNIQUE("fileDataId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Thread" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"lastModified" timestamp DEFAULT now() NOT NULL,
	"title" text,
	"version" integer NOT NULL,
	"activeMessageId" uuid,
	"agentId" uuid,
	"userId" uuid,
	CONSTRAINT "REL_e890a2d3645547f7bf2e204d63" UNIQUE("activeMessageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ToolCall" (
	"id" text PRIMARY KEY NOT NULL,
	"function" jsonb,
	"content" text,
	"type" "toolCall_type_enum" DEFAULT 'function' NOT NULL,
	"version" integer NOT NULL,
	"assistantMessageId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text DEFAULT '' NOT NULL,
	"apiKey" varchar(255) NOT NULL,
	"profilePicture" text DEFAULT '' NOT NULL,
	"defaultAgentId" uuid,
	CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expire" timestamp NOT NULL,
	"provider" text NOT NULL,
	"ip" text,
	"current" boolean DEFAULT false NOT NULL,
	"userId" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "document" ADD CONSTRAINT "document_threadId_Thread_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "Message" ADD CONSTRAINT "FK_46dd2ddc370017214fef302ca8f" FOREIGN KEY ("parentId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FileData" ADD CONSTRAINT "FileData_messageFileId_MessageFile_id_fk" FOREIGN KEY ("messageFileId") REFERENCES "public"."MessageFile"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "user" ADD CONSTRAINT "user_defaultAgentId_Agent_id_fk" FOREIGN KEY ("defaultAgentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_adabee28ab05d5e8eb77010915" ON "agent_tools_agent_tool" ("agentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_7faea4e95f26d2f121c9624389" ON "agent_tools_agent_tool" ("agentToolId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_941ea848f09d43306b75ea9791" ON "Message_closure" ("id_ancestor");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_090362f69add0ffff1dcc98539" ON "Message_closure" ("id_descendant");