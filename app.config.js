import "dotenv/config";

export default {
  expo: {
    name: "Chat App",
    slug: "chat-app",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/flame.png",
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    android: {
      package: "com.example.chatapp",
      adaptiveIcon: {
        foregroundImage: "./assets/splash.png",
        backgroundColor: "#ffffff",
      },
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    extra: {
      eas: {
        projectId: "bc6c5dae-363b-4a6f-bd24-7f2a222e8032",
      },
      google: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
      },
    },
  },
};
