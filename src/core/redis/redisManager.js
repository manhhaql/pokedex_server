import Redis from 'redis';

import config from '../../config';

class RedisManager {};

RedisManager.client = Redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    db: config.redis.db
});

RedisManager.connected = false;

RedisManager.client.on('ready', (error) => {
    RedisManager.connected = true;
});

RedisManager.client.on('connect', (error) => {
    
});
RedisManager.client.on('reconnecting', (error) => {
    
});
RedisManager.client.on('connect', (error) => {
    
});
RedisManager.client.on('error', (error) => {
    RedisManager.connected = false;
});
RedisManager.client.on('warning', (error) => {
    
});
RedisManager.client.on('end', (error) => {
    
});

export default RedisManager;