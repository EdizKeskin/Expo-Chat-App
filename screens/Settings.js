import { StyleSheet, View } from "react-native";
import React from "react";
import { Avatar, Button, Subheading, Title } from "react-native-paper";
import { signOut } from "firebase/auth";
import { auth } from "../config";

export const Settings = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={56}
        label={user.displayName
          .split(" ")
          .map((name) => name[0])
          .join("")}
      />
      <Title>{user.displayName}</Title>
      <Subheading>{user.email}</Subheading>

      <Button mode="contained" title="Sign Out" onPress={handleLogout}>
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
});
