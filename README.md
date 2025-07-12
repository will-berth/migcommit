# migcommit

**migcommit** is a lightweight migration tool for managing SQL database schema changes using migration files and metadata tracking. It supports PostgreSQL and is designed for extensibility.

> **Note:** This is an initial version. Some features, such as the implementation of the `pull` command and support for additional databases, are not yet available and will be added in future releases.

## Features

- Create migration files with checksums and metadata
- Apply pending migrations to your database
- Introspect SQL migrations using AST (Abstract Syntax Tree)
- Track migration history per environment
- Extensible adapters for databases and SQL parsers

## Installation

```bash
npm install -g migcommit
```

## Usage

### Initialize a migration project

```bash
migcommit init
```

Creates the necessary directories and metadata files.

### Create a new migration

```bash
migcommit commit "create users table" --env dev
```

Generates a new SQL migration file with a unique timestamp and checksum.

### Apply migrations to the database

```bash
migcommit push --env dev
```

Applies all pending migrations for the specified environment.

## Configuration

Create a `migcommit.config.json` file in your project root:

```json
{
  "dialect": "postgres",
  "out": "./migrations",
  "environments": {
    "dev": "postgres://user:password@localhost:5432/dbname",
    "prod": "postgres://user:password@prodhost:5432/dbname"
  }
}
```

## API

### Migrator

Main entry point for migration commands.

```typescript
const migrator = new Migrator(configLoader, 'dev');
migrator.init();
migrator.commit('add users table');
migrator.push();
```

### MigrationManager

Handles migration file creation and applying migrations.

### DatabaseAdapter

Interface for database operations (see `src/databases/DatabaseAdapter.ts`).

### ParserAdapter

Interface for SQL parsing and introspection (see `src/core/parser/ParserAdapter.ts`).

## Extending

- Add support for other databases by implementing `DatabaseAdapter`.
- Add custom SQL parsers by implementing `ParserAdapter`.

## CLI Reference

- `migcommit init` — Initialize migration project
- `migcommit commit <name> [--env <env>]` — Create a new migration
- `migcommit push [--env <env>]` — Apply migrations

## Roadmap & Limitations

- The `pull` command is not yet implemented.
- Only PostgreSQL is supported for now.
- More features and improvements are planned for future versions.

## License

MIT

## Contributing

Pull requests and issues are welcome!