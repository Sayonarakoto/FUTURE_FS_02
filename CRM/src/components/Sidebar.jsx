import { Box, Stack, Title, Button, Text, Divider } from '@mantine/core';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Settings,
  UserCog,
  LogOut,
  BookOpen,
  Rocket,
  GitFork,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ logout }) => {
  const location = useLocation();

  const navLinks = [
    { id: 1, icon: LayoutDashboard, title: 'Dashboard', link: '/dashboard' },
    { id: 2, icon: Users, title: 'Leads', link: '/leads' },
    { id: 3, icon: LineChart, title: 'Analytics', link: '/analytics' },
    { id: 4, icon: Settings, title: 'Settings', link: '/settings' },
    { id: 5, icon: UserCog, title: 'Admins', link: '/admins' },
  ];

  const resourceLinks = [
    {
      id: 8,
      icon: GitFork,
      title: 'GitHub Repo',
      link: 'https://github.com/Sayonarakoto/FUTURE_FS_02',
      external: true,
    },
  ];

  return (
    <Box
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '10px 0 40px rgba(0, 0, 0, 0.02)',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title
        order={4}
        style={{
          marginBottom: '40px',
          fontWeight: 600,
          letterSpacing: '2px',
          color: '#1a1a1a',
        }}
      >
        NEXUS
      </Title>

      <Stack gap="sm" style={{ flexGrow: 1 }}>
        <Text
          fz={10}
          fw={700}
          tt="uppercase"
          c="#adb5bd"
          style={{ letterSpacing: '1px', marginBottom: '10px' }}
        >
          Navigation
        </Text>

        {navLinks.map(({ id, icon: Icon, title, link }) => {
          const isActive = location.pathname === link;

          return (
            <Link
              key={id}
              to={link}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#000' : '#868e96',
                background: isActive ? '#F8F9FA' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} style={{ marginRight: '12px' }} strokeWidth={isActive ? 2.5 : 1.5} />
              {title}
            </Link>
          );
        })}

        <Divider my="md" label="Resources" labelPosition="center" />

        {resourceLinks.map(({ id, icon: Icon, title, link, external }) =>
          external ? (
            <a
              key={id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#868e96',
                background: 'transparent',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} style={{ marginRight: '12px' }} />
              {title}
            </a>
          ) : (
            <Link
              key={id}
              to={link}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#868e96',
                background: 'transparent',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} style={{ marginRight: '12px' }} />
              {title}
            </Link>
          )
        )}
      </Stack>

      <Button
        variant="subtle"
        color="gray"
        fullWidth
        justify="flex-start"
        leftSection={<LogOut size={18} />}
        onClick={logout}
        style={{
          color: '#868e96',
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;