import type { ServiceOrderStatus } from "@protogestor/shared";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import type { MobileServiceOrder } from "@/src/lib/api";

type OrderCardProps = {
  order: MobileServiceOrder;
  isLoading: boolean;
  onStatusChange: (
    orderId: string,
    newStatus: ServiceOrderStatus,
  ) => Promise<void>;
};

export function OrderCard({
  order,
  isLoading,
  onStatusChange,
}: OrderCardProps) {
  const getStatusBadge = (status: ServiceOrderStatus) => {
    switch (status) {
      case "completed":
        return { bg: "#052e16", text: "#86efac", label: "Concluída" };
      case "in_progress":
        return { bg: "#15803d", text: "#f0fdf4", label: "Em Andamento" };
      case "scheduled":
        return { bg: "#166534", text: "#dcfce7", label: "Agendada" };
      case "canceled":
        return { bg: "#7f1d1d", text: "#fee2e2", label: "Cancelada" };
      default:
        return { bg: "#1a3325", text: "#86a894", label: "Rascunho" };
    }
  };

  const badge = getStatusBadge(order.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{order.code}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <Text style={styles.orderTitle}>{order.title}</Text>
      <Text style={styles.clientLabel}>
        Cliente: <Text style={styles.clientName}>{order.clientName}</Text>
      </Text>

      {order.items && order.items.length > 0 ? (
        <View style={styles.itemsBox}>
          <Text style={styles.itemsHeader}>Serviços / Itens:</Text>
          {order.items.map((item, idx) => (
            <Text key={`${order.id}-item-${idx}`} style={styles.itemText}>
              • {item}
            </Text>
          ))}
        </View>
      ) : null}

      {order.notes ? (
        <Text style={styles.notesText}>Obs: {order.notes}</Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.valueText}>Valor: {order.valueFormatted}</Text>

        <View style={styles.actionsRow}>
          {order.status === "scheduled" && (
            <TouchableOpacity
              disabled={isLoading}
              style={[styles.actionBtn, styles.btnStart]}
              onPress={() => onStatusChange(order.id, "in_progress")}
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
              onPress={() => onStatusChange(order.id, "completed")}
            >
              <Text style={styles.actionBtnText}>
                {isLoading ? "Finalizando..." : "Concluir Atendimento"}
              </Text>
            </TouchableOpacity>
          )}

          {order.status === "completed" && (
            <View style={styles.completedIndicator}>
              <Text style={styles.completedText}>✓ Serviço Finalizado</Text>
            </View>
          )}
        </View>
      </View>
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
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  codeBadge: {
    backgroundColor: "#07100b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  codeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#22c55e",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  clientLabel: {
    fontSize: 13,
    color: "#86a894",
    marginBottom: 12,
  },
  clientName: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  itemsBox: {
    backgroundColor: "#07100b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#86a894",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 13,
    color: "#cbd5e1",
    lineHeight: 18,
  },
  notesText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#fbbf24",
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1a3325",
    paddingTop: 12,
    marginTop: 4,
    backgroundColor: "transparent",
  },
  valueText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#22c55e",
  },
  actionsRow: {
    backgroundColor: "transparent",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnStart: {
    backgroundColor: "#15803d",
  },
  btnComplete: {
    backgroundColor: "#16a34a",
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  completedIndicator: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  completedText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "600",
  },
});
