import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
];

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const linkStyles = (darkMode: any) => ({
  color: 'inherit',
  typography: 'h6',
  '&:hover': {
    color: darkMode ? 'grey.200' : 'inherit',
    backgroundSize: 'contain',
    bgcolor: darkMode ? 'primary.dark' : 'inherit',
    borderRadius: '0.5rem'
  },
  '&.active': {
    color: darkMode ? 'grey.900' : 'inherit',
    bgcolor: 'default',
    '&:hover': {
      bgcolor: 'inherit'
    }
  }
});

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useAppSelector(state => state.basket);
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Box display={'flex'} alignItems={'center'}>
          <Typography variant="h6"
            component={NavLink}
            to='/'
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              ...linkStyles
            }}>
            RE-STORE
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>

        <Box display={'flex'} alignItems={'center'}>
          <List sx={{ display: 'flex' }}>
            {midLinks.map(({ title, path }) => (
              <ListItem key={path}
                component={NavLink}
                to={path}
                sx={linkStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box display={'flex'} alignItems={'center'}>
          <IconButton component={Link} to="/basket" size='large' edge='start' color='inherit'>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <List sx={{ display: 'flex' }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem key={path}
                component={NavLink}
                to={path}
                sx={linkStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar >
  );
}