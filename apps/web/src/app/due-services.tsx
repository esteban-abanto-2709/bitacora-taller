import Link from "next/link";
import { ChevronRight, Clock, TriangleAlert } from "lucide-react";
import {
  getDueServices,
  UPCOMING_KM,
  type DueService,
  type DueStatus,
} from "@/lib/alerts";
import { formatDate, formatKm } from "@/lib/mileage";

function detail(service: DueService, status: DueStatus) {
  const { due_km, due_on, current_km } = service;
  if (status === "overdue") {
    return due_km !== null && current_km >= due_km
      ? `Vencido hace ${formatKm(current_km - due_km)}`
      : `Vencido desde el ${formatDate(due_on as string)}`;
  }
  return due_km !== null && due_km - current_km <= UPCOMING_KM
    ? `Faltan ${formatKm(due_km - current_km)}`
    : `Vence el ${formatDate(due_on as string)}`;
}

export async function DueServices() {
  const items = await getDueServices();

  if (!items) {
    return (
      <p role="alert" className="text-sm text-destructive">
        No se pudieron cargar los avisos.
      </p>
    );
  }

  if (!items.length) {
    return <p className="text-muted-foreground">Sin servicios pendientes.</p>;
  }

  const groups = [
    {
      status: "overdue" as const,
      title: "Vencidos",
      icon: <TriangleAlert className="text-destructive" />,
    },
    {
      status: "upcoming" as const,
      title: "Próximos",
      icon: <Clock className="text-muted-foreground" />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      {groups.map(({ status, title, icon }) => {
        const rows = items.filter((i) => i.status === status);
        if (!rows.length) return null;
        return (
          <div key={status} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              {icon}
              {title}
            </h2>
            <ul className="flex flex-col gap-2">
              {rows.map(({ service }) => (
                <li
                  key={`${service.vehicle_id}-${service.service_type_id}`}
                  className="rounded-lg border bg-card"
                >
                  <Link
                    href={`/autos/${service.vehicle_id}`}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {service.plate} · {service.service_type_name}
                      </p>
                      <p className="text-muted-foreground">
                        {detail(service, status)}
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
