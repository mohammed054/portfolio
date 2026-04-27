export interface Project {
  id: number;
  name: string;
  category: string;
  url: string;
  imageAvailable?: boolean;
  image?: string;
  images?: {
    main: string;
    detail1?: string;
  };
}

export interface SectionProps {
  id?: string;
}

export interface NavLink {
  to?: string;
  label: string;
  sectionId?: string;
  href?: string;
}

export interface ContactInfo {
  email: string;
  ceoEmail?: string;
  calUrl?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  social?: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  copyright?: string;
  tagline?: string;
}

export interface ColorPalette {
  bgDark: string;
  bgDark2: string;
  bgContact: string;
  textLight: string;
  textMuted: string;
  accentGold: string;
  purpleMid: string;
  blueDeep: string;
}

export type SectionId =
  | 'home'
  | 'work'
  | 'about-us'
  | 'about-copy'
  | 'about-vintage'
  | 'shredder'
  | 'contact'
  | 'golden-tie'
  | 'handshake'
  | 'good-buy'
  | 'footer';
