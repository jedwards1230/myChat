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

type InferQueryModel<
	TableName extends keyof TablesWithRelations,
	Columns extends IncludeColumns<TableName> | undefined = undefined,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TablesWithRelations,
	TablesWithRelations[TableName],
	{ columns: Columns; with: With }
>;

type InferResultType<
	TableName extends keyof TablesWithRelations,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<TablesWithRelations, TablesWithRelations[TableName], { with: With }>;

export type { IncludeRelation, InferQueryModel, InferResultType };

/* 
ex output: 
const tester: {
    id: string;
    name: string | null;
    email: string;
    password: string;
    defaultAgentId: string | null;
    defaultAgent: {
        id: string;
        name: string;
        createdAt: string;
        model: {....}
	};
};

This file and utility types will add on the relations associatee with a table based on the relation id. 

I do not want it to include both the id and the related object. i want it to omit the id field if a relation is loaded

desired output:

const tester: {
    id: string;
    name: string | null;
    email: string;
    password: string;
    defaultAgent: {
        id: string;
        name: string;
        createdAt: string;
        model: {....}
	};
};
*/
