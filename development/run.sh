
redisKey='test:line-lpush'
redis-cli del $redisKey
(
echo 'line 1'
echo 'line 2'
echo 'line 3'
) | redisKey=$redisKey npm start
redis-cli llen $redisKey
redis-cli lrange $redisKey 0 5
redis-cli rpop $redisKey
