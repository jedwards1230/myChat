import type {
	BuildQueryResult,
	DBQueryConfig,
	ExtractTablesWithRelations,
} from "drizzle-orm";

import type * as schema from "../schema/index";

type Schema = typeof schema;
type TablesWithRelations = ExtractTablesWithRelations<Schema>;

type IncludeRelation<TableName extends keyof TablesWithRelations> = DBQueryConfig<
	"one" | "many",
	boolean,
	TablesWithRelations,
	TablesWithRelations[TableName]
>["with"];

type IncludeColumns<TableName extends keyof TablesWithRelations> = DBQueryConfig<
	"one" | "many",
	boolean,
	TablesWithRelations,
	TablesWithRelations[TableName]
>["columns"];

export type InferQueryModel<
	TableName extends keyof TablesWithRelations,
	Columns extends IncludeColumns<TableName> | undefined = undefined,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TablesWithRelations,
	TablesWithRelations[TableName],
	{
		columns: Columns;
		with: With;
	}
>;

export type InferResultType<
	TableName extends keyof TablesWithRelations,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TablesWithRelations,
	TablesWithRelations[TableName],
	{
		with: With;
	}
>;
