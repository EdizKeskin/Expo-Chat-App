import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { View, TextInput, FormErrorMessage } from "../components";
import { Colors, auth } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { loginValidationSchema } from "../utils";
import { Button } from "react-native-paper";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };
  return (
    <>
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            {/* <Logo uri={Images.logo} /> */}
            <Text style={styles.screenTitle}>Welcome back!</Text>
          </View>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                <Button
                  onPress={handleSubmit}
                  mode="contained"
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Signup")}
            style={styles.borderlessButtonContainer}
          >
            <Text style={styles.footerText}>Create a new account?</Text>
          </Button>
          <Button
            mode="text"
            style={styles.borderlessButtonContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.footerText}>Forgot Password?</Text>
          </Button>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 20,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "700",
  },
  button: {
    width: "100%",
    marginTop: 8,
    padding: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
