import {
  type AppointmentStatus,
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatFullAddress,
} from "@protogestor/shared";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";

type VisitItem = {
  id: string;
  time: string;
  clientName: string;
  serviceTitle: string;
  status: AppointmentStatus;
  phone: string;
  address: {
    line1: string;
    city: string;
    state: string;
  };
};

const TODAY_VISITS: VisitItem[] = [
  {
    id: "apt-1",
    time: "08:30",
    clientName: "Condomínio Horizonte",
    serviceTitle: "Manutenção Preventiva das Bombas",
    status: "scheduled",
    phone: "11999998888",
    address: {
      line1: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
    },
  },
  {
    id: "apt-2",
    time: "11:00",
    clientName: "Clínica Central",
    serviceTitle: "Revisão Técnica de Equipamentos",
    status: "scheduled",
    phone: "11988887777",
    address: {
      line1: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
    },
  },
  {
    id: "apt-3",
    time: "14:30",
    clientName: "Edifício Solaris",
    serviceTitle: "Instalação e Teste Operacional",
    status: "done",
    phone: "11977776666",
    address: {
      line1: "Alameda Santos, 200",
      city: "São Paulo",
      state: "SP",
    },
  },
];

export default function TabAgendaScreen() {
  const handleOpenMaps = (address: VisitItem["address"]) => {
    const url = buildGoogleMapsUrl(address);
    if (url) Linking.openURL(url);
  };

  const handleOpenWaze = (address: VisitItem["address"]) => {
    const url = buildWazeUrl(address);
    if (url) Linking.openURL(url);
  };

  const handleOpenWhatsApp = (phone: string, client: string) => {
    const url = buildWhatsAppUrl(
      phone,
      `Olá, ${client}! Sou o técnico da equipe e estou a caminho do seu atendimento.`,
    );
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda do Técnico</Text>
        <Text style={styles.headerSubtitle}>
          {TODAY_VISITS.length} visitas programadas para hoje
        </Text>
      </View>

      <View style={styles.list}>
        {TODAY_VISITS.map((visit) => {
          const isDone = visit.status === "done";
          return (
            <View
              key={visit.id}
              style={[styles.card, isDone && styles.cardDone]}
            >
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
                    onPress={() => handleOpenMaps(visit.address)}
                  >
                    <Text style={styles.btnText}>Maps</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnWaze]}
                    onPress={() => handleOpenWaze(visit.address)}
                  >
                    <Text style={styles.btnText}>Waze</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnWhatsApp]}
                    onPress={() =>
                      handleOpenWhatsApp(visit.phone, visit.clientName)
                    }
                  >
                    <Text style={styles.btnText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  list: {
    gap: 16,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardDone: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  timeBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: "#0369a1",
  },
  statusDone: {
    backgroundColor: "#059669",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusPendingText: {
    color: "#e0f2fe",
  },
  statusDoneText: {
    color: "#d1fae5",
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 14,
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
    backgroundColor: "#475569",
  },
  btnWaze: {
    backgroundColor: "#0284c7",
  },
  btnWhatsApp: {
    backgroundColor: "#16a34a",
  },
  btnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
