-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "public"."Message_role_enum" AS ENUM('system', 'user', 'assistant', 'tool');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ToolCall_type_enum" AS ENUM('function');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" bigint NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"apiKey" varchar(255) NOT NULL,
	"name" text DEFAULT 'New User' NOT NULL,
	"email" text NOT NULL,
	"password" text DEFAULT '' NOT NULL,
	"profilePicture" text DEFAULT '' NOT NULL,
	"defaultAgentId" uuid,
	CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AgentTool" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "Agent" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text DEFAULT 'myChat Agent' NOT NULL,
	"model" jsonb DEFAULT '{"api":"openai","name":"gpt-4o","params":{"N":1,"topP":1,"maxTokens":128000,"temperature":0.7,"presencePenalty":0,"frequencyPenalty":0},"serviceName":"OpenAIService"}'::jsonb NOT NULL,
	"toolsEnabled" boolean DEFAULT true NOT NULL,
	"systemMessage" text DEFAULT 'You are a personal assistant.' NOT NULL,
	"version" integer NOT NULL,
	"ownerId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserSession" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expire" timestamp NOT NULL,
	"provider" text NOT NULL,
	"ip" text,
	"current" boolean DEFAULT false NOT NULL,
	"userId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Thread" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "Message" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"content" text,
	"role" "Message_role_enum" NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"tokenCount" integer DEFAULT 0 NOT NULL,
	"threadId" uuid,
	"toolCallIdId" text,
	"parentId" uuid,
	CONSTRAINT "REL_8b38a933c77f4398908d09febe" UNIQUE("toolCallIdId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MessageFile" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "FileData" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"blob" "bytea" NOT NULL,
	"messageFileId" uuid,
	CONSTRAINT "REL_bb4c5813ed4c9713c3068289a7" UNIQUE("messageFileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ToolCall" (
	"id" text PRIMARY KEY NOT NULL,
	"function" jsonb,
	"content" text,
	"type" "ToolCall_type_enum" DEFAULT 'function' NOT NULL,
	"version" integer NOT NULL,
	"assistantMessageId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AgentRun" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "embed_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" "vector" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_tools_agent_tool" (
	"agentId" uuid NOT NULL,
	"agentToolId" uuid NOT NULL,
	CONSTRAINT "PK_a3f4e7c952796e91f6c6509146b" PRIMARY KEY("agentId","agentToolId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message_closure" (
	"id_ancestor" uuid NOT NULL,
	"id_descendant" uuid NOT NULL,
	CONSTRAINT "PK_883bac06f134fb892a0a01d72c0" PRIMARY KEY("id_ancestor","id_descendant")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "FK_020002df4ba03af085a7b4c871f" FOREIGN KEY ("defaultAgentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentTool" ADD CONSTRAINT "FK_594c1ce0cab05bc1a0d47387568" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "FK_413252bb492a4a95f0fe1756d3e" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserSession" ADD CONSTRAINT "FK_7353eaf92987aeaf38c2590e943" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "FK_e890a2d3645547f7bf2e204d63b" FOREIGN KEY ("activeMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "FK_517b1981e4fd8709586865fb1bf" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thread" ADD CONSTRAINT "FK_87d1c427aecddf8cdb1ef65904e" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "FK_f68c231246d738ee2aea9d573be" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "FK_932fb6efa239cce299f5f06577e" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "FK_57b45d0685ae72c74150840e20c" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "FK_8b38a933c77f4398908d09febea" FOREIGN KEY ("toolCallIdId") REFERENCES "public"."ToolCall"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "MessageFile" ADD CONSTRAINT "FK_251e73e4405200edd05f962ef03" FOREIGN KEY ("fileDataId") REFERENCES "public"."FileData"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageFile" ADD CONSTRAINT "FK_0172936f398a69bcd650d2e68e7" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FileData" ADD CONSTRAINT "FK_bb4c5813ed4c9713c3068289a75" FOREIGN KEY ("messageFileId") REFERENCES "public"."MessageFile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ToolCall" ADD CONSTRAINT "FK_823d14e1c12461c7cef94d112c9" FOREIGN KEY ("assistantMessageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_35612191ef308b88a9f37564643" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_a2f19faa0d7faf9ca88ca96e296" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_10e4a76b9290991647e732abf1b" FOREIGN KEY ("filesId") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "FK_adabee28ab05d5e8eb770109156" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "FK_7faea4e95f26d2f121c96243899" FOREIGN KEY ("agentToolId") REFERENCES "public"."AgentTool"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message_closure" ADD CONSTRAINT "FK_941ea848f09d43306b75ea97911" FOREIGN KEY ("id_ancestor") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message_closure" ADD CONSTRAINT "FK_090362f69add0ffff1dcc98539b" FOREIGN KEY ("id_descendant") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_adabee28ab05d5e8eb77010915" ON "agent_tools_agent_tool" ("agentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_7faea4e95f26d2f121c9624389" ON "agent_tools_agent_tool" ("agentToolId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_941ea848f09d43306b75ea9791" ON "Message_closure" ("id_ancestor");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_090362f69add0ffff1dcc98539" ON "Message_closure" ("id_descendant");
*/