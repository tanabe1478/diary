import { format } from "date-fns";

export default function Time({ dateTime }: { dateTime: string }) {
  return (
    <time
      dateTime={dateTime}
      title={dateTime}
      className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {format(new Date(dateTime), "MMM d, yyyy")}
    </time>
  );
}
