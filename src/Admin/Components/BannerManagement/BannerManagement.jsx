import React, { useState, useEffect } from 'react';
import './BannerManagement.css';
import api, { API_BASE_URL } from '../../../Config/api';
import BlobImage from '../../../until/BlobImage'; // Import BlobImage

const BannerManagement = () => {
  const [urls, setUrls] = useState([]);

  const getURLs = async () => {
    try {
        const res = await api.get("api/banner/slideimage");
        if (res.data) {
          setUrls(res.data);
        }
    } catch (error) {
        console.error("Failed to fetch banner images for admin view:", error);
    }
  };


  const handleDeleteBanner = async (url) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá banner này?");
    if (!confirmDelete) return;
    const deleteUrl = url.replace("/images/homeslide/", "");
    try {
      await api.delete(`api/admin/banner/${deleteUrl}`);
      alert('Xóa banner thành công!');
      await getURLs();
    } catch (error) {
      alert('Xóa banner thất bại');
      console.error("Delete error:", error);
    }
  };
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

  const handleAddBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        // Dùng api instance thay vì axios thường để tự động gắn header Authorization và Ngrok
        await api.post(`/api/admin/banner/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        alert("Tải lên thành công!");
        await getURLs();
    } catch (error) {
        console.error("Lỗi khi tải lên banner:", error);
        alert(`Tải lên thất bại! Lỗi: ${error.response?.data?.message || error.message}`);
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
  return (
    <>
    <div className="grid grid-cols-2 gap-4">
      {urls.map((url, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => handleDeleteBanner(url)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow z-10"
          >
            ×
          </button>
          {/* Thay thẻ img bằng BlobImage */}
          <BlobImage
            src={`${API_BASE_URL}${url}`}
            className="w-full h-auto rounded-lg shadow"
            alt={`Banner ${index}`}
          />
        </div>
      ))}
  </div>
  <div className="mt-4">
        <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer shadow">
          Thêm banner
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddBanner}
          />
        </label>
      </div>
    </>
  );
};

export default BannerManagement;