const authHeader = token => ({Authorization: `Bearer ${token}`});
const dashboardHeader = clientId => ({Authorization: `Bearer ${clientId}`});
const franchisesHeader = clientId => ({Authorization: `"id": '${clientId}'`});
const productHeader = clientId => ({Authorization: `Bearer '${clientId}'`});

export {authHeader, dashboardHeader, franchisesHeader, productHeader};