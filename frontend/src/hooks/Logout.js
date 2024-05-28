export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('otp_token');
    localStorage.removeItem('hasSeenLoginAlert')
    window.location.href = '/login';
};
