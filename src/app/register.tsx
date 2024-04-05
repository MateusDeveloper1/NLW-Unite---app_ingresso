import { Input } from "@/components/input";
import { Alert, Image, View } from "react-native";

import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { api } from "@/server/api";
import axios from "axios";

import { useBadgeStore } from "@/store/badge-store";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleRegister() {
    try {
      if (!email.trim() || !name.trim()) {
        return Alert.alert("Inscrição", "Preencha todos os campos");
      }

      setIsLoading(true);

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        );

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert("Incrição", "Inscrição realizada com sucesso!", [
          { text: "OK", onPress: () => router.push("/ticket") },
        ]);
      }
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes("already registered")
        ) {
          return Alert.alert("Iscrição", "Esse email já está cadastrado");
        }
      }

      Alert.alert("Inscrição", "Não foi possivel fazer a inscrição");
    }
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar style="light" />
      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />

      <View className="w-full mt-12 gap-3">
        <Input>
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field placeholder="Nome completo" onChangeText={setName} />
        </Input>
        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>
        <Button
          title="Realizar inscrição"
          onPress={handleRegister}
          isLoading={isLoading}
        />
        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  );
}
