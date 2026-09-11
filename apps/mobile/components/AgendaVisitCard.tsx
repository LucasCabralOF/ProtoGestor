import {
  type AppointmentStatus,
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatFullAddress,
} from "@protogestor/shared";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";

export type MobileVisitItem = {
  id: string;
  time: string;
  clientName: string;
  serviceTitle: string;
  status: AppointmentStatus;
  phone: string;
  address: {
    line1: string;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
};

type AgendaVisitCardProps = {
  visit: MobileVisitItem;
};

export function AgendaVisitCard({ visit }: AgendaVisitCardProps) {
  const isDone = visit.status === "done";

  const handleOpenMaps = () => {
    const url = buildGoogleMapsUrl(visit.address);
    if (url) Linking.openURL(url);
  };

  const handleOpenWaze = () => {
    const url = buildWazeUrl(visit.address);
    if (url) Linking.openURL(url);
  };

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppUrl(
      visit.phone,
      `Olá, ${visit.clientName}! Sou o técnico da equipe e estou a caminho do seu atendimento.`,
    );
    if (url) Linking.openURL(url);
  };

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.cardHeader}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{visit.time}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            isDone ? styles.statusDone : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isDone ? styles.statusDoneText : styles.statusPendingText,
            ]}
          >
            {isDone ? "Concluído" : "Agendado"}
          </Text>
        </View>
      </View>

      <Text style={styles.clientName}>{visit.clientName}</Text>
      <Text style={styles.serviceTitle}>{visit.serviceTitle}</Text>
      <Text style={styles.addressText}>
        📍 {formatFullAddress(visit.address)}
      </Text>

      {!isDone && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnMaps]}
            onPress={handleOpenMaps}
          >
            <Text style={styles.btnText}>Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnWaze]}
            onPress={handleOpenWaze}
          >
            <Text style={styles.btnText}>Waze</Text>
          </TouchableOpacity>

          {visit.phone ? (
            <TouchableOpacity
              style={[styles.btn, styles.btnWhatsApp]}
              onPress={handleOpenWhatsApp}
            >
              <Text style={styles.btnText}>WhatsApp</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#112219",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a3325",
    marginBottom: 14,
  },
  cardDone: {
    opacity: 0.6,
    borderColor: "#1a3325",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  timeBadge: {
    backgroundColor: "#07100b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#22c55e",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: "#166534",
  },
  statusDone: {
    backgroundColor: "#052e16",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  statusPendingText: {
    color: "#dcfce7",
  },
  statusDoneText: {
    color: "#86efac",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 14,
    color: "#86a894",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 13,
    color: "#cbd5e1",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "transparent",
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnMaps: {
    backgroundColor: "#15803d",
  },
  btnWaze: {
    backgroundColor: "#16a34a",
  },
  btnWhatsApp: {
    backgroundColor: "#22c55e",
  },
  btnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
