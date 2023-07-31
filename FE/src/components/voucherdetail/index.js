import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import './css/VoucherDetail.scss'; // Import CSS mới
import { useSelector } from "react-redux"
import { getInfor, getUserData } from "../../state/selectors"
import { checkVoucher, saleVoucher, getBalanceOf } from '../../service/api';
import { createAxios } from "../../utils/createInstance"
import { setInfor } from "../../state/userSlice"
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateBalance } from '../../state/userSlice';
import Web3 from 'web3';
import { purchaseVoucher } from '../../service/api';
import { getBalance } from '../../state/selectors';
import DCToken from '../../assets/imgs/DCToken.svg'
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
const web3 = new Web3('https://sepolia.infura.io/v3/c6b95d3b003e40cda8dcf76f7ba58be8');

const VoucherDetail = ({ product }) => {
    const user = useSelector(getInfor)
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, setInfor);
    const currentAccount = useSelector(getUserData);
    const balance = useSelector(getBalance);
    const [price, setPrice] = useState(0);
    const [show, setShow] = useState(false);
    console.log(balance)
    const salevoucher = async () => {
        //Kiểm tra số dư của User:
        
        const balanceWei = await getBalanceOf(currentAccount);
        const balanceEther = Number(balanceWei)/(10 ** 18)
        console.log("Balance: ", balanceEther);
        if (balanceEther < product.price) {
            toast.error('Unable to buy, please check your balance !', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
        else {
             //Gọi hàm tới BE
            // Check còn voucher không ?
            setShow(true);
            
        }
       
    }
    const handlePurchase = async () => {
        let check = await checkVoucher(product._id);
            if (check === 1) {
                console.log("id", product._id)
                console.log("currentAccount" ,currentAccount)
                console.log("product.price" ,product.name)
                
                // create signature
                const hashedMessage = web3.utils.soliditySha3(currentAccount, product.price,product.name, 0);
                console.log("Hashed Message: ", hashedMessage)
                const signatureObj = web3.eth.accounts.sign(hashedMessage, '0x93856d655b8ecd9ebff0f2c3c5d614834ecf76b66b6fca8ad6fc37381c1989b4')
                console.log("signature: ", signatureObj.signature);
                const signature = signatureObj.signature

                try {
                    let trHash = await purchaseVoucher(product._id,"0xcbffe3fa9226a7cD7CfFC770103299B83518F538", currentAccount,product.price,product.name,0,signature);
                    console.log("trHash: ", trHash);
                    //Success Lưu bên BE 
                    let data = {
                        voucherDetail: product._id,
                        trHash: trHash,
                    }
                    let token = user.accessToken;
                    let sale = await saleVoucher(data, token, axiosJWT);
                    console.log("Kết quả bán", sale)
                    if(trHash !== -1 ) {
                        let type = product.price;
                        dispatch(updateBalance({type, balance}, dispatch));
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            else {
                // Hết Vouchers
        }
        setShow(false)
    }
    const handleClose = () => setShow(false);
    return (
        <Box className="product-detail">
            <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="md"
            > 
                <Modal.Header closeButton>
                <Modal.Title>Xác nhận mua voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div style={{fontWeight: "bold",margin:"10px", justifyContent: "center"}}>
                    Bạn có chắc chắn sẽ mua voucher này chứ?  
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Huỷ
                </Button>
                <Button variant="contained" color="primary" onClick={handlePurchase}>Chắc chắn</Button>
                </Modal.Footer>
            </Modal>
            <Card>
                <CardActionArea>
                    <CardMedia className="product-image" component="img" height="400" image={product.img} alt={product.name} >
                    </CardMedia>
                    <Button className="buy-button" variant="contained" color="primary" onClick={salevoucher}>
                        Mua
                    </Button>
                    <CardContent>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography variant="subtitle1">Price: {product.price}
                        <img id='token' src={DCToken}></img>
                        </Typography>
                        <Typography variant="body1">{product.description}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
};

export default VoucherDetail;
