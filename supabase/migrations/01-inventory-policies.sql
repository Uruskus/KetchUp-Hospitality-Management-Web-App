-- Inventory Items Policies
CREATE POLICY "Enable read access for all users" ON "inventory_items"
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "inventory_items"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "inventory_items"
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON "inventory_items"
    FOR DELETE USING (true);

-- Inventory Transactions Policies
CREATE POLICY "Enable read access for all users" ON "inventory_transactions"
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "inventory_transactions"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "inventory_transactions"
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON "inventory_transactions"
    FOR DELETE USING (true);
