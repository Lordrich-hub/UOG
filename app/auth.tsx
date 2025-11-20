import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedRole = (params.role as 'student' | 'staff') || 'student';
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(''); // For students only
  const [staffId, setStaffId] = useState(''); // For staff only
  const [department, setDepartment] = useState(''); // For both
  const [role, setRole] = useState<'student' | 'staff'>(selectedRole);
  const [loading, setLoading] = useState(false);

  // Update role when params change
  useEffect(() => {
    if (params.role) {
      setRole(params.role as 'student' | 'staff');
    }
  }, [params.role]);

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email domain
    if (!email.toLowerCase().endsWith('@gre.ac.uk')) {
      Alert.alert('Invalid Email', 'Please use your University of Greenwich email (@gre.ac.uk)');
      return;
    }

    // Validate additional fields for sign up
    if (isSignUp) {
      if (role === 'student' && !studentId) {
        Alert.alert('Error', 'Please enter your Student ID');
        return;
      }
      if (role === 'staff' && !staffId) {
        Alert.alert('Error', 'Please enter your Staff ID');
        return;
      }
      if (!department) {
        Alert.alert('Error', 'Please enter your Department/Faculty');
        return;
      }

      // Validate Student ID format (must start with numbers)
      if (role === 'student' && !/^\d{9}$/.test(studentId)) {
        Alert.alert('Invalid Student ID', 'Student ID must be 9 digits (e.g., 001234567)');
        return;
      }

      // Validate Staff ID format (must contain letters)
      if (role === 'staff' && !/^[A-Z]{3}\d+$/i.test(staffId)) {
        Alert.alert('Invalid Staff ID', 'Staff ID must start with letters (e.g., STF123)');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store user data in Firestore with comprehensive profile
        const userData: any = {
          name,
          email,
          role,
          department,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        // Add role-specific fields
        if (role === 'student') {
          userData.studentId = studentId;
          userData.yearOfStudy = 1; // Default, can be updated later
          userData.program = ''; // To be filled in profile
          userData.enrollmentDate = new Date().toISOString();
        } else {
          userData.staffId = staffId;
          userData.position = ''; // To be filled in profile
          userData.officeLocation = ''; // To be filled in profile
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);

        // Store role locally
        await AsyncStorage.setItem('userRole', role);
        
        Alert.alert('Success', 'Account created successfully!');
        
        // Navigate based on role
        if (role === 'student') {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(staff)/home');
        }
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Verify the user is logging in with the correct role
          if (userData.role !== role) {
            await auth.signOut(); // Sign out immediately
            Alert.alert(
              'Wrong Portal',
              `This account is registered as ${userData.role === 'student' ? 'a Student' : 'Staff'}. Please use the correct portal.`
            );
            setLoading(false);
            return;
          }
          
          await AsyncStorage.setItem('userRole', userData.role);
          
          // Navigate based on role
          if (userData.role === 'student') {
            router.replace('/(tabs)/home');
          } else {
            router.replace('/(staff)/home');
          }
        } else {
          Alert.alert('Error', 'User data not found');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../assets/images/uog_logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>University of Greenwich</Text>
            <Text style={styles.subtitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
            
            {/* Role Badge */}
            <View style={[styles.roleBadge, role === 'student' ? styles.roleBadgeStudent : styles.roleBadgeStaff]}>
              <MaterialIcons 
                name={role === 'student' ? 'school' : 'work'} 
                size={18} 
                color="#fff" 
              />
              <Text style={styles.roleBadgeText}>
                {role === 'student' ? 'Student Portal' : 'Staff Portal'}
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="badge" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={role === 'student' ? 'Student ID (e.g., 001234567)' : 'Staff ID (e.g., STF123)'}
                    placeholderTextColor="#9ca3af"
                    value={role === 'student' ? studentId : staffId}
                    onChangeText={role === 'student' ? setStudentId : setStaffId}
                    autoCapitalize="none"
                  />
                </View>

                {(studentId || staffId) && (
                  <Text style={styles.idHint}>
                    {role === 'student' 
                      ? (!/^\d{9}$/.test(studentId) ? '⚠️ Student ID must be 9 digits' : '✅ Valid Student ID')
                      : (!/^[A-Z]{3}\d+$/i.test(staffId) ? '⚠️ Staff ID must start with letters (e.g., STF123)' : '✅ Valid Staff ID')}
                  </Text>
                )}

                <View style={styles.inputContainer}>
                  <MaterialIcons name="business" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={role === 'student' ? 'Faculty/Department' : 'Department'}
                    placeholderTextColor="#9ca3af"
                    value={department}
                    onChangeText={setDepartment}
                    autoCapitalize="words"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="University Email (@gre.ac.uk)"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {isSignUp && email && !email.toLowerCase().endsWith('@gre.ac.uk') && (
              <Text style={styles.emailWarning}>⚠️ Use your @gre.ac.uk email</Text>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6b7280" />
              <Text style={styles.backButtonText}>Back to Role Selection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1140',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    tintColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#c8cfee',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  roleBadgeStudent: {
    backgroundColor: '#3b4a9e',
  },
  roleBadgeStaff: {
    backgroundColor: '#2e7d32',
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0D1140',
  },
  idHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 16,
  },
  authButton: {
    backgroundColor: '#0D1140',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  emailWarning: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 16,
  },
});

