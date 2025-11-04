-- Create enum for course levels
CREATE TYPE course_level AS ENUM ('UG', 'PG', 'Diploma', 'Certificate');

-- Create enum for course modes
CREATE TYPE course_mode AS ENUM ('Online', 'Hybrid', 'Offline');

-- Create institutes table
CREATE TABLE public.institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location TEXT,
  logo_url TEXT,
  approvals TEXT[],
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  established_year INTEGER,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  level course_level NOT NULL,
  mode course_mode NOT NULL,
  duration TEXT NOT NULL,
  fee_min DECIMAL(10,2),
  fee_max DECIMAL(10,2),
  description TEXT,
  eligibility TEXT,
  specializations TEXT[],
  accreditation TEXT[],
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  institute_id UUID REFERENCES public.institutes(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create comparison_registrations table (for unlocking comparison results)
CREATE TABLE public.comparison_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  compared_courses UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (institutes and courses are publicly visible)
CREATE POLICY "Institutes are viewable by everyone" 
  ON public.institutes FOR SELECT 
  USING (true);

CREATE POLICY "Courses are viewable by everyone" 
  ON public.courses FOR SELECT 
  USING (true);

-- RLS Policies for enquiries (anyone can insert, only authenticated admins can view)
CREATE POLICY "Anyone can create enquiries" 
  ON public.enquiries FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for comparison registrations (anyone can insert)
CREATE POLICY "Anyone can create comparison registrations" 
  ON public.comparison_registrations FOR INSERT 
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_institutes_updated_at
  BEFORE UPDATE ON public.institutes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_courses_institute_id ON public.courses(institute_id);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_mode ON public.courses(mode);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_institutes_slug ON public.institutes(slug);
CREATE INDEX idx_enquiries_created_at ON public.enquiries(created_at DESC);
