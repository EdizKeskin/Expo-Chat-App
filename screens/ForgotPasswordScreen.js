import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema } from "../utils";
import { auth } from "../config";
import { View, TextInput, FormErrorMessage } from "../components";
import { Button } from "react-native-paper";

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");

  const handleSendPasswordResetEmail = (values) => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => setErrorState(error.message));
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.screenTitle}>Reset your password</Text>
      </View>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={passwordResetSchema}
        onSubmit={(values) => handleSendPasswordResetEmail(values)}
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
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {errorState !== "" ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Button>
          </>
        )}
      </Formik>
      <Button
        style={styles.borderlessButtonContainer}
        mode="text"
        onPress={() => navigation.navigate("Login")}
      >
        <Text>Go back to Login</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  innercontainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    padding: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
