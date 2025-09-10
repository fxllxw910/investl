import React from "react";
import { cn } from "@/lib/utils";

export interface DataTableHeader {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  headers: DataTableHeader[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  headers,
  data,
  renderRow,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header) => (
              <th
                key={header.id}
                className={cn(
                  "p-3 font-medium text-muted-foreground",
                  header.align === "center" && "text-center",
                  header.align === "right" && "text-right",
                  header.align === "left" && "text-left"
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="py-12 text-center text-muted-foreground"
              >
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item))
          )}
        </tbody>
      </table>
    </div>
  );
}