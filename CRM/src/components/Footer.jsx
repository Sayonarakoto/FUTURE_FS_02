import React from 'react';
import { Container, Group, Text, Anchor, rem, Divider, Stack } from '@mantine/core';
import { Code, BookOpen, ShieldCheck } from 'lucide-react'; // Replaced Github with Code

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container size="lg" py={rem(40)}>
      <Divider mb="xl" color="rgba(255,255,255,0.05)" />

      {/* Using wrap="wrap" for better responsiveness on smaller screens */}
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        
        {/* Logo and copyright stack */}
        <Stack gap={4} align="flex-start"> {/* Align items to the start for consistency */}
          <Text fw={900} size="lg" c="white" style={{ letterSpacing: '-1px' }}>
            Nexus CRM
          </Text>
          <Text size="xs" c="dimmed">
            © {currentYear} Software Operations. All rights reserved.
          </Text>
        </Stack>

        {/* Links group */}
        <Group gap="xl" wrap="wrap"> {/* Allow links to wrap on smaller screens */}
          <Anchor href="#" c="dimmed" size="xs" underline="hover">
            <Group gap={6} wrap="nowrap"> {/* Keep icon and text together */}
              <BookOpen size={14} />
              <span>Documentation</span>
            </Group>
          </Anchor>

          <Anchor href="#" c="dimmed" size="xs" underline="hover">
            <Group gap={6} wrap="nowrap">
              <Code size={14} /> {/* Replaced Github with Code */}
              <span>Source Code</span> {/* Changed label to Source Code */}
            </Group>
          </Anchor>

          <Anchor href="#" c="dimmed" size="xs" underline="hover">
            <Group gap={6} wrap="nowrap">
              <ShieldCheck size={14} />
              <span>API Status</span>
            </Group>
          </Anchor>
        </Group>
      </Group>
    </Container>
  );
};

export default Footer;