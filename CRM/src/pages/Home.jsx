import { Box } from '@mantine/core';

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
        padding: '20px' // Add some padding around the glassmorphism container
      }}
    >
      <div className="glassmorphism-container"> {/* This will have the glassmorphism effect */}
        <HeroSection />
        <TechStack />
        <LeadCaptureForm />
        <Footer />
      </div>
    </Box>
  );
}
