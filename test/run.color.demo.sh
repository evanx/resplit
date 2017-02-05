

NORMAL=`echo -e '\033[0m'`
BOLD=`echo -e '\033[1m'`
CYAN=`echo -e '\033[96m'`

  2>&1 sh -x test/demo.sh | sed -e "s/^\(+.*\)$/$NORMAL$CYAN\1/" | sed -e "s/^\(\w.*\)$/$NORMAL$BOLD\1/"

