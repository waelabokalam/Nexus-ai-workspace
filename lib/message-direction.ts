const RTL_CHARACTER = /[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function messageDirection(content: string): "rtl" | "auto" {
  return RTL_CHARACTER.test(content) ? "rtl" : "auto";
}
