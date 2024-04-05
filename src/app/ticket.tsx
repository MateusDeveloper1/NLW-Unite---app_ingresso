import { Credential } from "@/components/cerdential";
import { Header } from "@/components/header";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Share,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { QRCode } from "@/components/qrcode";

import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";
import { MotiView } from "moti";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        });
      }
    } catch (error) {
      Alert.alert("Compartilhar", "Não foi possivel compartilhar ");
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });

      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Foto", "Não foi possivel selecionar a imagem");
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar style="light" />
      <Header title="Minha Credencial" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onExpandedQRCode={() => setExpandQRCode(true)}
        />

        <MotiView
          from={{
            translateY: 0,
          }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: "timing",
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do evento Unite summite!
        </Text>

        <Button title="Compartilhar" onPress={handleShare} />
        <View className="mt-10">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => badgeStore.remove()}
          >
            <Text className="text-base text-white font-bold text-center">
              Remover ingresso
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <QRCode value="teste" size={300} />
            <Text className="text-base text-orange-500 font-bold text-center mt-10">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
