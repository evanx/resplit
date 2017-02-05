
NORMAL=`echo -e '\033[0m'`
BOLD=`echo -e '\033[1m'`
CYAN=`echo -e '\033[96m'`

  sh -x test/demo.sh > tmp/demo.out 2>&1

  cat tmp/demo.out

  set -x 

  cat tmp/demo.out | 
    sed -e "s/^\(\+.*\)$/$NORMAL$CYAN\1$NORMAL/" |
    sed -e "s/^\(\w.*\)$/$NORMAL$BOLD\1$NORMAL/"

