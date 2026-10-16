import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Car,
  Home,
  Zap,
  ShoppingBag,
  HeartPulse,
  BookOpen,
  Coffee,
  Film,
  Users,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Wallet,
  Gift,
  Coins,
  CreditCard,
  Building2,
  DollarSign,
  HelpCircle
} from 'lucide-react';

const iconMap = {
  Utensils,
  ShoppingCart,
  Car,
  Home,
  Zap,
  ShoppingBag,
  HeartPulse,
  BookOpen,
  Coffee,
  Film,
  Users,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Wallet,
  Gift,
  Coins,
  CreditCard,
  Building2,
  DollarSign,
};

export const CategoryIcon = ({ name, size = 18, className = '', color }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return (
    <IconComponent
      size={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
};
