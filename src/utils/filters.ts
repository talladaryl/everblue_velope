export function buildCssFilter(filters: any = {}) {
  const brightness = filters.brightness ?? 100;
  const contrast = filters.contrast ?? 100;
  const saturation = filters.saturation ?? 100;
  const blur = filters.blur ?? 0;
  const grayscale = filters.grayscale ?? 0;

  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%)`;
}
