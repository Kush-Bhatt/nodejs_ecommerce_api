export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    return token ? token : 'No Token Found';
};