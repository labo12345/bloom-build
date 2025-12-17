-- Create gallery_items table with category and media type support
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  category TEXT NOT NULL DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery items" ON public.gallery_items FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update gallery items" ON public.gallery_items FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery items" ON public.gallery_items FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  video_url TEXT,
  email TEXT,
  phone TEXT,
  display_order INTEGER DEFAULT 0,
  is_leader BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can insert team members" ON public.team_members FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team members" ON public.team_members FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team members" ON public.team_members FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create projects table for job tracking
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  budget DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  assigned_team_member_id UUID REFERENCES public.team_members(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all projects" ON public.projects FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  description TEXT,
  estimated_budget DECIMAL(12, 2),
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, accepted, rejected
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all proposals" ON public.proposals FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert proposals" ON public.proposals FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update proposals" ON public.proposals FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete proposals" ON public.proposals FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Gallery storage policies
CREATE POLICY "Anyone can view gallery files" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update gallery files" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery files" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for team
INSERT INTO storage.buckets (id, name, public) VALUES ('team', 'team', true);

-- Team storage policies  
CREATE POLICY "Anyone can view team files" ON storage.objects FOR SELECT USING (bucket_id = 'team');
CREATE POLICY "Admins can upload team files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team files" ON storage.objects FOR UPDATE USING (bucket_id = 'team' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team files" ON storage.objects FOR DELETE USING (bucket_id = 'team' AND has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();