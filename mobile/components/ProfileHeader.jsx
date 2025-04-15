import { View, Text} from "react-native";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles.js";
import { formatMemberSince } from "../lib/utils.js";
import { Image } from "expo-image";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  //console.log("createdAt value:", user.createdAt);
  //console.log("formatted date:", formatMemberSince(user?.createdAt));
  console.log("user", user);


    if (!user) { return null; }
  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
        💮 Joined {formatMemberSince(user?.createdAt)}
        </Text>
      </View>
    </View>
  );
}