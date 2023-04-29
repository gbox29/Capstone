import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const ITEM_HEIGHT = 48;
export default function HorizontalIcon(props){
    
    return (
        <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={props.open ? 'long-menu' : undefined}
                        aria-expanded={props.open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={props.handleClick}
                        >
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                            }}
                            anchorEl={props.anchorEl}
                            open={props.open}
                            onClose={props.handleClose}
                            PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                    <MenuItem onClick={props.update}>
                        Update
                    </MenuItem>                                                
                    <MenuItem onClick={props.delete}>
                        Delete
                    </MenuItem>
                    </Menu>        
        </>

    );
}