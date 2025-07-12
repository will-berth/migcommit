import { Parser } from "node-sql-parser";
import { ParserAdapter } from "./ParserAdapter";

/**
 * NSParser is an implementation of the ParserAdapter interface using node-sql-parser.
 * 
 * This class provides functionality to parse SQL statements into their AST (Abstract Syntax Tree)
 * representation for introspection or analysis, supporting multiple database dialects.
 */
export class NSParser implements ParserAdapter {
    private parser: Parser;

    /**
     * Creates a new instance of NSParser.
     * 
     * @param database The database dialect to use for parsing (e.g., "postgresql", "mysql").
     */
    constructor(
        private database: string
    ) {
        this.parser = new Parser()
    }

    /**
     * Converts a SQL statement into its AST (JSON) representation.
     * 
     * @param statement The SQL statement to be parsed.
     * @returns A JSON object representing the AST of the SQL statement.
     */
    toJson(statement: string): any {
        return this.parser.astify(statement, {
            database: this.database
        })
    }
}