-- Füge die Kategorie-Spalte zur inventory_items-Tabelle hinzu
ALTER TABLE inventory_items 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'supplies';

-- Erstelle einen Enum-Typ für die Kategorien
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_category') THEN
        CREATE TYPE inventory_category AS ENUM (
            'beverages-alcoholic',
            'beverages-non-alcoholic',
            'food-fresh',
            'food-dry',
            'food-frozen',
            'food-prepared',
            'supplies'
        );
    END IF;
END $$;

-- Kommentar zur Kategorie-Spalte hinzufügen
COMMENT ON COLUMN inventory_items.category IS 'Kategorie des Inventarartikels (Getränke, Lebensmittel, Verbrauchsmaterial, etc.)';

-- Aktualisiere bestehende Einträge mit Standardkategorien basierend auf Namen (optional)
UPDATE inventory_items SET category = 'beverages-alcoholic' WHERE name ILIKE '%bier%' OR name ILIKE '%wein%' OR name ILIKE '%schnaps%';
UPDATE inventory_items SET category = 'beverages-non-alcoholic' WHERE name ILIKE '%saft%' OR name ILIKE '%wasser%' OR name ILIKE '%kaffee%' OR name ILIKE '%tee%';
UPDATE inventory_items SET category = 'food-fresh' WHERE name ILIKE '%obst%' OR name ILIKE '%gemüse%' OR name ILIKE '%salat%';
UPDATE inventory_items SET category = 'food-dry' WHERE name ILIKE '%mehl%' OR name ILIKE '%zucker%' OR name ILIKE '%reis%' OR name ILIKE '%nudel%';
UPDATE inventory_items SET category = 'food-frozen' WHERE name ILIKE '%eis%' OR name ILIKE '%tiefkühl%' OR name ILIKE '%gefrier%';
UPDATE inventory_items SET category = 'food-prepared' WHERE name ILIKE '%fertig%' OR name ILIKE '%zubereitet%' OR name ILIKE '%dessert%';
