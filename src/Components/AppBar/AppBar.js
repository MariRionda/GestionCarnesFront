import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { createTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { getAlertRes } from '../../Redux/Actions/Actions';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Search from '@mui/icons-material/Search';









export default function PrimarySearchAppBar() {

  const dispatch =useDispatch()

  useEffect(() => {
    dispatch(getAlertRes())
}, [dispatch])

let alertRes = useSelector((state)=>state.alertRes)

const navigate = useNavigate()

  //tema del calendario
  const outerTheme = createTheme({
    palette: {
        primary: {
            main: '#00585C'
        },
    },
    });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" theme={outerTheme}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: '', sm: 'block' } }}
          >
            Gestión de Carnes
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: '', md: 'flex' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={()=>navigate('/Alertas')}
            >
              <Badge badgeContent={alertRes.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}