import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Container,
  Text,
  Group,
  Table,
  Box,
  Stack,
  ScrollArea,
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { notifications } from '@mantine/notifications';
import Sidebar from '../components/Sidebar';
import LeadTableRow from '../components/LeadTableRow';
import LeadDetailsDrawer from '../components/LeadDetailsDrawer';
import CommandPalette from '../components/CommandPalette';

const Dashboard = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch leads data once when the component mounts and isAuthenticated is true
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await api.get('/leads');
      setLeads(response.data.data || []);
    } catch (error) {
      notifications.show({
        title: 'Data Error',
        message: 'Could not fetch leads.',
        color: 'red',
      });
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    } else if (!authLoading) { // Redirect only if not loading and not authenticated
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);


  const handleUpdateStatus = async (id, newStatus) => {
    const previousLeads = leads; // Capture previous state for rollback
    const previousSelectedLead = selectedLead;

    // Optimistic UI update: update local state immediately
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );

    setSelectedLead((prev) => // Optimistically update selected lead too
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );

    try {
      const response = await api.put(`/leads/${id}/status`, { status: newStatus });
      const updatedLead = response.data.data; // Backend response with potentially more data

      if (updatedLead) {
        // If backend returns full updated lead, merge it in to ensure all data is fresh
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === id ? { ...lead, ...updatedLead } : lead
          )
        );

        setSelectedLead((prev) => // Update drawer's selected lead too with backend data
          prev && prev.id === id ? { ...prev, ...updatedLead } : prev
        );
      }

      notifications.show({
        title: 'Status Updated',
        message: `Lead marked as ${newStatus}`,
        color: 'blue',
      });
    } catch (err) {
      // Rollback UI state if the API call fails
      setLeads(previousLeads);
      setSelectedLead(previousSelectedLead);

      console.error('Failed to update status - detailed error:', err); 

      // Attempt to display a more specific error message from the API response
      if (err.response && err.response.data && err.response.data.message) {
        notifications.show({ 
          title: 'Update Failed', 
          message: err.response.data.message, 
          color: 'red' 
        });
      } else {
        // Fallback to a generic error message if specific details aren't available
        notifications.show({ 
          title: 'Update Failed', 
          message: 'Could not update lead status.', 
          color: 'red' 
        });
      }
    }
  };

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
        {/* Render CommandPalette to handle actions and pass leads data */}
        <CommandPalette leads={leads} /> 

        <Container size="xl">
          <Stack gap="xl">
            <Box>
              <Text size="xl" fw={700}>
                Dashboard
              </Text>
              <Text size="sm" c="dimmed">
                Welcome back, {user?.email || 'Admin'}
              </Text>
            </Box>

            <Box
              mt={30}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(12px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '30px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              }}
            >
              <Text style={{ fontFamily: 'serif', fontSize: '1.8rem', marginBottom: '20px' }}>
                Inbound Inquiries
              </Text>

              <Table
                verticalSpacing="lg"
                horizontalSpacing="md"
                style={{
                  color: '#1a1a1a',
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Client</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Message</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {leads.map((lead) => (
                    <LeadTableRow
                      key={lead.id}
                      lead={lead}
                      onUpdate={handleUpdateStatus}
                      onView={setSelectedLead}
                    />
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          </Stack>
        </Container>
      </AppShell.Main>

      <LeadDetailsDrawer
        lead={selectedLead}
        opened={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </AppShell>
  );
};

export default Dashboard;
