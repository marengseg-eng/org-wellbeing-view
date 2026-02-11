import { cn } from "@/lib/utils";

type StatusType = "Conforme" | "Atenção" | "Crítico" | "";

const statusStyles: Record<string, string> = {
  Conforme: "bg-status-conforme/15 text-status-conforme border-status-conforme/30",
  "Atenção": "bg-status-atencao/15 text-status-atencao border-status-atencao/30",
  "Crítico": "bg-status-critico/15 text-status-critico border-status-critico/30",
};

export const StatusBadge = ({ status }: { status: StatusType }) => {
  if (!status) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide",
        statusStyles[status] || "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
};
