export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string | Date | null, withTime = false) {
  if (!value) return "—";

  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(date);
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{0,2})/, "($1")
      .replace(/^(\(\d{2})(\d)/, "$1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskDocument(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatWhatsappUrl(phone: string | null, message: string) {
  const normalizedPhone = onlyDigits(phone ?? "");
  const countryPhone =
    normalizedPhone.length === 11 ? `55${normalizedPhone}` : normalizedPhone;
  return `https://wa.me/${countryPhone}?text=${encodeURIComponent(message)}`;
}
