export interface Project {
  id: number;
  name: string;
  category: string;
  url: string;
  image?: string;
}

export interface SectionProps {
  id?: string;
}

export interface NavLink {
  to: string;
  label: string;
}

export interface ContactInfo {
  email: string;
  ceo: string;
  cal: string;
  address: string;
  linkedin: string;
  instagram: string;
  twitter: string;
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