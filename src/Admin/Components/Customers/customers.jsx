import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import {Avatar, CardHeader, Button} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {getAllCustomers} from '../../../Redux/Auth/Action'
import {useDispatch, useSelector} from "react-redux";

import api from '../../../Config/api';
import { getMessages, setActiveConversation } from '../../../Redux/Chat/Action';
import ChatWindow from '../../../Customer/Chat/ChatWindow';

const Customers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {auth} = useSelector(store => store)

    const [isChatOpen, setIsChatOpen] = useState(false);


    const handleOpenChat = async (customer) => {
        if (!customer) return;
        try {

            const { data: conversation } = await api.get(`/api/conversations/with/${customer.id}`);

            dispatch(setActiveConversation(conversation));

            dispatch(getMessages(conversation.id));

            setIsChatOpen(true);
        } catch (error) {
            console.error("Lỗi khi bắt đầu cuộc hội thoại:", error);
            alert("Không thể bắt đầu chat. Vui lòng thử lại.");
        }
    };

    return (
        <Card>
            {}
            <ChatWindow open={isChatOpen} handleClose={handleCloseChat} />

            <CardHeader
                title='Danh sách khách hàng'
                sx={{pt: 2, alignItems: 'center', '& .MuiCardHeader-action': {mt: 0.6}}}
                action={<Typography onClick={() => navigate("/admin/customers")} variant='caption'
                                    sx={{color: "blue", cursor: "pointer", paddingRight: ".8rem"}}>View
                    All</Typography>}
                titleTypographyProps={{
                    variant: 'h5',
                    sx: {lineHeight: '1.6 !important', letterSpacing: '0.15px !important'}
                }}
            />
            <TableContainer>
                <Table sx={{minWidth: 390}} aria-label='table in dashboard'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auth.customers.map(item => (
                            <TableRow hover key={item.name} sx={{'&:last-of-type td, &:last-of-type th': {border: 0}}}>
                                <TableCell> <Avatar>{item?.name[0].toUpperCase()}</Avatar> </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleOpenChat(item)}
                                    >
                                        Chat
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}

export default Customers