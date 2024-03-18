import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  // Forgot password

  const forgetPassword =() => {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      alert("Password reset email has been sent" )
    }).catch((error) => {
      alert(error)
    })

  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.signupLink}
        >
          <Text style={styles.signupText}>Don't have an account? Register Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {forgetPassword()}}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loginContainer: {
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
