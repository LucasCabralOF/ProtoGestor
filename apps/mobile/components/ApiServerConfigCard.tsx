import { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";

type ApiServerConfigCardProps = {
  initialUrl: string;
  onSaveUrl: (url: string) => Promise<void>;
};

export function ApiServerConfigCard({
  initialUrl,
  onSaveUrl,
}: ApiServerConfigCardProps) {
  const [urlInput, setUrlInput] = useState(initialUrl);

  const handleSave = async () => {
    try {
      await onSaveUrl(urlInput);
      Alert.alert("Sucesso", "URL da API atualizada.");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a URL.");
    }
  };

  return (
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

      <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSave}>
        <Text style={styles.saveUrlBtnText}>Salvar Endereço da API</Text>
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
  quickUrlsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  quickUrlBtn: {
    flex: 1,
    backgroundColor: "#07100b",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a3325",
  },
  quickUrlText: {
    color: "#86a894",
    fontSize: 11,
  },
  saveUrlBtn: {
    backgroundColor: "#15803d",
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
