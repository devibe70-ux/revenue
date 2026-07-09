import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Successful login/signup will trigger AuthContext and index.tsx logic
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#064e3b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        <BlurView tint="dark" intensity={40} style={styles.card}>
          <Text style={styles.title}>Unified Revenue</Text>
          <Text style={styles.subtitle}>Sign in to view your dashboard</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#8A8F98"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8A8F98"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            <Text style={styles.secondaryButtonText}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D10',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8F98',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButton: {
    backgroundColor: '#60A5FA', // Blue accent
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8A8F98',
    fontSize: 14,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});
