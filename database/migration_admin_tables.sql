-- ============================================================
-- Migration: Add Admin Dashboard Tables
-- Creates: profiles, orders, order_items
-- Does NOT modify: categories, products
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES TABLE
--    Linked 1:1 to auth.users via id
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT,
    email       TEXT,
    phone       TEXT,
    is_admin    BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read any profile (needed for admin checks)
CREATE POLICY "profiles_select_public"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can insert their own profile row only
CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile; admins can update any
CREATE POLICY "profiles_update_own_or_admin"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid() = id
        OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
    );


-- ────────────────────────────────────────────────────────────
-- 2. AUTO-CREATE PROFILE ON SIGNUP
--    Trigger fires after a new auth.users row is inserted
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, phone, is_admin)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        false
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Drop trigger first if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 3. ORDERS TABLE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number        TEXT NOT NULL UNIQUE,
    user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Customer snapshot (stored at time of order, not linked to profiles)
    customer_name       TEXT NOT NULL,
    customer_email      TEXT NOT NULL,
    customer_phone      TEXT NOT NULL,

    -- Shipping address
    shipping_address    TEXT NOT NULL,
    shipping_city       TEXT NOT NULL,
    shipping_state      TEXT NOT NULL,
    shipping_zip_code   TEXT NOT NULL,

    -- Payment & fulfilment
    payment_method      TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'New'
                            CHECK (status IN ('New','Accepted','Packed','Shipped','Delivered','Cancelled')),

    -- Financials
    subtotal            DECIMAL(10,2) NOT NULL,
    shipping_cost       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_amount     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount        DECIMAL(10,2) NOT NULL,

    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (guest checkout supported)
CREATE POLICY "orders_insert_public"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Users can SELECT their own orders; admins can see all
CREATE POLICY "orders_select_own_or_admin"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = user_id
        OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
    );

-- Only admins can UPDATE (status changes)
CREATE POLICY "orders_update_admin_only"
    ON public.orders FOR UPDATE
    USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
    );

-- Admins only for DELETE (safety net)
CREATE POLICY "orders_delete_admin_only"
    ON public.orders FOR DELETE
    USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
    );


-- ────────────────────────────────────────────────────────────
-- 4. ORDER_ITEMS TABLE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,

    -- Product snapshot (stored at time of order)
    product_name    TEXT NOT NULL,
    product_price   DECIMAL(10,2) NOT NULL,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    weight          TEXT,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public can INSERT items when placing an order
CREATE POLICY "order_items_insert_public"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- Users can SELECT items belonging to their own orders; admins see all
CREATE POLICY "order_items_select_own_or_admin"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND (
                  o.user_id = auth.uid()
                  OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
              )
        )
    );


-- ────────────────────────────────────────────────────────────
-- 5. ENABLE REALTIME FOR ORDERS
--    Required for the live notification badge in the admin UI
-- ────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;


-- ────────────────────────────────────────────────────────────
-- 6. HELPFUL INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user_id       ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at    ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
