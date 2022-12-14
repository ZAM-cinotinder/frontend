import { StyleSheet, TouchableOpacity, Image, Switch, Switch as Stitch } from "react-native";
import { ref, set } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";
import { useQueryClient } from "react-query";
import * as ImagePicker from "expo-image-picker";

import { Text, View } from "../components/Themed";
import { auth, database } from "../constants/firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

import Toast from "react-native-toast-message";
import { useAuthentication } from "../hooks/useAuthentication";
import { Dog } from "../types/Dog";

import { Picker } from "@react-native-picker/picker";
import { RootStackScreenProps } from "../types";
import { vivodeships } from "../types/WOJEWODZTWA";

const AddDogScheme = Yup.object().shape({
  imie: Yup.string().required("Required"),
  plec: Yup.string().required("Required"),
  rasa: Yup.string().required("Required"),
  wiek: Yup.string().matches(/^\d+$/, "WIEK TO LICZBA").required("Required"),
});

export const AddDogScreen = ({
  route,
  navigation,
}: RootStackScreenProps<"AddDogScreen">) => {
  const { user } = useAuthentication();
  const queryClient = useQueryClient();
  const Dog = route.params;
  const [image, setImage] = useState(Dog?.photo);
  const pushToDatabase = (
    name: string,
    gender: string,
    breed: string,
    age: string,
    description: string,
    wojewodztwo: string,
    czyAktywny: boolean
  ) => {
    Toast.show({
      type: "error",
      text1: "Błąd sesji",
    });
    if (!user) {
      return;
    }

    const dogInDatabase: Dog = {
      userId: user.uid,
      Imie: name,
      Plec: gender,
      Rasa: breed,
      Wiek: Number.parseInt(age),
      photo: image ?? "",
      opis: description,
      voivodeship: wojewodztwo,
      isActive: czyAktywny,
    };

    const dogId = Dog?.id ?? uuid();
    // queryClient.invalidateQueries(["Psy", user?.uid]);

    set(ref(database, `users/${user.uid}/Psy/${dogId}`), dogInDatabase);
    set(ref(database, `Psy/${wojewodztwo}/${dogId}`), dogInDatabase);

    // navigation.navigate('AddDogScreen');
    navigation.pop();
    Toast.show({
      type: "success",
      text1: "Sukces",
    });
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    console.log(result);

    // @ts-ignore
    if (!result.canceled) {
      // @ts-ignore
      setImage(result.base64);
    }
  };

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    console.log(result);

    // @ts-ignore
    if (!result.canceled) {
      // @ts-ignore
      setImage(result.base64);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          imie: Dog?.Imie ?? "",
          plec: Dog?.Plec ?? "Pies",
          rasa: Dog?.Rasa ?? "",
          wiek: Dog?.Wiek ? String(Dog?.Wiek) : "",
          opis: Dog?.opis ?? "",
          voivodeship: Dog?.voivodeship ?? "Lodzkie",
          isActive: Dog?.isActive ?? true,
        }}
        onSubmit={({ imie, plec, rasa, wiek, opis, voivodeship, isActive }) =>
          pushToDatabase(imie, plec, rasa, wiek, opis, voivodeship, isActive)
        }
        validationSchema={AddDogScheme}
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
          <View style={styles.form}>
            <Image
              style={styles.dogoImage}
              source={{ uri: "data:image/png;base64," + image }}
            />
            <Button
              mode="contained"
              onPress={addImage}
              style={{ marginVertical: 4 }}
            >
              Wybierz zdjęcie
            </Button>
            <Button
              mode="contained"
              onPress={takeImage}
              style={{ marginVertical: 4 }}
            >
              Zrób zdjęcie
            </Button>
            <TextInput
              onChangeText={handleChange("imie")}
              onBlur={handleBlur("imie")}
              value={values.imie}
              style={styles.input}
              placeholder="imie"
            />
            {errors.imie && touched.imie && (
              <Text style={styles.error}>{errors.imie}</Text>
            )}
            {/* <TextInput
              onChangeText={handleChange('plec')}
              onBlur={handleBlur('plec')}
              value={values.plec} 
              style={styles.input}
              placeholder="plec"
            /> 
            {errors.plec && touched.plec && <Text style={styles.error}>{errors.plec}</Text>}*/}
            <Picker
              selectedValue={values.plec}
              onValueChange={(itemValue, itemIndex) =>
                setFieldValue("plec", itemValue)
              }
            >
              <Picker.Item label="Pies" value="Pies" />
              <Picker.Item label="Suczka" value="Suczka" />
            </Picker>

            <TextInput
              onChangeText={handleChange("rasa")}
              onBlur={handleBlur("rasa")}
              value={values.rasa}
              style={styles.input}
              placeholder="rasa"
            />
            {errors.rasa && touched.rasa && (
              <Text style={styles.error}>{errors.rasa}</Text>
            )}

            <TextInput
              onChangeText={handleChange("wiek")}
              onBlur={handleBlur("wiek")}
              value={values.wiek}
              style={styles.input}
              placeholder="wiek"
            />
            {errors.wiek && touched.wiek && (
              <Text style={styles.error}>{errors.wiek}</Text>
            )}
            <TextInput
              onChangeText={handleChange("opis")}
              onBlur={handleBlur("opis")}
              value={values.opis}
              style={styles.input}
              placeholder="opis"
            />
            {errors.opis && touched.opis && (
              <Text style={styles.error}>{errors.opis}</Text>
            )}
            {/*<TextInput
              onChangeText={handleChange('voivodeship')}
              onBlur={handleBlur('voivodeship')}
              value={values.voivodeship} 
              style={styles.input}
              placeholder="voivodeship"
            />
            {errors.voivodeship && touched.voivodeship && <Text style={styles.error}>{errors.voivodeship}</Text>}*/}
            <Picker
              selectedValue={values.voivodeship}
              onValueChange={(itemValue, itemIndex) =>
                setFieldValue("voivodeship", itemValue)
              }
            >
              {vivodeships.map((vivodeship) => (
                <Picker.Item
                  label={vivodeship}
                  value={vivodeship}
                  key={vivodeship}
                />
              ))}
            </Picker>
            
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin:3}}>
            <Text>Aktywny</Text>
            <Switch 
              onChange={() => setFieldValue("isActive", !values.isActive)}
              value={values.isActive}
            /></View>

            <Button
              onPress={handleSubmit}
              mode="contained"
              style={styles.firstButton}
            >
              {Dog ? "Zedytuj" : "Stwórz"} psa
            </Button>
          </View>
        )}
      </Formik>
      <Image
        source={require("../assets/psy/pies28.png")}
        style={styles.backgroundImg}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  form: {
    // flex: 1,
    backgroundColor: "transparent",
    width: "80%",
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 200,
    // height: 20,
  },
  backgroundImg: {
    position: "absolute",
    bottom: "-10%",
    right: "0%",
    left: "0%",
    zIndex: -1,
    // width: '70%'
  },
  dogoImage: {
    width: 100,
    height: 100,
    margin: 16,
    alignSelf: "center",
    borderRadius: 8,
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
