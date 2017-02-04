
redisKey='test:line-lpush'
echo 'line 1
line 2' | redisKey=$redisKey npm start
redis-cli llen $redisKey
redis-cli lrange $redisKey 0 0
redis-cli lrange $redisKey 1 1
