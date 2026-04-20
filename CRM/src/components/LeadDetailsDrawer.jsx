import { Drawer, Text, Title, Group, Stack, Button, Divider, ScrollArea, Box } from '@mantine/core';

const STATUS_LIST = ['NEW', 'CONTACTED', 'CONVERTED', 'REJECTED', 'IN_PROGRESS', 'QUALIFIED'];

const LeadDetailsDrawer = ({ lead, opened, onClose, onUpdateStatus }) => {
  if (!lead) return null;

  const currentStatus = String(lead.status || 'NEW').toUpperCase();

  const logLines = [
    `[${new Date().toISOString().split('T')[0]}] Initialization_Successful`,
    `[${new Date().toISOString().split('T')[0]}] Record_Synced_to_TiDB_Cloud`,
  ];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title="LEAD_DOSSIER_V1.0"
      styles={{
        header: { backgroundColor: 'transparent' },
        content: {
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
        },
        body: {
          height: 'calc(100vh - 80px)',
          padding: 0,
        },
      }}
    >
      <ScrollArea h="100%" type="hover" scrollbars="y" viewportProps={{ style: { width: '100%' } }}>
        <Stack gap="xl" p="md">
          <Box>
            <Title order={1} style={{ fontFamily: 'serif', fontSize: '2.4rem', fontWeight: 400 }}>
              {lead.name || 'Unnamed Lead'}
            </Title>
            <Text ff="monospace" size="xs" c="dimmed" mt={5}>
              SYSTEM_UID: {lead.id}
            </Text>
          </Box>

          <Divider color="#000" size="md" />

          <Stack gap="xs">
            <Text size="xs" fw={900} c="dimmed" style={{ letterSpacing: '1px' }}>
              CONTACT_INFO
            </Text>
            <Text fw={500}>{lead.email || '-'}</Text>
            <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
              {lead.message || 'No additional inquiry details provided.'}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Text size="xs" fw={900} c="dimmed" style={{ letterSpacing: '1px' }}>
              CURRENT_STATUS
            </Text>
            <Group>
              {STATUS_LIST.map((status) => (
                <Button
                  key={status}
                  variant={currentStatus === status ? 'filled' : 'outline'}
                  color="dark"
                  radius={0}
                  size="xs"
                  onClick={() => onUpdateStatus(lead.id, status)}
                  style={{ borderWidth: 1, fontSize: '9px' }}
                >
                  {status}
                </Button>
              ))}
            </Group>
          </Stack>

          <Divider variant="dashed" />

          <Stack gap="xs">
            <Text size="xs" fw={900} c="dimmed" style={{ letterSpacing: '1px' }}>
              SYSTEM_LOGS
            </Text>
            <Box p="sm" style={{ backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
              <Stack gap={4}>
                {logLines.map((line) => (
                  <Text key={line} ff="monospace" size="xs" c="dimmed">
                    {line}
                  </Text>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </ScrollArea>
    </Drawer>
  );
};

export default LeadDetailsDrawer;