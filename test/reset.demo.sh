
(
  set -u -e -x
  if docker network ls | grep test-r8-network
  then
    docker rm -f test-r8-redis test-r8-app test-r8-decipher test-r8-encipher
    for name in redis decipher encipher app 
    do
      for container in `docker ps -q -f name=test-r8-$name`
      do
        docker rm -f $container
      done
    done
    docker network rm test-r8-network
  fi
)
