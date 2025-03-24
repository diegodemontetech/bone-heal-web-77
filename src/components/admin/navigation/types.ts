
export interface NavItem {
  title: string;
  icon: any;
  href: string;
  segment: string | null;
  permission?: string;
  children?: NavItem[];
}
