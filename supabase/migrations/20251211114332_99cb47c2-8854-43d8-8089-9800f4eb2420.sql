-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

-- Allow anyone to view portfolio images (public bucket)
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Only admins can upload portfolio images
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND has_role(auth.uid(), 'admin')
);

-- Only admins can update portfolio images
CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' 
  AND has_role(auth.uid(), 'admin')
);

-- Only admins can delete portfolio images
CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' 
  AND has_role(auth.uid(), 'admin')
);