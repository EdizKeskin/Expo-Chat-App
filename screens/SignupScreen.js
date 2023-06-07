import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { View, TextInput, FormErrorMessage } from "../components";
import { auth } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { signupValidationSchema } from "../utils";
import { Button } from "react-native-paper";

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values) => {
    const { email, password, displayName } = values;

    await createUserWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );

    updateProfile(auth.currentUser, {
      displayName: displayName,
    }).catch((error) => {
      setErrorState(error.message);
    });
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.logoContainer}>
          {/* <Logo uri={Images.logo} /> */}
          <Text style={styles.screenTitle}>Create a new account!</Text>
        </View>
        <Formik
          initialValues={{
            email: "",
            displayName: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
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
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name="displayName"
                leftIconName="account"
                placeholder="Enter Username"
                autoCapitalize="none"
                autoFocus={true}
                value={values.displayName}
                onChangeText={handleChange("displayName")}
                onBlur={handleBlur("displayName")}
              />
              <FormErrorMessage
                error={errors.displayName}
                visible={touched.displayName}
              />
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="newPassword"
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
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Enter password again"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Signup</Text>
              </Button>
            </>
          )}
        </Formik>
        <Button
          style={styles.borderlessButtonContainer}
          mode="text"
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Already have an account?</Text>
        </Button>
      </KeyboardAwareScrollView>
    </View>
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
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
