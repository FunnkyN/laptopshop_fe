import { Grid, Link, Typography, Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import ZaloIcon from '@mui/icons-material/Chat'; // Dùng icon Chat đại diện cho Zalo nếu không có SVG custom

const footerSections = [
  {
    title: 'Sản phẩm',
    items: ['LAPTOP Gaming', 'LAPTOP Văn phòng', 'Linh kiện', 'Màn hình', 'Phụ kiện'],
  },
  {
    title: 'Hướng dẫn',
    items: ['Hướng dẫn mua hàng', 'Hướng dẫn thanh toán', 'Hướng dẫn lắp đặt'],
  },
  {
    title: 'Chính sách',
    items: ['Bảo hành', 'Đổi trả', 'Vận chuyển', 'Bảo mật'],
  },
  {
    title: 'Liên hệ',
    items: [
      { 
        label: 'Zalo: 0911910949', 
        link: 'https://zalo.me/0911910949', 
        icon: <ZaloIcon sx={{ fontSize: 20 }} /> 
      },
      { 
        label: 'Facebook: Nguyễn Duy Tú', 
        link: 'https://www.facebook.com/1906tu', 
        icon: <FacebookIcon sx={{ fontSize: 20 }} /> 
      },
      { 
        label: 'Email: duytu192003', 
        link: 'mailto:duytu192003@gmail.com', 
        icon: <EmailIcon sx={{ fontSize: 20 }} /> 
      },
      { 
        label: 'Địa chỉ: 10 Trần Phú Hà Đông Hà Nội', 
        icon: <LocationOnIcon sx={{ fontSize: 20 }} /> 
      },
    ],
  }
];

const Footer = () => {
  return (
    <Grid
      container
      spacing={4}
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      {footerSections.map((section, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: '#fff', pb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            {section.title}
          </Typography>
          
          {section.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              {/* Nếu có icon thì hiển thị */}
              {typeof item !== 'string' && item.icon && (
                <Box component="span" sx={{ mr: 1.5, display: 'flex', color: '#9155FD' }}>
                  {item.icon}
                </Box>
              )}

              <Typography variant="body2">
                {typeof item === 'string' ? (
                  item
                ) : item.link ? (
                  <Link
                    href={item.link}
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: '#fff', '&:hover': { color: '#9155FD' }, transition: 'color 0.3s' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </Typography>
            </Box>
          ))}

          {/* Thêm hàng icon Mạng xã hội riêng ở cột cuối cùng (Liên hệ) */}
          {section.title === 'Liên hệ' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#ccc' }}>Kết nối với chúng tôi:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  component="a" 
                  href="https://www.facebook.com/1906tu" 
                  target="_blank"
                  sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#1877F2' } }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://youtube.com" 
                  target="_blank"
                  sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#FF0000' } }}
                >
                  <YouTubeIcon />
                </IconButton>
                <IconButton 
                  component="a" 
                  href="https://instagram.com" 
                  target="_blank"
                  sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#E4405F' } }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Grid>
      ))}

      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            pt: 4,
            borderTop: '1px solid #333',
            color: '#888',
          }}
        >
          &copy; {new Date().getFullYear()} ADAYROILAPTOP.com - Học viện Công nghệ Bưu chính Viễn thông
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;