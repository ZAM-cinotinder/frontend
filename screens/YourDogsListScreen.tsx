import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { ref } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";

import { Text, View } from "../components/Themed";
import { database } from "../constants/firebase";

import { Button } from "react-native-paper";
import { useState } from "react";

import { useAuthentication } from "../hooks/useAuthentication";
import { Dogs } from "../types/Dog";

// @ts-ignore
export const YourDogsListScreen = ({ navigation }) => {
  const { user } = useAuthentication();
  const dbRef = ref(database, `users/${user?.uid ?? "*"}/Psy`);
  const dogs = useDatabaseValue<Dogs>(["Psy", user?.uid], dbRef, {
    subscribe: true,
  });

  const renderDogCards = () => {
    if (!dogs?.data) return null;

    return Object.entries(dogs.data).map(([id, dog]) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("AddDogScreen", { ...dog, id })}
        style={styles.dogCard}
        key={id}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.dogName}>
            {dog.Imie}, {dog.Rasa} {dog.Wiek}m
          </Text>
          <Text style={styles.dogPlec}>{dog.Plec}</Text>
          <Text style={styles.dogOpis}>{dog.opis}</Text>
          <Text style={styles.dogVoivodeship}>{dog.voivodeship}</Text>
        </View>
        <Image
          style={styles.dogImage}
          source={{ uri: "data:image/png;base64," + dog.photo }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddDogScreen")}
        style={{ marginBottom: 16 }}
      >
        Add new dog
      </Button>
      <ScrollView style={styles.scrollable}>{renderDogCards()}</ScrollView>
      <Image
        source={require("../assets/psy/tmpg5s7r8fg.png")}
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
  form: {
    backgroundColor: "transparent",
    width: "80%",
    padding: 10,
  },
  scrollable: {
    width: "100%",
    flex: 1,
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
  },
  dogCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",

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
  dogOpis: {
    fontSize: 16,
    color: "#000",
  },
  dogVoivodeship: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
    marginTop: -3,
  },
  dogPlec: {
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
