import { Title, Text, Button, Container, Stack, Group, rem } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <Container size="md" py={rem(80)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack align="center" gap="xl">
          <Group gap="xs" justify="center">
            <Zap size={16} color="#4f46e5" fill="#4f46e5" />
            <Text 
              size="xs" 
              fw={700} 
              tt="uppercase" 
              lts={rem(2)} 
              c="indigo.4"
            >
              Next Gen CRM Engine
            </Text>
          </Group>

          <Title 
            order={1} 
            className="hero-title"
            style={{ 
              fontSize: rem(72), 
              lineHeight: 1.1, 
              textAlign: 'center',
              fontWeight: 900,
              letterSpacing: rem(-2),
              color: 'white'
            }}
          >
            Leads Management, <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Simplified.</span>
          </Title>

          <Text 
            size="xl" 
            c="dimmed" 
            ta="center" 
            maw={rem(600)}
            style={{ lineHeight: 1.6 }}
          >
            A high-performance CRM architecture built for modern scale. 
            Capture, track, and convert leads with a unified dashboard powered by 
            TiDB and Prisma.
          </Text>

          <Group justify="center" mt="md">
            <Button 
              size="lg" 
              radius="md" 
              color="indigo"
              rightSection={<ArrowRight size={18} />}
              style={{ height: rem(54), paddingLeft: rem(30), paddingRight: rem(30) }}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              radius="md" 
              variant="outline" 
              color="gray"
              style={{ height: rem(54), paddingLeft: rem(30), paddingRight: rem(30) }}
            >
              Documentation
            </Button>
          </Group>
        </Stack>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: ${rem(40)} !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default HeroSection;
