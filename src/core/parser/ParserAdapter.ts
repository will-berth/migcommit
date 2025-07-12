/**
 * Defines the contract for SQL parser adapters.
 * 
 * Implementations of this interface should provide a method to convert
 * SQL statements into a JSON representation for introspection or analysis.
 */
export interface ParserAdapter {
    /**
     * Converts a SQL statement into a JSON representation.
     * 
     * @param statement The SQL statement to be parsed.
     * @returns A JSON object representing the parsed SQL statement.
     */
    toJson(statement: string): any;
}