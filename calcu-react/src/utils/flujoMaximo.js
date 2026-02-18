export function flujoMaximo(
  flujoVol      = 0,
  flujoInf      = 0,
  // flujoBombaCalor = 0,
  // flujoPanel      = 0,
  // flujoCaldera    = 0,
  // flujoGenerador  = 0,
) {
  return Math.max(
    flujoVol,
    flujoInf,
    // flujoBombaCalor,
    // flujoPanel,
    // flujoCaldera,
    // flujoGenerador,
  );
}