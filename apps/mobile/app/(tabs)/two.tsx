import {
  type ServiceOrderStatus,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { updateServiceOrderStatus } from "@/src/lib/api";

type ServiceOrderItem = {
  id: string;
  code: string;
  title: string;
  clientName: string;
  status: ServiceOrderStatus;
  valueFormatted: string;
  items: string[];
  notes?: string;
};

const INITIAL_ORDERS: ServiceOrderItem[] = [
  {
    id: "ord-101",
    code: "OS #101",
    title: "Manutenção Preventiva do Sistema Hidráulico",
    clientName: "Condomínio Horizonte",
    status: "scheduled",
    valueFormatted: "R$ 680,00",
    items: [
      "Inspeção geral de vazamentos",
      "Troca de reparos nas bombas",
      "Teste de pressão operacional",
    ],
    notes: "Solicitar assinatura do zelador ao término.",
  },
  {
    id: "ord-102",
    code: "OS #102",
    title: "Revisão Técnica e Limpeza de Filtros",
    clientName: "Clínica Central",
    status: "in_progress",
    valueFormatted: "R$ 420,00",
    items: ["Higienização dos dutos principais", "Substituição de filtro HEPA"],
    notes: "Trabalho silencioso devido aos pacientes.",
  },
  {
    id: "ord-103",
    code: "OS #103",
    title: "Instalação de Válvula Reguladora de Pressão",
    clientName: "Edifício Solaris",
    status: "completed",
    valueFormatted: "R$ 1.250,00",
    items: [
      "Desmontagem do registro antigo",
      "Instalação de válvula de bronze 2 polegadas",
      "Calibração e teste de vazão",
    ],
    notes: "Serviço finalizado com sucesso.",
  },
];

export default function TabOrdersScreen() {
  const [orders, setOrders] = useState<ServiceOrderItem[]>(INITIAL_ORDERS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    orderId: string,
    newStatus: ServiceOrderStatus,
  ) => {
    // Validação com Zod do @protogestor/shared
    const validation = updateOrderStatusSchema.safeParse({ status: newStatus });
    if (!validation.success) {
      Alert.alert("Erro", "Status inválido.");
      return;
    }

    setLoadingId(orderId);
    try {
      // Tenta atualizar no backend se disponível
      await updateServiceOrderStatus(orderId, newStatus).catch(() => {
        // Fallback local caso offline
      });

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

  const getStatusBadge = (status: ServiceOrderStatus) => {
    switch (status) {
      case "completed":
        return { bg: "#065f46", text: "#d1fae5", label: "Concluída" };
      case "in_progress":
        return { bg: "#1e40af", text: "#dbeafe", label: "Em Andamento" };
      case "scheduled":
        return { bg: "#0369a1", text: "#e0f2fe", label: "Agendada" };
      case "canceled":
        return { bg: "#7f1d1d", text: "#fee2e2", label: "Cancelada" };
      default:
        return { bg: "#334155", text: "#cbd5e1", label: "Rascunho" };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ordens de Serviço</Text>
        <Text style={styles.headerSubtitle}>
          Controle de execução e fechamento de atendimentos
        </Text>
      </View>

      <View style={styles.list}>
        {orders.map((order) => {
          const badge = getStatusBadge(order.status);
          const isLoading = loadingId === order.id;

          return (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{order.code}</Text>
                </View>

                <View
                  style={[styles.statusBadge, { backgroundColor: badge.bg }]}
                >
                  <Text style={[styles.statusText, { color: badge.text }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.orderTitle}>{order.title}</Text>
              <Text style={styles.clientLabel}>
                Cliente:{" "}
                <Text style={styles.clientName}>{order.clientName}</Text>
              </Text>

              <View style={styles.itemsBox}>
                <Text style={styles.itemsHeader}>Serviços / Itens:</Text>
                {order.items.map((item, idx) => (
                  <Text key={`${order.id}-item-${idx}`} style={styles.itemText}>
                    • {item}
                  </Text>
                ))}
              </View>

              {order.notes ? (
                <Text style={styles.notesText}>Obs: {order.notes}</Text>
              ) : null}

              <View style={styles.footerRow}>
                <Text style={styles.valueText}>
                  Valor: {order.valueFormatted}
                </Text>

                <View style={styles.actionsRow}>
                  {order.status === "scheduled" && (
                    <TouchableOpacity
                      disabled={isLoading}
                      style={[styles.actionBtn, styles.btnStart]}
                      onPress={() =>
                        handleStatusChange(order.id, "in_progress")
                      }
                    >
                      <Text style={styles.actionBtnText}>
                        {isLoading ? "Iniciando..." : "Iniciar Atendimento"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {order.status === "in_progress" && (
                    <TouchableOpacity
                      disabled={isLoading}
                      style={[styles.actionBtn, styles.btnComplete]}
                      onPress={() => handleStatusChange(order.id, "completed")}
                    >
                      <Text style={styles.actionBtnText}>
                        {isLoading ? "Finalizando..." : "Concluir Atendimento"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {order.status === "completed" && (
                    <View style={styles.completedIndicator}>
                      <Text style={styles.completedText}>
                        ✓ Serviço Finalizado
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  codeBadge: {
    backgroundColor: "#334155",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  clientLabel: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 12,
  },
  clientName: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  itemsBox: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemsHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: "#cbd5e1",
    lineHeight: 18,
  },
  notesText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#94a3b8",
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    backgroundColor: "transparent",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
  },
  actionsRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnStart: {
    backgroundColor: "#0284c7",
  },
  btnComplete: {
    backgroundColor: "#16a34a",
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  completedIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#065f46",
    borderRadius: 6,
  },
  completedText: {
    color: "#d1fae5",
    fontSize: 12,
    fontWeight: "600",
  },
});
