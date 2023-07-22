import axios from "axios";
import Web3 from 'web3'
import TokenArtifact from "../../contracts/TouristConTract.json"
import contractAddress from "../../contracts/contract-address.json";



const getAllPlace = async () => {
    try {
        let allplace = await axios.get(`${process.env.REACT_APP_ENDPOINT}/v1/place/getallplaces`)
        return allplace.data;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
const reviewtoBE = async (data, token, axiosJWT) => {
    try {
        console.log(token)
        console.log(data);
        let review = await axiosJWT.post(`${process.env.REACT_APP_ENDPOINT}/v1/trip/upload`, data, {
            headers: {
                token: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })
        console.log(review)
    }
    catch (err) {
        console.log(err)
    }
}
const getTrips = async (token, axiosJWT) => {
    try {
        console.log(token)
        let review = await axiosJWT.get(`${process.env.REACT_APP_ENDPOINT}/v1/trip`, {
            headers: {
                token: `Bearer ${token}`,
            },
        })
        // console.log(review)
        return review
    }
    catch (err) {
        console.log(err)
    }
}

const getPlace = async (token, axiosJWT, placeid) => {
    try {
        console.log(token)
        // From SC
        const web3 = new Web3('https://sepolia.infura.io/v3/c6b95d3b003e40cda8dcf76f7ba58be8');
        const contract = new web3.eth.Contract(TokenArtifact.abi, contractAddress.Token);
        let review1 =  await contract.methods.getReviewsInPlace(placeid).call();
        // From BE
        // let review2 = await axiosJWT.get(`${process.env.REACT_APP_ENDPOINT}/v1/trip`, {
        //     headers: {
        //         token: `Bearer ${token}`,
        //     },
        // })
        // //Merge
        // const mergedArray = review1.map((item1) => {
        //     const matchingElement = review2.find((item2) => item2.time === (item1.tripid));
        //     if (matchingElement) {
        //         return { ...item1, ...matchingElement };
        //     } else {
        //         return item1;
        //     }
        // });
        // console.log("Merge Array", mergedArray)

        // return mergedArray
        return review1
    }
    catch (err) {
        console.log(err)
    }
}
export {
    getAllPlace,
    reviewtoBE,
    getTrips,
    getPlace
}