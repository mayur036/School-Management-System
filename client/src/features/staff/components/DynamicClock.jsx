import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BASE } from '@/lib/icons';
import { cn } from '@/lib/utils';

const DynamicClock = ({
  todayAttendance,
  isClockedIn,
  isClockedOut,
  isAttendanceLoading,
  isClocking,
  handleClockAction,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':').map(Number);
    if (parts.length >= 2) {
      const hrs = parts[0];
      const mins = parts[1];
      const secs = parts.length > 2 ? parts[2] : 0;
      return { hrs, mins, secs };
    }
    return null;
  };

  const getElapsedDuration = () => {
    if (!todayAttendance || !todayAttendance.clock_in) {
      return null;
    }

    try {
      const inParts = parseTime(todayAttendance.clock_in);
      if (!inParts) return null;

      const clockInDate = new Date();
      clockInDate.setHours(inParts.hrs, inParts.mins, inParts.secs, 0);

      let clockOutDate;
      if (todayAttendance.clock_out) {
        const outParts = parseTime(todayAttendance.clock_out);
        if (!outParts) return null;
        clockOutDate = new Date();
        clockOutDate.setHours(outParts.hrs, outParts.mins, outParts.secs, 0);
      } else {
        clockOutDate = time;
      }

      const diffMs = clockOutDate.getTime() - clockInDate.getTime();
      if (diffMs < 0) return '00:00:00';

      const diffSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(diffSecs / 3600);
      const mins = Math.floor((diffSecs % 3600) / 60);
      const secs = diffSecs % 60;

      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } catch {
      return null;
    }
  };

  // SVG Dial Clock calculations
  const seconds = time.getSeconds();
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (seconds / 60) * circumference;

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 * Math.PI) / 180;
    const isHour = i % 5 === 0;
    const length = isHour ? 6 : 3;
    const r1 = 68;
    const r2 = 68 - length;
    const x1 = 80 + r1 * Math.sin(angle);
    const y1 = 80 - r1 * Math.cos(angle);
    const x2 = 80 + r2 * Math.sin(angle);
    const y2 = 80 - r2 * Math.cos(angle);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={isHour ? 1.5 : 0.75}
        className={
          isHour
            ? 'text-indigo-400 dark:text-indigo-600'
            : 'text-slate-200 dark:text-slate-800'
        }
      />
    );
  }

  const elapsed = getElapsedDuration();
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const hour12 = time.toLocaleTimeString('en-US', { hour12: true });
  const isPm = hour12.endsWith('PM');
  const digitalTimeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex w-full flex-row items-center justify-between gap-3 py-1 sm:gap-6 sm:py-2">
      {/* Left panel: Analog-digital SVG clock */}
      <div className="relative flex shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 160 160"
          className="h-28 w-28 select-none sm:h-40 sm:w-40 md:h-45 md:w-45"
        >
          {/* Ticks */}
          {ticks}
          {/* Progress Circle Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-slate-100 stroke-[3.5] dark:stroke-slate-800"
          />
          {/* Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-indigo-600 stroke-[3.5] transition-all duration-300 dark:stroke-indigo-500"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 80 80)"
            strokeLinecap="round"
          />
          {/* Central digital time text */}
          <text
            x="80"
            y="76"
            textAnchor="middle"
            className="fill-foreground font-mono text-[19px] font-bold tracking-tight"
          >
            {digitalTimeStr}
          </text>
          {/* AM/PM Badge */}
          <g>
            <rect
              x="62"
              y="90"
              width="36"
              height="15"
              rx="4"
              className="fill-indigo-50 stroke-none dark:fill-indigo-950/40"
            />
            <text
              x="80"
              y="101"
              textAnchor="middle"
              className="fill-indigo-600 text-[8px] font-bold tracking-wider dark:fill-indigo-400"
            >
              {isPm ? 'PM' : 'AM'}
            </text>
          </g>
        </svg>
      </div>

      {/* Vertical separator */}
      <div className="h-24 self-center border-l border-dashed border-slate-200 sm:h-32 dark:border-slate-800" />

      {/* Right panel: Shift duration and action */}
      <div className="flex flex-1 flex-col items-start gap-2 sm:gap-4.5">
        <div className="text-left">
          <span className="text-muted-foreground text-[10px] font-semibold sm:text-xs">
            {dateStr}
          </span>
        </div>

        {/* Current/Total Duration Card */}
        <div className="flex w-full flex-col items-start justify-center rounded-xl border border-indigo-100/50 bg-indigo-50/30 px-3 py-1.5 text-left sm:px-4 sm:py-2.5 dark:border-indigo-950/30 dark:bg-indigo-950/10">
          <span className="text-muted-foreground text-[8px] font-bold tracking-wider uppercase sm:text-[9px]">
            {isClockedOut ? 'Total Work Duration' : 'Current Shift Duration'}
          </span>
          <span className="mt-0.5 font-mono text-lg font-bold text-indigo-600 sm:text-2xl dark:text-indigo-400">
            {elapsed || '00:00:00'}
          </span>
        </div>

        {/* Status indicator badge */}
        <div className="flex w-full justify-start">
          {isAttendanceLoading ? (
            <div className="bg-muted h-4 w-16 animate-pulse rounded-full sm:h-5 sm:w-24" />
          ) : isClockedOut ? (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground gap-1.5 border-none px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:py-0.5 sm:text-xs"
            >
              <span className="bg-muted-foreground size-1 rounded-full sm:size-1.5" />
              Shift Ended
            </Badge>
          ) : isClockedIn ? (
            <Badge className="gap-1.5 border-none bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 sm:px-2.5 sm:py-0.5 sm:text-xs dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="size-1 animate-pulse rounded-full bg-emerald-500 sm:size-1.5" />
              Active Shift
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-border text-muted-foreground gap-1.5 px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:py-0.5 sm:text-xs"
            >
              <span className="size-1 rounded-full bg-slate-300 sm:size-1.5 dark:bg-slate-700" />
              Not Clocked In
            </Badge>
          )}
        </div>

        {/* Clocked in time details label */}
        <div className="text-muted-foreground -mt-1.5 w-full text-left text-[9px] sm:-mt-2 sm:text-[11px]">
          {isAttendanceLoading ? (
            'Loading attendance status...'
          ) : isClockedOut ? (
            <span>
              Clocked in: {todayAttendance?.clock_in}{' '}
              <br className="sm:hidden" /> Clocked out:{' '}
              {todayAttendance?.clock_out}
            </span>
          ) : isClockedIn ? (
            <span>Clocked in at {todayAttendance?.clock_in}</span>
          ) : (
            <span>Ready to start your workday</span>
          )}
        </div>

        {/* Action Button */}
        <Button
          className={cn(
            'h-10 w-full cursor-pointer border text-xs font-bold transition-all duration-200 sm:text-sm',
            isClockedIn && !isClockedOut
              ? 'bg-danger-light text-danger border-danger/20 hover:bg-danger-light/85'
              : 'bg-primary-light text-primary border-primary/20 hover:bg-primary-light/85'
          )}
          disabled={isClockedOut || isAttendanceLoading || isClocking}
          onClick={handleClockAction}
        >
          {isClocking ? (
            <BASE.LOADER className="mr-1 h-3.5 w-3.5 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
          ) : isClockedOut ? (
            'Shift Complete'
          ) : isClockedIn ? (
            <>
              <BASE.LOGOUT className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />{' '}
              Clock Out
            </>
          ) : (
            <>
              <BASE.LOGIN className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />{' '}
              Clock In
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DynamicClock;
