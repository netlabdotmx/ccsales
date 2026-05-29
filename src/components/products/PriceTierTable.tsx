import type { PriceTier } from "@/types";

interface Props {
  tiers: PriceTier[];
  listPrice: number;
  selectedQty?: number;
}

export default function PriceTierTable({ tiers, listPrice, selectedQty = 1 }: Props) {
  if (tiers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 p-4">
        <p className="text-sm text-slate-500">
          Precio de lista:{" "}
          <span className="font-bold text-brand-navy">
            ${listPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <div className="bg-brand-navy px-4 py-2.5">
        <p className="text-xs font-semibold text-white uppercase tracking-widest">
          Precios por volumen
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Cantidad</th>
            <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Precio c/u</th>
            <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Ahorro</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => {
            const isActive = selectedQty >= tier.minQty &&
              (tier.maxQty === null || selectedQty <= tier.maxQty);
            const saving = listPrice > 0
              ? Math.round((1 - tier.price / listPrice) * 100)
              : 0;

            return (
              <tr
                key={tier.id}
                className={`border-b border-slate-50 transition-colors ${
                  isActive ? "bg-brand-green/8" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    )}
                    <span className={`font-medium ${isActive ? "text-brand-navy" : "text-slate-600"}`}>
                      {tier.label}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${isActive ? "text-brand-navy text-base" : "text-slate-700"}`}>
                    ${tier.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {saving > 0 ? (
                    <span className="text-brand-green font-semibold text-xs bg-brand-green/10 px-2 py-0.5 rounded-full">
                      -{saving}%
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
