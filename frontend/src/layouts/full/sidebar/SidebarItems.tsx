import Menuitems from './MenuItems';
import { useRouter } from 'next/router';
import { Box, Button, IconButton, List, TextField } from '@mui/material';
import { IconBookmark, IconLogin, IconUserPlus } from '@tabler/icons-react';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useState } from 'react';

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const { pathname } = useRouter();
  const pathDirect = pathname;
  let editors = [
    {
      id: 1,
      title: 'Room 1',
      icon: IconBookmark,
      href: '/editor/1',
      edit: true,
    },
  ];
  const [booleanAdd, setBooleanAdd] = useState(false);
  const [name, setName] = useState('');
  const [editor, c] = useState(editors);
  const handleSetName = (e: any) => {
    setName(e.target.value);
  };
  const handleAddRoom = (name: string) => {
    c([
      ...editor,
      {
        id: editor.length + 1,
        title: `${name ?? 'My Room'}`,
        icon: IconBookmark,
        href: `/editor/${editor.length + 1}`,
        edit: true,
      },
    ]);
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className='sidebarNav' component='div'>
        {Menuitems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
        <NavGroup
          item={{
            navlabel: true,
            subheader: 'Rooms',
          }}
        />
        {editor.map((item) => {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
              editor={item.edit}
            />
          );
        })}
        {booleanAdd && (
          <div style={{ marginLeft: '1rem' }}>
            <TextField
              value={name}
              onChange={handleSetName}
              label='Room name'
              variant='standard'
              size='small'
            />
            <IconButton
              color='primary'
              sx={{ p: '10px' }}
              aria-label='directions'
            >
              <IconBookmark onClick={() => handleAddRoom(name)} />
            </IconButton>
          </div>
        )}
        <Button
          variant='outlined'
          onClick={() => setBooleanAdd(!booleanAdd)}
          style={{ margin: '.5rem 0 1rem 0' }}
        >
          Create New Room
        </Button>
        <NavGroup
          item={{
            navlabel: true,
            subheader: 'Authentication',
          }}
        />
        <NavItem
          item={{
            id: 'login',
            title: 'Login',
            icon: IconLogin,
            href: '/authentication/login',
          }}
          pathDirect={pathDirect}
          onClick={toggleMobileSidebar}
        />
        <NavItem
          item={{
            id: 'register',
            title: 'Register',
            icon: IconUserPlus,
            href: '/authentication/register',
          }}
          pathDirect={pathDirect}
          onClick={toggleMobileSidebar}
        />
      </List>
    </Box>
  );
};
export default SidebarItems;
