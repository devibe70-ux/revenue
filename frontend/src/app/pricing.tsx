import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { calculateSubscriptionTax } from '../lib/taxCalculator';

export default function PricingPlan() {
  const { user, profile } = useAuth();
  const [gstNumber, setGstNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [stateCode, setStateCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = 4.99;
  const taxBreakdown = calculateSubscriptionTax({ countryCode, stateCode }, basePrice);

  const handleRazorpayCheckout = async () => {
    if (!user) {
      alert("Please log in first to upgrade.");
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    // Simulate Razorpay Checkout delay
    setTimeout(async () => {
      try {
        if (db) {
          await updateDoc(doc(db, 'users', user.uid), {
            subscriptionTier: 'pro',
            gstNumber: gstNumber || null,
            countryCode,
            stateCode,
            taxBreakdown,
          });
          alert("Payment Successful! Welcome to Pro Creator.");
          router.replace('/');
        }
      } catch (error) {
        console.error("Payment failed", error);
        alert("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#064e3b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Unlock advanced analytics and top-tier security for your revenue streams.</Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* FREE TIER */}
          <BlurView tint="dark" intensity={40} style={styles.card}>
            <Text style={styles.planName}>Basic</Text>
            <Text style={styles.price}>$0<Text style={styles.priceInterval}>/mo</Text></Text>
            
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ 30-Day Revenue History</Text>
              <Text style={styles.feature}>✓ Basic Platform Allocation</Text>
              <Text style={styles.feature}>✓ Standard Security</Text>
              <Text style={styles.featureWarning}>⚠ Ad-Supported Experience</Text>
              <Text style={styles.featureDisabled}>✗ Custom Date Ranges</Text>
              <Text style={styles.featureDisabled}>✗ Deep YouTube/Amazon Analytics</Text>
              <Text style={styles.featureDisabled}>✗ 2FA Authenticator Protection</Text>
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.back()}
              disabled={profile?.subscriptionTier === 'free'}
            >
              <Text style={styles.secondaryButtonText}>
                {profile?.subscriptionTier === 'free' ? 'Current Plan' : 'Downgrade to Basic'}
              </Text>
            </TouchableOpacity>
          </BlurView>

          {/* PRO TIER */}
          <BlurView tint="dark" intensity={60} style={[styles.card, styles.proCard]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
            </View>
            <Text style={styles.planNamePro}>Pro Creator</Text>
            <Text style={styles.price}>$4.99<Text style={styles.priceInterval}>/mo</Text></Text>
            
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Unlimited Revenue History</Text>
              <Text style={styles.feature}>✓ Advanced Platform Allocation</Text>
              <Text style={styles.feature}>✓ Custom Date Range Tracking</Text>
              <Text style={styles.feature}>✓ Deep YouTube/Amazon Analytics</Text>
              <Text style={styles.featureHighlight}>★ Ad-Free Experience</Text>
              <Text style={styles.featureHighlight}>★ Mandatory 2FA Authenticator Security</Text>
            </View>

            <View style={styles.billingContainer}>
              <Text style={styles.billingLabel}>Billing Region</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity style={countryCode === 'IN' ? styles.radioSelected : styles.radio} onPress={() => setCountryCode('IN')}>
                  <Text style={countryCode === 'IN' ? styles.radioTextSelected : styles.radioText}>India</Text>
                </TouchableOpacity>
                <TouchableOpacity style={countryCode !== 'IN' ? styles.radioSelected : styles.radio} onPress={() => setCountryCode('US')}>
                  <Text style={countryCode !== 'IN' ? styles.radioTextSelected : styles.radioText}>International</Text>
                </TouchableOpacity>
              </View>

              {countryCode === 'IN' && (
                <>
                  <Text style={styles.billingLabel}>State Code (e.g., 24 for Gujarat)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="24"
                    placeholderTextColor="#475569"
                    value={stateCode}
                    onChangeText={setStateCode}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.billingLabel}>GST Number (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter GSTIN (e.g. 24AAAAA0000A1Z5)"
                    placeholderTextColor="#475569"
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    maxLength={15}
                    autoCapitalize="characters"
                  />
                </>
              )}
              
              <View style={styles.taxBreakdown}>
                <View style={styles.taxRow}><Text style={styles.taxText}>Base Price:</Text><Text style={styles.taxText}>${basePrice.toFixed(2)}</Text></View>
                {taxBreakdown.cgst > 0 && <View style={styles.taxRow}><Text style={styles.taxText}>CGST (9%):</Text><Text style={styles.taxText}>${taxBreakdown.cgst.toFixed(2)}</Text></View>}
                {taxBreakdown.sgst > 0 && <View style={styles.taxRow}><Text style={styles.taxText}>SGST (9%):</Text><Text style={styles.taxText}>${taxBreakdown.sgst.toFixed(2)}</Text></View>}
                {taxBreakdown.igst > 0 && <View style={styles.taxRow}><Text style={styles.taxText}>IGST (18%):</Text><Text style={styles.taxText}>${taxBreakdown.igst.toFixed(2)}</Text></View>}
                <View style={[styles.taxRow, styles.taxTotalRow]}><Text style={styles.taxTotalText}>Total Amount:</Text><Text style={styles.taxTotalText}>${taxBreakdown.finalAmount.toFixed(2)}</Text></View>
                {taxBreakdown.invoiceNote ? <Text style={styles.invoiceNote}>{taxBreakdown.invoiceNote}</Text> : null}
                <Text style={styles.sacCode}>SAC Code: {taxBreakdown.sacCode}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleRazorpayCheckout}
              disabled={isProcessing || profile?.subscriptionTier === 'pro'}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {profile?.subscriptionTier === 'pro' ? 'Current Plan' : 'Pay with Razorpay'}
                </Text>
              )}
            </TouchableOpacity>
          </BlurView>
        </View>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D10',
  },
  scrollContent: {
    padding: 40,
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8A8F98',
    textAlign: 'center',
    maxWidth: 600,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
    maxWidth: 1000,
  },
  card: {
    flex: 1,
    minWidth: 320,
    maxWidth: 400,
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  proCard: {
    borderColor: 'rgba(96, 165, 250, 0.4)',
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  popularBadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  planNamePro: {
    fontSize: 24,
    fontWeight: '700',
    color: '#60A5FA',
    marginBottom: 8,
  },
  price: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  priceInterval: {
    fontSize: 18,
    color: '#8A8F98',
    fontWeight: '500',
  },
  featuresList: {
    gap: 16,
    marginBottom: 40,
  },
  feature: {
    color: '#E2E8F0',
    fontSize: 16,
  },
  featureDisabled: {
    color: '#475569',
    fontSize: 16,
  },
  featureWarning: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  featureHighlight: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#8A8F98',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 60,
    padding: 16,
  },
  backButtonText: {
    color: '#8A8F98',
    fontSize: 16,
    fontWeight: '500',
  },
  billingContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    borderRadius: 12,
  },
  billingLabel: {
    color: '#8A8F98',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  radio: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  radioSelected: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderWidth: 1,
    borderColor: '#60A5FA',
    alignItems: 'center',
  },
  radioText: {
    color: '#8A8F98',
    fontWeight: '600',
  },
  radioTextSelected: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  taxBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taxText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  taxTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  taxTotalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  invoiceNote: {
    color: '#10B981',
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 12,
  },
  sacCode: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
  },
});
