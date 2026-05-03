DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tc.table_name, tc.constraint_name, kcu.column_name, 
            ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ) LOOP
        EXECUTE 'ALTER TABLE public."' || r.table_name || '" DROP CONSTRAINT "' || r.constraint_name || '"';
        EXECUTE 'ALTER TABLE public."' || r.table_name || '" ADD CONSTRAINT "' || r.constraint_name || 
                '" FOREIGN KEY ("' || r.column_name || '") REFERENCES public."' || r.foreign_table_name || '"("' || r.foreign_column_name || '") ON DELETE CASCADE';
    END LOOP;
END $$;
