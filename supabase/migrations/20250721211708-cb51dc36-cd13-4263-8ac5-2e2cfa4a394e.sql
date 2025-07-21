-- Create separate storage buckets for each product category
INSERT INTO storage.buckets (id, name, public) VALUES ('gummies', 'gummies', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cookies', 'cookies', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('chocolate-bars', 'chocolate-bars', true);

-- Create storage policies for gummies bucket
CREATE POLICY "Gummies are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gummies');

CREATE POLICY "Authenticated users can upload gummies"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gummies' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gummies"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gummies' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gummies"
ON storage.objects FOR DELETE
USING (bucket_id = 'gummies' AND auth.role() = 'authenticated');

-- Create storage policies for cookies bucket
CREATE POLICY "Cookies are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cookies');

CREATE POLICY "Authenticated users can upload cookies"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cookies' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cookies"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cookies' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete cookies"
ON storage.objects FOR DELETE
USING (bucket_id = 'cookies' AND auth.role() = 'authenticated');

-- Create storage policies for chocolate-bars bucket
CREATE POLICY "Chocolate bars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chocolate-bars');

CREATE POLICY "Authenticated users can upload chocolate bars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chocolate-bars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chocolate bars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'chocolate-bars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete chocolate bars"
ON storage.objects FOR DELETE
USING (bucket_id = 'chocolate-bars' AND auth.role() = 'authenticated');