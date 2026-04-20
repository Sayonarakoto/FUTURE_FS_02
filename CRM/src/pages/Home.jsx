import { Box, Button, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

// Component Imports
import HeroSection from '../components/HeroSection';
import TechStack from '../components/TechStack';
import LeadCaptureForm from '../components/LeadCaptureForm';
import Footer from '../components/Footer';

/**
 * Home Component
 * The primary landing page for Nexus CRM.
 * Implements a "Software-First" aesthetic using a Slate/Zinc dark theme.
 */
export default function Home() {
  return (
    <Box
      sx={{ // Using sx prop for Mantine styles as it's more idiomatic for Mantine
        backgroundColor: '#FFFFFF', // White canvas background
        minHeight: '100vh',
        color: '#1a1a1a',
        overflowX: 'hidden',
        display: 'flex', // Use flexbox to center the glassmorphism container
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px', // Add some padding around the glassmorphism container
        position: 'relative',
      }}
    >
      <Group
        justify="space-between"
        align="center"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 10,
        }}
      >
        <Text fw={900} size="lg" c="#1a1a1a" style={{ letterSpacing: '-0.8px' }}>
          Nexus CRM
        </Text>

        <Button
          component={Link}
          to="/login"
          variant="outline"
          color="dark"
          radius="xl"
          size="sm"
          styles={{
            root: {
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
              borderColor: '#d0d7de',
            },
          }}
        >
          Login
        </Button>
      </Group>

      <div className="glassmorphism-container"> {/* This will have the glassmorphism effect */}
        <HeroSection />
        <TechStack />
        <LeadCaptureForm />
        <Footer />
      </div>
    </Box>
  );
}
