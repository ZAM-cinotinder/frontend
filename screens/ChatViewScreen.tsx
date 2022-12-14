import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { ref, set } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";
import { format } from "date-fns";

import { Text, View } from "../components/Themed";
import { database } from "../constants/firebase";

import { Formik } from "formik";

import { Button, TextInput } from "react-native-paper";
import React, { useState } from "react";

import { useAuthentication } from "../hooks/useAuthentication";
import { Message } from "../types/Message";
import { RootStackScreenProps } from "../types";
import { useEffect } from "react";

export const ChatViewScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"ChatViewScreen">) => {
  const { user } = useAuthentication();
  const dbRef = ref(database, `Chats/${route.params.chatId ?? "*"}`);
  const messages = useDatabaseValue<Message[]>(
    ["Chats", route.params.chatId],
    dbRef,
    {
      subscribe: true,
    }
  );

  useEffect(() => {
    if (!user || !messages?.data) return;

    set(
      ref(database, `users/${user.uid}/Chats/${route.params.chatId}/isSeen`),
      true
    );
  }, [messages.data, user]);

  const pushToDatabase = (tekst: string, resetForm: () => void) => {
    const messageInDatabase: Message = {
      text: tekst,
      date: new Date().toISOString(),
      who: user!.uid,
    };
    set(
      ref(
        database,
        `Chats/${route.params.chatId ?? "*"}/${messages.data!.length}`
      ),
      messageInDatabase
    );
    set(
      ref(
        database,
        `users/${user!.uid}/Chats/${route.params.chatId ?? "*"}/lastMessage`
      ),
      messageInDatabase
    );
    set(
      ref(
        database,
        `users/${route.params.otherUserId}/Chats/${
          route.params.chatId ?? "*"
        }/lastMessage`
      ),
      messageInDatabase
    );
    set(
      ref(
        database,
        `users/${route.params.otherUserId}/Chats/${
          route.params.chatId ?? "*"
        }/isSeen`
      ),
      false
    );

    resetForm();
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return format(dateObj, "dd.MM.yyyy HH:mm");
  };

  const renderChatCards = () => {
    if (!messages?.data) return null;

    return Object.entries(messages.data).map(([id, message]) => (
      <View
        style={
          message.who == user?.uid
            ? styles.messageCardRight
            : styles.messageCardLeft
        }
        key={id}
      >
        <Text style={styles.lastMessage}>{message.text}</Text>
        <Text style={styles.timeSend}>{formatDate(message.date)}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>{renderChatCards()}</View>
      <Formik
        initialValues={{
          message: "",
        }}
        onSubmit={({ message }, { resetForm }) =>
          pushToDatabase(message, resetForm)
        }
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={{ backgroundColor: "transparent" }}>
            <View style={styles.form}>
              <TextInput
                onChangeText={handleChange("message")}
                onBlur={handleBlur("message")}
                value={values.message}
                style={styles.input}
                placeholder="Wiadomość"
              />
              <View>
                <Button
                  onPress={handleSubmit}
                  mode="contained"
                  style={styles.firstButton}
                >
                  Wyślij
                </Button>
              </View>
            </View>
            {errors.message && touched.message && (
              <Text style={styles.error}>{errors.message}</Text>
            )}
          </View>
        )}
      </Formik>
      <Image
        source={require("../assets/psy/tmpdqql4f1j.png")}
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
    backgroundColor: "transparent",
    padding: 20,
  },
  form: {
    width: "80%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
    flexDirection: "column",
    backgroundColor: "transparent",
    gap: 16,
  },
  backgroundImg: {
    position: "absolute",
    bottom: "0%",
    right: "10%",
    zIndex: -1,
  },
  dogImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 16,
  },
  messageCardLeft: {
    backgroundColor: "#F7F9FF",
    borderRadius: 8,
    padding: 10,
    alignSelf: "flex-start",
    marginRight: 50,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  messageCardRight: {
    backgroundColor: "#ffffe8",
    borderRadius: 8,
    padding: 10,
    alignSelf: "flex-end",
    marginLeft: 50,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    padding: 4.8,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
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
