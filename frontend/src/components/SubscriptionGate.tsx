import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGate({ children, fallback }: SubscriptionGateProps) {
  const { profile } = useAuth();

  // If user is Pro, show the protected content
  if (profile?.subscriptionTier === 'pro') {
    return <>{children}</>;
  }

  // If fallback is provided, render it instead of the default blur overlay
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default behavior: Render content but blur it, showing an upgrade overlay
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer} pointerEvents="none">
        {children}
      </View>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.overlayContent}>
          <View style={styles.iconContainer}>
            <Lock color="#60A5FA" size={32} />
          </View>
          <Text style={styles.title}>Pro Feature Locked</Text>
          <Text style={styles.subtitle}>Upgrade your account to unlock advanced analytics, custom date ranges, and 2FA security.</Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/pricing')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Pro - $4.99/mo</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
  },
  contentContainer: {
    opacity: 0.3, // Dim the content slightly behind the blur
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8F98',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  upgradeButton: {
    backgroundColor: '#60A5FA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
