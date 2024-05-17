import type { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1715761398481 implements MigrationInterface {
	name = "Initial1715761398481";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "AgentTool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT false, "description" text NOT NULL, "parameters" jsonb NOT NULL, "toolName" text NOT NULL, "version" integer NOT NULL, "ownerId" uuid, CONSTRAINT "PK_63ec070f2e12a1f10e4e2f32fde" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Agent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL DEFAULT 'myChat Agent', "model" jsonb NOT NULL DEFAULT '{"name":"gpt-4o","serviceName":"OpenAIService","api":"openai","params":{"temperature":0.7,"topP":1,"N":1,"maxTokens":128000,"frequencyPenalty":0,"presencePenalty":0}}', "toolsEnabled" boolean NOT NULL DEFAULT true, "systemMessage" text NOT NULL DEFAULT 'You are a personal assistant.', "version" integer NOT NULL, "ownerId" uuid, CONSTRAINT "PK_d3e275b7b201e40ca8f8108aa0d" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "UserSession" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expire" TIMESTAMP NOT NULL, "provider" text NOT NULL, "ip" text, "current" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_44f848faf1dd3898e9de61dc18b" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "embed_item" ("id" SERIAL NOT NULL, "embedding" text NOT NULL, CONSTRAINT "PK_065834748cf44269d6ac8535b29" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "document" ("id" SERIAL NOT NULL, "decoded" text NOT NULL, "metadata" jsonb NOT NULL, "tokenCount" integer, "threadId" uuid, "userId" uuid, "messageId" uuid, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKey" character varying(255) NOT NULL, "name" text NOT NULL DEFAULT 'New User', "email" text NOT NULL, "password" text NOT NULL DEFAULT '', "profilePicture" text NOT NULL DEFAULT '', "defaultAgentId" uuid, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Thread" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "lastModified" TIMESTAMP NOT NULL DEFAULT now(), "title" text, "version" integer NOT NULL, "activeMessageId" uuid, "agentId" uuid, "userId" uuid, CONSTRAINT "REL_e890a2d3645547f7bf2e204d63" UNIQUE ("activeMessageId"), CONSTRAINT "PK_d12805bfee6d69233bbcf04125c" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "FileData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blob" bytea NOT NULL, "messageFileId" uuid, CONSTRAINT "REL_bb4c5813ed4c9713c3068289a7" UNIQUE ("messageFileId"), CONSTRAINT "PK_343c750a13e6143d7cc956529e2" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "MessageFile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "path" text, "lastModified" bigint, "uploadDate" TIMESTAMP NOT NULL DEFAULT now(), "size" bigint NOT NULL, "mimetype" text NOT NULL, "tokenCount" integer, "extension" text NOT NULL, "parsedText" text, "fileDataId" uuid, "messageId" uuid, CONSTRAINT "REL_251e73e4405200edd05f962ef0" UNIQUE ("fileDataId"), CONSTRAINT "PK_a423e4528c409d2a6af4046d933" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."Message_role_enum" AS ENUM('system', 'user', 'assistant', 'tool')`
		);
		await queryRunner.query(
			`CREATE TABLE "Message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text, "role" "public"."Message_role_enum" NOT NULL, "name" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "tokenCount" integer NOT NULL DEFAULT '0', "threadId" uuid, "toolCallIdId" text, "parentId" uuid, CONSTRAINT "REL_8b38a933c77f4398908d09febe" UNIQUE ("toolCallIdId"), CONSTRAINT "PK_7dd6398f0d1dcaf73df342fa325" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."ToolCall_type_enum" AS ENUM('function')`
		);
		await queryRunner.query(
			`CREATE TABLE "ToolCall" ("id" text NOT NULL, "function" jsonb, "content" text, "type" "public"."ToolCall_type_enum" NOT NULL DEFAULT 'function', "version" integer NOT NULL, "assistantMessageId" uuid, CONSTRAINT "PK_63429f3376d2808406192a79213" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "AgentRun" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" jsonb NOT NULL, "status" text NOT NULL DEFAULT 'queued', "type" text NOT NULL, "stream" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "threadId" uuid, "agentId" uuid, "filesId" integer, CONSTRAINT "PK_a99c1e701606b7f428d7850a4c9" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "agent_tools_agent_tool" ("agentId" uuid NOT NULL, "agentToolId" uuid NOT NULL, CONSTRAINT "PK_a3f4e7c952796e91f6c6509146b" PRIMARY KEY ("agentId", "agentToolId"))`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_adabee28ab05d5e8eb77010915" ON "agent_tools_agent_tool" ("agentId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_7faea4e95f26d2f121c9624389" ON "agent_tools_agent_tool" ("agentToolId") `
		);
		await queryRunner.query(
			`CREATE TABLE "Message_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_883bac06f134fb892a0a01d72c0" PRIMARY KEY ("id_ancestor", "id_descendant"))`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_941ea848f09d43306b75ea9791" ON "Message_closure" ("id_ancestor") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_090362f69add0ffff1dcc98539" ON "Message_closure" ("id_descendant") `
		);
		await queryRunner.query(
			`ALTER TABLE "AgentTool" ADD CONSTRAINT "FK_594c1ce0cab05bc1a0d47387568" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Agent" ADD CONSTRAINT "FK_413252bb492a4a95f0fe1756d3e" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "UserSession" ADD CONSTRAINT "FK_7353eaf92987aeaf38c2590e943" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "document" ADD CONSTRAINT "FK_f68c231246d738ee2aea9d573be" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "document" ADD CONSTRAINT "FK_932fb6efa239cce299f5f06577e" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "User" ADD CONSTRAINT "FK_020002df4ba03af085a7b4c871f" FOREIGN KEY ("defaultAgentId") REFERENCES "Agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" ADD CONSTRAINT "FK_e890a2d3645547f7bf2e204d63b" FOREIGN KEY ("activeMessageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" ADD CONSTRAINT "FK_517b1981e4fd8709586865fb1bf" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" ADD CONSTRAINT "FK_87d1c427aecddf8cdb1ef65904e" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "FileData" ADD CONSTRAINT "FK_bb4c5813ed4c9713c3068289a75" FOREIGN KEY ("messageFileId") REFERENCES "MessageFile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "MessageFile" ADD CONSTRAINT "FK_251e73e4405200edd05f962ef03" FOREIGN KEY ("fileDataId") REFERENCES "FileData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "MessageFile" ADD CONSTRAINT "FK_0172936f398a69bcd650d2e68e7" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" ADD CONSTRAINT "FK_57b45d0685ae72c74150840e20c" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" ADD CONSTRAINT "FK_8b38a933c77f4398908d09febea" FOREIGN KEY ("toolCallIdId") REFERENCES "ToolCall"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" ADD CONSTRAINT "FK_46dd2ddc370017214fef302ca8f" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "ToolCall" ADD CONSTRAINT "FK_823d14e1c12461c7cef94d112c9" FOREIGN KEY ("assistantMessageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_35612191ef308b88a9f37564643" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_a2f19faa0d7faf9ca88ca96e296" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" ADD CONSTRAINT "FK_10e4a76b9290991647e732abf1b" FOREIGN KEY ("filesId") REFERENCES "document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "FK_adabee28ab05d5e8eb770109156" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE "agent_tools_agent_tool" ADD CONSTRAINT "FK_7faea4e95f26d2f121c96243899" FOREIGN KEY ("agentToolId") REFERENCES "AgentTool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Message_closure" ADD CONSTRAINT "FK_941ea848f09d43306b75ea97911" FOREIGN KEY ("id_ancestor") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Message_closure" ADD CONSTRAINT "FK_090362f69add0ffff1dcc98539b" FOREIGN KEY ("id_descendant") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "Message_closure" DROP CONSTRAINT "FK_090362f69add0ffff1dcc98539b"`
		);
		await queryRunner.query(
			`ALTER TABLE "Message_closure" DROP CONSTRAINT "FK_941ea848f09d43306b75ea97911"`
		);
		await queryRunner.query(
			`ALTER TABLE "agent_tools_agent_tool" DROP CONSTRAINT "FK_7faea4e95f26d2f121c96243899"`
		);
		await queryRunner.query(
			`ALTER TABLE "agent_tools_agent_tool" DROP CONSTRAINT "FK_adabee28ab05d5e8eb770109156"`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_10e4a76b9290991647e732abf1b"`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_a2f19faa0d7faf9ca88ca96e296"`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentRun" DROP CONSTRAINT "FK_35612191ef308b88a9f37564643"`
		);
		await queryRunner.query(
			`ALTER TABLE "ToolCall" DROP CONSTRAINT "FK_823d14e1c12461c7cef94d112c9"`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" DROP CONSTRAINT "FK_46dd2ddc370017214fef302ca8f"`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" DROP CONSTRAINT "FK_8b38a933c77f4398908d09febea"`
		);
		await queryRunner.query(
			`ALTER TABLE "Message" DROP CONSTRAINT "FK_57b45d0685ae72c74150840e20c"`
		);
		await queryRunner.query(
			`ALTER TABLE "MessageFile" DROP CONSTRAINT "FK_0172936f398a69bcd650d2e68e7"`
		);
		await queryRunner.query(
			`ALTER TABLE "MessageFile" DROP CONSTRAINT "FK_251e73e4405200edd05f962ef03"`
		);
		await queryRunner.query(
			`ALTER TABLE "FileData" DROP CONSTRAINT "FK_bb4c5813ed4c9713c3068289a75"`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" DROP CONSTRAINT "FK_87d1c427aecddf8cdb1ef65904e"`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" DROP CONSTRAINT "FK_517b1981e4fd8709586865fb1bf"`
		);
		await queryRunner.query(
			`ALTER TABLE "Thread" DROP CONSTRAINT "FK_e890a2d3645547f7bf2e204d63b"`
		);
		await queryRunner.query(
			`ALTER TABLE "User" DROP CONSTRAINT "FK_020002df4ba03af085a7b4c871f"`
		);
		await queryRunner.query(
			`ALTER TABLE "document" DROP CONSTRAINT "FK_932fb6efa239cce299f5f06577e"`
		);
		await queryRunner.query(
			`ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`
		);
		await queryRunner.query(
			`ALTER TABLE "document" DROP CONSTRAINT "FK_f68c231246d738ee2aea9d573be"`
		);
		await queryRunner.query(
			`ALTER TABLE "UserSession" DROP CONSTRAINT "FK_7353eaf92987aeaf38c2590e943"`
		);
		await queryRunner.query(
			`ALTER TABLE "Agent" DROP CONSTRAINT "FK_413252bb492a4a95f0fe1756d3e"`
		);
		await queryRunner.query(
			`ALTER TABLE "AgentTool" DROP CONSTRAINT "FK_594c1ce0cab05bc1a0d47387568"`
		);
		await queryRunner.query(`DROP INDEX "public"."IDX_090362f69add0ffff1dcc98539"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_941ea848f09d43306b75ea9791"`);
		await queryRunner.query(`DROP TABLE "Message_closure"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_7faea4e95f26d2f121c9624389"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_adabee28ab05d5e8eb77010915"`);
		await queryRunner.query(`DROP TABLE "agent_tools_agent_tool"`);
		await queryRunner.query(`DROP TABLE "AgentRun"`);
		await queryRunner.query(`DROP TABLE "ToolCall"`);
		await queryRunner.query(`DROP TYPE "public"."ToolCall_type_enum"`);
		await queryRunner.query(`DROP TABLE "Message"`);
		await queryRunner.query(`DROP TYPE "public"."Message_role_enum"`);
		await queryRunner.query(`DROP TABLE "MessageFile"`);
		await queryRunner.query(`DROP TABLE "FileData"`);
		await queryRunner.query(`DROP TABLE "Thread"`);
		await queryRunner.query(`DROP TABLE "User"`);
		await queryRunner.query(`DROP TABLE "document"`);
		await queryRunner.query(`DROP TABLE "embed_item"`);
		await queryRunner.query(`DROP TABLE "UserSession"`);
		await queryRunner.query(`DROP TABLE "Agent"`);
		await queryRunner.query(`DROP TABLE "AgentTool"`);
	}
}
