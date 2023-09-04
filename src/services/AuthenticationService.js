import axios from 'axios';
import { ApiContants } from '../assets/constants';
import { authHeader } from '../utils/Generator';

const AuthRequest = axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

const register = async user => {
    if (!user?.FullName || !user?.EmailAdress || !user?.ContactNumber || !user?.Password) {
        return { status: false, message: 'Please fill up all fields' };
    }
    try {
        let requestBody = {
            Id: null,
            FullName: user?.FullName,
            EmailAdress: user?.EmailAdress,
            ContactNumber: user?.ContactNumber,
            Password: user?.Password
        };
        let registerResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.REGISTER,
            { requestBody },
        );
        return registerResponse?.data;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const login = async user => {
    if (!user?.username || !user?.password) {
        return { status: false, message: 'Please fill up all fields' };
    }
    try {
        let requestBody = {
            emial: user?.username,
            password: user?.password,
        };
        let loginResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.LOGIN,
            { requestBody },
        );
        return loginResponse?.data;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const checkUserExist = async (type, value) => {
    try {
        let params = { [type]: value };
        let userCheckResponse = await AuthRequest.get(
            ApiContants.BACKEND_API.USER_EXIST,
            { params },
        );
        return userCheckResponse?.data;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const phoneVerification = async (phoneInputs, selectedCountry) => {

    if (!phoneInputs || !selectedCountry) {
        return { status: false, message: 'Please fill up all fields' };
    }
    try {
        let requestBody = {
            phoneNumber: phoneInputs,
            countryCode: selectedCountry
        };
        let verificationResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.VERIFICATION,
            { requestBody }
        );
        return verificationResponse?.data;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
}

const refreshToken = async () => {
    try {
        let tokenResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.REFRESH_TOKEN,
        );
        if (tokenResponse?.status === 200) {
            return { status: true, data: tokenResponse?.data };
        } else {
            return { status: false };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

export default { register, login, checkUserExist, refreshToken };