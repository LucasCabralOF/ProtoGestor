import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  AgendaVisitCard,
  type MobileVisitItem,
} from "@/components/AgendaVisitCard";
import { Text, View } from "@/components/Themed";
import { fetchTodaySchedule } from "@/src/lib/api";
import { useMobileAuth } from "@/src/lib/auth-context";

const FALLBACK_VISITS: MobileVisitItem[] = [
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
];

export default function TabAgendaScreen() {
  const { activeOrg } = useMobileAuth();
  const [visits, setVisits] = useState<MobileVisitItem[]>(FALLBACK_VISITS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadSchedule = useCallback(async () => {
    try {
      const data = await fetchTodaySchedule();
      if (data && Array.isArray(data.appointments)) {
        const formatted: MobileVisitItem[] = data.appointments.map((apt) => {
          const startTime = new Date(apt.startsAt);
          const timeStr = `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`;

          const customer = apt.serviceOrder?.customer;
          const address = customer?.address || {
            line1: apt.locationText || "Endereço não informado",
            city: "São Paulo",
            state: "SP",
          };

          return {
            id: apt.id,
            time: timeStr,
            clientName: customer?.name || "Cliente",
            serviceTitle: apt.serviceOrder?.title || "Visita Técnica",
            status: apt.status,
            phone: customer?.phone || "",
            address: {
              line1: address.line1,
              city: address.city || "São Paulo",
              state: address.state || "SP",
            },
          };
        });

        setVisits(formatted);
      }
    } catch {
      // Mantém fallback se offline
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadSchedule().finally(() => setLoading(false));
  }, [loadSchedule]);


  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedule();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#38bdf8"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda do Técnico</Text>
        <Text style={styles.headerSubtitle}>
          {activeOrg ? `${activeOrg.name} • ` : ""}
          {visits.length} visitas programadas para hoje
        </Text>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#38bdf8" style={styles.loader} />
      ) : visits.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Nenhuma visita para hoje</Text>
          <Text style={styles.emptySubtitle}>
            Puxe para baixo para atualizar sua agenda.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {visits.map((visit) => (
            <AgendaVisitCard key={visit.id} visit={visit} />
          ))}
        </View>
      )}
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
    backgroundColor: "transparent",
  },
  loader: {
    marginVertical: 40,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
  },
});
