import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
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

  const [email, setEmail] = useState("demo@local.dev");
  const [password, setPassword] = useState("Demo@1234");
  const [urlInput, setUrlInput] = useState(apiBaseUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Informe email e senha.");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha na autenticação.";
      Alert.alert("Erro de Login", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUrl = async () => {
    try {
      await changeApiBaseUrl(urlInput);
      Alert.alert("Sucesso", "URL da API atualizada.");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a URL.");
    }
  };

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
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Conectar com a Conta</Text>
          <Text style={styles.formHint}>
            Acesse com seu usuário cadastrado no painel web.
          </Text>

          <Text style={styles.inputLabel}>E-mail:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seu.email@empresa.com"
            placeholderTextColor="#64748b"
          />

          <Text style={styles.inputLabel}>Senha:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Sua senha"
            placeholderTextColor="#64748b"
          />

          <TouchableOpacity
            disabled={isSubmitting}
            style={[styles.loginBtn, isSubmitting && styles.btnDisabled]}
            onPress={handleLogin}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginBtnText}>Entrar no App</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Servidor da API</Text>
        <Text style={styles.formHint}>
          Altere a URL caso esteja usando emulador ou dispositivo físico.
        </Text>

        <TextInput
          style={styles.input}
          value={urlInput}
          onChangeText={setUrlInput}
          autoCapitalize="none"
          placeholder="http://localhost:3001"
          placeholderTextColor="#64748b"
        />

        <View style={styles.quickUrlsRow}>
          <TouchableOpacity
            style={styles.quickUrlBtn}
            onPress={() => setUrlInput("http://localhost:3001")}
          >
            <Text style={styles.quickUrlText}>Localhost:3001</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickUrlBtn}
            onPress={() => setUrlInput("http://10.0.2.2:3001")}
          >
            <Text style={styles.quickUrlText}>Android 10.0.2.2</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveUrl}>
          <Text style={styles.saveUrlBtnText}>Salvar Endereço da API</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
    color: "#94a3b8",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  formHint: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 14,
  },
  userBox: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userEmail: {
    fontSize: 13,
    color: "#94a3b8",
  },
  orgBox: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  orgLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2,
  },
  orgName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#38bdf8",
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
    color: "#94a3b8",
    marginBottom: 8,
  },
  orgSelectBtn: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#0f172a",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  orgSelectBtnActive: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
  },
  orgSelectText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  orgSelectTextActive: {
    color: "#38bdf8",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  loginBtn: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  quickUrlsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  quickUrlBtn: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  quickUrlText: {
    color: "#94a3b8",
    fontSize: 11,
  },
  saveUrlBtn: {
    backgroundColor: "#334155",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveUrlBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
});
