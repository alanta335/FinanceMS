// Utility functions for Supabase storage

// --- Error Handling ---
export const handleSupabaseError = (error: unknown, operation: string) => {
    const message = typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined;
    console.error(`Supabase ${operation} error:`, error);
    throw new Error(`Failed to ${operation}: ${message || 'Unknown error'}`);
};

// --- Utility: Create update object from partials ---
export type UpdateMap<T> = Partial<Record<keyof T, string | ((v: unknown) => unknown)>>;
export function createUpdateObject<T>(updates: Partial<T>, map: UpdateMap<T>) {
    return Object.entries(map).reduce((acc, [key, dbKeyOrFn]) => {
        const value = updates[key as keyof T];
        if (value !== undefined) {
            acc[typeof dbKeyOrFn === 'string' ? dbKeyOrFn : key] =
                typeof dbKeyOrFn === 'function' ? dbKeyOrFn(value) : value;
        }
        return acc;
    }, {} as Record<string, unknown>);
}
