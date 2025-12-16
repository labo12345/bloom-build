-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert initial Kenyan testimonials
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (name, role, content, rating, featured) VALUES
('Wanjiku Mwangi', 'Homeowner, Karen', 'Beyond House transformed our living room into a masterpiece. The ceiling design and custom cabinetry exceeded all our expectations. Highly recommended!', 5, true),
('James & Faith Otieno', 'New Home Owners, Kilimani', 'From the initial consultation to the final touches, the team was professional, creative, and attentive to our needs. Our home has never looked better.', 5, true),
('Michael Kamau', 'Business Owner, Westlands', 'We hired Beyond House for our office renovation and the results were outstanding. The flooring and wall treatments created a perfect professional atmosphere.', 5, true),
('Grace Njeri', 'Property Developer, Lavington', 'Exceptional quality and attention to detail. Beyond House delivered our apartment interiors on time and within budget. Will definitely work with them again.', 5, false),
('David Ochieng', 'Restaurant Owner, Kileleshwa', 'The custom cabinetry and ceiling work they did for our restaurant is absolutely stunning. Our customers always compliment the interior design.', 5, false);

-- Insert initial services
INSERT INTO public.services (title, subtitle, description, image_url, features, display_order) VALUES
('Ceiling Design', 'Elevate Your Spaces', 'Our ceiling design services bring architectural elegance and sophistication to any room. From classic coffered designs to modern tray ceilings, we create custom solutions that enhance your interior aesthetics.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', ARRAY['Coffered ceilings', 'Tray ceiling designs', 'Crown molding', 'Recessed lighting integration', 'Custom medallions', 'Acoustic solutions'], 1),
('Custom Cabinetry', 'Crafted to Perfection', 'Our bespoke cabinetry solutions are designed and built to perfectly fit your space and lifestyle. We combine traditional craftsmanship with modern techniques to deliver furniture that is both beautiful and functional.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', ARRAY['Kitchen cabinets', 'Built-in wardrobes', 'Entertainment units', 'Home office solutions', 'Bathroom vanities', 'Custom storage'], 2),
('Walls & Décor', 'Transform Your Walls', 'Transform your walls into works of art with our comprehensive wall treatment services. From textured finishes to elegant wallpapers and decorative moldings, we create stunning focal points that define your space.', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', ARRAY['Wall paneling', 'Wallpaper installation', 'Textured finishes', 'Decorative moldings', 'Accent walls', 'Art curation'], 3),
('Flooring Solutions', 'The Foundation of Design', 'Complete your interior vision with our premium flooring solutions. We offer expert installation of various flooring types, ensuring durability, aesthetics, and value that stands the test of time.', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', ARRAY['Hardwood floors', 'Engineered wood', 'Luxury vinyl tiles', 'Porcelain & ceramic', 'Natural stone', 'Floor restoration'], 4);