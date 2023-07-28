import AsyncStorage from '@react-native-async-storage/async-storage';

const setFirstTimeUse = () => {
    return AsyncStorage.setItem('isFirstTimeUse', 'true');
};

const getFirstTimeUse = () => {
    return AsyncStorage.getItem('isFirstTimeUse');
};

const setToken = token => {
    return AsyncStorage.setItem('token', token);
};

const getToken = () => {
    return AsyncStorage.getItem('token');
};

const setUserData = userData => {
    return AsyncStorage.setItem('userData', JSON.stringify(userData));
};

const getUserData = () => {
    return AsyncStorage.getItem('userData');
};

const setAppleUser = (val) => {
    return AsyncStorage.setItem('appleUser', JSON.stringify(val));
}

const setGoogleUser = (val) => {
    return AsyncStorage.setItem('googleUser', JSON.stringify(val));
}

const getAppleUser = async () => {
    const appleUser = await AsyncStorage.getItem('appleUser');
    return appleUser !== null ? JSON.parse(appleUser) : null;
}

const getGoogleUser = async () => {
    const googleUser = await AsyncStorage.getItem('googleUser');
    return googleUser !== null ? JSON.parse(googleUser) : null;
}

const setLocation = async (location) => {
    return AsyncStorage.setItem('location', JSON.stringify(location))
}

const getLocation = async () => {
    const location = await AsyncStorage.getItem('location');
    return location !== null ? JSON.parse(location) : null;
}

const setAddress = async (newAddress) => {
    try {
        const existingAddresses = await getAddress();
        if (existingAddresses === null) {
            await AsyncStorage.setItem('address', JSON.stringify([newAddress]));
        } else {
            const updatedAddresses = [...existingAddresses, newAddress];
            await AsyncStorage.setItem('address', JSON.stringify(updatedAddresses));
            console.log(updatedAddresses)
        }
    } catch (e) {
    }
}

const getAddress = async () => {
    try {
        const value = await AsyncStorage.getItem('address');
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
    }
}

export default { 
    setFirstTimeUse, 
    getFirstTimeUse, 
    setToken, 
    getToken, 
    setUserData, 
    getUserData, 
    getGoogleUser, 
    getAppleUser, 
    setGoogleUser, 
    setAppleUser, 
    getLocation, 
    setLocation,
    setAddress,
    getAddress,
};