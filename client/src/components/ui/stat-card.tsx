import { StatCardProps } from "@/types";

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendDirection, 
  icon,
  iconBgColor,
  iconTextColor
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold mt-1 font-mono">{value}</p>
        </div>
        <div className={`p-2 ${iconBgColor} rounded-full ${iconTextColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center text-sm">
        <span className={`${trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'} flex items-center font-medium`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={trendDirection === 'up' ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
            />
          </svg>
          {trend}
        </span>
        <span className="text-slate-500 ml-2">since last month</span>
      </div>
    </div>
  );
}
