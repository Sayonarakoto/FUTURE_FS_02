import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Stack,
  Box,
  rem,
  ActionIcon,
  Center,
} from '@mantine/core';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    console.log('🛡️ Nexus Auth: Requesting OTP for', email);
    setLoading(true);
    try {
      const response = await api.post('/auth/request-otp', { email });
      console.log('✅ OTP API Response:', response.data);

      notifications.show({
        title: 'Check your email',
        message: 'A 6-digit code has been sent to your inbox.',
        color: 'blue',
      });
      setStep(2);
    } catch (error) {
      console.error('❌ OTP Request Failed:', error);
      notifications.show({
        title: 'Connection Error',
        message: error.response?.data?.message || 'Failed to send OTP. Visit console for details.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      notifications.show({
        title: 'Access Granted',
        message: 'Welcome to the Nexus Core Dashboard.',
        color: 'green',
      });
      
      // Update global auth state (this handles localStorage and profile fetch)
      loginWithToken(data.token);
      
      navigate('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Authentication Failed',
        message: error.response?.data?.message || 'Invalid or expired code.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: '#FFFFFF', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container size={420} my={80} style={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          withBorder 
          shadow="lg" 
          p={40} 
          radius="lg" 
          bg="#FFFFFF"
          style={{ 
            borderColor: '#F1F3F5',
            zIndex: 2
          }}
        >
          {step === 1 ? (
            <Stack align="center" gap="xl">
              <Center
                p={15}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '16px',
                }}
              >
                <ShieldCheck size={32} color="white" strokeWidth={1.5} />
              </Center>

              <div style={{ textAlign: 'center' }}>
                <Title order={2} fw={800} style={{ color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                  Nexus Access
                </Title>
                <Text c="dimmed" size="sm" mt={5}>
                  Enter your admin email to receive an entry code.
                </Text>
              </div>

              <form onSubmit={handleRequestOTP} style={{ width: '100%' }}>
                <Stack gap="md">
                  <TextInput
                    label={<Text c="#888" size="xs" fw={700} style={{letterSpacing: '1px'}}>EMAIL ADDRESS</Text>}
                    placeholder="admin@nexus.core"
                    size="md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    autoComplete="email"
                    required
                    leftSection={<Mail size={18} strokeWidth={1.5} />}
                    styles={{
                      input: { backgroundColor: '#F8F9FA', borderColor: '#F1F3F5', color: '#1a1a1a' }
                    }}
                  />

                  <Button
                    fullWidth
                    size="md"
                    type="submit"
                    loading={loading}
                    rightSection={!loading && <ArrowRight size={18} />}
                    style={{
                      background: '#1a1a1a',
                      height: rem(48),
                    }}
                  >
                    Send Secure Code
                  </Button>
                </Stack>
              </form>
            </Stack>
          ) : (
            <Stack align="center" gap="xl">
              <ActionIcon 
                variant="subtle" 
                color="dimmed" 
                onClick={() => setStep(1)}
                style={{ position: 'absolute', top: 15, left: 15 }}
              >
                <ArrowLeft size={20} />
              </ActionIcon>

              <Center
                p={15}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '16px',
                }}
              >
                <KeyRound size={32} color="white" strokeWidth={1.5} />
              </Center>

              <div style={{ textAlign: 'center' }}>
                <Title order={2} fw={800} style={{ color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                  Verify Identity
                </Title>
                <Text c="dimmed" size="sm" mt={5}>
                  A code was sent to <b>{email}</b>
                </Text>
              </div>

              <form onSubmit={handleVerifyOTP} style={{ width: '100%' }}>
                <Stack gap="md">
                  <TextInput
                    label={<Text c="#888" size="xs" fw={700} style={{letterSpacing: '1px'}}>6-DIGIT CODE</Text>}
                    placeholder="000000"
                    size="xl"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    required
                    styles={{
                      input: { 
                        backgroundColor: '#F8F9FA', 
                        borderColor: '#F1F3F5',
                        textAlign: 'center',
                        letterSpacing: '10px',
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#1a1a1a'
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    size="md"
                    type="submit"
                    loading={loading}
                    style={{
                      background: '#1a1a1a',
                      height: rem(48),
                    }}
                  >
                    Enter The Nexus
                  </Button>

                  <Text size="xs" c="dimmed" ta="center">
                    Didn't receive it? <Text span c="black" inherit style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleRequestOTP}>Resend Code</Text>
                  </Text>
                </Stack>
              </form>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
}