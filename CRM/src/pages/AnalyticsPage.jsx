import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Container,
  Text,
  Title,
  Stack,
  Box,
  Grid,
  ScrollArea,
  Card,
  Group,
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { notifications } from '@mantine/notifications';
import Sidebar from '../components/Sidebar';
import CommandPalette from '../components/CommandPalette';
import CommandGuideCard from '../components/CommandGuideCard';

// Recharts imports
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A0A0A0']; 

const STATUS_COLORS = {
  'New': '#0088FE',
  'Contacted': '#00C49F',
  'Converted': '#FFBB28',
  'Rejected': '#FF8042',
  'Unknown': '#A0A0A0',
};

const AnalyticsPage = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [leadsByStatus, setLeadsByStatus] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchLeadsByStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/leads-by-status');
      setLeadsByStatus(response.data.data || {});
    } catch (error) {
      console.error("Error fetching leads by status:", error);
      notifications.show({
        title: 'Data Fetch Error',
        message: 'Could not fetch lead analytics data.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeadsByStatus();
      fetchLeads();
    } else if (!authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Transform data for Recharts PieChart
  const chartData = Object.entries(leadsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Calculate summary metrics
  const totalLeads = Object.values(leadsByStatus).reduce((sum, count) => sum + count, 0);
  const convertedLeads = leadsByStatus['Converted'] || 0;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  if (authLoading) return null;

  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding="xl"
      styles={{
        main: {
          backgroundColor: '#FBFBFB',
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          minHeight: '100vh',
        },
      }}
    >
      <AppShell.Navbar p={0}>
        <ScrollArea
          h="100%"
          type="hover"
          scrollbars="y"
          viewportProps={{ style: { width: '100%' } }}
        >
          <Sidebar logout={logout} />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <CommandPalette leads={leads} /> 
        
        <Container size="xl">
          <Stack gap="xl">
            <Group justify="space-between">
              <Box>
                <Title order={2} c="dark" style={{ fontFamily: 'serif', fontWeight: 400 }}>
                  Analytics Overview
                </Title>
                <Text size="sm" c="dimmed">
                  Distribution of leads by current status.
                </Text>
              </Box>
              <Box w={300}>
                <CommandGuideCard />
              </Box>
            </Group>

            {/* Summary Metrics Cards */}
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" radius="md" withBorder p="lg">
                  <Text size="lg" fw={700} c="#212529">{totalLeads}</Text>
                  <Text size="sm" c="dimmed">Total Leads</Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" radius="md" withBorder p="lg">
                  <Text size="lg" fw={700} c="#212529">{conversionRate.toFixed(1)}%</Text>
                  <Text size="sm" c="dimmed">Conversion Rate</Text>
                </Card>
              </Grid.Col>
            </Grid>

            <Box
              mt={30}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(12px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '30px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                minHeight: '350px',
              }}
            >
              <Text style={{ fontFamily: 'serif', fontSize: '1.4rem', marginBottom: '20px' }}>
                Lead Status Distribution
              </Text>

              {loading ? (
                <Text>Loading analytics...</Text>
              ) : chartData.length === 0 ? (
                <Text>No lead data available to display.</Text>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AnalyticsPage;
