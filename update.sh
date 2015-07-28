BackFile='/home/node/.bak'
id1=`git rev-parse HEAD`
grep ${id1} ${BackFile}
if [[ $? -eq 0 ]]; then
	echo "id  already exist"
else
	echo 'id write in bak'
	git rev-parse HEAD >>${BackFile}
fi
id2=`tail  -n 1  ${BackFile}`
echo $id1,$id2
if [[ "${id1}" = "${id2}" ]];then
	res=`git fetch`
 	  	if [ -n "${res}" ]; then
			read -p  "Are you sure update,y/n?:" val
			if [ "${val}" = "y" ]; then
				echo 'ok'
				git merge origin
				cd web/ && ccnpm install && ccnpm run build && ccnpm run reload && pm2 list
			else
				echo 'not update'
				exit 1
			fi
		else
			echo 'Already up-to-date.'
	 	 fi
else
	echo 'failed'
	exit 1
fi