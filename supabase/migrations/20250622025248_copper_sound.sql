/*
  # Financial Management System Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `brand` (text)
      - `model` (text)
      - `serial_number` (text)
      - `imei` (text)
      - `warranty_period` (integer, months)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `position` (text)
      - `department` (text)
      - `base_salary` (numeric)
      - `commission_rate` (numeric)
      - `join_date` (date)
      - `is_active` (boolean)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `emergency_contact` (text)
      - `bank_account` (text)
      - `pan_number` (text)
      - `aadhar_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sales`
      - `id` (uuid, primary key)
      - `date` (timestamp)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_amount` (numeric)
      - `payment_method` (text)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `sales_person` (text)
      - `commission` (numeric)
      - `is_returned` (boolean)
      - `warranty_start_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `expenses`
      - `id` (uuid, primary key)
      - `date` (timestamp)
      - `category` (text)
      - `subcategory` (text)
      - `amount` (numeric)
      - `description` (text)
      - `vendor` (text)
      - `receipt` (text)
      - `payment_method` (text)
      - `approved_by` (text)
      - `status` (text)
      - `is_recurring` (boolean)
      - `recurring_frequency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text DEFAULT '',
  imei text DEFAULT '',
  warranty_period integer DEFAULT 12,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL DEFAULT '',
  department text DEFAULT '',
  base_salary numeric DEFAULT 0,
  commission_rate numeric DEFAULT 5,
  join_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text DEFAULT '',
  emergency_contact text DEFAULT '',
  bank_account text DEFAULT '',
  pan_number text DEFAULT '',
  aadhar_number text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  payment_method text DEFAULT 'cash',
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  sales_person text NOT NULL DEFAULT '',
  commission numeric DEFAULT 0,
  is_returned boolean DEFAULT false,
  warranty_start_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  category text NOT NULL DEFAULT '',
  subcategory text NOT NULL DEFAULT '',
  amount numeric DEFAULT 0,
  description text NOT NULL DEFAULT '',
  vendor text DEFAULT '',
  receipt text DEFAULT '',
  payment_method text DEFAULT 'cash',
  approved_by text DEFAULT '',
  status text DEFAULT 'pending',
  is_recurring boolean DEFAULT false,
  recurring_frequency text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Allow all operations for authenticated users on products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for employees
CREATE POLICY "Allow all operations for authenticated users on employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for sales
CREATE POLICY "Allow all operations for authenticated users on sales"
  ON sales
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for expenses
CREATE POLICY "Allow all operations for authenticated users on expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();