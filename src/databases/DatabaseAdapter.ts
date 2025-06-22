

export interface DatabaseAdapter{
    init(): void;
    push(): void;
    pull(): void;
}