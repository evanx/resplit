
(
  set -u -e -x
  if docker network ls | grep test-evanx-network
  then
    docker rm -f test-evanx-redis test-evanx-app test-evanx-decipher test-evanx-encipher
    for name in redis decipher encipher app
    do
      for container in `docker ps -q -f name=test-evanx-$name`
      do
        docker rm -f $container
      done
    done
    docker network rm test-evanx-network
  fi
)
