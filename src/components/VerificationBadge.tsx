import React from 'react';
import { Shield, ShieldCheck, AlertCircle, Clock, XCircle } from 'lucide-react';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | undefined;

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'badge' | 'dropdown' | 'banner';
}

const statusConfig: Record<Exclude<VerificationStatus, undefined>, { 
  label: string; 
  color: string; 
  bgColor: string; 
  icon: React.ReactNode;
}> = {
  verified: {
    label: 'Verified',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  pending: {
    label: 'Pending Review',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="w-3 h-3" />,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <XCircle className="w-3 h-3" />,
  },
  unverified: {
    label: 'Not Verified',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: <Shield className="w-3 h-3" />,
  },
};

export default function VerificationBadge({ 
  status = 'unverified', 
  size = 'md', 
  showText = true,
  variant = 'badge'
}: VerificationBadgeProps) {
  const config = statusConfig[status] || statusConfig.unverified;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = config.icon.type as React.ComponentType<{ className?: string }>;
  const iconProps = config.icon.props as { className?: string };

  if (variant === 'dropdown') {
    return (
      <div className="flex items-center gap-2">
        <Icon className={`${iconProps.className} ${config.color}`} />
        {showText && <span className="text-sm text-gray-700">{config.label}</span>}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
          <Icon className={`${iconProps.className} ${config.color}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">Identity Verification</p>
          <p className="text-sm text-gray-500">Status: <span className={config.color} font-medium>{config.label}</span></p>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${config.bgColor} ${config.color}`}>
      <Icon className={iconProps.className} />
      {showText && <span>{config.label}</span>}
    </span>
  );
}
