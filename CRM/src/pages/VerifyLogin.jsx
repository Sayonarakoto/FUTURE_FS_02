import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Title, Text, Loader, Stack, Button } from '@mantine/core';
import { ShieldCheck, XCircle } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function VerifyLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState(searchParams.get('token') ? 'verifying' : 'error');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify?token=${token}`);
        
        // Use our new Magic-Link friendly login method
        if (loginWithToken) loginWithToken(response.data.token);

        setStatus('success');
        
        notifications.show({
          title: 'Authentication Successful',
          message: 'Redirecting to your dashboard...',
          color: 'teal',
          icon: <ShieldCheck size={18} />,
          autoClose: 2000,
        });

        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (error) {
        console.error('Verification failed', error);
        setStatus('error');
        
        notifications.show({
          title: 'Link Expired or Invalid',
          message: 'Please request a new secure login link.',
          color: 'red',
          icon: <XCircle size={18} />,
          autoClose: 4000,
        });
      }
    };

    verifyToken();
  }, [token, navigate, loginWithToken]);

  return (
    <div style={{ minHeight: '100vh', background: '#171717', display: 'flex', alignItems: 'center' }}>
      <Container size="sm" w="100%">
        <Paper shadow="xl" radius="md" p="xl" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Stack gap="lg" align="center">
            {status === 'verifying' && (
              <>
                <Loader color="blue" size="xl" type="dots" />
                <Title order={3} c="white">Verifying Secure Link...</Title>
                <Text c="dimmed">Please wait while we authenticate your session.</Text>
              </>
            )}

            {status === 'success' && (
              <>
                <ShieldCheck size={64} color="#10b981" />
                <Title order={3} c="white">Access Granted</Title>
                <Text c="dimmed">Loading dashboard...</Text>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle size={64} color="#ef4444" />
                <Title order={3} c="white">Authentication Failed</Title>
                <Text c="dimmed">The link may have expired or is invalid. Please request a new one.</Text>
                <Button 
                  onClick={() => navigate('/login')}
                  mt="md" 
                  style={{ background: '#2563eb' }}
                >
                  Return to Login
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
