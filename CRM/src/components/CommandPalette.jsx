import { useDebounce } from 'react-haiku';
import { Spotlight } from '@mantine/spotlight';
import { Search, User, Settings, LayoutDashboard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function CommandPalette({ leads }) { // Receives leads as prop
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [isSearching, setIsSearching] = React.useState(false);

  // Effect to handle "searching" state when query changes
  React.useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query, debouncedQuery]);

  // Transform leads data into searchable actions for the palette
  const leadActions = leads.map((lead) => ({
    id: lead.id.toString(), // Ensure ID is a string for compatibility
    label: lead.name,
    description: `Manage lead: ${lead.email}`,
    onClick: () => navigate(`/dashboard/leads/${lead.id}`),
    leftSection: <User size={18} />,
  }));

  const staticActions = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'System overview and metrics',
      onClick: () => navigate('/dashboard'),
      leftSection: <LayoutDashboard size={18} />,
    },
    {
      id: 'settings',
      label: 'System Settings',
      description: 'Configure API keys and Admin profile',
      onClick: () => navigate('/dashboard/settings'),
      leftSection: <Settings size={18} />,
    },
  ];

  return (
    <Spotlight
      actions={[...staticActions, ...leadActions]} // Combine static and dynamic actions
      onQueryChange={setQuery}
      searchProps={{
        leftSection: isSearching ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" /> : <Search size={18} strokeWidth={1.5} />,
        placeholder: 'Search leads, commands, or documentation...',
      }}
      shortcut={['mod + K', '/']} // Support both Ctrl+K and '/'
      nothingFound="No engineering records match your query."
      highlightQuery
      styles={{
        content: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphic white
          backdropFilter: 'blur(20px)',
          borderRadius: 0, // Sharp editorial edges
          border: '1px solid #EEE',
        },
        action: {
          borderRadius: 0, // Sharp edges for actions
          '&:hover': { backgroundColor: '#F8F9FA' }
        }
      }}
    />
  );
}

export default CommandPalette;
