import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChooseRole() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const selectRole = async (role: 'student' | 'staff') => {
    // Navigate to auth screen with the selected role
    router.push(`/auth?role=${role}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40 }]}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/uog_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to UOG</Text>
        <Text style={styles.subtitle}>Please select your role to continue</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.8}
          onPress={() => selectRole('student')}
        >
          <View style={[styles.iconWrap, { backgroundColor: '#3b4a9e' }]}>
            <MaterialIcons name="school" size={48} color="#fff" />
          </View>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>
            Access your timetable, modules, grades, and campus services
          </Text>
          <View style={styles.arrow}>
            <MaterialIcons name="arrow-forward" size={24} color="#3b4a9e" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.8}
          onPress={() => selectRole('staff')}
        >
          <View style={[styles.iconWrap, { backgroundColor: '#2e7d32' }]}>
            <MaterialCommunityIcons name="account-tie" size={48} color="#fff" />
          </View>
          <Text style={styles.roleTitle}>Staff</Text>
          <Text style={styles.roleDescription}>
            Manage classes, attendance, announcements, and student records
          </Text>
          <View style={styles.arrow}>
            <MaterialIcons name="arrow-forward" size={24} color="#2e7d32" />
          </View>
        </TouchableOpacity>
      </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1140',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9aa0c7',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
    paddingBottom: 20,
  },
  roleCard: {
    backgroundColor: '#151a42',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 14,
    color: '#9aa0c7',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    fontSize: 11,
    color: '#6b7598',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
});
