import React from 'react';
import { Card, Text, Group, Stack, Kbd, ThemeIcon, Box } from '@mantine/core';
import { Keyboard, Command, Search } from 'lucide-react';

/**
 * CommandGuideCard component
 * Displays a premium, glassmorphic guide for command palette shortcuts.
 */
const CommandGuideCard = () => {
  return (
    <Card
      shadow="sm"
      p="md"
      radius="md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Stack gap="xs">
        <Group gap="sm">
          <ThemeIcon variant="light" color="blue" size="md" radius="sm">
            <Keyboard size={16} />
          </ThemeIcon>
          <Text size="sm" fw={700} c="dark.4">
            Quick Actions
          </Text>
        </Group>

        <Stack gap={8} mt={5}>
          <Group justify="space-between">
            <Group gap="xs">
              <Search size={14} color="#868e96" />
              <Text size="xs" c="dimmed">Search Commands</Text>
            </Group>
            <Group gap={4}>
              <Kbd size="xs">Ctrl</Kbd>
              <Text size="xs" c="dimmed">+</Text>
              <Kbd size="xs">K</Kbd>
            </Group>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <Command size={14} color="#868e96" />
              <Text size="xs" c="dimmed">Quick Search</Text>
            </Group>
            <Kbd size="xs">/</Kbd>
          </Group>

          <Group justify="space-between">
            <Text size="xs" c="dimmed" ml={24}>Close Palette</Text>
            <Kbd size="xs">Esc</Kbd>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CommandGuideCard;
