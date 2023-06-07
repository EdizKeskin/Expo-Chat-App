import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import { GiftedChat, Actions, InputToolbar } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const customtInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "white",
        borderColor: "#E8E8E8",
        borderWidth: 1,
        height: 48,
        borderRadius: 25,
        marginHorizontal: 4,
        marginBottom: 4,
      }}
    />
  );
};

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  useEffect(() => {
    const chatId = route.params.chatId;
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      setMessages(snapshot.data()?.messages ?? []);
    });
    return () => {
      unsubscribe();
    };
  }, [route.params.chatId]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();

    const message = {
      _id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
      },
      image: blob,
    };

    onSend([message]);
  };

  const onSend = async (m = []) => {
    if (m[0].image) {
      setLoading(true);
      const sessionId = new Date().getTime();
      const imageRef = ref(storage, `images/${sessionId}`);
      await uploadBytes(imageRef, m[0].image);
      const url = await getDownloadURL(imageRef);
      m[0].image = url;
    }

    await setDoc(
      doc(db, "chats", route.params.chatId),
      {
        messages: GiftedChat.append(messages, m),
      },
      { merge: true }
    ).catch((error) => console.error(error));
    setLoading(false);
  };

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        options={{
          "Choose From Library": handlePickImage,
          Cancel: () => {},
        }}
        icon={() => <AntDesign name="camerao" size={24} color="black" />}
      />
    );
  };

  const renderFooter = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Resim yükleniyor...</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages.map((message) => ({
          ...message,
          createdAt: message.createdAt?.toDate(),
        }))}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        }}
        renderActions={renderActions}
        renderFooter={renderFooter}
        renderInputToolbar={customtInputToolbar}
      />
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#b2b2b2",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  loadingText: {
    color: "gray",
    alignSelf: "center",
    marginBottom: 10,
  },
});
