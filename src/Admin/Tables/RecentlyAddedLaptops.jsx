import {
    Avatar,
    Box,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import React from 'react'
import {useNavigate} from 'react-router-dom'

const RecentlyAddedLaptops = () => {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader
                title='Recently Added Laptops'
                sx={{pt: 2, alignItems: 'center', '& .MuiCardHeader-action': {mt: 0.6}}}
                action={<Typography onClick={() => navigate("/admin/laptops")} variant='caption'
                                    sx={{color: "blue", cursor: "pointer", paddingRight: ".8rem"}}>View
                    All</Typography>}
                titleTypographyProps={{
                    variant: 'h5',
                    sx: {lineHeight: '1.6 !important', letterSpacing: '0.15px !important'}
                }}
            />
            <TableContainer>
                <Table sx={{minWidth: 800}} aria-label='table in dashboard'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}

export default RecentlyAddedLaptops