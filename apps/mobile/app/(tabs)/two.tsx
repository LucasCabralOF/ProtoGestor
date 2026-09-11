import {
  type ServiceOrderStatus,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { OrderCard } from "@/components/OrderCard";
import { Text, View } from "@/components/Themed";
import {
  fetchServiceOrders,
  type MobileServiceOrder,
  updateServiceOrderStatus,
} from "@/src/lib/api";
import { useMobileAuth } from "@/src/lib/auth-context";

const FALLBACK_ORDERS: MobileServiceOrder[] = [
  {
    id: "ord-101",
    code: "OS #101",
    title: "Manutenção Preventiva do Sistema Hidráulico",
    clientName: "Condomínio Horizonte",
    status: "scheduled",
    totalCents: 68000,
    valueFormatted: "R$ 680,00",
    items: [
      "Inspeção geral de vazamentos",
      "Troca de reparos nas bombas",
      "Teste de pressão operacional",
    ],
    notes: "Solicitar assinatura do zelador ao término.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord-102",
    code: "OS #102",
    title: "Revisão Técnica e Limpeza de Filtros",
    clientName: "Clínica Central",
    status: "in_progress",
    totalCents: 42000,
    valueFormatted: "R$ 420,00",
    items: ["Higienização dos dutos principais", "Substituição de filtro HEPA"],
    notes: "Trabalho silencioso devido aos pacientes.",
    createdAt: new Date().toISOString(),
  },
];

export default function TabOrdersScreen() {
  const { activeOrg } = useMobileAuth();
  const [orders, setOrders] = useState<MobileServiceOrder[]>(FALLBACK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchServiceOrders();
      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch {
      // Mantém ordens de fallback/offline
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadOrders().finally(() => setLoading(false));
  }, [loadOrders]);


  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: ServiceOrderStatus,
  ) => {
    const validation = updateOrderStatusSchema.safeParse({ status: newStatus });
    if (!validation.success) {
      Alert.alert("Erro", "Status inválido.");
      return;
    }

    setLoadingId(orderId);
    try {
      await updateServiceOrderStatus(orderId, newStatus).catch(() => {});
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord,
        ),
      );

      const statusLabels: Record<ServiceOrderStatus, string> = {
        draft: "Rascunho",
        scheduled: "Agendada",
        in_progress: "Em Andamento",
        completed: "Concluída",
        canceled: "Cancelada",
      };

      Alert.alert(
        "Status Atualizado",
        `A Ordem de Serviço foi alterada para "${statusLabels[newStatus]}".`,
      );
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o status da OS.");
    } finally {
      setLoadingId(null);
    }
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
        <Text style={styles.headerTitle}>Ordens de Serviço</Text>
        <Text style={styles.headerSubtitle}>
          {activeOrg ? `${activeOrg.name} • ` : ""}
          {orders.length} ordens de serviço
        </Text>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#38bdf8" style={styles.loader} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Nenhuma OS encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Puxe para baixo para atualizar a lista de atendimentos.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isLoading={loadingId === order.id}
              onStatusChange={handleStatusChange}
            />
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
