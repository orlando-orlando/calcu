// =============================
// FORMATOS NUMÉRICOS GLOBALES
// =============================

export function formatNumber(valor, decimales = 0) {
  if (valor === null || valor === undefined || isNaN(valor)) return "—";

  return Number(valor).toLocaleString("en-US", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

export function formatBTU(valor) {
  if (!valor || valor <= 0) return "—";
  return `${formatNumber(valor, 0)} BTU/h`;
}

export function formatM3(valor) {
  return valor > 0 ? `${formatNumber(valor, 1)} m³` : "—";
}

export function formatM2(valor) {
  return valor > 0 ? `${formatNumber(valor, 1)} m²` : "—";
}

export function formatMetro(valor) {
  return valor > 0 ? `${formatNumber(valor, 2)} m` : "—";
}

export function formatGPM(valor) {
  if (valor == null || isNaN(valor) || valor <= 0) return "—";

  return `${valor.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} gpm`;
}