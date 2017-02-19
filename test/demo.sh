(
  set -u -e
  mkdir -p tmp
  encipherPort=6341
  redisKey='test:resplit'
  for name in test-evanx-redis test-evanx-app test-evanx-decipher test-evanx-encipher
  do
    docker rm -f $name || echo "No $name but OK as just checking"
  done
  if docker network ls | grep test-evanx-network
  then
    docker network rm test-evanx-network
  fi
  docker network create -d bridge test-evanx-network
  redisContainer=`docker run --network=test-evanx-network \
      --name test-evanx-redis -d tutum/redis`
  sleep 1
  docker logs $redisContainer | grep '^\s*redis-cli -a'
  redisPassword=`docker logs $redisContainer | grep '^\s*redis-cli -a' |
      sed -e 's/^\s*redis-cli -a \(\w*\) .*$/\1/'`
  redisHost=`docker inspect $redisContainer |
      grep '"IPAddress":' | tail -1 | sed 's/.*"\([0-9\.]*\)",/\1/'`
  dd if=/dev/urandom bs=32 count=1 > $HOME/tmp/test-spiped-keyfile
  decipherContainer=`docker run --network=test-evanx-network \
    --name test-evanx-decipher -v $HOME/tmp/test-spiped-keyfile:/spiped/key:ro \
    -p 6444:6444 -d spiped \
    -d -s "[0.0.0.0]:6444" -t "[$redisHost]:6379"`
  decipherHost=`docker inspect $decipherContainer |
    grep '"IPAddress":' | tail -1 | sed 's/.*"\([0-9\.]*\)",/\1/'`
  encipherContainer=`docker run --network=test-evanx-network \
    --name test-evanx-encipher -v $HOME/tmp/test-spiped-keyfile:/spiped/key:ro \
    -p $encipherPort:$encipherPort -d spiped \
    -e -s "[0.0.0.0]:$encipherPort" -t "[$decipherHost]:6444"`
  encipherHost=`docker inspect $encipherContainer |
    grep '"IPAddress":' | tail -1 | sed 's/.*"\([0-9\.]*\)",/\1/'`
  cat test/lines.txt |
    docker run \
    --network=test-evanx-network \
    --name test-evanx-app \
    -e NODE_ENV=production \
    -e redisHost=$encipherHost \
    -e redisPort=$encipherPort \
    -e redisPassword=$redisPassword \
    -e redisKey=$redisKey \
    -i evanxsummers/resplit
  redis-cli -a $redisPassword -h $encipherHost -p $encipherPort lrange $redisKey 0 5
  docker rm -f test-evanx-redis test-evanx-app test-evanx-decipher test-evanx-encipher
  docker network rm test-evanx-network
)
