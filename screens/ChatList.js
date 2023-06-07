import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  FAB,
  List,
  Portal,
  TextInput,
} from "react-native-paper";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import Toast from "react-native-root-toast";

export const ChatList = () => {
  const [visible, setVisible] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const navigation = useNavigation();

  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", auth.currentUser.email)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setChats(querySnapshot.docs);
    });

    return () => unsubscribe();
  }, []);

  const createChat = async () => {
    setLoading(true);

    const targetUser = await fetchSignInMethodsForEmail(auth, targetEmail);

    if (targetUser.length === 0) {
      hideDialog();
      setLoading(false);
      setTargetEmail("");
      Toast.show("Kullanıcı Bulunamadı", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#e3e3e3",
        textColor: "#000",
      });
      return;
    }

    const chatExists = chats.find((chat) => {
      const chatUsers = chat.data()?.users;
      return (
        chatUsers.includes(targetEmail) &&
        chatUsers.includes(auth.currentUser.email)
      );
    });

    if (chatExists) {
      hideDialog();
      setLoading(false);
      setTargetEmail("");
      navigation.navigate("ChatRoom", { chatId: chatExists.id });
      return;
    }

    if (targetEmail === auth.currentUser.email || targetEmail === "") {
      hideDialog();
      setLoading(false);
      setTargetEmail("");
      return;
    }
    const response = await addDoc(collection(db, "chats"), {
      users: [auth.currentUser.email, targetEmail],
      messages: [],
    });
    hideDialog();
    setLoading(false);
    setTargetEmail("");
    navigation.navigate("ChatRoom", { chatId: response.id });
  };

  const orderedChats = chats?.sort((a, b) => {
    const aDate = a.data().messages[0]?.createdAt?.toDate();
    const bDate = b.data().messages[0]?.createdAt?.toDate();
    if (aDate && bDate) {
      return bDate - aDate;
    } else {
      return 0;
    }
  });

  return (
    <View style={styles.container}>
      {orderedChats.map((chat) => (
        <View key={chat.id}>
          <List.Item
            titleStyle={styles.titleStyle}
            title={
              chat
                .data()
                .users.filter(
                  (user) => user !== auth.currentUser.displayName
                )[0]
            }
            description={
              chat.data().messages[0]?.text
                ? chat.data().messages[0]?.text
                : chat.data().messages[0]?.image
                ? "Resim"
                : "no messages yet"
            }
            onPress={() => {
              navigation.navigate("ChatRoom", { chatId: chat.id });
            }}
            left={() => (
              <Avatar.Text
                size={56}
                style={styles.avatar}
                label={
                  chat
                    .data()
                    .users.filter(
                      (user) => user !== auth.currentUser.displayName
                    )[0]
                    .split("")[0]
                }
              />
            )}
          />
          <Divider inset />
        </View>
      ))}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="User E-Mail"
              mode="outlined"
              value={targetEmail}
              keyboardType="email-address"
              onChangeText={(text) => setTargetEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} loading={loading}>
              Cancel
            </Button>
            <Button
              onPress={() => createChat()}
              loading={loading}
              disabled={loading}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB style={styles.fab} icon="plus" onPress={showDialog} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  titleStyle: {
    color: "black",
  },
  avatar: {
    marginLeft: 8,
  },
});
