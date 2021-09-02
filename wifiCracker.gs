clear_screen
computer = get_shell.host_computer
crypto = include_lib("/lib/crypto.so")
crypto.airmon("start", "wlan0")
networks = computer.wifi_networks("wlan0")
info = "NUMBER BSSID PWR ESSID\n"
n = 0
for network in networks
	n = n + 1
	network = network.split(" ")
	bssid = network[0]
	pwr = network[1]
	essid = network[2]
	info = info + n + ". " + bssid + " " + pwr + " " + essid + "\n"
end for
print(format_columns(info))
net_to_hack = user_input(">>> ")
if net_to_hack.len >= 1 then
	net_to_hack = net_to_hack.to_int
	net_to_hack = net_to_hack - 1
	net_to_hack = networks[net_to_hack]
	net_to_hack = net_to_hack.split(" ")
	bssid = net_to_hack[0]
	pwr = net_to_hack[1]
	essid = net_to_hack[2]
	pwr = pwr.remove("%")
	pwr = pwr.to_int
	acks = ceil(300000/pwr)
	print("<b>Getting</b> " + "<b>" + acks + "</b>" + " <b>acks</b>")
	crypto.aireplay(bssid, essid, acks)
	pass = crypto.aircrack(current_path + "/file.cap")
	computer.connect_wifi("wlan0", bssid, essid, pass)
	file = computer.File(current_path + "/file.cap")
	file.delete
	end if
