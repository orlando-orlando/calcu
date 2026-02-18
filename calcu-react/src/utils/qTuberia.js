export function qTuberia(resumenTramosR = {}, resumenDisparosR = {}, datos, mesMasFrio) {
  // Combinar los resúmenes de tramos y disparos
  const resumenMateriales = { ...(resumenTramosR || {}) };

  for (const [diam, info] of Object.entries(resumenDisparosR || {})) {
    if (!resumenMateriales[diam]) {
      resumenMateriales[diam] = { ...info };
    } else {
      resumenMateriales[diam].tuberia_m   += info.tuberia_m   || 0;
      resumenMateriales[diam].tees        += info.tees        || 0;
      resumenMateriales[diam].codos       += info.codos       || 0;
      resumenMateriales[diam].reducciones += info.reducciones || 0;
    }
  }

  // Sin materiales o sin datos climáticos → retornar vacío
  if (Object.keys(resumenMateriales).length === 0) {
    return { porDiametro: {}, total_BTU_h: 0 };
  }

  if (!mesMasFrio?.tProm) return { porDiametro: {}, total_BTU_h: 0 };

  // Constantes
  const INCH_TO_M      = 0.0254;
  const KCALH_TO_BTUH  = 3.96832;
  const k_kcal_m_h_C   = 0.22;

  const T2     = mesMasFrio.tProm;
  const T1     = parseFloat(datos.tempDeseada) || 0;
  const deltaT = T1 - T2;

  const pvcSch40 = {
    "tuberia 1.50":  { OD_m: 1.90  * INCH_TO_M, ID_m: 1.61  * INCH_TO_M },
    "tuberia 2.00":  { OD_m: 2.37  * INCH_TO_M, ID_m: 2.07  * INCH_TO_M },
    "tuberia 2.50":  { OD_m: 2.87  * INCH_TO_M, ID_m: 2.47  * INCH_TO_M },
    "tuberia 3.00":  { OD_m: 3.50  * INCH_TO_M, ID_m: 3.07  * INCH_TO_M },
    "tuberia 4.00":  { OD_m: 4.50  * INCH_TO_M, ID_m: 4.03  * INCH_TO_M },
    "tuberia 6.00":  { OD_m: 6.62  * INCH_TO_M, ID_m: 6.07  * INCH_TO_M },
    "tuberia 8.00":  { OD_m: 8.62  * INCH_TO_M, ID_m: 7.98  * INCH_TO_M },
    "tuberia 10.00": { OD_m: 10.75 * INCH_TO_M, ID_m: 9.98  * INCH_TO_M },
    "tuberia 12.00": { OD_m: 12.75 * INCH_TO_M, ID_m: 11.89 * INCH_TO_M },
    "tuberia 14.00": { OD_m: 14.00 * INCH_TO_M, ID_m: 13.13 * INCH_TO_M },
    "tuberia 16.00": { OD_m: 16.00 * INCH_TO_M, ID_m: 14.94 * INCH_TO_M },
    "tuberia 18.00": { OD_m: 18.00 * INCH_TO_M, ID_m: 16.81 * INCH_TO_M }
  };

  const qTub = { porDiametro: {}, total_BTU_h: 0 };

  for (const [diamNom, info] of Object.entries(resumenMateriales)) {
    const length_m = info && typeof info.tuberia_m === "number" ? info.tuberia_m : 0;

    if (length_m <= 0) {
      qTub.porDiametro[diamNom] = { length_m, Q_BTU_h: 0, note: "longitud 0" };
      continue;
    }

    const entry = pvcSch40[diamNom];
    if (!entry) {
      qTub.porDiametro[diamNom] = { length_m, Q_BTU_h: 0, note: "diámetro no en tabla" };
      continue;
    }

    const r1 = entry.ID_m / 2;
    const r2 = entry.OD_m / 2;

    const Q_kcal_h =
      (2 * Math.PI * k_kcal_m_h_C * length_m * deltaT) / Math.log(r2 / r1);
    const Q_BTU_h = Q_kcal_h * KCALH_TO_BTUH;

    qTub.porDiametro[diamNom] = {
      length_m,
      Q_BTU_h: Number(Q_BTU_h.toFixed(2))
    };

    qTub.total_BTU_h += Q_BTU_h;
  }

  qTub.total_BTU_h = Number(qTub.total_BTU_h.toFixed(2));

  return qTub;
}