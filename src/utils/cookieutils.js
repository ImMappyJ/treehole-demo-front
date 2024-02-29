export function getCookieValue(cookieName) {
    // 获取 document.cookie 的值
    const cookieString = document.cookie;

    // 将 cookie 字符串分割成各个键值对
    const cookiePairs = cookieString.split(';');

    // 遍历键值对，找到指定的 cookie
    for (let pair of cookiePairs) {
        // 移除空格
        pair = pair.trim();
        // 将键值对分割成键和值
        const [key, value] = pair.split('=');
        // 如果找到指定的 cookie，则返回其值
        if (key === cookieName) {
            return decodeURIComponent(value);
        }
    }

    // 如果未找到指定的 cookie，则返回空字符串或其他指定的默认值
    return '';
}

export function outdatedAllCookie(){
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
}