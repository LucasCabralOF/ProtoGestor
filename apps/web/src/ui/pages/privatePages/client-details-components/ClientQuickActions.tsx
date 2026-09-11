"use client";

import {
  FiCopy,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiNavigation,
  FiPhone,
} from "react-icons/fi";
import type { ClientDetailsData } from "@/lib/client-details-utils";
import {
  buildAppointmentWhatsAppMessage,
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatFullAddress,
} from "@/lib/whatsapp-utils";
import { Card } from "@/ui/base/Card";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type ClientQuickActionsProps = {
  client: ClientDetailsData;
  orgName?: string;
};

export function ClientQuickActions({
  client,
  orgName = "Nossa Empresa",
}: ClientQuickActionsProps) {
  const { notifySuccess } = useAppFeedback();

  const formattedAddress = formatFullAddress(client.primaryAddress);
  const mapsUrl = buildGoogleMapsUrl(client.primaryAddress);
  const wazeUrl = buildWazeUrl(client.primaryAddress);

  const defaultMessage = buildAppointmentWhatsAppMessage({
    customerName: client.name,
    orgName,
  });

  const whatsappUrl = buildWhatsAppUrl(
    client.whatsapp || client.phone,
    defaultMessage,
  );

  const handleCopyAddress = () => {
    if (!formattedAddress) return;
    void navigator.clipboard.writeText(formattedAddress);
    notifySuccess("Endereço copiado para a área de transferência!");
  };

  return (
    <Card className="border border-(--color-border) bg-(--color-base-1)">
      <h2 className="text-base font-bold text-(--color-text)">
        Ações Rápidas & Contato
      </h2>
      <p className="mt-0.5 text-xs text-(--color-text-2)">
        Comunicação direta e rotas de deslocamento para atendimento em campo.
      </p>

      {/* Botões de Ação Imediata */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* WhatsApp */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-500 hover:shadow-md"
            data-testid="button-whatsapp-client"
          >
            <FiMessageCircle className="h-4 w-4" />
            <span>Chamar no WhatsApp</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-xl bg-(--color-base-2) px-4 py-2.5 text-xs font-semibold text-(--color-text-2) opacity-60"
          >
            <FiMessageCircle className="h-4 w-4" />
            <span>Sem WhatsApp</span>
          </button>
        )}

        {/* Google Maps */}
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-110 hover:shadow-md"
            data-testid="button-maps-client"
          >
            <FiMapPin className="h-4 w-4" />
            <span>Abrir no Google Maps</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-xl bg-(--color-base-2) px-4 py-2.5 text-xs font-semibold text-(--color-text-2) opacity-60"
          >
            <FiMapPin className="h-4 w-4" />
            <span>Sem Endereço</span>
          </button>
        )}

        {/* Waze */}
        {wazeUrl ? (
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-teal-500 hover:shadow-md"
            data-testid="button-waze-client"
          >
            <FiNavigation className="h-4 w-4" />
            <span>Navegar via Waze</span>
          </a>
        ) : null}

        {/* Telefone / Ligar */}
        {client.phone ? (
          <a
            href={`tel:${client.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-base-2) px-4 py-2.5 text-xs font-semibold text-(--color-text) transition-all hover:bg-(--color-base-3)"
            data-testid="button-call-client"
          >
            <FiPhone className="h-4 w-4 text-emerald-500" />
            <span>Ligar ({client.phone})</span>
          </a>
        ) : null}

        {/* Email */}
        {client.email ? (
          <a
            href={`mailto:${client.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-base-2) px-4 py-2.5 text-xs font-semibold text-(--color-text) transition-all hover:bg-(--color-base-3)"
            data-testid="button-email-client"
          >
            <FiMail className="h-4 w-4 text-(--color-primary)" />
            <span>Enviar E-mail</span>
          </a>
        ) : null}
      </div>

      {/* Bloco de Endereço Detalhado */}
      <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FiMapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--color-text)">
                Endereço Principal de Atendimento
              </p>
              <p className="mt-0.5 text-xs text-(--color-text-2)">
                {formattedAddress ||
                  "Nenhum endereço cadastrado para este cliente."}
              </p>
            </div>
          </div>

          {formattedAddress && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1 text-xs font-medium text-(--color-primary) hover:underline"
              >
                <FiCopy className="h-3 w-3" />
                Copiar
              </button>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-(--color-primary) hover:underline"
                >
                  <FiExternalLink className="h-3 w-3" />
                  Abrir
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Observações Operacionais */}
      {client.notes && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-(--color-text)">
          <p className="font-semibold text-amber-600">
            Observações Operacionais:
          </p>
          <p className="mt-1 text-(--color-text-2) whitespace-pre-wrap">
            {client.notes}
          </p>
        </div>
      )}
    </Card>
  );
}
