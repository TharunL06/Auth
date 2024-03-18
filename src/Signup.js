import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const signupUser = async (email, password, firstname, lastname) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: "https://test2-b3d98.firebaseapp.com",
          })
          .then(() => {
            alert("Verification email sent");
          })
          .catch((error) => {
            alert(error.message);
          })
          .then(() => {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                firstname,
                lastname,
                email,
              });
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.signupcontainer}>
      <Text style={styles.title}>Signup</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          onChangeText={(firstname) => setFirstname(firstname)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          onChangeText={(lastname) => setLastname(lastname)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={() => signupUser(email, password, firstname, lastname)} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.signupLink}
        >
          <Text style={styles.signupText}>Already have an account? Login</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  signupcontainer: {
    backgroundColor: "#f0f0f0", // Background color for the login container
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 40,
    color: "#333", // Darker text color
    textDecorationLine: 'underline', // Underline style
  },
  formContainer: {
    width: "80%",
    alignItems: "center", // Center form elements horizontally
  },
  textInput:{
    paddingTop:20,
    paddingBottom:10,
    width:300,
    fontSize:18,
    borderBottomWidth:1,
    borderBottomColor:'#ccc', // Lighter border color
    marginBottom:20,
  },
  button: {
    height:50,
    width:200,
    backgroundColor: "#007bff", // Primary color button
    borderRadius: 25,
    alignItems: "center",
    justifyContent:"center",
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "#007bff", // Primary color link
  },
  forgotPasswordLink: {
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#007bff", // Primary color link
  },
});
