
(
  set -u -e -x
  if docker network ls | grep resplit-network
  then
    docker rm -f resplit-redis resplit-app resplit-decipher resplit-encipher
    for name in redis decipher encipher app
    do
      for container in `docker ps -q -f name=resplit-$name`
      do
        docker rm -f $container
      done
    done
    docker network rm resplit-network
  fi
)
