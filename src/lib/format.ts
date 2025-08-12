export const moneyShort = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(1)}Cr`
    : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L`
      : `₹${n.toLocaleString('en-IN')}`;

export const roas = (x: number) => `${x.toFixed(1)}×`;
export const pct = (x: number) => `${x.toFixed(1)}%`;
export const pp = (x: number) => `${x.toFixed(1)} pp`;


