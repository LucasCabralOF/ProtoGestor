import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";

type MobileLoginFormCardProps = {
  onLogin: (email: string, pass: string) => Promise<void>;
};

export function MobileLoginFormCard({ onLogin }: MobileLoginFormCardProps) {
  const [email, setEmail] = useState("demo@local.dev");
  const [password, setPassword] = useState("Demo@1234");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Informe email e senha.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha na autenticação.";
      Alert.alert("Erro de Login", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        placeholderTextColor="#86a894"
      />

      <Text style={styles.inputLabel}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Sua senha"
        placeholderTextColor="#86a894"
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
  );
}

const styles = StyleSheet.create({
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
  formHint: {
    fontSize: 12,
    color: "#86a894",
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#86a894",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#07100b",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#1a3325",
    marginBottom: 14,
  },
  loginBtn: {
    backgroundColor: "#15803d",
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
});
