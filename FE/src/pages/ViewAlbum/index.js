import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { TextField, Paper, Rating, Typography, ImageList, ImageListItem } from "@mui/material";
import img from "../../assets/imgs/place1.png"
import './css/ViewAlbum.scss';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation } from 'react-router-dom';
import place from "../../constants";
import { Gallery, Item } from "react-photoswipe-gallery"
const ViewAlbum = () => {
    const location = useLocation();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [trips, setTrips] = useState([])
    const [album, setAlbum] = useState(null)
    const [imgs] = useState([img, img, img, img]);
    const [triptime, setTriptime] = useState(null)
    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };
    const formatDate = (timestamp) => {
        const dateObj = new Date(timestamp * 1000); // Phải nhân với 1000 vì timestamp là giây còn Date nhận tham số là mili giây

        // Lấy thông tin ngày, tháng, năm, giờ, phút, giây từ đối tượng Date
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Tháng trong Date bắt đầu từ 0 (0 - 11), nên cộng thêm 1
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();

        // Định dạng lại thành dạng ngày/tháng/năm giờ:phút:giây
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    const formatealbumDate = (dateString) => {
        // Tạo đối tượng Date từ chuỗi thời gian
        const dateObj = new Date(dateString);
        // Trích xuất thông tin ngày, tháng, năm, giờ, phút và giây
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Tháng trong Date bắt đầu từ 0 (0 - 11), nên cộng thêm 1
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();
        // Định dạng lại chuỗi theo định dạng mong muốn: dd/MM/yyyy HH:mm:ss
        const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    useEffect(() => {
        const result = location.state;
        setAlbum(result);
        setTrips(result.list_trips);
        console.log(result);
    })

    return (
        <div className="viewalbum">
            <div className="viewalbum-slide">
                Album lưu giữ kỷ niệm
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Link underline="hover" color="inherit" href="/album">
                        Album
                    </Link>
                    <Typography color="text.primary">View Album</Typography>
                </Breadcrumbs>
            </div>
            <Container maxWidth="lg">
                <div className="viewalbum__body">
                    <div className="viewalbum__sidebar">
                        <h2 className="viewalbum__title">Danh sách địa điểm</h2>
                        <ul className="viewalbum__location-list">
                            {trips && trips.map((location) => (
                                <div
                                    key={location.id}
                                    className={`viewalbum__location-item ${selectedLocation?._id === location._id ? 'active' : ''}`}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    {place.placenames[Number(location.placeId)]}
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="viewalbum__content">
                        {selectedLocation ? (
                            <div className="form-container">
                                <div className="album__header__wrapper">
                                    <h2 className="viewalbum__album-title">{album?.title}</h2>
                                    <h7 className="viewalbum__album-time">{formatealbumDate(album?.createdAt)}</h7>
                                    <h6 className="viewalbum__album-content">{album?.content}</h6>
                                </div>
                                {/* <h2 className="viewalbum__album-time">{album?.createdAt}</h2> */}
                                <div>
                                    <Typography>Thời gian: {formatDate(selectedLocation?.time)}</Typography>
                                    <label>
                                        Rating:
                                        <Rating
                                            name="rating"
                                            value={Number(selectedLocation?.rate)}
                                            readOnly
                                        />
                                    </label>
                                    <label>
                                        <TextField
                                            disabled
                                            id="outlined-controlled"
                                            label="TIÊU ĐỀ"
                                            size='medium'
                                            value={`${selectedLocation?.title}`}
                                        />
                                    </label>
                                    <label>
                                        <TextField
                                            disabled
                                            id="outlined-controlled"
                                            label="CẢM NGHĨ"
                                            value={`${selectedLocation?.review} `}
                                            multiline

                                        />
                                    </label>
                                    <label>
                                        <div className="viewealbum-img-wrapper">
                                            <Gallery>
                                                {
                                                    selectedLocation && selectedLocation.list_imgs.map((item, index) => (
                                                        <Item
                                                            original={item}
                                                            thumbnail={item}
                                                            width="1024"
                                                            height="768"
                                                            key={index}
                                                        >
                                                            {({ ref, open }) => (
                                                                <img ref={ref} onClick={open} src={item} alt="ảnh" />
                                                            )}
                                                        </Item>
                                                    ))
                                                }
                                            </Gallery>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <p className="viewalbum__empty-message">Chọn một địa điểm để xem thông tin chi tiết</p>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ViewAlbum;