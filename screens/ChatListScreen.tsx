import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { ref, get } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";
import { format } from "date-fns";

import { Text, View } from "../components/Themed";
import { database } from "../constants/firebase";

import { Button } from "react-native-paper";
import { useEffect, useState } from "react";

import { useAuthentication } from "../hooks/useAuthentication";
import { Chats } from "../types/Chat";
import { Dog, Dogs } from "../types/Dog";
import { RootStackScreenProps } from "../types";

export const ChatListScreen = ({
  navigation,
}: RootStackScreenProps<"ChatListScreen">) => {
  const { user } = useAuthentication();
  const [dogs, setDogs] = useState<Dogs>();
  const dbRef = ref(database, `users/${user?.uid ?? "*"}/Chats`);
  const chats = useDatabaseValue<Chats>(["Chats", user?.uid], dbRef, {
    subscribe: true,
  });

  const getDogs = async () => {
    if (!chats?.data) return {};

    const dogs = Object.values(chats.data).map(async (chat) => {
      const dogRef = ref(
        database,
        `/users/${chat.otherUserId}/Psy/${chat.otherDogId}`
      );
      return { [chat.otherDogId]: (await get(dogRef)).val() };
    });

    const resolvedDogs = await Promise.all(dogs);
    return resolvedDogs.reduce((acc, dog) => ({ ...acc, ...dog }), {});
  };

  useEffect(() => {
    (async () => {
      const dogs = await getDogs();
      setDogs(dogs);
    })();
  }, [chats.data]);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return format(dateObj, "dd.MM.yyyy HH:mm");
  };

  const renderChatCards = () => {
    if (!chats?.data) return null;

    return Object.entries(chats.data).map(([id, chat]) => {
      const dog = dogs?.[chat.otherDogId];
      if (!dog) return null;

      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChatViewScreen", {
              chatId: id,
              otherUserId: chat.otherUserId,
            })
          }
          style={styles.dogCard}
          key={id}
        >
          {/* <Text>{'data:image/png;base64,' +  dog.photo}</Text> */}
          <Image
            style={styles.dogImage}
            source={{ uri: "data:image/png;base64," + dog.photo }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.dogName}>
              {dog.Imie}, {dog.Rasa} {dog.Wiek}m
            </Text>
            <Text style={styles.lastMessage}>{chat.lastMessage.text}</Text>
            <Text style={styles.timeSend}>
              {formatDate(chat.lastMessage.date)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollable}>{renderChatCards()}</ScrollView>
      <Image
        source={require("../assets/psy/tmpspemxaxj.png")}
        style={styles.backgroundImg}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
  },
  scrollable: {
    width: "100%",
    flex: 1,
  },
  form: {
    backgroundColor: "transparent",
    width: "80%",
    padding: 10,
  },
  backgroundImg: {
    position: "absolute",
    bottom: "-10%",
    right: "0%",
    left: "20%",
    zIndex: -1,
  },
  dogImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 16,
  },
  dogCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  dogName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 16,
    color: "#000",
  },
  timeSend: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
    marginTop: -3,
  },
  dogVoivodeship: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
    marginTop: -3,
  },
  input: {
    width: "100%",
    margin: 3,
  },
  firstButton: {
    margin: 3,
    marginTop: 12,
  },
  error: {
    color: "red",
  },
  button: {
    margin: 3,
  },
  logo: {
    margin: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
    marginBottom: 12,
  },
});
