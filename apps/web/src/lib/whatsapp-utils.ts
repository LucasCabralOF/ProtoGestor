export type AddressInput = {
  city?: string | null;
  line1: string;
  line2?: string | null;
  postalCode?: string | null;
  state?: string | null;
};

export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replaceAll(/\D/g, "");
  if (!digits) return "";

  // Se já tiver DDI brasileiro (ex: 5511999998888)
  if (digits.length >= 12 && digits.startsWith("55")) {
    return digits;
  }

  // Se for celular ou fixo com DDD brasileiro (10 ou 11 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function buildWhatsAppUrl(
  phone: string | null | undefined,
  message?: string,
): string | null {
  const sanitized = sanitizePhone(phone);
  if (!sanitized) return null;

  const baseUrl = `https://wa.me/${sanitized}`;
  if (message?.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }

  return baseUrl;
}

export function buildAppointmentWhatsAppMessage({
  customerName,
  orgName,
  serviceTitle,
  scheduledDate,
}: {
  customerName: string;
  orgName: string;
  scheduledDate?: string;
  serviceTitle?: string;
}): string {
  let text = `Olá, ${customerName}! Aqui é da ${orgName}.`;
  if (serviceTitle) {
    text += ` Referente ao serviço "${serviceTitle}".`;
  }
  if (scheduledDate) {
    text += ` Confirmamos nosso atendimento agendado para ${scheduledDate}.`;
  } else {
    text += " Gostaríamos de confirmar o agendamento do seu atendimento.";
  }
  return text;
}

export function formatFullAddress(address?: AddressInput | null): string {
  if (!address || !address.line1) return "";
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  if (address.city) {
    parts.push(
      address.state ? `${address.city} - ${address.state}` : address.city,
    );
  }
  if (address.postalCode) parts.push(`CEP: ${address.postalCode}`);
  return parts.join(", ");
}

export function buildGoogleMapsUrl(
  address?: AddressInput | null,
): string | null {
  const full = formatFullAddress(address);
  if (!full) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
}

export function buildWazeUrl(address?: AddressInput | null): string | null {
  const full = formatFullAddress(address);
  if (!full) return null;
  return `https://waze.com/ul?q=${encodeURIComponent(full)}&navigate=yes`;
}
