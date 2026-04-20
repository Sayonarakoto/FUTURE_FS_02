import React, { useState } from 'react';
import {
  Paper,
  TextInput,
  Select,
  Button,
  Stack,
  Title,
  Text,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import api from '../api/axios';

const LeadCaptureForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      company: '',
      inquiryType: 'Technical Demo',
      message: '',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      message: (value) => (value.trim().length < 10 ? 'Detailed message required' : null),
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post('/leads', {
        ...values,
        source: 'nexus-crm-landing',
      });

      notifications.show({
        title: 'Success',
        message: 'Lead captured.',
        color: 'teal',
      });

      setSubmitted(true);
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Submission failed.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" p="xl" withBorder>
        {!submitted ? (
          <Stack>
            <Title order={2}>Contact Us</Title>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack>
                <TextInput label="Name" {...form.getInputProps('name')} required />
                <TextInput label="Email" {...form.getInputProps('email')} required />
                <TextInput label="Company" {...form.getInputProps('company')} />
                <Select
                  label="Inquiry Type"
                  data={['Technical Demo', 'API Access', 'Enterprise Collaboration']}
                  {...form.getInputProps('inquiryType')}
                />
                <TextInput label="Message" {...form.getInputProps('message')} required />
                <Button type="submit" loading={loading}>Submit</Button>
              </Stack>
            </form>
          </Stack>
        ) : (
          <Stack align="center">
            <Title order={3}>Thank You!</Title>
            <Text>Your request has been submitted.</Text>
            <Button onClick={() => setSubmitted(false)}>Submit another</Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default LeadCaptureForm;