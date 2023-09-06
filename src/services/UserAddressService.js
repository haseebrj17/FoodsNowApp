import { ApiContants } from '../assets/constants';
import axios from 'axios';
import { authHeader } from '../utils/Generator';
// import { getToken } from '../Store';

const AuthRequest = axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

const addUserAddress = async () => {
    console.log(`UserService | addUserData`);
    try {
        let requestBody = {
            Id: user?.Id,
            StreetAddress: address?.streetAddress,
            House: address?.house,
            District: address?.district,
            UnitNumber: address?.unitNumber,
            FloorNumber: address?.floorNumber,
            Notes: address?.notes,
            Tag: address?.tag,
            Latitude: address?.latitude,
            Longitude: address?.longitude,
            City: address?.city
        };
        let addAddressResponse = await AuthRequest.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ADD_ADDRESS}`,
            // {
            //     headers: authHeader(getToken()),
            // },
            { 
                requestBody 
            }
        );

        if (addAddressResponse?.status === 200) {
            return {
                status: true,
                message: `Address added successfully`,
                data: addAddressResponse?.data,
            };
        } else {
            return {
                status: false,
                message: `Failed to add address`,
            };
        }
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message
                ? error?.response?.data?.message
                : `Failed to add Address`,
        };
    }
};

const updateUserAddress = async () => {
    console.log(`UserService | updateUserData`);
    try {
        let requestBody = {
            Id: user?.Id,
            StreetAddress: address?.streetAddress,
            House: address?.house,
            District: address?.district,
            UnitNumber: address?.unitNumber,
            FloorNumber: address?.floorNumber,
            Notes: address?.notes,
            Tag: address?.tag,
            Latitude: address?.latitude,
            Longitude: address?.longitude,
            City: address?.city
        };
        let addAddressResponse = await AuthRequest.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ADD_ADDRESS}`,
            // {
            //     headers: authHeader(getToken()),
            // },
            {
                requestBody 
            }
        );

        if (addAddressResponse?.status === 200) {
            return {
                status: true,
                message: `Address added successfully`,
                data: addAddressResponse?.data,
            };
        } else {
            return {
                status: false,
                message: `Failed to add address`,
            };
        }
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message
                ? error?.response?.data?.message
                : `Failed to add Address`,
        };
    }
};

export default { addUserAddress, updateUserAddress };
