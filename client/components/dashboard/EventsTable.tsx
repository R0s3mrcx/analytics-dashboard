import { useState } from "react";
import type { EventItem } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export function EventsTable({ items }: { items: EventItem[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <Th>userName</Th>
                <Th>userEmail</Th>
                <Th>eventoName</Th>
                <Th>userId</Th>
                <Th>Detalles</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((e, idx) => {
                const key = String(e.id ?? idx);
                const isOpen = expanded[key];
                return (
                  <>
                    <tr key={key} className="border-b">
                      <Td>{e.userName}</Td>
                      <Td>{e.userEmail}</Td>
                      <Td>{e.eventoName}</Td>
                      <Td className="font-mono text-xs">{String(e.userId)}</Td>
                      <Td>
                        <button
                          className="text-primary hover:underline"
                          onClick={() => setExpanded((s) => ({ ...s, [key]: !s[key] }))}
                          aria-expanded={isOpen}
                        >
                          {isOpen ? "Ocultar" : "Ver"}
                        </button>
                      </Td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-muted/30" key={`${key}-details`}>
                        <td colSpan={5} className="p-4">
                          <div className="grid gap-3 md:grid-cols-4 text-xs">
                            <Detail label="country" value={e.country} />
                            <Detail label="platform" value={e.platform} />
                            <Detail label="productName" value={e.productName} />
                            <Detail label="productQty" value={e.productQty} />
                            <Detail label="serviceName" value={e.serviceName} />
                            <Detail label="storeName" value={e.storeName} />
                            <Detail label="typeStore" value={e.typeStore} />
                            <Detail label="walkerName" value={e.walkerName} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium break-words">{value ?? "—"}</div>
    </div>
  );
}
