import React from 'react';
import { Container, Group, Badge, Text, rem, Stack, Anchor } from '@mantine/core';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, ShieldCheck, Mail } from 'lucide-react';

const TechBadge = ({ icon: Icon, label, color, url }) => (
  <Anchor href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
    <Badge 
      variant="dot" 
      color={color} 
      size="lg" 
      radius="sm"
      leftSection={<Icon size={14} />}
      styles={{
        root: { 
          paddingLeft: rem(12), 
          paddingRight: rem(12), 
          height: rem(36),
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer'
        },
        label: { fontWeight: 600, color: '#94a3b8' }
      }}
    >
      {label}
    </Badge>
  </Anchor>
);

const TechStack = () => {
  const stack = [
    { icon: Cpu, label: 'React 18', color: 'blue', url: 'https://react.dev/' },
    { icon: Server, label: 'Node.js', color: 'green', url: 'https://nodejs.org/' },
    { icon: ShieldCheck, label: 'Sequelize ORM', color: 'indigo', url: 'https://sequelize.org/' },
    { icon: Database, label: 'TiDB Serverless', color: 'pink', url: 'https://www.pingcap.com/tidb-cloud/' },
    { icon: Mail, label: 'Resend API', color: 'orange', url: 'https://resend.com/' },
  ];

  // Triple the stack to ensure seamless infinite scroll even on larger screens
  const scrollingStack = [...stack, ...stack, ...stack];

  return (
    <Container size="md" pb={rem(80)} style={{ overflow: 'hidden' }}>
      <Stack align="center" gap="xl">
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
          Engineered with
        </Text>
        
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            style={{ 
              display: 'flex', 
              width: 'fit-content',
              gap: rem(20)
            }}
            animate={{ x: [0, '-33.33%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {scrollingStack.map((item, index) => (
              <div key={index} style={{ flexShrink: 0 }}>
                <TechBadge {...item} />
              </div>
            ))}
          </motion.div>
        </div>
      </Stack>
    </Container>
  );
};

export default TechStack;
