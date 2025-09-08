import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type FiltersState = {
  startDate?: string;
  endDate?: string;
  eventoName?: string;  // <-- reemplazado country por eventoName
  platform?: string;
};

export function Filters({
  value,
  onChange,
  onApply,
  onClear,
  sample,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  onApply: () => void;
  onClear: () => void;
  sample?: { events: string[]; platforms: string[] }; // <-- ahora sample.events
}) {
  const events = useMemo(() => Array.from(new Set(sample?.events ?? [])).filter(Boolean), [sample]);
  const platforms = useMemo(() => Array.from(new Set(sample?.platforms ?? [])).filter(Boolean), [sample]);

  return (
    <Card>
      <CardContent className="grid gap-4 md:grid-cols-5 p-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="start">Desde</label>
          <Input
            id="start"
            type="date"
            value={value.startDate ?? ""}
            onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="end">Hasta</label>
          <Input
            id="end"
            type="date"
            value={value.endDate ?? ""}
            onChange={(e) => onChange({ ...value, endDate: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="eventoName">Evento</label>
          <Input
            id="eventoName"
            list="eventos"
            placeholder="Todos"
            value={value.eventoName ?? ""}
            onChange={(e) => onChange({ ...value, eventoName: e.target.value })}
          />
          <datalist id="eventos">
            {events.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="platform">Plataforma</label>
          <Input
            id="platform"
            list="platforms"
            placeholder="Todas"
            value={value.platform ?? ""}
            onChange={(e) => onChange({ ...value, platform: e.target.value })}
          />
          <datalist id="platforms">
            {platforms.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={onApply} className="w-full">Aplicar</Button>
          <Button onClick={onClear} variant="outline" className="w-full">Limpiar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
