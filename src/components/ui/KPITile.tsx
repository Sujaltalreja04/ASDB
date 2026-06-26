import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPITileProps {
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changePeriod?: string;
  trend?: 'up' | 'down' | 'stable';
  positive?: 'up' | 'down';
  sparkline?: number[];
  severity?: 'critical' | 'warning' | 'info' | 'success';
}

export default function KPITile({
  label,
  value,
  unit = '',
  change,
  changePeriod = 'vs last week',
  trend,
  positive = 'up',
  sparkline = [],
  severity
}: KPITileProps) {
  const [animatedValue, setAnimatedValue] = useState<number | string>(0);

  // Animate numbers counting up on load
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (start === end) {
        setAnimatedValue(end);
        return;
      }
      const duration = 800; // ms
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const ease = progress * (2 - progress);
        const current = start + (end - start) * ease;
        
        if (Number.isInteger(end)) {
          setAnimatedValue(Math.floor(current));
        } else {
          setAnimatedValue(Number(current.toFixed(2)));
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(end);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedValue(value);
    }
  }, [value]);

  // Determine change indicator colors
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  const isPositive = (isUp && positive === 'up') || (isDown && positive === 'down');
  const isNegative = (isUp && positive === 'down') || (isDown && positive === 'up');

  // Build sparkline path
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const width = 80;
    const height = 28;
    const minVal = Math.min(...sparkline);
    const maxVal = Math.max(...sparkline);
    const range = maxVal - minVal || 1;
    
    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height + 1; // offset padding
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-20 h-7 text-primary/30" viewBox="0 0 80 30">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
          className="text-primary"
        />
      </svg>
    );
  };

  const getBorderColorClass = () => {
    if (severity === 'critical') return 'border-critical glow-critical';
    if (severity === 'warning') return 'border-warning';
    if (severity === 'success') return 'border-success';
    return 'border-border hover:border-border-strong';
  };

  return (
    <div className={`kpi-tile border ${getBorderColorClass()} flex flex-col justify-between h-[115px]`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider leading-none">
          {label}
        </span>
        {sparkline.length > 0 && renderSparkline()}
      </div>

      <div className="flex items-baseline gap-1 mt-2.5">
        <span className="text-2xl font-black text-text-primary tracking-tight">
          {typeof animatedValue === 'number' ? animatedValue.toLocaleString() : animatedValue}
        </span>
        {unit && <span className="text-xs text-text-secondary font-semibold">{unit}</span>}
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-text-muted">
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 font-bold ${
            isPositive ? 'text-success' : isNegative ? 'text-critical' : 'text-text-muted'
          }`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {isUp ? '+' : ''}{change}%
          </span>
        )}
        <span className="truncate leading-none">{changePeriod}</span>
      </div>
    </div>
  );
}
