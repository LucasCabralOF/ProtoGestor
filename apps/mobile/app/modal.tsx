import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ApiServerConfigCard } from "@/components/ApiServerConfigCard";
import { MobileLoginFormCard } from "@/components/MobileLoginFormCard";
import { Text, View } from "@/components/Themed";
import { useMobileAuth } from "@/src/lib/auth-context";

export default function ModalProfileScreen() {
  const {
    user,
    activeOrg,
    organizations,
    isAuthenticated,
    apiBaseUrl,
    login,
    logout,
    selectOrg,
    changeApiBaseUrl,
  } = useMobileAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil & Conexão</Text>
        <Text style={styles.headerSubtitle}>
          Configurações de acesso e sincronização da equipe
        </Text>
      </View>

      {isAuthenticated && user ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Técnico Conectado</Text>
          <View style={styles.userBox}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {activeOrg ? (
            <View style={styles.orgBox}>
              <Text style={styles.orgLabel}>Empresa Ativa:</Text>
              <Text style={styles.orgName}>{activeOrg.name}</Text>
              <Text style={styles.orgRole}>Papel: {activeOrg.role}</Text>
            </View>
          ) : null}

          {organizations.length > 1 ? (
            <View style={styles.multiOrgBox}>
              <Text style={styles.multiOrgTitle}>Alternar Empresa:</Text>
              {organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  style={[
                    styles.orgSelectBtn,
                    org.id === activeOrg?.id && styles.orgSelectBtnActive,
                  ]}
                  onPress={() => selectOrg(org.id)}
                >
                  <Text
                    style={[
                      styles.orgSelectText,
                      org.id === activeOrg?.id && styles.orgSelectTextActive,
                    ]}
                  >
                    {org.name} ({org.role})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Desconectar Conta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MobileLoginFormCard onLogin={login} />
      )}

      <ApiServerConfigCard
        initialUrl={apiBaseUrl}
        onSaveUrl={changeApiBaseUrl}
      />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07100b",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#86a894",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#112219",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a3325",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  userBox: {
    backgroundColor: "#07100b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userEmail: {
    fontSize: 13,
    color: "#86a894",
  },
  orgBox: {
    backgroundColor: "#07100b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  orgLabel: {
    fontSize: 11,
    color: "#86a894",
    marginBottom: 2,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#22c55e",
  },
  orgRole: {
    fontSize: 12,
    color: "#cbd5e1",
    marginTop: 2,
  },
  multiOrgBox: {
    marginBottom: 14,
    backgroundColor: "transparent",
  },
  multiOrgTitle: {
    fontSize: 12,
    color: "#86a894",
    marginBottom: 8,
  },
  orgSelectBtn: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#07100b",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  orgSelectBtnActive: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  orgSelectText: {
    color: "#86a894",
    fontSize: 13,
  },
  orgSelectTextActive: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
