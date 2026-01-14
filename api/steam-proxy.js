# 创建 api/steam-proxy.js
mkdir -p api
cat > api/steam-proxy.js << 'EOF'
export default async function handler(req, res) {
    const { steamid } = req.query;
    
    if (!steamid) {
        return res.status(400).json({ error: '缺少steamid参数' });
    }
    
    try {
        // 尝试获取Steam头像（使用Steam CDN）
        const avatarUrl = `https://avatars.steamstatic.com/${steamid}_full.jpg`;
        
        // 验证头像是否存在
        const response = await fetch(avatarUrl, { method: 'HEAD' });
        
        if (response.ok) {
            return res.status(200).json({
                steamid,
                avatar: avatarUrl,
                source: 'steam-cdn'
            });
        } else {
            // 返回默认头像
            return res.status(200).json({
                steamid,
                avatar: getDefaultAvatar(steamid),
                source: 'default'
            });
        }
    } catch (error) {
        // 出错时返回默认头像
        return res.status(200).json({
            steamid,
            avatar: getDefaultAvatar(steamid),
            source: 'error-fallback'
        });
    }
}

function getDefaultAvatar(steamid) {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', 
                   '#1abc9c', '#e67e22', '#95a5a6', '#d35400'];
    const index = parseInt(steamid.slice(-2)) % colors.length || 0;
    const color = colors[index];
    const letter = steamid.slice(-1);
    
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="184" height="184"><rect width="184" height="184" rx="92" fill="${color}"/><text x="92" y="104" font-size="72" fill="white" font-family="Arial" text-anchor="middle">${letter}</text></svg>`;
}
EOF