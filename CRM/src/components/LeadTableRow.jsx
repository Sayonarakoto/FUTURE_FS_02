import React, { memo } from 'react';
import { Menu, ActionIcon, Badge } from '@mantine/core';
import { MoreVertical } from 'lucide-react';

const statusStyles = {
  NEW: { color: '#111827', bg: '#F3F4F6' },
  CONTACTED: { color: '#1976D2', bg: '#E3F2FD' },
  CONVERTED: { color: '#2E7D32', bg: '#E8F5E9' },
  REJECTED: { color: '#C62828', bg: '#FFEBEE' },
};

const LeadTableRow = memo(({ lead, onUpdate, onView }) => {
  const status = String(lead.status || 'NEW').toUpperCase();
  const style = statusStyles[status] || statusStyles.NEW;

  return (
    <tr
      onClick={() => onView(lead)}
      style={{
        borderBottom: '1px solid #F8F9FA',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F8F9FA';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <td style={{ padding: '20px 12px', fontWeight: 600, color: '#1a1a1a' }}>
        {lead.name || 'Unnamed Lead'}
      </td>

      <td style={{ padding: '20px 12px', color: '#868e96' }}>
        {lead.email || '-'}
      </td>

      <td style={{ padding: '20px 12px', color: '#868e96' }}>
        {lead.message || '-'}
      </td>

      <td style={{ padding: '20px 12px' }}>
        <Badge
          variant="outline"
          radius="0"
          size="sm"
          style={{
            borderColor: style.color,
            color: style.color,
            fontWeight: 700,
            fontSize: '10px',
          }}
        >
          {status}
        </Badge>
      </td>

      <td
        style={{ padding: '20px 12px', textAlign: 'right' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => e.stopPropagation()}
              style={{ opacity: 0.4 }}
            >
              <MoreVertical size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
            <Menu.Item
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(lead.id, 'CONTACTED');
              }}
            >
              Mark Contacted
            </Menu.Item>

            <Menu.Item
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(lead.id, 'CONVERTED');
              }}
            >
              Mark Converted
            </Menu.Item>

            <Menu.Item
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(lead.id, 'REJECTED');
              }}
            >
              Reject
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  );
});

export default LeadTableRow;