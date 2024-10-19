export function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseInt(value) : value;
  if (isNaN(num)) return value as string;

  let result: string;
  let unit: string;
  if (num >= 1024 * 1024) {
    result = (num / (1024 * 1024)).toFixed(2);
    unit = "M";
  } else if (num >= 1024) {
    result = (num / 1024).toFixed(2);
    unit = "K";
  } else {
    return num.toString();
  }

  // 去掉尾部的零和不必要的小数点
  return result.replace(/\.?0+$/, "") + unit;
}

export function formatTokens(value: number): string {
  const num = value;

  if (num >= 0.001) {
    return num.toFixed(3).replace(/\.?0+$/, "") + "/M";
  } else if (num >= 0.00001) {
    return (num * 1000).toFixed(3).replace(/\.?0+$/, "") + "/K";
  } else {
    return num.toString();
  }
}
