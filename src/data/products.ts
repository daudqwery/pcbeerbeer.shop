import { Product } from '../types';

export const products: Product[] = [];

export const categories = [
  'WhatsApp Tools',
  'Telegram Tools',
  'Instagram Tools',
  'PC Gaming',
] as const;

export const categoryImages: Record<string, string> = {
  'WhatsApp Tools': '/images/wabpromob.png',
  'Telegram Tools': '/images/tbpromob.png',
  'Instagram Tools': '/images/instarobo.png',
  'PC Gaming': '/images/pc-gaming.png',
};

export const categoryIcons: Record<string, string> = {
  'WhatsApp Tools': '💬',
  'Telegram Tools': '✈️',
  'Instagram Tools': '📸',
  'PC Gaming': '🖥️',
};
